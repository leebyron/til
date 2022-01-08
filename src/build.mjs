import * as path from 'path'
import * as fs from 'fs/promises'
import { render, jsx } from 'hyperjsx'
import { DateTime } from 'luxon'
import { parseMarkdown } from './markdown.mjs'
import { mdjsx } from './mdjsx.mjs'
import { Index, Page } from './pages.mjs'
import {
  TIL_PATH,
  ENTRIES_PATH,
  MEDIA_PATH,
  DIST_PATH,
  spin,
  quot,
  run,
  exec,
  directoryExists,
} from './util.mjs'

export async function build() {
  // Clean directory
  await exec(`rm -rf ${DIST_PATH} && mkdir -p ${DIST_PATH}`)

  // Copy all static content into /dist
  await exec(`cp -r ${path.resolve(TIL_PATH, 'assets')} ${DIST_PATH}`)

  // Copy all media into /dist
  if (await directoryExists(MEDIA_PATH))
    await exec(`cp -r ${MEDIA_PATH} ${DIST_PATH}`)

  // Parse all files
  const filenames = await fs.readdir(ENTRIES_PATH)
  const entries = await Promise.all(
    filenames.map(async filename => {
      const filepath = path.resolve(ENTRIES_PATH, filename)
      const lastModified = DateTime.fromISO(
        await exec(`git log -1 --pretty="format:%cI" "${quot(filepath)}"`)
      )
      const content = await fs.readFile(filepath, 'utf8')
      const markdown = parseMarkdown(content)
      return {
        filename,
        filepath,
        lastModified,
        content,
        markdown,
        frontmatter: markdown.frontmatter.value,
      }
    })
  )

  // Read the first portion of the readme, up until the first thematic break.
  const readmeFilepath = path.resolve(TIL_PATH, 'README.md')
  const readmeContent = await fs.readFile(readmeFilepath, 'utf8')
  const readmeMarkdown = parseMarkdown(readmeContent)
  const rule = readmeMarkdown.children.findIndex(
    node => node.type === 'thematicBreak'
  )
  if (~rule) {
    readmeMarkdown.children.splice(rule)
  }

  // Sort entries in reverse-chrono order
  const frontmatters = entries
    .map(entry => entry.frontmatter)
    .filter(frontmatter => frontmatter.published !== false)
  frontmatters.sort((a, b) => b.date - a.date)

  // Build index
  const indexFile = path.resolve(DIST_PATH, 'index.html')
  const rendered = render(
    jsx(Index, {
      frontmatters,
      Content: options => mdjsx(readmeMarkdown, options),
    })
  )
  await fs.writeFile(indexFile, rendered, 'utf8')
  console.log(path.relative(DIST_PATH, indexFile))

  // Build all files
  for (const { filename, lastModified, markdown, frontmatter } of entries) {
    const entryDir = path.resolve(DIST_PATH, frontmatter.permalink)
    const entryFile = path.resolve(entryDir, 'index.html')
    const rendered = render(
      jsx(Page, {
        filename,
        lastModified,
        frontmatter: markdown.frontmatter.value,
        markdown,
        Content: options => mdjsx(markdown, options),
      })
    )
    await run(`mkdir -p "${quot(entryDir)}"`)
    await fs.writeFile(entryFile, rendered, 'utf8')
    console.log(path.relative(DIST_PATH, entryFile))
  }
}
