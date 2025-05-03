import { Marked, Renderer } from 'marked'

const renderer = new Renderer()

renderer.code = function ({ lang, text }) {
  return `<pre><code class="language-${lang}">${text}</code></pre>`
}

// renderer.html = function ({ text }) {
//   return `<escaped>${escape(text)}</escaped>`
// }

const _markedInstance = new Marked()

_markedInstance.use({
  renderer,
})

export const markedInstance = _markedInstance
