<template>
  <RouterMenu :items="serverAsideMenuItems" />
</template>

<script setup lang="ts">
import RouterMenu from '@/components/common/RouterMenu.vue'
import { ref } from 'vue'

import type { RouterMenuItem } from '@/types'

const serverAsideMenuItems = ref<RouterMenuItem[]>([
  {
    label: 'Browser Channels',
    icon: 'ti ti-list-search',
    to: { name: 'server_channels' },
  },
])
</script>
