<template>
  <button :class="toggleButtonClass" @click="modelValue = !modelValue">
    <i :class="icon"></i>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'ToggleButton',
})

const props = defineProps<{
  icon: string
}>()

const modelValue = defineModel<boolean>()

const toggleButtonClass = computed(() => {
  return {
    'toggle-Button-On': modelValue.value,
    'toggle-Button-Off': !modelValue.value,
  }
})
</script>
