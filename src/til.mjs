import * as child_process from 'child_process'
import * as fs from 'fs/promises'
import * as path from 'path'
import * as util from 'util'
import {
  TIL_PATH,
  ENTRIES_PATH,
  MEDIA_PATH,
  quot,
  dateTo3339,
  run,
  exec,
  fileExists,
  spin,
} from './util.mjs'

// TODO: better way to autotag
const TAGS = ['vim', 'markdown']

export default async function til(args) {
  // Handle other commands first
  if (args.length === 1)
    switch (args[0]) {
      // We all need help sometimes
      case 'help':
      case '--help':
        return console.log(`
\x1B[1m\x1B[3mtil\x1B[0m / \x1B[1mhow to til\x1B[0m

Usage:

    \x1B[1mtil\x1B[0m                  list all current documents
    \x1B[1mtil <title>\x1B[0m          edit and publishes a document
    \x1B[1mtil <title> <path>\x1B[0m   and including some media

Note: Paths to media files may appear before or after the title.

Other commands:

    \x1B[1mtil --help\x1B[0m        this lovely message right here
    \x1B[1mtil --build\x1B[0m       builds all documents to HTML files for distribution

Examples:

We're learning to ride a bike! We just figured out about handlebars and
pedals and want to write about it for posterity.

    \x1B[1mtil how to ride a bike\x1B[0m

Here you'll find your $EDITOR open with a markdown file with some yaml
frontmatter pre-filled with the title "how to ride a bike". Write a quick
paragraph or two (til should be brief), and save and quit. It will
automatically be committed and pushed to your git repository.

Uh oh! We found a typo! No matter, we could open the file back up:

    \x1B[1mtil how to ride a bike\x1B[0m

Or if we forgot the name of the file, just run \x1B[1mtil\x1B[0m without arguments to
open all in fzf.`)

      // Build documents to HTML
      case 'build':
      case '--build':
        const { build } = await import('./build.mjs')
        await build()
        return
    }

  // Almost certainly a mistake
  for (const arg of args) {
    if (arg.startsWith('--')) throw `Unknown argument ${arg}`
  }

  // Collect real files, assume they're media
  const media = []

  // Look at the front of the list
  while (
    args.length > 0 &&
    (await fileExists(path.resolve(process.env.PWD, args[0])))
  ) {
    media.push(path.resolve(process.env.PWD, args.shift()))
  }

  // And the back
  while (
    args.length > 0 &&
    (await fileExists(path.resolve(process.env.PWD, args[args.length - 1])))
  ) {
    media.push(path.resolve(process.env.PWD, args.pop()))
  }

  // Construct all metadata
  const mediaInfo = await Promise.all(
    media.map(async src => {
      const ext = path.extname(src)
      const name = path.basename(src, ext)
      const safeName = name
        .toLowerCase()
        .replace(/[^\w\-]/g, '-')
        .replace(/^-+|-+$/g, '')
      const sha = (await shaSum(src)).slice(0, 6)
      const destName = `${safeName}-${sha}${ext}`
      const dest = path.resolve(MEDIA_PATH, destName)
      const rel = path.relative(ENTRIES_PATH, dest)
      return { src, dest, rel }
    })
  )

  // Create markdown template referencing media
  const mediaMarkdown = mediaInfo
    .map(({ rel }) => `\n![](${rel})`)
    .join('\n')

  // Use all remaining arguments provided concatenated together as a title.
  const title = args.join(' ')

  // Make sure the repo is up to date before making any changes.
  await spin(async () => {
    if (await exec(`git -C "${TIL_PATH}" status --porcelain`)) {
      throw 'dirty repo'
    }
    await run(`git -C "${TIL_PATH}" fetch && git -C "${TIL_PATH}" rebase -q`, {
      timeout: 5000,
    })
  })

  // Either coerce the promptname to a filename, or show a fzf.
  const filename = title
    ? title
        .toLowerCase()
        .replace(/(-[^\x20-\x2e\x30-\x39\x3b-\x7e])+/g, '-')
        .replace(/^-+|-+$/g, '')
    : (
        await interactive(
          `ls | tr '\\n' '\\0' | xargs -0 basename -s .md |` +
            `fzf --no-multi --layout=reverse --margin 7% --border=none --preview "bat --color=always --style=plain --line-range=:500 {}.md" --preview-window=right,70%,border-none`,
          { cwd: ENTRIES_PATH }
        )
      ).trim()
  const filepath = path.resolve(ENTRIES_PATH, filename + '.md')
  const isExisting = await fileExists(filepath)

  let tmpFile
  try {
    // Either edit and existing file, or create a new one.
    if (isExisting) {
      // If media is provided to an existing file, concat it.
      if (mediaMarkdown) {
        tmpFile = await exec('mktemp')
        await fs.writeFile(tmpFile, mediaMarkdown, 'utf8')
        await edit(
          `"+silent \\$read ${quot(tmpFile)}" "+normal G z." "${quot(
            filepath
          )}"`
        )
      } else {
        await edit(`+8 "${quot(filepath)}"`)
      }
    } else {
      // Ensure the entries path exists
      await exec(`mkdir -p ${ENTRIES_PATH}`)

      // Write a template to a tmp file and fill it into the editor buffer.
      // This way you can quit without saving and not alter the repo state.
      const permalink = title
        .toLowerCase()
        .replace(/(-|[^0-9a-z])+/gi, '-')
        .replace(/^-+|-+$/g, '')
      const date = new Date()
      const tags = title
        .toLowerCase()
        .split(/\s+/g)
        .filter(arg => TAGS.includes(arg))
      const entry = template({ title, permalink, date, tags }) + mediaMarkdown
      tmpFile = await exec('mktemp')
      await fs.writeFile(tmpFile, entry, 'utf8')
      await edit(
        `"+silent 0read ${tmpFile}" +\\$d +8 +start "${quot(filepath)}"`
      )
    }
  } finally {
    if (tmpFile) await fs.unlink(tmpFile)
  }

  // Look for lack of changes
  if (!(await exec(`git -C "${TIL_PATH}" status --porcelain`))) {
    // If this was a new change, it must have been aborted
    if (!isExisting || media.length > 0) {
      throw 'Aborted'
    }
    // Otherwise, you were probably just reading the file.
    return
  }

  // There are changes, add any media now.
  if (mediaInfo.length > 0) {
    await exec(`mkdir -p ${ENTRIES_PATH}`)
    for (const { src, dest } of mediaInfo) {
      await fs.cp(src, dest, { force: true })
    }
  }

  // Update the repo
  await spin(async () => {
    // format the file first
    const prettier = path.resolve(TIL_PATH, 'node_modules/.bin/prettier')
    await run(`${prettier} -w --loglevel silent "${quot(filepath)}"`)

    // then stage and commit it
    await run(
      `git -C "${TIL_PATH}" add -A &&` +
        `git -C "${TIL_PATH}" commit -q -m "${
          isExisting ? 'edit' : 'add'
        }: ${quot(filename)}" &&` +
        `git -C "${TIL_PATH}" push -q &&` +
        `echo "Published ${quot(filename)}" ||` +
        `echo "Nothing to publish"`,
      { timeout: 5000 }
    )
  })
}

// Open an editor
const edit = command =>
  new Promise((resolve, reject) => {
    const shell = child_process.spawn(`$EDITOR ${command}`, {
      stdio: 'inherit',
      shell: true,
    })
    shell.on('close', code => (code ? reject() : resolve()))
    shell.on('error', error => reject(error))
  })

// Run an interactive command, returning the results.
const interactive = (command, opts) =>
  new Promise((resolve, reject) => {
    const shell = child_process.spawn(command, {
      stdio: [0, null, 2],
      shell: true,
      ...opts,
    })
    let results = ''
    shell.stdout.on('data', data => {
      results += data
    })
    shell.on('close', code => (code ? reject() : resolve(results)))
    shell.on('error', error => reject(error))
  })

const template = ({ title, permalink, date, tags }) =>
  `---
title: ${title}
permalink: ${permalink}
date: ${dateTo3339(date)}
tags: ${tags.length > 0 ? `[${tags.join()}]` : ''}
---


`

function shaSum(filepath) {
  return Promise.all([import('fs'), import('crypto'), import('stream')]).then(
    ([{ createReadStream }, { createHash }, { pipeline }]) =>
      new Promise((resolve, reject) => {
        const hash = createHash('sha256')
        pipeline(createReadStream(filepath), hash, error =>
          error ? reject(error) : resolve(hash.digest('hex'))
        )
      })
  )
}
