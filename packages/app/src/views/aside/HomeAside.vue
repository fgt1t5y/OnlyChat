<template>
  <RouterMenu :items="homeAsideMenuItems" />
  <Divider />
  <div class="text-base text-muted-color">Chat sessions</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Divider } from 'primevue'
import RouterMenu from '@/components/common/RouterMenu.vue'

import type { RouterMenuItem } from '@/types'

const homeAsideMenuItems = ref<RouterMenuItem[]>([
  { label: 'All Friends', icon: 'ti ti-users', to: { name: 'friend_list' } },
  { label: 'Add Friend', icon: 'ti ti-user-search', to: { name: 'friend_find' } },
])
</script>
