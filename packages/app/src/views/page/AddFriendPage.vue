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
          :placeholder="$t('search_friends_placeholder')"
        />
        <Button type="submit" icon="ti ti-search" :loading="loading" :label="$t('search')" />
      </InputGroup>
    </form>
  </Page>
</template>

<script setup lang="ts">
import * as apis from '@/apis'
import Page from '@/components/common/Page.vue'
import PageTitle from '@/components/common/PageTitle.vue'
import { useRequest } from 'alova/client'
import { useSocketIO } from '@/stores/socket'
import { Button, InputGroup, InputText, useToast } from 'primevue'
import { inject, onActivated, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import type { AppGlobalContext, User } from '@/types'

const { sentFriendRequests, friends, mainTitleText } = inject<AppGlobalContext>('OC')!

const ws = useSocketIO()
const toast = useToast()
const { t } = useI18n()

const receiverUsername = ref<string>('')

const {
  data: user,
  loading,
  send: checkUser,
} = useRequest(apis.getUser, { immediate: false })
  .onSuccess(() => {
    if (!user.value || isFriend(user.value.username) || wasRequested(user.value.username)) {
      return
    }

    handleSendFriendRequest(user.value.id)

    toast.add({
      severity: 'success',
      detail: t('sent'),
      life: 3000,
    })
  })
  .onError(() => {
    toast.add({
      severity: 'error',
      summary: t('searching_user_not_found'),
      life: 3000,
    })
  })

const handleSearch = () => {
  if (!receiverUsername) {
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
