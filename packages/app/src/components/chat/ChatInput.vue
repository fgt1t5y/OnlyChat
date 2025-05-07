<template>
  <div class="chat-Input">
    <div v-if="false" class="chat-Input-Attachment-List">1</div>
    <form @submit.prevent.stop="emits('submit')" class="chat-Input-Main">
      <textarea
        v-model="content"
        class="chat-Input-Textarea"
        ref="textarea"
        rows="1"
        :placeholder="placeholder"
        @input="onTextareaInput"
        @keydown="onTextareaKeydown"
      ></textarea>
      <div class="flex items-start h-full">
        <Button
          type="submit"
          icon="ti ti-send"
          severity="secondary"
          size="small"
          variant="text"
          :disabled="content.length === 0"
        />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef, watch } from 'vue'
import { Button } from 'primevue'
import { useResizeObserver } from '@vueuse/core'

defineOptions({
  name: 'ChatInput',
})

const props = defineProps<{
  placeholder?: string
}>()

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

const onTextareaInput = () => {
  resizeTextarea()
}

const onTextareaKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    emits('submit')
  }
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
