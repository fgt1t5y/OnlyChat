<template>
  <Page>
    <PageTitle title="Friend Requests" icon="ti ti-user-plus" />
    <div v-if="receivedFriendRequests">
      <div class="text-muted-color px-2">Received - {{ receivedFriendRequests.length }}</div>
      <ul>
        <li v-for="item in receivedFriendRequests" class="list-Item flex items-center gap-2">
          <UserAvatar :user="item.sender" />
          <div class="grow">
            <div class="font-bold">{{ item.sender.displayName }}</div>
            <div class="text-muted-color">@{{ item.sender.username }}</div>
          </div>
          <Button
            v-if="item.accepted"
            label="Accepted"
            icon="ti ti-check"
            severity="secondary"
            disabled
          />
          <div v-else class="flex gap-2">
            <Button label="Accept" icon="ti ti-check" @click="handleAcceptFriendRequest(item.id)" />
            <Button label="Ignore" icon="ti ti-x" severity="secondary" />
          </div>
        </li>
      </ul>
    </div>
    <div v-if="sentFriendRequests">
      <div class="text-muted-color px-2">Sent - {{ sentFriendRequests.length }}</div>
      <ul>
        <li v-for="item in sentFriendRequests" class="list-Item flex items-center gap-2">
          <UserAvatar :user="item.receiver" />
          <div class="grow">
            <div class="font-bold">{{ item.receiver.displayName }}</div>
            <div class="text-muted-color">@{{ item.receiver.username }}</div>
          </div>
          <Button label="Cancle" icon="ti ti-x" severity="secondary" />
        </li>
      </ul>
    </div>
  </Page>
</template>

<script setup lang="ts">
import Page from '@/components/common/Page.vue'
import PageTitle from '@/components/PageTitle.vue'
import UserAvatar from '@/components/UserAvatar.vue'
import { inject } from 'vue'
import { Button } from 'primevue'
import { useSocketIO } from '@/stores/socket'

import type { AppGlobalContext } from '@/types'

const { receivedFriendRequests, sentFriendRequests } = inject<AppGlobalContext>('OC')!

const ws = useSocketIO()

const handleAcceptFriendRequest = (friendRequestId: number) => {
  ws.emit('friend_request.accept', { friendRequestId })
}
</script>
