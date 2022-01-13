import Context from 'context-eval'
import { jsx, Fragment } from 'hyperjsx'
import shiki from 'shiki'

/**
 * Options:
 *
 *   - components: an object with keys of names of components and values of
 *                 component functions to be used for such named MDX elements.
 *
 *   - overrides: an object with keys with the name of mdast node types and
 *                values of either string of an html element to use, or
 *                function which returns jsx.
 */
export function mdjsx(ast, { components, overrides } = {}) {
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
      jsx('h' + depth, {
        id: slug,
        children: jsx('a', { href: '#' + slug, 'data-anchor': true, children }),
      }),
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
    definition: null,
    link: ({ url, title, children }) =>
      jsx('a', {
        href: url,
        title,
        target: /^(\w+:)?\/\//.test(url) ? '_blank' : null,
        children,
      }),
    image: ({ url, title, alt, children }) =>
      jsx('img', { src: url, title, alt, children }),
    delete: 's',
    table: ({ children }) =>
      jsx('div', {
        class: 'table-wrapper',
        children: jsx('table', {
          children: [
            jsx('thead', { children: children[0] }),
            children.length > 1 &&
              jsx('tbody', { children: children.slice(1) }),
          ],
        }),
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
        children: jsx('sup', { children: number }),
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
    mdxJsxTextElement: mdxToJsx,
    mdxJsxFlowElement: mdxToJsx,
    mdxTextExpression: ({ children }) => run(unescapeMarkdown(children)),
    mdxFlowExpression: ({ children }) => {
      const result = run(unescapeMarkdown(children))
      if (result == null) return null
      return result == null
        ? null
        : typeof result === 'object' && result && 'props' in result
        ? result
        : jsx('p', { children: result })
    },
  }

  let _runContext
  const result = mdastToJsx(ast)
  if (_runContext) _runContext.destroy()
  return result

  function mdastToJsx(node) {
    const type = node && (overrides?.[node.type] || defaults[node.type])
    if (!type) return null

    const props = {}
    if (typeof type === 'function') {
      for (let prop in node) {
        if (prop !== 'type' && prop != 'children' && prop != 'value') {
          props[prop] = node[prop]
        }
      }
    }

    if (node.children || node.value != null) {
      props.children = node.children
        ? node.children.map(mdastToJsx)
        : node.value
    }

    return typeof type === 'function' ? type(props) : jsx(type, props)
  }

  function mdxToJsx({ name, attributes, children }) {
    const type =
      name == null
        ? Fragment
        : (/^[A-Z]/.test(name) &&
            (_runContext?.getGlobal()[name] ?? components?.[name])) ||
          name

    const props = {}
    for (const { type, name, value } of attributes) {
      if (type === 'mdxJsxExpressionAttribute') {
        Object.assign(props, run(value))
      } else {
        props[name] =
          typeof value === 'string'
            ? value
            : value?.type === 'mdxJsxAttributeValueExpression'
            ? run(value.value)
            : true
      }
    }
    props.children = children

    return jsx(type, props)
  }

  function run(expression) {
    if (!_runContext) _runContext = new Context({ jsx })
    return _runContext.evaluate(expression)
  }
}

function unescapeMarkdown(expression) {
  return expression.replace(/\\([*_])/g, '$1')
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
