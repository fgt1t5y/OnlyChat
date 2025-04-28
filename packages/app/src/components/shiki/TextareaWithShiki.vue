<template>
  <div class="relative border border-content">
    <div v-html="output" class="highlight-Result"></div>
    <textarea v-model="input" class="highlight-Textarea" rows="3" spellcheck="false" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { highlighter } from '@/utils'

defineOptions({
  name: 'TextareaWithShiki',
})

const input = ref<string>('**Hello**')
const output = ref<string>('')

const highlight = () => {
  output.value = highlighter.codeToHtml(input.value, {
    lang: 'markdown',
    themes: {
      light: 'github-light',
      dark: 'github-dark',
    },
  })
}

highlight()

watch(
  input,
  () => {
    highlight()
  },
  { flush: 'post' },
)
</script>
