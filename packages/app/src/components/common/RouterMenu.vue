<template>
  <div :class="routerMenuClass">
    <RouterLink v-for="item in items" :to="item.to" class="router-Menu-Item">
      <i v-if="item.icon" :class="item.icon"></i>
      <div class="router-Menu-Item-Text">{{ item.label }}</div>
      <div v-if="item.badge === true" class="router-Menu-Item-DotBadge"></div>
      <div
        v-if="typeof item.badge === 'number' && item.badge > 0"
        class="router-Menu-Item-NumBadge"
      >
        {{ item.badge }}
      </div>
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
    'router-Menu': true,
    'flex-row': props.vertical,
  }
})
</script>
