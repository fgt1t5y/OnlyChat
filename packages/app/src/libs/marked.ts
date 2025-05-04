import { Marked, Renderer } from 'marked'

const ESCAPE_CHARS: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
}

const renderer = new Renderer()

renderer.html = function ({ text }) {
  return `<span>${text.replace(/[&<>]/g, (c) => ESCAPE_CHARS[c] || c)}</span>`
}

renderer.text = function ({ text }) {
  return `<span>${text}</span>`
}

const _markedInstance = new Marked()

_markedInstance.use({
  renderer,
})

export const markedInstance = _markedInstance
