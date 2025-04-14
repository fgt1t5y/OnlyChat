<template>
  <Page right-aside>
    <PageTitle title="All Friends" icon="ti ti-users" />
    <div class="flex gap-2 justify-end">
      <InputText class="grow" placeholder="Search friends" />
      <RouterLink :to="{ name: 'friend_add' }">
        <Button label="Add Friend" icon="ti ti-plus" severity="secondary" />
      </RouterLink>
    </div>
    <div v-if="friends.length">
      <ul>
        <li v-for="item in friends" class="list-Item flex items-center gap-2">
          <UserAvatar :user="item" />
          <div class="grow">
            <div class="font-bold">{{ item.displayName }}</div>
            <div class="text-muted-color">@{{ item.username }}</div>
          </div>
          <div class="flex gap-2">
            <RouterLink :to="{ name: 'dm', params: { dmSessionId: item.id } }">
              <Button icon="ti ti-messages" severity="secondary" rounded />
            </RouterLink>
            <Button icon="ti ti-dots" severity="secondary" rounded />
          </div>
        </li>
      </ul>
    </div>
    <NoFriendPlaceholder v-else />

    <template #rightAside>
      <aside class="page-Aside">
        <PageTitle title="Friend Status" icon="ti ti-stars" />
      </aside>
    </template>
  </Page>
</template>

<script setup lang="ts">
import Page from '@/components/common/Page.vue'
import PageTitle from '@/components/PageTitle.vue'
import UserAvatar from '@/components/UserAvatar.vue'
import NoFriendPlaceholder from '@/components/placeholder/NoFriendPlaceholder.vue'
import { inject } from 'vue'
import { Button, InputText } from 'primevue'

import type { AppGlobalContext } from '@/types'

const { friends } = inject<AppGlobalContext>('OC')!
</script>
