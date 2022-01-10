import { relative } from 'path'
import { h } from 'hyperjsx'

export function Index({ frontmatters, Content }) {
  return (
    h(Document, { path: '/til/' },
      h('title', 'Today I Learned / Lee Byron'),
      JSONLD({
        '@context': 'https://schema.org/',
        '@type': 'Collection',
        name: 'Today I Learned',
        author: {
          '@type': 'Person',
          name: 'Lee Byron',
          url: 'http://leebyron.com' },
        url: 'https://leebyron.com/til/',
        collectionSize: frontmatters.length,
        license: 'https://creativecommons.org/licenses/by/4.0/',
      }),
      h('section',
        h(Content, { components }),
        h('h2', { id: 'entry-log' },
          h('a', { href: '#entry-log', 'data-anchor': true },
             'entry log')),
        frontmatters.map(frontmatter =>
          h('div', { class: 'entrylog' },
            h('a', { href: `${frontmatter.permalink}/` }, frontmatter.title),
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

export function Page({ filename, lastModified, frontmatter, Content }) {
  return (
    h(Document, { path: `/til/${frontmatter.permalink}/` },
      h('title', frontmatter.title + ' / til / Lee Byron'),
      frontmatter.published === false &&
        h('meta', { name: 'robots', content: 'noindex' }),
      JSONLD({
        '@context': 'https://schema.org/',
        '@type': 'LearningResource',
        name: frontmatter.title,
        author: {
          '@type': 'Person',
          name: 'Lee Byron',
          url: 'http://leebyron.com' },
        url: `https://leebyron.com/til/${frontmatter.permalink}/`,
        datePublished: frontmatter.date.toISO(),
        dateModified: lastModified.toISO(),
        keywords: frontmatter.tags.join(', ') || undefined,
        isPartOf: 'https://leebyron.com/til/',
        license: 'https://creativecommons.org/licenses/by/4.0/',
      }),
      h('article',
        h('h1',
          h('a', { href: '../' }, 'til'),
          h('span', frontmatter.title)
        ),
        h(Content, { components }),
      ),
      h('footer',
        h(License, { year: frontmatter.date.year },
          h(Attribution, { filename, frontmatter })
        )
      )
    )
  )
}

function Document({ children, path }) {
  return (
    h('html',
      h('head',
        h('meta', { charset: 'UTF-8' }),
        children.filter(isHeadElement),
        h('meta', { name: 'viewport', content:'width=device-width, initial-scale=1'}),
        h('link', { rel: 'canonical', href: 'https://leebyron.com' + path }),
        h('link', { rel: 'shortcut icon', href: relative(path, '/til/assets/favicon.png') }),
        h('link', { rel: 'stylesheet', href: relative(path, '/til/assets/style.css') }),
        h(GTag),
      ),
      h('body',
        h('header',
          h('a', { href: 'https://leebyron.com' },
            h('img', { src: relative(path, '/til/assets/logo.svg'), alt: 'Lee Byron' })
          )
        ),
        children.filter(child => !isHeadElement(child)),
      )
    )
  )
}

function isHeadElement(element) {
  switch (element.type) {
    case 'title':
    case 'meta':
    case 'link':
    case 'script':
      return true
  }
  return false
}

function JSONLD(data) {
  return h('script', {
    type: 'application/ld+json',
    innerHTML: `\n${JSON.stringify(data, null, 2)}\n`
  })
}

function GTag() {
  return [
    h('script', { async: true, src: "https://www.googletagmanager.com/gtag/js?id=UA-61714711-1" }),
    h('script', { innerHTML: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'UA-61714711-1');
    ` })
  ]
}

function Attribution({ filename, frontmatter: { permalink, date } }) {
  return [
    // attribution
    'This ',
    h('a', {
      property: "dct:title",
      rel: "cc:attributionURL",
      href: `https://leebyron.com/til/${permalink}/` },
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
    'licensed under ',
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

// List of components to expose via MDX
const components = {
  YouTube,
}

function YouTube({ v, aspectRatio }) {
  return h('div', {
    class: 'yt-player',
    style: { paddingTop: aspectRatio && `${100/aspectRatio}%` }},
    h('iframe', {
      src:`https://www.youtube.com/embed/${v}`,
      title:"YouTube video player",
      frameborder:"0",
      allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
      allowfullscreen:true
    })
  )
}
