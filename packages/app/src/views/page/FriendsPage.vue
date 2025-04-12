<template>
  <Page>
    <PageTitle title="All Friends" icon="ti ti-users" />
    <div v-if="friends.length">
      <ul>
        <li v-for="item in friends" class="list-Item flex items-center gap-2">
          <UserAvatar :user="item.userB" />
          <div class="grow">
            <div class="font-bold">{{ item.userB.displayName }}</div>
            <div class="text-muted-color">@{{ item.userB.username }}</div>
          </div>
        </li>
      </ul>
    </div>
    <NoFriendPlaceholder v-else />
  </Page>
</template>

<script setup lang="ts">
import Page from '@/components/common/Page.vue'
import PageTitle from '@/components/PageTitle.vue'
import UserAvatar from '@/components/UserAvatar.vue'
import NoFriendPlaceholder from '@/components/placeholder/NoFriendPlaceholder.vue'
import { inject } from 'vue'

import type { AppGlobalContext } from '@/types'

const { friends } = inject<AppGlobalContext>('OC')!
</script>
