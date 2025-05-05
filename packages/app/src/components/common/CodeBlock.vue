<template>
  <div class="code-Block">
    <div v-html="highlightedText"></div>
    <div class="code-Block-Button">
      <Button severity="secondary" size=small title="Copy" aria-label="Copy" @click="copy()">
        <template #icon>
          <i v-if="!copied" class="ti ti-copy"></i>
          <i v-else class="ti ti-check"></i>
        </template>
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { highlighter } from '@/libs/shiki'
import { Button } from 'primevue'
import { useClipboard } from '@vueuse/core'

const props = defineProps<{
  code: string
  lang: string
}>()

const { copy, copied } = useClipboard({
  source: props.code,
})

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
