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
          :loading="loading"
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
import { useSocketIO } from '@/stores/socket-io'
import { Button, InputGroup, InputText, useToast } from 'primevue'
import { inject, onActivated, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import type { AppGlobalContext } from '@/types'

const { sentFriendRequests, friends, mainTitleText, user } = inject<AppGlobalContext>('OC')!

const ws = useSocketIO()
const toast = useToast()
const { t } = useI18n()

const receiverUsername = ref<string>('')

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

    toast.add({
      severity: 'success',
      detail: t('sent'),
      life: 3000,
    })

    receiverUsername.value = ''
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
    (friendRequest) => friendRequest.receiver.username === receiverUsername,
  )
}

const handleSendFriendRequest = (receiverId: number) => {
  ws.emit('friend_request.send', { receiverId })
}

onActivated(() => {
  document.title = `OnlyChat | ${t('add_friend')}`
  mainTitleText.value = t('page.home')
})
</script>
