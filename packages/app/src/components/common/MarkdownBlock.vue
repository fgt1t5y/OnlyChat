<template>
  <component :is="vnode" />
</template>

<script setup lang="ts">
import CodeBlock from '@/components/common/CodeBlock.vue'
import { computed, Fragment, h } from 'vue'
import { markedInstance } from '@/libs/marked'
import { parse, TEXT_NODE } from '@/libs/ultrahtml'

import type { VNode } from 'vue'
import type { Node } from '@/libs/ultrahtml'

const props = defineProps<{
  text: string
  inline?: boolean
}>()

const treeToVNode = (input: Node): VNode | string | null => {
  if (!input) {
    return null
  }

  if (input.type === TEXT_NODE) {
    return input.value
  }

  if ('children' in input) {
    return nodeToVNode(input)
  }
  return null
}

const nodeToVNode = (node: Node): VNode | string | null => {
  if (node.name === 'pre') {
    let lang: string = node.children[0].attributes?.class

    if (lang) {
      const splitted = lang.split('-')
      lang = splitted[splitted.length - 1]

      return h(CodeBlock, { code: node.children[0].children[0].value, lang: lang })
    }
  }

  if (node.type === TEXT_NODE) {
    return node.value
  }

  if ('children' in node) {
    return h(node.name, node.attributes, node.children.map(treeToVNode))
  }
  return null
}

const contentToVNode = (html: string): VNode => {
  const tree = parse(html)

  return h(
    Fragment,
    ((tree.children as Node[]) || []).map((n) => treeToVNode(n)),
  )
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
