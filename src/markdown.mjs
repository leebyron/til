import { DateTime } from 'luxon'
import remarkParse from 'remark-parse'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import { unified } from 'unified'
import yaml from 'yaml'

export function parseMarkdown(markdown) {
  const ast = unified()
    .use(remarkParse)
    .use(remarkFrontmatter)
    .use(remarkGfm)
    .parse(markdown)
  yamlFrontmatter(ast)
  slugs(ast)
  tableCells(ast)
  linkReferences(ast)
  footnotes(ast)
  return ast
}

function yamlFrontmatter(ast) {
  const index = ast.children.findIndex(child => child.type === 'yaml')
  if (~index) {
    const node = ast.children[index]
    ast.children.splice(index, 1)
    ast.frontmatter = { ...node, value: yaml.parse(node.value) }
    // Parse tags as a list
    ast.tags = Array.isArray(ast.tags)
      ? ast.tags
      : typeof ast.tags === 'string'
      ? ast.tags.split(/\w+/g).filter(Boolean)
      : []
    // Parse date as luxon DateTime
    if (ast.frontmatter.value.date) {
      ast.frontmatter.value.date = DateTime.fromISO(
        ast.frontmatter.value.date,
        { setZone: true }
      )
    }
  }
}

function slugs(ast) {
  return visit(ast, node => {
    if (node.type === 'heading') {
      node.slug = slugify(textContent(node))
    }
  })
}

function textContent(ast) {
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
      return null
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
    const slug = 'fn-' + slugify(id)
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
  function dst(node, index) {
    const rtn = mapFn(node, index)
    if (rtn === undefined) {
      if (node.children) node.children = node.children.flatMap(dst)
      return [node]
    }
    return rtn === null ? [] : Array.isArray(rtn) ? rtn : [rtn]
  }
}
