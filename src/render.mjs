import * as path from 'path'
import * as fs from 'fs'
import { inspect } from 'util'
import { render, jsx } from 'hyperjsx'
import { parseMarkdown } from './markdown.mjs'
import { mdjsx } from './mdjsx.mjs'
import { Page } from './pages.mjs'
import { TIL_PATH, ENTRIES_PATH, quot, exec } from './util.mjs'

const DIST = path.resolve(TIL_PATH, 'dist')

// Clean directory
await exec(`rm -rf ${DIST} && mkdir -p ${DIST}`)

// Copy all static content into /dist
await exec(`cp ${path.resolve(TIL_PATH, 'static/*')} ${DIST}`)

// Build all files
const entries = fs.readdirSync(ENTRIES_PATH)
for (const filename of entries) {
  const content = fs.readFileSync(path.resolve(ENTRIES_PATH, filename), 'utf8')
  const markdown = parseMarkdown(content)
  //console.log(inspect(markdown, { depth: null, colors: true }))
  const entryDir = path.resolve(DIST, markdown.frontmatter.value.permalink)
  await exec(`mkdir -p "${quot(entryDir)}"`)
  fs.writeFileSync(
    path.resolve(entryDir, 'index.html'),
    render(
      jsx(Page, { filename, markdown, frontmatter: markdown.frontmatter.value })
    ),
    'utf8'
  )
}
