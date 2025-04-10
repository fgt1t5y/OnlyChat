<template>
  <div :class="routerMenuClass">
    <RouterLink v-for="item in items" :to="item.to" class="router-menu-item">
      <i :class="item.icon"></i>
      <div>{{ item.label }}</div>
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import type { RouterMenuItem } from '@/types'
import { computed } from 'vue'

defineOptions({
  name: 'RouterMenu',
})

const props = defineProps<{
  items: RouterMenuItem[]
  vertical?: boolean
}>()

const routerMenuClass = computed(() => {
  return {
    'router-menu': true,
    'flex-row': props.vertical,
  }
})
</script>
