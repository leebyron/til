import { jsx, Fragment } from 'hyperjsx'
import shiki from 'shiki'

export function mdjsx(ast, overrides) {
  return toJsx(ast)

  function toJsx(node) {
    if (!node) return null

    const type =
      (overrides && overrides[node.type]) || defaults[node.type] || node.type

    const props = {}
    if (typeof type === 'function') {
      for (let prop in node) {
        if (prop !== 'type' && prop != 'children' && prop != 'value') {
          props[prop] = node[prop]
        }
      }
    }

    if (node.children || node.value != null) {
      props.children = node.children ? node.children.map(toJsx) : node.value
    }

    return jsx(type, props)
  }
}

const defaults = {
  root: Fragment,
  text: ({ children }) => children,
  // Important: no sanitizing is being done here!
  html: ({ children }) =>
    /^<!--[\s\S]*?-->$/.test(children)
      ? null
      : jsx('div', { outerHTML: children }),
  paragraph: 'p',
  heading: ({ depth, slug, children }) =>
    jsx('h' + depth, { id: slug, children }),
  thematicBreak: 'hr',
  blockquote: 'blockquote',
  list: ({ ordered, start, children }) =>
    jsx(ordered ? 'ol' : 'ul', { start, children }),
  listItem: ({ checked, children }) =>
    jsx('li', {
      'data-checked': checked != null && String(checked),
      children:
        checked != null
          ? [
              jsx('input', { type: 'checkbox', disabled: true, checked }),
              ...children,
            ]
          : children,
    }),
  code: ({ lang, children }) =>
    jsx('pre', {
      'data-code-block': true,
      'data-lang': lang,
      children: jsx('code', { children: highlight(children, lang) }),
    }),
  emphasis: 'em',
  strong: 'strong',
  inlineCode: 'code',
  break: 'br',
  link: ({ url, title, children }) =>
    jsx('a', {
      href: url,
      title,
      target: /^(\w+:)?\/\//.test(url) ? '_blank' : null,
      children,
    }),
  image: ({ url, title, alt, children }) =>
    jsx('img', { src: url, title, children }),
  delete: 's',
  table: ({ children }) =>
    jsx('table', {
      children: [
        jsx('thead', { children: children[0] }),
        children.length > 1 && jsx('tbody', { children: children.slice(1) }),
      ],
    }),
  tableRow: 'tr',
  tableHeader: ({ align, children }) => jsx('th', { align, children }),
  tableCell: ({ align, children }) => jsx('td', { align, children }),
  footnotes: ({ children }) =>
    jsx('section', {
      'data-footnotes': true,
      'aria-label': 'footnotes',
      children: jsx('ol', { children }),
    }),
  footnoteReference: ({ slug, definition, number }) =>
    jsx('a', {
      href: '#' + definition.slug,
      id: slug,
      'data-footnote-ref': true,
      'aria-label': 'note',
      children: number,
    }),
  footnoteDefinition: ({ slug, references, children }) =>
    jsx('li', {
      id: slug,
      children: [
        children,
        references.map(ref =>
          jsx('a', {
            href: '#' + ref.slug,
            'data-footnote-backref': true,
            'aria-label': 'return',
            children: '\u21A9',
          })
        ),
      ],
    }),
}

const highlighter = await shiki.getHighlighter({
  theme: 'min-light',
})

function highlight(code, lang) {
  if (lang) {
    try {
      const tokens = highlighter.codeToThemedTokens(code, lang)
      return tokens.flatMap(line => [
        ...line.map(token =>
          /^\w*$/.test(token)
            ? token
            : jsx('span', {
                style: {
                  color: token.color,
                  'font-style':
                    token.fontStyle & shiki.FontStyle.Italic ? 'italic' : null,
                },
                children: token.content,
              })
        ),
        '\n',
      ])
    } catch {
      // Ignore
    }
  }
  // Otherwise return unhighlighted code text
  return code
}
