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
          <UserAvatar :user="item.userB" />
          <div class="grow">
            <div class="font-bold">{{ item.userB.displayName }}</div>
            <div class="text-muted-color">@{{ item.userB.username }}</div>
          </div>
          <div class="flex gap-2">
            <Button
              icon="ti ti-messages"
              severity="contrast"
              variant="text"
              rounded
            />
            <Button
              icon="ti ti-dots"
              severity="contrast"
              variant="text"
              rounded
            />
          </div>
        </li>
      </ul>
    </div>
    <NoFriendPlaceholder v-else />

    <template #rightAside>
      <aside class="w-[360px] p-2 border-l border-content">
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
