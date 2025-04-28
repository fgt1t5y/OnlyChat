import { Marked } from 'marked'
import { createHighlighter } from 'shiki'

export const markedInstance = new Marked()

export const highlighter = await createHighlighter({
  themes: ['github-light', 'github-dark'],
  langs: ['markdown'],
})
