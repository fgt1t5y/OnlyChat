<template>
  <div class="text-Divider" role="separator" :aria-label="text">
    <div class="text-Divider-Text">{{ text }}</div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  text: string
}>()
</script>
