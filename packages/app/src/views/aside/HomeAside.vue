<template>
  <div class="p-2">
    <RouterMenu :items="homeAsideMenuItems" />
    <Divider />
    <div class="aside-Group-Title">{{ $t('direct_messages') }}</div>
    <ul class="router-Menu">
      <li v-for="item in dmSessions" class="router-Menu-Item dm-Session-Item">
        <RouterLink
          :to="{ name: 'dm_chat', params: { dmSessionId: item.id } }"
          class="dm-Session-Item-Link"
        >
          <UserAvatar :user="item.userB" size="s" />
          <div>{{ item.userB.displayName }}</div>
        </RouterLink>
        <button @click.stop="handleCloseDMSession(item.id, item.userBId)">
          <i class="ti ti-x"></i>
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import * as apis from '@/apis'
import UserAvatar from '@/components/avatar/UserAvatar.vue'
import RouterMenu from '@/components/common/RouterMenu.vue'
import { inject, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Divider } from 'primevue'
import { useRouter } from 'vue-router'

import type { AppGlobalContext, RouterMenuItem } from '@/types'

const { dmSessions, unacceptFriendRequestCount } = inject<AppGlobalContext>('OC')!

const router = useRouter()
const { t } = useI18n()

const homeAsideMenuItems = ref<RouterMenuItem[]>([
  { label: t('friends'), icon: 'ti ti-users', to: { name: 'friends' } },
  {
    label: t('friend_requests'),
    icon: 'ti ti-users-plus',
    to: { name: 'friend_requests' },
    badge: unacceptFriendRequestCount,
  },
  { label: t('add_friend'), icon: 'ti ti-user-search', to: { name: 'friend_add' } },
])

const handleCloseDMSession = (dmSessionId: number, userBId: number) => {
  apis.closeDMSession(userBId).then(() => {
    const dmSessionIndex = dmSessions.value.findIndex((session) => session.id === dmSessionId)

    router.replace({ name: 'friends' })

    if (dmSessionIndex !== -1) {
      dmSessions.value.splice(dmSessionIndex, 1)
    }
  })
}
</script>
