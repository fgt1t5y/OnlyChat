<template>
  <div v-html="highlightedText"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { highlighter } from '@/libs/shiki'

const props = defineProps<{
  code: string
  lang: string
}>()

const highlightedText = computed(() => {
  const highlightedText = highlighter.codeToHtml(props.code, {
    themes: {
      light: 'github-light',
      dark: 'github-dark',
    },
    lang: props.lang,
  })

  return highlightedText
})
</script>
