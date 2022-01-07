import { relative } from 'path'
import { h } from 'hyperjsx'

export function Index({ frontmatters, Content }) {
  return (
    h(Document, {
      path: '/til',
      title: 'today i learned - Lee Byron' },
      h('section',
        h(Content),
        h('h2', 'entry log'),
        frontmatters.map(frontmatter =>
          h('div', { class: 'entrylog' },
            h('a', { href: frontmatter.permalink }, frontmatter.title),
            h('pre', { class: 'timestamp' },
              h('span', { class: 'p2' }, frontmatter.date.toFormat('ccc, ')),
              h('span', { class: 'p0' }, frontmatter.date.toFormat('dd LLL yyyy')),
              h('span', { class: 'p1' }, frontmatter.date.toFormat(' HH:mm')),
              h('span', { class: 'p3' }, frontmatter.date.toFormat(':ss ZZ')),
            )
          )
        )
      ),
      h('footer',
        h(License, { year: '2022' })
      )
    )
  )
}

export function Page({ filename, frontmatter, Content }) {
  return (
    h(Document, {
      path: '/til/' + frontmatter.permalink,
      title: frontmatter.title + ' — til by Lee Byron' },
      h('article',
        h('h1',
          h('a', { href: '../' }, 'til'),
          h('span', frontmatter.title)
        ),
        h(Content),
      ),
      h('footer',
        h(License, { year: frontmatter.date.year },
          h(Attribution, { filename, frontmatter })
        )
      )
    )
  )
}

function Document({ title, children, path }) {
  return (
    h('html',
      h('head',
        h('title', title),
        h('meta', { charset: 'UTF-8' }),
        h('meta', { name: 'viewport', content:'width=device-width, initial-scale=1'}),
        h('link', { rel: 'canonical', href: 'https://leebyron.com' + path }),
        h('link', { rel: 'shortcut icon', href: relative(path, '/til/assets/favicon.png') }),
        h('link', { rel: 'stylesheet', href: relative(path, '/til/assets/style.css') }),
      ),
      h('body',
        h('header',
          h('a', { href: 'https://leebyron.com' },
            h('img', { src: relative(path, '/til/assets/logo.svg'), alt: 'Lee Byron' })
          )
        ),
        children
      )
    )
  )
}

function Attribution({ filename, frontmatter: { permalink, date } }) {
  return [
    // attribution
    'This ',
    h('a', {
      property: "dct:title",
      rel: "cc:attributionURL",
      href: `https://leebyron.com/til/${permalink}` },
      'til'),

    // time
    ' was created ',
    h('span', { property: 'dct:created', content: date.toISO() },
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
    h('a', { href: `https://github.com/leebyron/til/edit/main/entries/${encodeURIComponent(filename)}#L8` },
      'edit'),
  ]
}

function License({ year, children }) {
  return h('div', {
    class: 'license',
    'xmlns:cc': "http://creativecommons.org/ns",
    'xmlns:dct': "http://purl.org/dc/terms/" },

    children,
    children && h('br'),

    // copyright
    '© ',
    h('span', { rel: 'dct:dateCopyrighted' }, year),
    ' ',
    h('a', {
      rel: "cc:attributionURL dct:creator",
      property: "cc:attributionName",
      href: "https://leebyron.com" },
      'Lee Byron'),

    ' ⸱ ',

    // license
    ' licensed under ',
    h('a', {
      href: "http://creativecommons.org/licenses/by/4.0/",
      target: "_blank",
      rel: "cc:license license noopener noreferrer" },
      'CC BY 4.0',
      h('img', { src: "https://mirrors.creativecommons.org/presskit/icons/cc.svg" }),
      h('img', { src: "https://mirrors.creativecommons.org/presskit/icons/by.svg" })
    )
  )
}
