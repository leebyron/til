import { relative } from 'path'
import { resolve } from 'url'
import { render, h, createContext, useContext } from 'hyperjsx'
import { mdjsx } from './mdjsx.mjs'
import { findNode, textContent } from './markdown.mjs'
import { currentYear } from './util.mjs'

import Config from '../config.mjs'

const relativeUrl =
  // Adds back trailing / which resolve() removes.
  (from, to) => relative(from, to) + (to.endsWith('/') ? '/' : '')

const canonicalPath = to => resolve(Config.canonicalRoot, relativeUrl('/', to))
const Path = createContext()
const useCanonical = () => canonicalPath(useContext(Path))
const useRelPath = to => relativeUrl(useContext(Path), to)

export function Index({ frontmatters, Content }) {
  return (
    h(Path, { value: '/' },
      h(Document,
        h('title', Config.pageTitle),
        ...OpenGraph({
          'og:url': Config.canonicalRoot,
          'og:title': Config.ogTitle,
          'og:description': Config.ogDescription,
          'twitter:card': 'summary',
          'twitter:title': Config.twitterTitle,
          'twitter:creator': Config.twitterCreator,
        }),
        JSONLD({
          '@type': 'Collection',
          name: Config.googleName,
          author: {
            '@type': 'Person',
            name: Config.authorName,
            url: Config.authorURL,
          },
          url: Config.canonicalRoot,
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
          h(License, { year: currentYear() })
        )
      )
    )
  )
}

export function Feed({ entries }) {
  return (
    h('feed', { xmlns: 'http://www.w3.org/2005/Atom', 'xml:lang': 'en-us' },
      h('id', canonicalPath('/feed.xml')),
      h('link', { rel: 'self', type: 'application/atom+xml', href: canonicalPath('/feed.xml') }),
      h('link', { rel: 'alternate', type: 'text/html', href: Config.canonicalRoot }),
      h('updated', entries.map(e => e.lastModified).sort((a, b) => a - b).pop().toISO()),
      h('title', Config.feedTitle),
      h('subtitle', Config.feedSubtitle),
      h('icon', canonicalPath('/assets/favicon.png')),
      h('author', h('name', Config.authorName), h('uri', Config.authorURL)),
      h('rights', `© ${currentYear()} ${Config.authorName} ⸱ licensed under CC BY 4.0`),
      h('generator', { uri: `https://github.com/${Config.githubRepo}` }, 'til'),
      entries.map(({ markdown, frontmatter, lastModified }) =>
        h('entry',
          h('id', canonicalPath(`/${frontmatter.permalink}/`)),
          h('link', { rel: 'alternate', type: 'text/html', href: canonicalPath(`/${frontmatter.permalink}/`) }),
          h('published', frontmatter.date.toISO()),
          h('updated', lastModified.toISO()),
          h('title', frontmatter.title),
          h('author', h('name', Config.authorName), h('uri', Config.authorURL)),
          frontmatter.tags.map(tag => h('category', { term: tag })),
          h('content', { type: 'html', innerHTML: `<![CDATA[${render(mdjsx(markdown, { components }))}]]>` }),
          h('rights', `© ${frontmatter.date.year} ${Config.authorName} ⸱ licensed under CC BY 4.0`),
        )
      )
    )
  )
}

export function Page({ filename, lastModified, frontmatter, markdown, Content, prev, next }) {
  const path = `/${frontmatter.permalink}/`
  const canonicalUrl = canonicalPath(path)
  const pageTitle = `${Config.title} / ${frontmatter.title} — ${Config.authorName}`
  const description = textContent(findNode(markdown, 'paragraph'))
  const imageNode = findNode(markdown, 'image')
  const image = imageNode && resolve(canonicalUrl, imageNode.url)
  const datePublished = frontmatter.date.toISO()
  const dateModified = lastModified.toISO()

  return (
    h(Path, { value: path },
      h(Document,
        frontmatter.published === false &&
        h('meta', { name: 'robots', content: 'noindex' }),
        h('title', pageTitle),
        ...OpenGraph({
          'og:url': canonicalUrl,
          'og:title': pageTitle,
          'og:description': description,
          'og:image': image,
          'og:image:alt': imageNode?.alt,
          'og:type': 'article',
          'article:author': Config.authorURL,
          'article:published_time': datePublished,
          'article:modified_time': dateModified,
          'twitter:card': 'summary',
          'twitter:creator': Config.twitterCreator,
        }),
        JSONLD({
          '@type': 'LearningResource',
          name: frontmatter.title,
          description,
          image,
          author: {
            '@type': 'Person',
            name: Config.authorName,
            url: Config.authorURL,
          },
          url: canonicalUrl,
          datePublished,
          dateModified,
          keywords: frontmatter.tags.join(', ') || undefined,
          isPartOf: Config.canonicalRoot,
          license: 'https://creativecommons.org/licenses/by/4.0/',
        }),
        h('article',
          h('h1',
            h('a', { href: '../' }, Config.title),
            h('span', frontmatter.title)
          ),
          h(Content, { components }),
        ),
        h('footer',
          (prev || next) && h('div', { class: 'linkedlist' },
            prev && h('a', { href: `../${prev.permalink}/`, class: 'prev' },
              prev.title),
            next && h('a', { href: `../${next.permalink}/`, class: 'next' },
              next.title)
          ),
          h(License, { year: frontmatter.date.year },
            h(Attribution, { filename, frontmatter })
          )
        )
      )
    )
  )
}

function Document({ children }) {
  return (
    h('html', { lang: 'en-US' },
      h('head',
        h('meta', { charset: 'UTF-8' }),
        children.filter(isHeadElement),
        h('meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' }),
        h('link', { rel: 'canonical', href: useCanonical() }),
        h('link', { rel: 'shortcut icon', href: useRelPath('/assets/favicon.png') }),
        h('link', { rel: 'stylesheet', href: useRelPath('/assets/style.css') }),
        h('link', { rel: 'alternate', type: 'application/atom+xml', title: 'Reader Feed', href: canonicalPath('/feed.xml') }),
        h(GTag),
      ),
      h('body',
        h('header',
          h('a', { href: Config.authorURL },
            h('img', { src: useRelPath('/assets/logo.svg'), alt: Config.authorName }),
          )
        ),
        children.filter(child => !isHeadElement(child)),
      )
    )
  )
}

function isHeadElement(element) {
  switch (element?.type) {
    case 'title':
    case 'meta':
    case 'link':
    case 'script':
      return true
  }
  return false
}

function OpenGraph(data) {
  return Object.entries(data).map(([name, content]) => content && h('meta', {
    [name.startsWith('twitter:') ? 'name' : 'property']: name,
    content
  }))
}

function JSONLD(data) {
  data = { '@context': 'https://schema.org/', ...data }
  return h('script', {
    type: 'application/ld+json',
    innerHTML: `\n${JSON.stringify(data, null, 2)}\n`
  })
}

function GTag() {
  return Config.gtag && [
    h('script', { async: true, src: `https://www.googletagmanager.com/gtag/js?id=${Config.gtag}` }),
    h('script', {
      innerHTML: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${Config.gtag}');
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
      href: useCanonical()
    },
      Config.title),

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
    h('a', { href: `https://raw.githubusercontent.com/${Config.githubRepo}/main/entries/${encodeURIComponent(filename)}`, target: '_blank' },
      'raw'),

    ' ⸱ ',

    // edit
    h('a', { href: `https://github.com/${Config.githubRepo}/edit/main/entries/${encodeURIComponent(filename)}#L8`, target: '_blank' },
      'edit'),
  ]
}

function License({ year, children }) {
  return h('div', {
    class: 'license',
    'xmlns:cc': "http://creativecommons.org/ns",
    'xmlns:dct': "http://purl.org/dc/terms/"
  },

    children,
    children && h('br'),

    // copyright
    '© ',
    h('span', { rel: 'dct:dateCopyrighted' }, year),
    ' ',
    h('a', {
      rel: "cc:attributionURL dct:creator",
      property: "cc:attributionName",
      href: Config.authorURL
    },
      Config.authorName),

    ' ⸱ ',

    // Designed by Lee Byron
    Config.authorName !== 'Lee Byron' && [
      'designed by ',
      h('a', { href: 'https://github.com/leebyron/til' }, 'Lee Byron'),
      ' ⸱ ',
    ],

    // license
    'licensed under ',
    h('a', {
      href: "http://creativecommons.org/licenses/by/4.0/",
      target: "_blank",
      rel: "cc:license license noopener noreferrer"
    },
      'CC BY 4.0',
      h('img', {
        src: "https://mirrors.creativecommons.org/presskit/icons/cc.svg",
        'aria-hidden': true
      }),
      h('img', {
        src: "https://mirrors.creativecommons.org/presskit/icons/by.svg",
        'aria-hidden': true
      })
    ),

    ' ⸱ ',

    h('a', { href: canonicalPath('/feed.xml'), rel: 'alternate feed', type: 'application/atom+xml' }, 'feed')
  )
}

// List of components to expose via MDX
const components = {
  YouTube,
}

function YouTube({ v, aspectRatio }) {
  return h('div', {
    class: 'yt-player',
    style: { '--aspectRatio': aspectRatio }
  },
    h('iframe', {
      src: `https://www.youtube.com/embed/${v}`,
      title: "YouTube video player",
      frameborder: "0",
      allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
      allowfullscreen: true
    })
  )
}
