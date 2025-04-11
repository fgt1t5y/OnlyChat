<template>
  <Page>
    <PageTitle title="Friend Requests" icon="ti ti-user-plus" />
    <div v-if="appContext?.receivedFriendRequests">
      <div class="text-muted-color px-2">
        Received - {{ appContext.receivedFriendRequests.length }}
      </div>
      <ul>
        <FriendRequestItem
          v-for="item in appContext.receivedFriendRequests"
          :key="item.id"
          :item="item"
        />
      </ul>
    </div>
  </Page>
</template>

<script setup lang="ts">
import Page from '@/components/common/Page.vue'
import PageTitle from '@/components/PageTitle.vue'
import FriendRequestItem from '@/components/list-item/FriendRequestItem.vue'
import { inject } from 'vue'

import type { AppGlobalContext } from '@/types'

const appContext = inject<AppGlobalContext>('OC')
</script>
