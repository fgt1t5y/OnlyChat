<template>
  <main class="flex flex-col grow gap-2 p-2">
    <slot />
  </main>
</template>

<script setup lang="ts">
defineOptions({
  name: 'Page',
})
</script>
