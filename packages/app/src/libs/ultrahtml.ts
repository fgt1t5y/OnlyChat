export type Node = DocumentNode | ElementNode | TextNode | CommentNode | DoctypeNode
export type NodeType =
  | typeof DOCUMENT_NODE
  | typeof ELEMENT_NODE
  | typeof TEXT_NODE
  | typeof COMMENT_NODE
  | typeof DOCTYPE_NODE
export interface Location {
  start: number
  end: number
}
interface BaseNode {
  type: NodeType
  loc: [Location, Location]
  parent: Node
  [key: string]: any
}

interface LiteralNode extends BaseNode {
  value: string
}

interface ParentNode extends BaseNode {
  children: Node[]
}

export interface DocumentNode extends Omit<ParentNode, 'parent'> {
  type: typeof DOCUMENT_NODE
  attributes: Record<string, string>
  parent: undefined
}

export interface ElementNode extends ParentNode {
  type: typeof ELEMENT_NODE
  name: string
  attributes: Record<string, string>
}

export interface TextNode extends LiteralNode {
  type: typeof TEXT_NODE
}

export interface CommentNode extends LiteralNode {
  type: typeof COMMENT_NODE
}

export interface DoctypeNode extends LiteralNode {
  type: typeof DOCTYPE_NODE
}

export const DOCUMENT_NODE = 0
export const ELEMENT_NODE = 1
export const TEXT_NODE = 2
export const COMMENT_NODE = 3
export const DOCTYPE_NODE = 4

export const Fragment = Symbol('Fragment')

const VOID_TAGS = new Set<string>([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'keygen',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
])
const RAW_TAGS = new Set<string>(['script', 'style'])
const DOM_PARSER_RE =
  /(?:<(\/?)([a-zA-Z][a-zA-Z0-9\:-]*)(?:\s([^>]*?))?((?:\s*\/)?)>|(<\!\-\-)([\s\S]*?)(\-\->)|(<\!)([\s\S]*?)(>))/gm

const ATTR_KEY_IDENTIFIER = /[\@\.a-z0-9_\:\-]/i

function splitAttrs(str?: string) {
  let obj: Record<string, string> = {}
  if (str) {
    let state: 'none' | 'key' | 'value' = 'none'
    let currentKey: string | undefined
    let currentValue: string = ''
    let tokenStartIndex: number | undefined
    let valueDelimiter: '"' | "'" | undefined
    for (let currentIndex = 0; currentIndex < str.length; currentIndex++) {
      const currentChar = str[currentIndex]

      if (state === 'none') {
        if (ATTR_KEY_IDENTIFIER.test(currentChar)) {
          // add attribute
          if (currentKey) {
            obj[currentKey] = currentValue
            currentKey = undefined
            currentValue = ''
          }

          tokenStartIndex = currentIndex
          state = 'key'
        } else if (currentChar === '=' && currentKey) {
          state = 'value'
        }
      } else if (state === 'key') {
        if (!ATTR_KEY_IDENTIFIER.test(currentChar)) {
          currentKey = str.substring(tokenStartIndex!, currentIndex)
          if (currentChar === '=') {
            state = 'value'
          } else {
            state = 'none'
          }
        }
      } else {
        if (currentChar === valueDelimiter && currentIndex > 0 && str[currentIndex - 1] !== '\\') {
          if (valueDelimiter) {
            currentValue = str.substring(tokenStartIndex!, currentIndex)
            valueDelimiter = undefined
            state = 'none'
          }
        } else if ((currentChar === '"' || currentChar === "'") && !valueDelimiter) {
          tokenStartIndex = currentIndex + 1
          valueDelimiter = currentChar
        }
      }
    }
    if (state === 'key' && tokenStartIndex != undefined && tokenStartIndex < str.length) {
      currentKey = str.substring(tokenStartIndex, str.length)
    }
    if (currentKey) {
      obj[currentKey] = currentValue
    }
  }
  return obj
}

export function parse(input: string): any {
  let str = input
  let doc: Node, parent: Node, token: any, text, i, bStart, bText, bEnd, tag: Node
  const tags: Node[] = []
  DOM_PARSER_RE.lastIndex = 0
  parent = doc = {
    type: DOCUMENT_NODE,
    children: [] as Node[],
  } as any

  let lastIndex = 0
  function commitTextNode() {
    text = str.substring(lastIndex, DOM_PARSER_RE.lastIndex - token[0].length)
    if (text) {
      ;(parent as ParentNode).children.push({
        type: TEXT_NODE,
        value: text,
        parent,
      } as any)
    }
  }

  while ((token = DOM_PARSER_RE.exec(str))) {
    bStart = token[5] || token[8]
    bText = token[6] || token[9]
    bEnd = token[7] || token[10]
    if (RAW_TAGS.has(parent.name) && token[2] !== parent.name) {
      i = DOM_PARSER_RE.lastIndex - token[0].length
      if (parent.children.length > 0) {
        parent.children[0].value += token[0]
      }
      continue
    } else if (bStart === '<!--') {
      i = DOM_PARSER_RE.lastIndex - token[0].length
      if (RAW_TAGS.has(parent.name)) {
        continue
      }
      tag = {
        type: COMMENT_NODE,
        value: bText,
        parent: parent,
        loc: [
          {
            start: i,
            end: i + bStart.length,
          },
          {
            start: DOM_PARSER_RE.lastIndex - bEnd.length,
            end: DOM_PARSER_RE.lastIndex,
          },
        ],
      } as any
      tags.push(tag)
      ;(tag.parent as any).children.push(tag)
    } else if (bStart === '<!') {
      i = DOM_PARSER_RE.lastIndex - token[0].length
      tag = {
        type: DOCTYPE_NODE,
        value: bText,
        parent: parent,
        loc: [
          {
            start: i,
            end: i + bStart.length,
          },
          {
            start: DOM_PARSER_RE.lastIndex - bEnd.length,
            end: DOM_PARSER_RE.lastIndex,
          },
        ],
      }
      tags.push(tag)
      tag.parent.children.push(tag)
    } else if (token[1] !== '/') {
      commitTextNode()
      if (RAW_TAGS.has(parent.name)) {
        lastIndex = DOM_PARSER_RE.lastIndex
        commitTextNode()
        continue
      } else {
        tag = {
          type: ELEMENT_NODE,
          name: token[2] + '',
          attributes: splitAttrs(token[3]),
          parent,
          children: [],
          loc: [
            {
              start: DOM_PARSER_RE.lastIndex - token[0].length,
              end: DOM_PARSER_RE.lastIndex,
            },
          ] as any,
        }
        tags.push(tag)
        tag.parent.children.push(tag)
        if ((token[4] && token[4].indexOf('/') > -1) || VOID_TAGS.has(tag.name)) {
          tag.loc[1] = tag.loc[0]
          tag.isSelfClosingTag = true
        } else {
          parent = tag
        }
      }
    } else {
      commitTextNode()
      // Close parent node if end-tag matches
      if (token[2] + '' === parent.name) {
        tag = parent
        parent = tag.parent!
        tag.loc.push({
          start: DOM_PARSER_RE.lastIndex - token[0].length,
          end: DOM_PARSER_RE.lastIndex,
        })
        text = str.substring(tag.loc[0].end, tag.loc[1].start)
        if (tag.children.length === 0) {
          tag.children.push({
            type: TEXT_NODE,
            value: text,
            parent,
          })
        }
      }
      // account for abuse of self-closing tags when an end-tag is also provided:
      else if (
        token[2] + '' === tags[tags.length - 1].name &&
        tags[tags.length - 1].isSelfClosingTag === true
      ) {
        tag = tags[tags.length - 1]
        tag.loc.push({
          start: DOM_PARSER_RE.lastIndex - token[0].length,
          end: DOM_PARSER_RE.lastIndex,
        })
      }
    }
    lastIndex = DOM_PARSER_RE.lastIndex
  }
  text = str.slice(lastIndex)
  parent.children.push({
    type: TEXT_NODE,
    value: text,
    parent,
  })
  return doc
}

export const RenderFn = Symbol('RenderFn')
