<template>
  <ul ref="el" @scroll="emits('scroll', $event)">
    <slot name="head" />

    <slot
      v-for="(item, index) of items"
      :item="item as T"
      :next="items[index + 1] as T"
      :prev="items[index - 1] as T"
      :index="index"
      :items="items as T[]"
    />

    <slot name="tail" />
  </ul>
</template>

<script setup lang="ts" generic="T">
import { useTemplateRef } from 'vue'

defineOptions({
  name: 'List',
})

defineSlots<{
  head: () => void
  default: (props: { item: T; next: T; prev: T; index: number; items: T[] }) => void
  tail: () => void
}>()

const { items = [] } = defineProps<{
  items: T[]
}>()

const emits = defineEmits<{
  (e: 'scroll', event: Event): void
}>()

const el = useTemplateRef('el')

const scrollTo = (top: number) => {
  if (el.value) {
    window.requestAnimationFrame(() => {
      el.value!.scrollTo({
        top: top,
      })
    })
  }
}

const scrollToBottom = () => {
  if (el.value) {
    window.requestAnimationFrame(() => {
      el.value!.scrollTo({
        top: el.value!.scrollHeight,
      })
    })
  }
}

defineExpose({ el, scrollTo, scrollToBottom })
</script>
