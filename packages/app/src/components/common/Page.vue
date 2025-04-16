<template>
  <main :id="id" class="page">
    <slot />
  </main>
  <slot v-if="rightAside" name="rightAside" />
</template>

<script setup lang="ts">
defineOptions({
  name: 'Page',
})

const props = defineProps<{
  id?: string
  rightAside?: boolean
}>()
</script>
