<template>
  <RouterMenu :items="homeAsideMenuItems" />
  <Divider />
  <div class="text-base text-muted-color px-2">DM Sessions</div>
  <ul>
    <li v-for="item in dmSessions" class="router-Menu">
      <RouterLink :to="{ name: 'dm', params: { dmSessionId: item.id } }" class="router-Menu-Item">
        <UserAvatar :user="item.userB" size="s" />
        <div>{{ item.userB.displayName }}</div>
      </RouterLink>
    </li>
  </ul>
</template>

<script setup lang="ts">
import UserAvatar from '@/components/avatar/UserAvatar.vue'
import RouterMenu from '@/components/common/RouterMenu.vue'
import { inject, ref } from 'vue'
import { Divider } from 'primevue'

import type { AppGlobalContext, RouterMenuItem } from '@/types'

const { dmSessions, unacceptFriendRequestCount } = inject<AppGlobalContext>('OC')!

const homeAsideMenuItems = ref<RouterMenuItem[]>([
  { label: 'Friends', icon: 'ti ti-users', to: { name: 'friends' } },
  {
    label: 'Friend Requests',
    icon: 'ti ti-users-plus',
    to: { name: 'friend_requests' },
    badge: unacceptFriendRequestCount,
  },
  { label: 'Add Friend', icon: 'ti ti-user-search', to: { name: 'friend_add' } },
])
</script>
