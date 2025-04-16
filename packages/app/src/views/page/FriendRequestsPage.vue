<template>
  <Page>
    <PageTitle title="Friend Requests" icon="ti ti-user-plus" />
    <div v-if="receivedFriendRequests" class="p-2">
      <div class="text-muted-color p-2">Received - {{ receivedFriendRequests.length }}</div>
      <ul>
        <li v-for="item in receivedFriendRequests" class="list-Item flex items-center gap-2">
          <UserAvatar :user="item.sender" />
          <div class="grow">
            <div class="font-bold">{{ item.sender.displayName }}</div>
            <div class="text-muted-color">@{{ item.sender.username }}</div>
          </div>
          <div v-if="item.accepted">
            <Button label="Accepted" icon="ti ti-check" severity="secondary" disabled />
          </div>
          <div v-else>
            <Button
              icon="ti ti-check"
              variant="text"
              rounded
              @click="handleAcceptFriendRequest(item.id)"
            />
            <Button
              icon="ti ti-x"
              severity="danger"
              variant="text"
              rounded
              @click="handleAcceptFriendRequest(item.id)"
            />
          </div>
        </li>
      </ul>
    </div>
    <div v-if="sentFriendRequests" class="p-2">
      <div class="text-muted-color px-2">Sent - {{ sentFriendRequests.length }}</div>
      <ul>
        <li v-for="item in sentFriendRequests" class="list-Item flex items-center gap-2">
          <UserAvatar :user="item.receiver" />
          <div class="grow">
            <div class="font-bold">{{ item.receiver.displayName }}</div>
            <div class="text-muted-color">@{{ item.receiver.username }}</div>
          </div>
          <Button
            v-if="item.accepted"
            label="Accepted"
            icon="ti ti-check"
            severity="secondary"
            disabled
          />
          <Button
            v-else
            icon="ti ti-x"
            severity="danger"
            variant="text"
            rounded
            @click="handleCancelFriendRequest(item.id)"
          />
        </li>
      </ul>
    </div>
  </Page>
</template>

<script setup lang="ts">
import Page from '@/components/common/Page.vue'
import PageTitle from '@/components/common/PageTitle.vue'
import UserAvatar from '@/components/avatar/UserAvatar.vue'
import { inject } from 'vue'
import { Button } from 'primevue'
import { useSocketIO } from '@/stores/socket'

import type { AppGlobalContext } from '@/types'

const { receivedFriendRequests, sentFriendRequests } = inject<AppGlobalContext>('OC')!

const ws = useSocketIO()

const handleAcceptFriendRequest = (friendRequestId: number) => {
  ws.emit('friend_request.accept', { friendRequestId })
}

const handleCancelFriendRequest = (friendRequestId: number) => {
  ws.emit('friend_request.cancel', { friendRequestId })
}
</script>
