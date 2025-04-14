<template>
  <header class="page-Title">
    <div class="flex items-center gap-2 text-xl">
      <slot name="icon">
        <i :class="icon"></i>
      </slot>

      <div>{{ title }}</div>
    </div>
    <slot />
  </header>
</template>

<script setup lang="ts">
defineOptions({
  name: 'PageTitle',
  inheritAttrs: false,
})

const props = defineProps<{
  title: string
  icon?: string
}>()
</script>
