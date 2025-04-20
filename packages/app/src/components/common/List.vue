<template>
  <ul ref="el">
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
  default: (props: {
    item: T
    next: T
    prev: T
    index: number
    items: T[]
  }) => void
  tail: () => void
}>()

const props = defineProps<{
  items: T[]
}>()

const el = useTemplateRef('el')

defineExpose({ el })
</script>
