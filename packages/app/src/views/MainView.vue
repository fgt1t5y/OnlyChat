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
          <div class="flex flex-col justify-center grow ml-2 w-[45%]">
            <div class="overflow-ellipsis overflow-hidden whitespace-nowrap">
              {{ auth.user.displayName }}
            </div>
            <div class="text-muted-color overflow-ellipsis overflow-hidden whitespace-nowrap">
              @{{ auth.user.username }}
            </div>
          </div>
          <Button
            severity="secondary"
            rounded
            :title="$t('set_my_state')"
            :aria-label="$t('set_my_state')"
            @click="userStateMenu?.show"
          >
            <span class="point-Online"></span>
            <span>{{ $t('online') }}</span>
          </Button>
          <Button
            icon="ti ti-settings"
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
  <ContextMenu ref="userStateMenu" :model="userStateMenuItems">
    <template #item="{ item, props }">
      <a class="flex items-center justify-between" v-bind="props.action">
        <div class="flex gap-2 items-center">
          <i v-if="item.icon" style="font-size: 1.25rem" :class="item.icon"></i>
          <span>{{ item.label }}</span>
        </div>
        <i v-if="item.checked" class="ti ti-check"></i>
      </a>
    </template>
  </ContextMenu>
</template>

<script setup lang="ts">
import * as apis from '@/apis'
import ServerAvatar from '@/components/avatar/ServerAvatar.vue'
import UserAvatar from '@/components/avatar/UserAvatar.vue'
import { useAuth } from '@/stores/auth'
import { useSocketIO } from '@/stores/socket-io'
import { Avatar, Button, ContextMenu } from 'primevue'
import { computed, provide, ref, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useEventBus } from '@vueuse/core'

import type {
  DMSession,
  FriendRequest,
  Server,
  User,
  DMMessage,
  AppGlobalContext,
  AppGlobalEventBusMap,
  DMSessionIdMessagesMap,
  AcceptFriendRequestDto,
  CancelFriendRequestDto,
} from '@/types'
import type { MenuItem } from 'primevue/menuitem'

const auth = useAuth()
const ws = useSocketIO()
const { t } = useI18n()

await auth.getUserProfile()
await ws.connectAsync()

const [dataFriendRequests, dataFriends, dataDMSessions] = await Promise.all([
  apis.getFriendRequests(),
  apis.getFriends(),
  apis.getDMSessions(),
])

const userStateMenu = useTemplateRef('userStateMenu')

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

const events: AppGlobalEventBusMap = {
  onFriendRequestSent: useEventBus<FriendRequest>('onFriendRequestSent'),
  onFriendRequestAccepted: useEventBus<AcceptFriendRequestDto>('onFriendRequestAccepted'),
  onFriendRequestDenied: useEventBus<AcceptFriendRequestDto>('onFriendRequestDenied'),
  onFriendRequestCanceled: useEventBus<AcceptFriendRequestDto>('onFriendRequestCanceled'),
}

const devLog = (...data: any[]) => {
  isDev && console.log(...data)
}

const onDMMessageReceived = (dmMessage: DMMessage) => {
  devLog('You received this dm message', dmMessage)

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
  devLog('You sent this friend request', friendRequest)

  if (friendRequest) {
    sentFriendRequests.value.unshift(friendRequest)
  }
}

const onFriendRequestReceived = (friendRequest: FriendRequest) => {
  devLog('You received this friend request', friendRequest)

  if (friendRequest) {
    receivedFriendRequests.value.unshift(friendRequest)
  }
}

const onFriendRequestAccepted = ({ friendRequestId }: AcceptFriendRequestDto) => {
  devLog('You accepted this friend request', friendRequestId)

  const friendRequest = receivedFriendRequests.value.find((item) => item.id === friendRequestId)

  if (friendRequest) {
    friends.value.unshift(friendRequest.sender)

    friendRequest.accepted = true
    friendRequest.resolved = true
  }
}

const onFriendRequestAcceptedByReceiver = ({ friendRequestId }: AcceptFriendRequestDto) => {
  devLog('Receiver is accepted this friend request', friendRequestId)

  const friendRequest = sentFriendRequests.value.find((item) => item.id === friendRequestId)

  if (friendRequest) {
    friends.value.unshift(friendRequest.receiver)

    friendRequest.accepted = true
    friendRequest.resolved = true
  }
}

const onFriendRequestDenied = ({ friendRequestId }: AcceptFriendRequestDto) => {
  devLog('You denied this friend request', friendRequestId)

  const friendRequest = receivedFriendRequests.value.find((item) => item.id === friendRequestId)

  if (friendRequest) {
    friendRequest.denied = true
    friendRequest.resolved = true
  }
}

const onFriendRequestDeniedByReceiver = ({ friendRequestId }: AcceptFriendRequestDto) => {
  devLog('Receiver is denied this friend request', friendRequestId)

  const friendRequest = sentFriendRequests.value.find((item) => item.id === friendRequestId)

  if (friendRequest) {
    friendRequest.denied = true
    friendRequest.resolved = true
  }
}

const onFriendRequestCanceled = ({ friendRequestId }: CancelFriendRequestDto) => {
  devLog('You canceled this friend request', friendRequestId)

  const friendRequest = sentFriendRequests.value.find((item) => item.id === friendRequestId)

  if (friendRequest) {
    friendRequest.canceled = true
    friendRequest.resolved = true
  }
}

const onFriendRequestCanceledBySender = ({ friendRequestId }: CancelFriendRequestDto) => {
  devLog('Sender is canceled this friend request', friendRequestId)

  const friendRequest = receivedFriendRequests.value.find((item) => item.id === friendRequestId)

  if (friendRequest) {
    friendRequest.canceled = true
    friendRequest.resolved = true
  }
}

events.onFriendRequestSent.on(onFriendRequestSent)
events.onFriendRequestAccepted.on(onFriendRequestAccepted)
events.onFriendRequestDenied.on(onFriendRequestDenied)
events.onFriendRequestCanceled.on(onFriendRequestCanceled)

ws.socket.on('dm_message.received', onDMMessageReceived)

ws.socket.on('friend_request.received', onFriendRequestReceived)
ws.socket.on('friend_request.accepted', onFriendRequestAcceptedByReceiver)
ws.socket.on('friend_request.denied', onFriendRequestDeniedByReceiver)
ws.socket.on('friend_request.canceled', onFriendRequestCanceledBySender)

const unacceptFriendRequestCount = computed(() => {
  let count = 0

  receivedFriendRequests.value.forEach((item) => {
    if (!item.accepted && !item.resolved) {
      count++
    }
  })

  return count
})

const userStateMenuItems = computed<MenuItem[]>(() => {
  return [
    {
      label: t('online'),
      icon: 'point-Online',
      checked: true,
    },
    { label: t('busy'), icon: 'point-Busy', checked: false },
    { label: t('invisible'), icon: 'point-Invisible', checked: false },
    { separator: true },
    { label: t('custom_state') },
  ]
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
  events,

  unacceptFriendRequestCount,

  devLog,
})
</script>
