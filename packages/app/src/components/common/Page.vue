<template>
  <main class="flex flex-col grow gap-2 p-3">
    <slot />
  </main>
</template>

<script setup lang="ts">
defineOptions({
  name: 'Page',
})
</script>
