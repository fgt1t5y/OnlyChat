<template>
  <RouterMenu :items="settingsAsideMenuItems" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import RouterMenu from '@/components/common/RouterMenu.vue'

import type { RouterMenuItem } from '@/types'

const settingsAsideMenuItems = ref<RouterMenuItem[]>([
  { label: 'Theme', icon: 'ti ti-shirt', to: { name: 'settings_theme' } },
])
</script>
