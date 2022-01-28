import { DateTime } from 'luxon'
import remarkComment from 'remark-comment'
import remarkParse from 'remark-parse'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import { retext } from 'retext'
import retextSmartypants from 'retext-smartypants'
import { mdx } from 'micromark-extension-mdx'
import { mdxFromMarkdown } from 'mdast-util-mdx'
import { unified } from 'unified'
import yaml from 'yaml'

export function parseMarkdown(markdown) {
  const ast = unified()
    .use(remarkParse)
    .use(remarkMdx)
    .use(remarkComment)
    .use(remarkFrontmatter)
    .use(remarkGfm)
    .parse(markdown)
  yamlFrontmatter(ast)
  smartypants(ast)
  collapseWhitespace(ast)
  slugs(ast)
  tableCells(ast)
  linkReferences(ast)
  footnotes(ast)
  return ast
}

function remarkMdx() {
  const data = this.data()
  const add = (field, value) =>
    (data[field] ? data[field] : (data[field] = [])).push(value)
  add('micromarkExtensions', mdx())
  add('fromMarkdownExtensions', mdxFromMarkdown)
}

function yamlFrontmatter(ast) {
  const index = ast.children.findIndex(child => child.type === 'yaml')
  if (~index) {
    const node = ast.children[index]
    ast.children.splice(index, 1)
    ast.frontmatter = { ...node, value: yaml.parse(node.value) }
    ast.frontmatter.value.tags = yamlTags(ast.frontmatter.value.tags)
    ast.frontmatter.value.date = yamlDate(ast.frontmatter.value.date)
  }
}

export function yamlTags(tags) {
  // Parse tags as a list
  return Array.isArray(tags)
    ? tags
    : typeof tags === 'string'
    ? tags.split(/\s+/g).filter(Boolean)
    : []
}

function yamlDate(date) {
  // Parse date as luxon DateTime
  return DateTime.fromISO(date, { setZone: true })
}

function smartypants(ast) {
  const processor = retext().use(retextSmartypants)
  visit(ast, (node, _, parent) => {
    if (isProseText(node, parent)) {
      node.value = String(processor.processSync(node.value))
    }
  })
}

function collapseWhitespace(ast) {
  visit(ast, (node, _, parent) => {
    if (isProseText(node, parent)) {
      node.value = node.value.replace(/\s+/g, ' ')
    }
  })
}

function isProseText(node, parent) {
  return (
    node.type === 'text' &&
    parent &&
    parent.type !== 'code' &&
    parent.type !== 'inlineCode'
  )
}

function slugs(ast) {
  return visit(ast, node => {
    if (node.type === 'heading') {
      node.slug = slugify(textContent(node))
    }
  })
}

export function findNode(ast, type) {
  let found
  visit(ast, node => {
    if (!found && node.type === type) {
      found = node
    }
  })
  return found
}

export function textContent(ast) {
  let content = ''
  visit(ast, node => {
    if (node.type === 'text') content += node.value
  })
  return content
}

function tableCells(ast) {
  let align
  let isHeader
  return visit(ast, (node, index) => {
    if (node.type === 'table') align = node.align
    else if (node.type === 'tableRow') isHeader = index === 0
    else if (node.type === 'tableCell')
      return {
        ...node,
        type: isHeader ? 'tableHeader' : 'tableCell',
        align: align && align[index],
      }
  })
}

function linkReferences(ast) {
  const definitions = new Map()

  // First pass, extract definitions and keep track of footnote order.
  visit(ast, node => {
    if (node.type === 'definition') {
      definitions.set(node.identifier, node)
    }
  })

  // Second pass, replace references
  visit(ast, node => {
    if (node.type === 'linkReference')
      return { ...definitions.get(node.identifier), ...node, type: 'link' }
    if (node.type === 'imageReference')
      return { ...definitions.get(node.identifier), ...node, type: 'image' }
  })
}

function footnotes(ast) {
  const footnoteDefinitions = new Map()
  const footnoteReferences = new Map()

  // Extract definitions and keep track of footnote order.
  visit(ast, node => {
    if (node.type === 'footnoteDefinition') {
      footnoteDefinitions.set(node.identifier, node)
      return null
    }
    if (node.type === 'footnoteReference') {
      if (footnoteReferences.has(node.identifier)) {
        footnoteReferences.get(node.identifier).push(node)
      } else {
        footnoteReferences.set(node.identifier, [node])
      }
    }
  })

  // Cross-link footnotes and give numbers/ids to all references.
  let footnoteNumber = 0
  for (const [id, refs] of footnoteReferences) {
    const footnote = footnoteDefinitions.get(id)
    const slug = 'fn:' + slugify(id)
    footnote.slug = slug
    footnote.number = ++footnoteNumber
    footnote.references = refs
    refs.forEach((ref, index) => {
      ref.slug = `${slug}.ref` + (refs.length > 1 ? index + 1 : '')
      ref.number = footnoteNumber
      ref.definition = footnote
    })
  }

  // Append footnotes to AST
  if (footnoteReferences.size > 0) {
    ast.children.push({
      type: 'footnotes',
      children: [...footnoteReferences.keys()].map(id =>
        footnoteDefinitions.get(id)
      ),
    })
  }
}

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^\p{Letter}\d\-_.!~*'()]+/gu, '-')
    .replace(/^-+|-+$/g, '')
}

function visit(ast, mapFn) {
  return dst(ast)[0]
  function dst(node, index, parent) {
    const rtn = mapFn(node, index, parent)
    if (rtn === undefined) {
      if (node.children) {
        node.children = node.children.flatMap((child, index) =>
          dst(child, index, node)
        )
      }
      return [node]
    }
    return rtn === null ? [] : Array.isArray(rtn) ? rtn : [rtn]
  }
}
