<template>
  <RouterMenu :items="homeAsideMenuItems" />
  <Divider />
  <div class="text-base text-muted-color">Chat sessions</div>
</template>

<script setup lang="ts">
import RouterMenu from '@/components/common/RouterMenu.vue'
import { ref } from 'vue'
import { Divider } from 'primevue'

import type { RouterMenuItem } from '@/types'

const homeAsideMenuItems = ref<RouterMenuItem[]>([
  { label: 'Friends', icon: 'ti ti-users', to: { name: 'friend_list' } },
  { label: 'Friend Requests', icon: 'ti ti-users-plus', to: { name: 'friend_request_list' } },
  { label: 'Add Friend', icon: 'ti ti-user-search', to: { name: 'friend_find' } },
])
</script>
