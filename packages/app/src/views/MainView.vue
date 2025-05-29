<template>
  <div v-if="auth.user" id="app">
    <div id="main-Title">
      <div class="font-bold">{{ mainTitleText }}</div>
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
            :title="$t('page.settings')"
            :aria-label="$t('page.settings')"
            @click="$router.push({ name: 'settings' })"
          />
        </section>
      </nav>
      <RouterView v-slot="{ Component, route }">
        <template v-if="Component">
          <KeepAlive>
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
import * as apis from '@/apis'
import ServerAvatar from '@/components/avatar/ServerAvatar.vue'
import UserAvatar from '@/components/avatar/UserAvatar.vue'
import { useAuth } from '@/stores/auth'
import { useSocketIO } from '@/stores/socket-io'
import { Avatar, Button } from 'primevue'
import { computed, provide, ref } from 'vue'

import type {
  DMSession,
  FriendRequest,
  Server,
  User,
  DMMessage,
  AppGlobalContext,
  DMSessionIdMessagesMap,
  AcceptFriendRequestDto,
  CancelFriendRequestDto,
} from '@/types'

const auth = useAuth()
const ws = useSocketIO()

await auth.getUserProfile()
await ws.connectAsync()

const [dataFriendRequests, dataFriends, dataDMSessions] = await Promise.all([
  apis.getFriendRequests(),
  apis.getFriends(),
  apis.getDmSessions(),
])

const isDev = import.meta.env.DEV
const receivedFriendRequests = ref<FriendRequest[]>(
  dataFriendRequests.filter((item) => item.receiverId === auth.user!.id),
)
const sentFriendRequests = ref<FriendRequest[]>(
  dataFriendRequests.filter((item) => item.senderId === auth.user!.id),
)
const friends = ref<User[]>(dataFriends.map((friend) => friend.userB) || [])
const joinedServers = ref<Server[]>(
  auth.user!.joinedServers.map((serverMember) => serverMember.server) || [],
)
const dmSessions = ref<DMSession[]>(dataDMSessions)
const dmMessages = ref<DMSessionIdMessagesMap>({})
const mainTitleText = ref<string>('')

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
  mainTitleText,
  user: auth.user!,

  unacceptFriendRequestCount,
})

const onDMMessageReceived = (dmMessage: DMMessage) => {
  console.log('You received this dm message', dmMessage)

  const dmSession = dmSessions.value.find((dmSession) => {
    return dmSession.userBId === dmMessage.authorId
  })

  if (dmSession) {
    if (!dmMessages.value[dmSession.id]) {
      dmMessages.value[dmSession.id] = []
    }

    dmMessages.value[dmSession.id].push(dmMessage)
    dmSession.lastMessageId = dmMessage.id
  }
}

const onFriendRequestSent = (friendRequest: FriendRequest) => {
  console.log('You sent this friend request', friendRequest)

  if (friendRequest) {
    sentFriendRequests.value.unshift(friendRequest)
  }
}

const onFriendRequestReceived = (friendRequest: FriendRequest) => {
  console.log('You received this friend request', friendRequest)

  if (friendRequest) {
    receivedFriendRequests.value.unshift(friendRequest)
  }
}

const onFriendRequestAccepted = ({ friendRequestId }: AcceptFriendRequestDto) => {
  console.log('You accepted this friend request', friendRequestId)

  const friendRequest = receivedFriendRequests.value.find((item) => item.id === friendRequestId)

  if (friendRequest) {
    friends.value.unshift(friendRequest.sender)
  }
}

const onFriendRequestAcceptedByReceiver = ({ friendRequestId }: AcceptFriendRequestDto) => {
  console.log('Receiver is accepted this friend request', friendRequestId)

  const friendRequest = sentFriendRequests.value.find((item) => item.id === friendRequestId)

  if (friendRequest) {
    friends.value.unshift(friendRequest.receiver)
  }
}

const onFriendRequestCanceled = ({ friendRequestId }: CancelFriendRequestDto) => {
  console.log('You canceled this friend request', friendRequestId)

  const friendRequestIndex = sentFriendRequests.value.findIndex(
    (item) => item.id === friendRequestId,
  )

  if (friendRequestIndex !== -1) {
    sentFriendRequests.value.splice(friendRequestIndex, 1)
  }
}

const onFriendRequestCanceledBySender = ({ friendRequestId }: CancelFriendRequestDto) => {
  console.log('Sender is canceled this friend request', friendRequestId)

  const friendRequestIndex = receivedFriendRequests.value.findIndex(
    (item) => item.id === friendRequestId,
  )

  if (friendRequestIndex !== -1) {
    receivedFriendRequests.value.splice(friendRequestIndex, 1)
  }
}

ws.socket.on('dm_message.received', onDMMessageReceived)
ws.socket.on('friend_request.send', onFriendRequestSent)
ws.socket.on('friend_request.received', onFriendRequestReceived)
ws.socket.on('friend_request.accept', onFriendRequestAccepted)
ws.socket.on('friend_request.accepted', onFriendRequestAcceptedByReceiver)
ws.socket.on('friend_request.cancel', onFriendRequestCanceled)
ws.socket.on('friend_request.canceled', onFriendRequestCanceledBySender)
</script>
