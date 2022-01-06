import * as child_process from 'child_process'
import * as fs from 'fs/promises'
import * as path from 'path'
import * as util from 'util'
import { TIL_PATH, ENTRIES_PATH, quot, dateTo3339, run, exec, spin } from './util.mjs'

const TAGS = ['vim']

export async function main(argv) {
  // Use all arguments provided concatenated together as a title.
  const title = argv.slice(2).join(' ')

  // Make sure the repo is up to date before making any changes.
  await spin(async () => {
    if (await exec(`git -C "${TIL_PATH}" status --porcelain`)) {
      throw 'dirty repo'
    }
    await run(
      `git -C "${TIL_PATH}" fetch && git -C "${TIL_PATH}" rebase -q`,
      { timeout: 5000 }
    )
  })

  // Either coerce the promptname to a filename, or show a fzf.
  const filename = title
    ? title
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

  // Either edit and existing file, or create a new one.
  const isExisting = await exists(filepath)
  if (isExisting) {
    await edit(`+8 "${quot(filepath)}"`)
  } else {
    // Write a template to a tmp file and fill it into the editor buffer.
    // This way you can quit without saving and not alter the repo state.
    const permalink = title
      .replace(/(-|[^0-9a-z])+/gi, '-')
      .replace(/^-+|-+$/g, '')
    const date = new Date()
    const tags = title
      .toLowerCase()
      .split(' ')
      .filter(arg => TAGS.includes(arg))
    const entry = template({ title, permalink, date, tags })
    const tmpFile = (await exec('mktemp')).trim()
    try {
      await fs.writeFile(tmpFile, entry, 'utf8')
      await edit(`"+read ${tmpFile}" +8 +star "${quot(filepath)}"`)
    } finally {
      await fs.unlink(tmpFile)
    }

    // Check to see if the file exists after the edit session.
    if (!(await exists(filepath))) {
      throw 'Aborted'
    }
  }

  // Update the repo
  await spin(() =>
    run(
      `git -C "${TIL_PATH}" add "${quot(filepath)}" &&` +
        `git -C "${TIL_PATH}" commit -q -m "${
          isExisting ? 'edit' : 'add'
        }: ${quot(filename)}" &&` +
        `git -C "${TIL_PATH}" push -q &&` +
        `echo "Published ${quot(filename)}" ||` +
        `echo "Nothing to publish"`,
      { timeout: 5000 }
    )
  )
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

// Check to see if a file exists.
const exists = p =>
  fs.stat(p).then(
    () => true,
    error => {
      if (error.code === 'ENOENT') return false
      throw error
    }
  )

const template = ({ title, permalink, date, tags }) =>
  `---
title: ${title}
permalink: ${permalink}
date: ${dateTo3339(date)}
tags: [${tags.join()}]
---

`
