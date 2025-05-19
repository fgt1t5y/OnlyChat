<template>
  <div v-if="auth.user" id="app">
    <div id="main-Title">
      <div class="text-primary font-bold">OnlyChat</div>
    </div>
    <div id="main-View" class="flex grow">
      <nav id="main-Nav">
        <section class="flex grow">
          <menu class="flex flex-col gap-3 p-3 items-center">
            <RouterLink class="menu-Link" :to="{ name: 'home' }">
              <Avatar icon="ti ti-home" size="large" />
            </RouterLink>
            <RouterLink
              v-for="server in joinedServers"
              class="menu-Link"
              :to="{ name: 'server', params: { serverId: server.id } }"
            >
              <ServerAvatar :server="server" />
            </RouterLink>
            <button class="menu-Link">
              <Avatar icon="ti ti-plus" size="large" />
            </button>
          </menu>
          <aside class="grow rounded-tl-xl border-l border-t border-content overflow-auto">
            <RouterView name="aside" />
          </aside>
        </section>
        <section id="main-Nav-User">
          <UserAvatar :user="auth.user" is-online />
          <div class="flex flex-col justify-center grow">
            <div>{{ auth.user.displayName }}</div>
            <div class="text-muted-color">@{{ auth.user.username }}</div>
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
      <RouterView v-slot="{ Component, route }">
        <template v-if="Component">
          <KeepAlive :include="['DMChatPage']">
            <Suspense suspensible>
              <component :is="Component" :key="route.fullPath"></component>
            </Suspense>
          </KeepAlive>
        </template>
      </RouterView>
    </div>
  </div>
  <div v-else class="text-center">Failed to load user profile, plase try refresh page.</div>
</template>

<script setup lang="ts">
import apis from '@/apis'
import ServerAvatar from '@/components/avatar/ServerAvatar.vue'
import UserAvatar from '@/components/avatar/UserAvatar.vue'
import { useAuth } from '@/stores/auth'
import { useSocketIO } from '@/stores/socket'
import { Avatar, Button } from 'primevue'
import { computed, provide, ref } from 'vue'

import type {
  AcceptFriendRequestDto,
  AppGlobalContext,
  DMSession,
  FriendRequest,
  Server,
  User,
  DmSessionIdMessagesMap,
  DMMessage,
} from '@/types'

const auth = useAuth()
const ws = useSocketIO()

await auth.getUserProfile()
await ws.connectAsync()

const isDev = import.meta.env.DEV
const receivedFriendRequests = ref<FriendRequest[]>(await apis.getReceivedFriendRequest())
const sentFriendRequests = ref<FriendRequest[]>(await apis.getSentFriendRequest())
const friends = ref<User[]>(await apis.getFriends())
const joinedServers = ref<Server[]>(
  auth.user?.joinedServers.map((serverMember) => serverMember.server) || [],
)
const dmSessions = ref<DMSession[]>(await apis.getDmSessions())
const dmMessages = ref<DmSessionIdMessagesMap>({})

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
  friends,
  joinedServers,
  dmSessions,
  dmMessages,

  unacceptFriendRequestCount,
})

const onDMMessageReceived = (dmMessage: DMMessage) => {
  console.log('You received this dm message', dmMessage)

  const dmSessionId = dmSessions.value.findIndex((dmSession) => {
    console.log(dmSession.userBId, dmMessage.authorId)

    return dmSession.userBId === dmMessage.authorId
  })

  if (dmSessionId !== -1) {
    dmMessages.value[dmSessions.value[dmSessionId].id].push(dmMessage)
  }
}

const onFriendRequestSuccessfullySent = (friendRequest: FriendRequest) => {
  console.log('You sent this friend request', friendRequest)

  if (friendRequest) {
    sentFriendRequests.value.unshift(friendRequest)
  }
}

const onFriendRequestReceivedByReceiver = (friendRequest: FriendRequest) => {
  console.log('You received this friend request', friendRequest)

  if (friendRequest) {
    receivedFriendRequests.value.unshift(friendRequest)
  }
}

const onFriendRequestSuccessfullyAccepted = ({ friendRequestId }: AcceptFriendRequestDto) => {
  console.log('You accepted this friend request', friendRequestId)

  const friendRequestIndex = receivedFriendRequests.value.findIndex(
    (item) => item.id === friendRequestId,
  )

  if (friendRequestIndex !== -1) {
    receivedFriendRequests.value[friendRequestIndex].accepted = true
  }

  friends.value.unshift(receivedFriendRequests.value[friendRequestIndex].sender)
}

const onFriendRequestAcceptedByReceiver = ({ friendRequestId }: AcceptFriendRequestDto) => {
  console.log('Receiver is accepted this friend request', friendRequestId)

  const friendRequestIndex = sentFriendRequests.value.findIndex(
    (item) => item.id === friendRequestId,
  )

  if (friendRequestIndex !== -1) {
    sentFriendRequests.value[friendRequestIndex].accepted = true
  }

  friends.value.unshift(sentFriendRequests.value[friendRequestIndex].receiver)
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

ws.socket.on('dm_message.received', onDMMessageReceived)
ws.socket.on('friend_request.send.success', onFriendRequestSuccessfullySent)
ws.socket.on('friend_request.received', onFriendRequestReceivedByReceiver)
ws.socket.on('friend_request.accept.success', onFriendRequestSuccessfullyAccepted)
ws.socket.on('friend_request.accepted', onFriendRequestAcceptedByReceiver)
ws.socket.on('friend_request.cancel.success', onFriendRequestSuccessfullyCanceled)
ws.socket.on('friend_request.canceled', onFriendRequestCanceledBySender)
</script>
