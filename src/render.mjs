import * as path from 'path'
import * as fs from 'fs'
import { inspect } from 'util'
import { render, h, } from 'hyperjsx'
import { parseMarkdown } from './markdown.mjs'
import { mdjsx } from './mdjsx.mjs'
import { TIL_PATH, ENTRIES_PATH, quot, dateFrom3339, exec } from './util.mjs'

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
    render(tilPage(filename, markdown)),
    'utf8'
  )
}

function tilPage(filename, markdown) {
  return (
    h('html',
      h('head',
        h('meta', { name: 'viewport', content:'width=device-width, initial-scale=1'}),
        h('link', { rel: 'stylesheet', href: '../style.css' }),
      ),
      h('body',
        h('header',
          h('a', { href: 'https://leebyron.com' },
            h('img', { src: '../logo.svg', alt: 'Lee Byron' })
          )
        ),
        h('section',
          h('h1',
            h('a', { href: '../' }, 'til'),
            h('span', markdown.frontmatter.value.title)
          ),
          mdjsx(markdown)
        ),
        h('footer',
          markdown.footnotes &&
            h('section', { 'data-footnotes': true, 'aria-label': 'footnotes' },
              h('ol', markdown.footnotes.map(mdjsx))
            ),
          license(markdown.frontmatter.value, filename),
        )
      )
    )
  )
}

function license(frontmatter, filename) {
  const date = dateFrom3339(frontmatter.date)
  return h('div', {
    class: 'license',
    'xmlns:cc': "http://creativecommons.org/ns",
    'xmlns:dct': "http://purl.org/dc/terms/" },

    // attribution
    'This ',
    h('a', {
      property: "dct:title",
      rel: "cc:attributionURL",
      href: `https://leebyron.com/til/${frontmatter.permalink}` },
      'til'),

    // time
    ' was created ',
    h('span', { property: 'dct:created', content: frontmatter.date },
      date.toLocaleString({
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        weekday: 'short',
        hour: 'numeric',
        minute: 'numeric'
      })),

    ' ⸱ ',

    // edit
    h('a', { href: `https://github.com/leebyron/til/edit/main/entries/${encodeURIComponent(filename)}#L8` }, 'edit'),

    h('br'),

    // copyright
    '© ',
    h('span', { rel: 'dct:dateCopyrighted' }, date.year),
    ' ',
    h('a', {
      rel: "cc:attributionURL dct:creator",
      property: "cc:attributionName",
      href: "https://leebyron.com", },
      'Lee Byron'),

    ' ⸱ ',

    // license
    ' licensed under ',
    h('a', {
      href: "http://creativecommons.org/licenses/by/4.0/",
      target: "_blank",
      rel: "cc:license license noopener noreferrer",
      style: "display: inline-block" },
      'CC BY 4.0',
      h('img', { src: "https://mirrors.creativecommons.org/presskit/icons/cc.svg" }),
      h('img', { src: "https://mirrors.creativecommons.org/presskit/icons/by.svg" })
    )
  )
}
