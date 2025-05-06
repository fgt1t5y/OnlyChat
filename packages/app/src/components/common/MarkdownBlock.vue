<template>
  <component :is="vnode" />
</template>

<script setup lang="ts">
import CodeBlock from '@/components/common/CodeBlock.vue'
import { computed, Fragment, h } from 'vue'
import { markdownToHTML } from '@/libs/marked'

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

  if (element.children.length) {
    return h(element.nodeName.toLowerCase(), Array.from(element.children).map(treeToVNode))
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

  return contentToVNode(markdownToHTML(props.text, props.inline))
})
</script>
