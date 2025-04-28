<template>
  <form @submit.prevent.stop="emits('submit')" class="chat-Input">
    <input v-model="content" ref="input" type="text" />
    <Button
      label="Send"
      type="submit"
      icon="ti ti-send"
      severity="primary"
      size="small"
      variant="text"
      :disabled="content.length === 0"
    />
  </form>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { Button } from 'primevue'

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
