import { Marked, Renderer } from 'marked'

const ESCAPE_CHARS: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
}

const _markedInstance = new Marked()
const renderer = new Renderer()

renderer.html = function ({ text }) {
  const escaped = text.replace(/[&<>]/g, (c) => ESCAPE_CHARS[c] || c)

  return `<span>${markedInstance.parseInline(escaped)}</span>`
}

renderer.text = function ({ text }) {
  return `<span>${text}</span>`
}

_markedInstance.use({
  renderer,
})

export const markedInstance = _markedInstance
