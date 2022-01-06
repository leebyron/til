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
  tableCells(ast)
  yamlFrontmatter(ast)
  linkReferences(ast)
  return ast
}

function yamlFrontmatter(ast) {
  const index = ast.children.findIndex(child => child.type === 'yaml')
  if (~index) {
    const node = ast.children[index]
    ast.children.splice(index, 1)
    ast.frontmatter = { ...node, value: yaml.parse(node.value) }
  }
}

function tableCells(ast) {
  let align
  let isHeader
  return editAST(ast, (node, index) => {
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
  const footnoteDefinitions = new Map()
  const footnoteReferences = new Map()

  // First pass, extract definitions and keep track of footnote order.
  editAST(ast, node => {
    if (node.type === 'definition') {
      definitions.set(node.identifier, node)
      return null
    }
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

  // Second pass, replace references
  editAST(ast, node => {
    if (node.type === 'linkReference')
      return { ...definitions.get(node.identifier), ...node, type: 'link' }
    if (node.type === 'imageReference')
      return { ...definitions.get(node.identifier), ...node, type: 'image' }
  })

  // Cross-link footnotes and give numbers/ids to all references.
  let footnoteNumber = 0
  for (const [id, refs] of footnoteReferences) {
    const footnote = footnoteDefinitions.get(id)
    footnote.number = ++footnoteNumber
    footnote.references = refs
    refs.forEach((ref, index) => {
      ref.number = footnoteNumber
      ref.referenceIdentifier = `${id}.ref` + (refs.length > 1 ? index + 1 : '')
      ref.footnote = footnote
    })
  }

  // Attach footnotes to AST
  if (footnoteReferences.size > 0) {
    ast.footnotes = [...footnoteReferences.keys()].map(id =>
      footnoteDefinitions.get(id)
    )
  }
}

function editAST(ast, mapFn) {
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
