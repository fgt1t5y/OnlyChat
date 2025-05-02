<template>
  <span v-text="text"></span>
</template>

<script setup lang="ts">
const props = defineProps<{
  text: string
}>()
</script>
