import * as path from 'path'
import * as fs from 'fs'
import { inspect } from 'util'
import { render, jsx } from 'hyperjsx'
import { parseMarkdown } from './markdown.mjs'
import { mdjsx } from './mdjsx.mjs'
import { Index, Page } from './pages.mjs'
import { TIL_PATH, ENTRIES_PATH, quot, exec } from './util.mjs'

const DIST = path.resolve(TIL_PATH, 'dist')

// Clean directory
await exec(`rm -rf ${DIST} && mkdir -p ${DIST}`)

// Copy all static content into /dist
await exec(`cp ${path.resolve(TIL_PATH, 'static/*')} ${DIST}`)

// Parse all files
const entries = fs.readdirSync(ENTRIES_PATH).map(filename => {
  const filepath = path.resolve(ENTRIES_PATH, filename)
  const content = fs.readFileSync(filepath, 'utf8')
  const markdown = parseMarkdown(content)
  return {
    filename,
    filepath,
    content,
    markdown,
    frontmatter: markdown.frontmatter.value,
  }
})

// Parse and assemble index
const readmeFilepath = path.resolve(TIL_PATH, 'README.md')
const readmeContent = fs.readFileSync(readmeFilepath, 'utf8')
const readmeMarkdown = parseMarkdown(readmeContent)
// Use the first thematic break to differentiate from repo-only readme
const rule = readmeMarkdown.children.findIndex(
  node => node.type === 'thematicBreak'
)
if (~rule) {
  readmeMarkdown.children.splice(rule)
}
const frontmatters = entries.map(entry => entry.frontmatter)
frontmatters.sort((a, b) => b.date - a.date)

// Build index
const indexFile = path.resolve(DIST, 'index.html')
const rendered = render(
  jsx(Index, {
    frontmatters,
    Content: options => mdjsx(readmeMarkdown, options),
  })
)
fs.writeFileSync(indexFile, rendered, 'utf8')
console.log(path.relative(process.env.PWD, indexFile))

// Build all files
for (const { filename, markdown, frontmatter } of entries) {
  //console.log(inspect(markdown, { depth: null, colors: true }))
  const entryDir = path.resolve(DIST, frontmatter.permalink)
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
  fs.writeFileSync(entryFile, rendered, 'utf8')
  console.log(path.relative(process.env.PWD, entryFile))
}
