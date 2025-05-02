<template>
  <component :is="vnode" />
</template>

<script setup lang="ts">
import CodeBlock from '@/components/common/CodeBlock.vue'
import EscapedBlock from '@/components/common/EscapedBlock.vue'
import { computed, Fragment, h } from 'vue'
import { markedInstance } from '@/libs/marked'

import type { VNode } from 'vue'

const props = defineProps<{
  text: string
  inline?: boolean
}>()

const nodeToVNode = (element: Element): VNode | null => {
  if (element.nodeName === 'PRE') {
    const code = element.querySelector('code')

    if (code) {
      const lang = code.className.split('-').pop()

      return h(CodeBlock, { code: code.textContent || '', lang: lang || 'text' })
    }
  }

  return h(element.nodeName.toLowerCase(), element.textContent!)
}

const treeToVNode = (element: Element): VNode | null => {
  if (element.nodeType === Node.ELEMENT_NODE) {
    return nodeToVNode(element)
  }

  return null
}

const contentToVNode = (html: string): VNode => {
  const template = document.createElement('template')

  template.innerHTML = html

  return h(Fragment, Array.from(template.content.children).map(treeToVNode))
}

const vnode = computed(() => {
  if (!props.text) {
    return null
  }

  return contentToVNode(
    props.inline
      ? markedInstance.parseInline(props.text, { async: false })
      : markedInstance.parse(props.text, { async: false }),
  )
})
</script>
