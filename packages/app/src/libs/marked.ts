import { Marked, Renderer } from 'marked'

const renderer = new Renderer()

renderer.code = ({ lang, text }) => {
  return `<pre><code class="language-${lang}">${text}</code></pre>`
}

const _markedInstance = new Marked()

_markedInstance.use({
  breaks: true,
  renderer,
})

export const markedInstance = _markedInstance
