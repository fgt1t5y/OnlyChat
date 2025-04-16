<template>
  <form @submit.prevent.stop="emits('submit')" class="chat-Input">
    <input v-model="content" ref="input" type="text" />
  </form>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue'

defineOptions({
  name: 'ChatInput',
})

const emits = defineEmits<{
  (e: 'submit'): void
}>()

const content = defineModel<string>({ default: '' })

const input = useTemplateRef('input')

defineExpose({ input })
</script>
