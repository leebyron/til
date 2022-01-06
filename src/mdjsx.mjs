import { jsx, Fragment } from 'hyperjsx'

export function mdjsx(ast, overrides) {
  return toJsx(ast)

  function toJsx(node) {
    if (node.type === 'text') return node.value
    if (node.type === 'html') return jsx('html', { outerHTML: node.value })

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
  paragraph: 'p',
  heading: ({ depth, children }) => jsx('h' + depth, { children }),
  thematicBreak: 'hr',
  blockquote: 'blockquote',
  list: ({ ordered, start, children }) =>
    // TODO: checked
    jsx(ordered ? 'ol' : 'ul', { start, children }),
  listitem: 'li',
  code: ({ lang, children }) =>
    jsx('pre', { 'data-lang': lang, children: jsx('code', { children }) }),
  emphasis: 'em',
  strong: 'strong',
  inlineCode: 'code',
  break: 'br',
  link: ({ url, title, children }) => jsx('a', { href: url, title, children }),
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
  footnoteReference: ({ identifier, referenceIdentifier, number }) =>
    jsx('a', {
      href: '#fn-' + identifier,
      id: 'fn-' + referenceIdentifier,
      'data-footnote-ref': true,
      'aria-label': 'note',
      children: number,
    }),
  footnoteDefinition: ({ identifier, references, children }) =>
    jsx('li', {
      id: 'fn-' + identifier,
      children: [
        children,
        references.map(ref =>
          jsx('a', {
            href: '#fn-' + ref.referenceIdentifier,
            'data-footnote-backref': true,
            'aria-label': 'return',
            children: '\u21A9',
          })
        ),
      ],
    }),
}
