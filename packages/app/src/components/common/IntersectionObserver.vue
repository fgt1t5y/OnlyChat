<template>
  <div ref="observeTarget" aria-hidden="true"></div>
</template>

<script setup lang="ts">
import { watchEffect, useTemplateRef } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

defineOptions({
  name: 'IntersectionObserver',
})

interface IntersectionObserverProps {
  disabled?: boolean
  rootMargin?: string
}

const props = withDefaults(defineProps<IntersectionObserverProps>(), {
  disabled: true,
  rootMargin: undefined,
})

const emits = defineEmits<{
  (e: 'reach'): void
}>()

const observeTarget = useTemplateRef('observeTarget')

const { pause, resume } = useIntersectionObserver(
  observeTarget,
  ([{ isIntersecting }]) => {
    if (props.disabled) {
      return
    }

    isIntersecting && emits('reach')
  },
  {
    rootMargin: props.rootMargin,
  },
)

watchEffect(() => {
  if (props.disabled) {
    pause()
  } else {
    resume()
  }
})
</script>
