<template>
  <Page>
    <PageTitle title="Friends" icon="ti ti-users" />
    <div class="flex overflow-hidden grow">
      <div class="p-2 grow">
        <div class="flex gap-2 justify-end mb-2">
          <InputText class="grow" placeholder="Search friends" />
          <RouterLink :to="{ name: 'friend_add' }">
            <Button label="Add Friend" icon="ti ti-plus" />
          </RouterLink>
        </div>
        <ul v-if="friends.length">
          <li v-for="item in friends" class="list-Item flex items-center gap-2">
            <UserAvatar :user="item" />
            <div class="grow">
              <div class="font-bold">{{ item.displayName }}</div>
              <div class="text-muted-color">@{{ item.username }}</div>
            </div>
            <div class="flex gap-2">
              <Button
                icon="ti ti-messages"
                severity="secondary"
                rounded
                @click="handleOpenDMSession(item.id)"
              />
              <Button icon="ti ti-dots" severity="secondary" rounded />
            </div>
          </li>
        </ul>
        <NoFriendPlaceholder v-else />
      </div>
      <div class="page-Aside p-2">
        <div class="text-xl">Activity Now</div>
      </div>
    </div>
  </Page>
</template>

<script setup lang="ts">
import Page from '@/components/common/Page.vue'
import PageTitle from '@/components/common/PageTitle.vue'
import UserAvatar from '@/components/avatar/UserAvatar.vue'
import NoFriendPlaceholder from '@/components/placeholder/NoFriendPlaceholder.vue'
import { inject, onActivated } from 'vue'
import { Button, InputText } from 'primevue'
import { useRouter } from 'vue-router'

import type { AppGlobalContext } from '@/types'
import apis from '@/apis'

const { friends, dmSessions } = inject<AppGlobalContext>('OC')!

const router = useRouter()

const handleOpenDMSession = async (userBId: number) => {
  const dmSessionIndex = dmSessions.value.findIndex((session) => session.userBId === userBId)

  if (dmSessionIndex !== -1) {
    router.push({ name: 'dm', params: { dmSessionId: dmSessions.value[dmSessionIndex].id } })
  } else {
    const dmSession = await apis.openDMSession(userBId)

    if (dmSession) {
      dmSessions.value.unshift(dmSession)
    }

    router.push({ name: 'dm', params: { dmSessionId: dmSession.id } })
  }
}

onActivated(() => {
  document.title = `OnlyChat | Friends`
})
</script>
