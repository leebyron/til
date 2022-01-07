import * as path from 'path'
import * as fs from 'fs/promises'
import { render, jsx } from 'hyperjsx'
import { parseMarkdown } from './markdown.mjs'
import { mdjsx } from './mdjsx.mjs'
import { Index, Page } from './pages.mjs'
import { TIL_PATH, ENTRIES_PATH, DIST_PATH, spin, quot, exec } from './util.mjs'

export async function main() {
  await spin(renderDocs)
}

async function renderDocs() {
  // Clean directory
  await exec(`rm -rf ${DIST_PATH} && mkdir -p ${DIST_PATH}`)

  // Copy all static content into /dist
  await exec(`cp ${path.resolve(TIL_PATH, 'static/*')} ${DIST_PATH}`)

  // Parse all files
  const filenames = await fs.readdir(ENTRIES_PATH)
  const entries = await Promise.all(
    filenames.map(async filename => {
      const filepath = path.resolve(ENTRIES_PATH, filename)
      const content = await fs.readFile(filepath, 'utf8')
      const markdown = parseMarkdown(content)
      return {
        filename,
        filepath,
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
  const frontmatters = entries.map(entry => entry.frontmatter)
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
  console.log(path.relative(process.env.PWD, indexFile))

  // Build all files
  for (const { filename, markdown, frontmatter } of entries) {
    const entryDir = path.resolve(DIST_PATH, frontmatter.permalink)
    const entryFile = path.resolve(entryDir, 'index.html')
    const rendered = render(
      jsx(Page, {
        filename,
        frontmatter: markdown.frontmatter.value,
        markdown,
        Content: options => mdjsx(markdown, options),
      })
    )
    await exec(`mkdir -p "${quot(entryDir)}"`)
    await fs.writeFile(entryFile, rendered, 'utf8')
    console.log(path.relative(process.env.PWD, entryFile))
  }
}
