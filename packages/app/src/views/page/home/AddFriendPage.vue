<template>
  <Page>
    <PageTitle icon="ti ti-user-search" :title="$t('add_friend')" />
    <form @submit.prevent.stop="handleSearch" class="p-2">
      <InputGroup>
        <InputText
          v-model="receiverUsername"
          autofocus
          fluid
          required
          :placeholder="$t('add_friends_placeholder')"
        />
        <Button
          type="submit"
          icon="ti ti-send"
          :loading="loading || sending"
          :label="$t('send_friend_request')"
        />
      </InputGroup>
    </form>
  </Page>
</template>

<script setup lang="ts">
import * as apis from '@/apis'
import Page from '@/components/common/Page.vue'
import PageTitle from '@/components/common/PageTitle.vue'
import { useRequest } from 'alova/client'
import { Button, InputGroup, InputText, useToast } from 'primevue'
import { inject, onActivated, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import type { AppGlobalContext } from '@/types'

const { sentFriendRequests, friends, mainTitleText, user, events } = inject<AppGlobalContext>('OC')!

const toast = useToast()
const { t } = useI18n()

const receiverUsername = ref<string>('')

const {
  data: friendRequest,
  send: sendFriendRequest,
  loading: sending,
} = useRequest(apis.sendFriendRequest, {
  immediate: false,
}).onSuccess(() => {
  toast.add({
    severity: 'success',
    detail: t('sent'),
    life: 3000,
  })
  events.onFriendRequestSent.emit(friendRequest.value)

  receiverUsername.value = ''
})

const {
  data: receiver,
  loading,
  send: checkUser,
} = useRequest(apis.getUser, { immediate: false })
  .onSuccess(() => {
    if (
      !receiver.value ||
      isFriend(receiver.value.username) ||
      wasRequested(receiver.value.username)
    ) {
      return
    }

    handleSendFriendRequest(receiver.value.id)
  })
  .onError(() => {
    toast.add({
      severity: 'error',
      summary: t('searching_user_not_found'),
      life: 3000,
    })
  })

const handleSearch = () => {
  if (!receiverUsername.value || receiverUsername.value === user.username) {
    return
  }

  if (isFriend(receiverUsername.value)) {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('friend_already_exists'),
      life: 3000,
    })

    return
  }

  if (wasRequested(receiverUsername.value)) {
    toast.add({
      severity: 'success',
      detail: t('sent'),
      life: 3000,
    })

    return
  }

  checkUser(receiverUsername.value.trim())
}

const isFriend = (username: string) => {
  return friends.value.some((friend) => friend.username === username)
}

const wasRequested = (receiverUsername: string) => {
  return sentFriendRequests.value.some(
    (friendRequest) =>
      friendRequest.receiver.username === receiverUsername && !friendRequest.resolved,
  )
}

const handleSendFriendRequest = (receiverId: number) => {
  sendFriendRequest(receiverId)
}

onActivated(() => {
  document.title = `OnlyChat | ${t('add_friend')}`
  mainTitleText.value = t('page.home')
})
</script>
