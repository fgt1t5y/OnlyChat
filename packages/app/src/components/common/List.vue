<template>
  <ul ref="el">
    <slot name="head" />

    <slot
      v-for="(item, index) of items"
      :item="item as T"
      :older="items[index + 1] as T"
      :newer="items[index - 1] as T"
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
  head: ({}) => void
  default: (props: {
    items: T[]
    item: T
    index: number
    active?: boolean
    older: T
    newer: T // newer is undefined when index === 0
  }) => void
  tail: ({}) => void
}>()

const props = defineProps<{
  items: T[]
}>()

const el = useTemplateRef('el')

defineExpose({ el })
</script>
