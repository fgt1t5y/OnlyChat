import { Marked, Renderer } from 'marked'

const renderer = new Renderer()

renderer.code = ({ lang, text }) => {
  return `<pre><code class="language-${lang}">${text}</code></pre>`
}

// renderer.html = ({ text }) => {
//   return `<escaped value="${escape(text)}"></escaped>`
// }

const _markedInstance = new Marked()

_markedInstance.use({
  renderer,
})

export const markedInstance = _markedInstance
