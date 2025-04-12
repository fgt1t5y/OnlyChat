<template>
  <div v-if="auth.user" class="flex h-screen">
    <nav class="flex flex-col min-w-[350px] border-r border-content">
      <section class="flex grow">
        <menu class="flex flex-col gap-3 p-3 items-center border-r border-content">
          <RouterLink class="menu-Link" :to="{ name: 'home' }">
            <Avatar icon="ti ti-home" size="large" />
          </RouterLink>
        </menu>
        <aside class="grow p-2">
          <RouterView name="aside" />
        </aside>
      </section>
      <section class="flex gap-2 items-center border-t border-content p-3">
        <UserAvatar :user="auth.user!" />
        <div class="flex flex-col justify-center grow">
          <div>{{ auth.user.username }}</div>
          <div class="text-primary">Online</div>
        </div>
        <Button
          icon="ti ti-settings"
          size="large"
          severity="secondary"
          rounded
          title="Settings"
          aria-label="Settings"
          @click="$router.push({ name: 'settings' })"
        />
      </section>
    </nav>
    <RouterView />
  </div>
  <div v-else class="text-center">Failed to load user profile, plase try refresh page.</div>
  <DebugBar v-if="isDev" />
</template>

<script setup lang="ts">
import apis from '@/apis'
import UserAvatar from '@/components/UserAvatar.vue'
import DebugBar from '@/components/DebugBar.vue'
import { useAuth } from '@/stores/auth'
import { useSocketIO } from '@/stores/socket'
import { Avatar, Button } from 'primevue'
import { computed, provide, ref } from 'vue'

import type { AcceptFriendRequestDto, AppGlobalContext, FriendRequest } from '@/types'

const auth = useAuth()
const ws = useSocketIO()

await auth.getUserProfile()
await ws.connectAsync()

const isDev = import.meta.env.DEV
const receivedFriendRequests = ref<FriendRequest[]>(await apis.friendRequest.getReceived())
const sentFriendRequests = ref<FriendRequest[]>(await apis.friendRequest.getSent())
const unacceptFriendRequestCount = computed(() => {
  let count = 0

  receivedFriendRequests.value.forEach((item) => {
    if (!item.accepted) {
      count++
    }
  })

  return count
})

provide<AppGlobalContext>('OC', {
  isDev,
  receivedFriendRequests,
  sentFriendRequests,
  unacceptFriendRequestCount,
})

const onFriendRequestSuccessfullyAccepted = ({ friendRequestId }: AcceptFriendRequestDto) => {
  console.log('Accepted this friend request', friendRequestId)

  const friendRequestIndex = receivedFriendRequests.value.findIndex(
    (item) => item.id === friendRequestId,
  )

  if (friendRequestIndex !== -1) {
    receivedFriendRequests.value[friendRequestIndex].accepted = true
  }
}

const onFriendRequestAcceptedByReceiver = ({ friendRequestId }: AcceptFriendRequestDto) => {
  console.log('Receiver is accepted this friend request', friendRequestId)

  const friendRequestIndex = sentFriendRequests.value.findIndex(
    (item) => item.id === friendRequestId,
  )

  if (friendRequestIndex !== -1) {
    sentFriendRequests.value[friendRequestIndex].accepted = true
  }
}

const onFriendRequestSuccessfullyCanceled = ({ friendRequestId }: AcceptFriendRequestDto) => {
  console.log('Canceled this friend request', friendRequestId)

  const friendRequestIndex = sentFriendRequests.value.findIndex(
    (item) => item.id === friendRequestId,
  )

  if (friendRequestIndex !== -1) {
    sentFriendRequests.value.splice(friendRequestIndex, 1)
  }
}

const onFriendRequestCanceledBySender = ({ friendRequestId }: AcceptFriendRequestDto) => {
  console.log('Sender is canceled this friend request', friendRequestId)

  const friendRequestIndex = receivedFriendRequests.value.findIndex(
    (item) => item.id === friendRequestId,
  )

  if (friendRequestIndex !== -1) {
    receivedFriendRequests.value.splice(friendRequestIndex, 1)
  }
}

ws.socket.on('friend_request.accept', onFriendRequestSuccessfullyAccepted)
ws.socket.on('friend_request.accepted', onFriendRequestAcceptedByReceiver)
ws.socket.on('friend_request.cancel', onFriendRequestSuccessfullyCanceled)
ws.socket.on('friend_request.canceled', onFriendRequestCanceledBySender)
</script>
