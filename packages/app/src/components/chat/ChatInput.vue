<template>
  <form @submit.prevent.stop="emits('submit')" class="chat-Input">
    <textarea v-model="content" ref="textarea" @input="resizeTextarea" rows="1"></textarea>
    <Button
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
import { onMounted, onUnmounted, useTemplateRef, watch } from 'vue'
import { Button } from 'primevue'
import { useResizeObserver } from '@vueuse/core'

defineOptions({
  name: 'ChatInput',
})

const emits = defineEmits<{
  (e: 'submit'): void
}>()

const content = defineModel<string>({ default: '' })

const textarea = useTemplateRef('textarea')

const { stop } = useResizeObserver(textarea, () => {
  resizeTextarea()
})

const resizeTextarea = () => {
  if (!textarea.value) {
    return
  }

  if (content.value === '' || textarea.value.value === '') {
    textarea.value.style.setProperty('height', 'auto')
    return
  }

  textarea.value.style.setProperty('height', 'auto')
  textarea.value.style.setProperty('height', `${textarea.value.scrollHeight}px`)
}

watch(
  () => content.value,
  () => {
    resizeTextarea()
  },
)

onMounted(() => {
  resizeTextarea()
})

onUnmounted(() => {
  stop()
})

defineExpose({ textarea })
</script>
