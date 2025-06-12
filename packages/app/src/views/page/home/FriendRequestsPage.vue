<template>
  <Page>
    <PageTitle icon="ti ti-user-plus" :title="$t('friend_requests')" />
    <div v-if="receivedFriendRequests" class="p-2">
      <div class="text-muted-color p-2">
        {{ $t('received_friend_requests', [receivedFriendRequests.length]) }}
      </div>
      <ul>
        <li v-for="item in receivedFriendRequests" class="list-Item flex items-center gap-2">
          <UserAvatar :user="item.sender" />
          <div class="grow">
            <div class="font-bold">{{ item.sender.displayName }}</div>
            <div class="text-muted-color">@{{ item.sender.username }}</div>
          </div>
          <div v-if="!item.resolved">
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
              @click="handleDenyFriendRequest(item.id)"
            />
          </div>
          <div v-else-if="item.accepted">
            <Button icon="ti ti-check" severity="secondary" disabled :label="$t('accepted')" />
          </div>
          <div v-else-if="item.denied">
            <Button icon="ti ti-x" severity="secondary" disabled :label="$t('denied')" />
          </div>
          <div v-else="item.canceled">
            <Button icon="ti ti-x" severity="secondary" disabled :label="$t('canceled')" />
          </div>
        </li>
      </ul>
    </div>
    <div v-if="sentFriendRequests" class="p-2">
      <div class="text-muted-color px-2">
        {{ $t('sent_friend_requests', [sentFriendRequests.length]) }}
      </div>
      <ul>
        <li v-for="item in sentFriendRequests" class="list-Item flex items-center gap-2">
          <UserAvatar :user="item.receiver" />
          <div class="grow">
            <div class="font-bold">{{ item.receiver.displayName }}</div>
            <div class="text-muted-color">@{{ item.receiver.username }}</div>
          </div>
          <div v-if="!item.resolved">
            <Button
              icon="ti ti-x"
              severity="danger"
              variant="text"
              rounded
              @click="handleCancelFriendRequest(item.id)"
            />
          </div>
          <div v-else-if="item.accepted">
            <Button icon="ti ti-check" severity="secondary" disabled :label="$t('accepted')" />
          </div>
          <div v-else-if="item.denied">
            <Button icon="ti ti-x" severity="secondary" disabled :label="$t('denied')" />
          </div>
          <div v-else="item.canceled">
            <Button icon="ti ti-x" severity="secondary" disabled :label="$t('canceled')" />
          </div>
        </li>
      </ul>
    </div>
  </Page>
</template>

<script setup lang="ts">
import * as apis from '@/apis'
import Page from '@/components/common/Page.vue'
import PageTitle from '@/components/common/PageTitle.vue'
import UserAvatar from '@/components/avatar/UserAvatar.vue'
import { inject, onActivated } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'alova/client'
import { Button } from 'primevue'

import type { AppGlobalContext } from '@/types'

const { receivedFriendRequests, sentFriendRequests, mainTitleText, events } =
  inject<AppGlobalContext>('OC')!

const { t } = useI18n()

const { send: acceptFriendRequest } = useRequest(apis.acceptFriendRequest, {
  immediate: false,
}).onSuccess((res) => {
  events.onFriendRequestAccepted.emit({ friendRequestId: res.args[0] })
})

const { send: denyFriendRequest } = useRequest(apis.denyFriendRequest, {
  immediate: false,
}).onSuccess((res) => {
  events.onFriendRequestDenied.emit({ friendRequestId: res.args[0] })
})

const { send: cancelFriendRequest } = useRequest(apis.cancelFriendRequest, {
  immediate: false,
}).onSuccess((res) => {
  events.onFriendRequestCanceled.emit({ friendRequestId: res.args[0] })
})

const handleAcceptFriendRequest = (friendRequestId: number) => {
  acceptFriendRequest(friendRequestId)
}

const handleDenyFriendRequest = (friendRequestId: number) => {
  denyFriendRequest(friendRequestId)
}

const handleCancelFriendRequest = (friendRequestId: number) => {
  cancelFriendRequest(friendRequestId)
}

onActivated(() => {
  document.title = `OnlyChat | ${t('friend_requests')}`
  mainTitleText.value = t('page.home')
})
</script>
