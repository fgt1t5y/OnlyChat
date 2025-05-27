import { Marked, Renderer } from 'marked'

const ESCAPE_CHARS: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
}

const escape = (text: string) => text.replace(/[&<>]/g, (c) => ESCAPE_CHARS[c] || c)

const _markedInstance = new Marked()
const renderer = new Renderer()

renderer.html = function ({ text }) {
  return `<span>${_markedInstance.parseInline(escape(text))}</span>`
}

renderer.text = function ({ text }) {
  return `<span>${text}</span>`
}

_markedInstance.use({
  renderer,
})

export const markdownToHTML = (markdown: string, inline: boolean = false) => {
  return inline
    ? _markedInstance.parseInline(markdown, { async: false })
    : _markedInstance.parse(markdown, { async: false })
}
