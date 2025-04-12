<template>
  <main class="flex flex-col grow gap-2 p-2">
    <slot />
  </main>
  <slot v-if="rightAside" name="rightAside" />
</template>

<script setup lang="ts">
defineOptions({
  name: 'Page',
})

const props = defineProps<{
  rightAside?: boolean
}>()
</script>
