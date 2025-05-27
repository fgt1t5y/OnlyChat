<template>
  <Page>
    <PageTitle icon="ti ti-user-search" :title="$t('add_friend')" />
    <form @submit.prevent.stop="handleSearch" class="p-2">
      <InputGroup>
        <InputText
          v-model="searchKeyword"
          autofocus
          fluid
          required
          :placeholder="$t('search_friends_placeholder')"
        />
        <Button type="submit" icon="ti ti-search" :loading="finding" :label="$t('search')" />
      </InputGroup>
    </form>
    <div v-if="foundItems" class="p-2">
      <div class="text-muted-color px-2">Hitted {{ foundItems.length }} user(s)</div>
      <ul v-if="foundItems.length">
        <li v-for="item in foundItems" class="list-Item flex items-center gap-2">
          <UserAvatar :user="item" />
          <div class="grow">
            <div class="font-bold">{{ item.displayName }}</div>
            <div class="text-muted-color">@{{ item.username }}</div>
          </div>
          <div v-if="isFriend(item)"></div>
          <Button
            v-else-if="wasRequested(item)"
            severity="secondary"
            disabled
            :label="$t('sent')"
          />
          <Button
            v-else
            severity="secondary"
            :label="$t('send_friend_request')"
            @click="handleSendFriendRequest(item.id)"
          />
        </li>
      </ul>
    </div>
    <SearchPlaceholder v-else />
  </Page>
</template>

<script setup lang="ts">
import * as apis from '@/apis'
import Page from '@/components/common/Page.vue'
import PageTitle from '@/components/common/PageTitle.vue'
import UserAvatar from '@/components/avatar/UserAvatar.vue'
import SearchPlaceholder from '@/components/placeholder/SearchPlaceholder.vue'
import { useRequest } from 'alova/client'
import { useSocketIO } from '@/stores/socket'
import { Button, InputGroup, InputText } from 'primevue'
import { inject, onActivated, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import type { AppGlobalContext, User } from '@/types'

const { sentFriendRequests, friends, mainTitleText } = inject<AppGlobalContext>('OC')!

const ws = useSocketIO()
const { t } = useI18n()

const searchKeyword = ref<string>('')

const {
  data: foundItems,
  loading: finding,
  send: find,
} = useRequest(apis.findUser, { immediate: false })

const handleSearch = () => {
  if (!searchKeyword) {
    return
  }

  find(searchKeyword.value.trim())
}

const isFriend = (receiver: User) => {
  return friends.value.some((friend) => friend.id === receiver.id)
}

const wasRequested = (receiver: User) => {
  return sentFriendRequests.value.some((friendRequest) => friendRequest.receiverId === receiver.id)
}

const handleSendFriendRequest = (receiverId: number) => {
  ws.emit('friend_request.send', { receiverId })
}

onActivated(() => {
  document.title = `OnlyChat | ${t('add_friend')}`
  mainTitleText.value = t('page.home')
})
</script>
