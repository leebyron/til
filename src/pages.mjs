import { h } from 'hyperjsx'

export function Page({ filename, frontmatter, Content, Footnotes }) {
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
            h('span', frontmatter.title)
          ),
          h(Content),
        ),
        h('footer',
          h(Footnotes),
          h(License, { filename, frontmatter }),
        )
      )
    )
  )
}

function License({ filename, frontmatter: { permalink, date } }) {
  return h('div', {
    class: 'license',
    'xmlns:cc': "http://creativecommons.org/ns",
    'xmlns:dct': "http://purl.org/dc/terms/" },

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
