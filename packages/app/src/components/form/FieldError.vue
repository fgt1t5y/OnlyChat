<template>
  <div v-if="props.state.meta.errors.length">
    <em v-for="error of props.state.meta.errors" class="text-danger">{{ error }}</em>
  </div>
  <div v-else>&nbsp;</div>
</template>

<script setup lang="ts">
import type { AnyFieldApi } from '@tanstack/vue-form'

defineOptions({
  name: 'FieldError',
})

const props = defineProps<{
  state: AnyFieldApi['state']
}>()
</script>
