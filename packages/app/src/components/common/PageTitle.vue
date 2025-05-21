<template>
  <header class="page-Title">
    <div class="flex items-center gap-2">
      <slot name="icon">
        <i :class="icon"></i>
      </slot>

      <slot name="title" :title="title">
        <div class="text-base">{{ title }}</div>
      </slot>
    </div>
    <slot />
  </header>
</template>

<script setup lang="ts">
defineOptions({
  name: 'PageTitle',
  inheritAttrs: false,
})

defineSlots<{
  default(): any
  icon(): any
  title(props: { title: string }): any
}>()

const props = defineProps<{
  title: string
  icon?: string
}>()
</script>
