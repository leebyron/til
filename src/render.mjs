import * as path from 'path'
import * as fs from 'fs'
import * as url from 'url'
import { inspect } from 'util'
import yaml from 'yaml'
import { render, h as _h } from 'hyperjsx'
import { compiler } from 'markdown-to-jsx'

const TIL_PATH = path.dirname(url.fileURLToPath(import.meta.url))
const ENTRIES = path.resolve(TIL_PATH, '../entries')

function h(type, ...rest) {
  return (rest[0] && typeof rest[0] === 'object' && 'props' in rest[0])
    ? _h(type, rest.unshift(), ...rest)
    : _h(type, null, ...rest) 
}

function Markdown({ children, ...props }) {
  return compiler(children, {
    wrapper: null,
    forceBlock: true,
    ...props,
  //  overrides: { a: Link, code: Code },
    createElement: _h
  })
}

const entries = fs.readdirSync(ENTRIES)
console.log(entries)
const content = fs.readFileSync(path.resolve(ENTRIES, entries[0]), 'utf8')
const [frontmatter, markdown] = readFrontmatter(content)
console.log(markdown)
console.log(render(tilPage(frontmatter, markdown)))

function readFrontmatter(raw) {
  if (raw.slice(0, 4) !== '---\n') return [null, raw]
  const parts = content.split(/^---$/mg)
  return [yaml.parse(parts[1]), parts.slice(2).join('---')]
}

function tilPage(frontmatter, markdown) {
  return h('html', 
    h('body', 
      h('h1', frontmatter.title), 
      h(Markdown, markdown)
    )
  )
}
