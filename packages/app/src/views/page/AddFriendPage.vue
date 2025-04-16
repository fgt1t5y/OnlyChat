<template>
  <Page>
    <PageTitle title="Add Friend" icon="ti ti-user-search" />
    <form @submit.prevent.stop="handleSearch" class="p-2">
      <InputGroup>
        <InputText
          v-model="searchKeyword"
          placeholder="Search username here..."
          autofocus
          fluid
          required
        />
        <Button label="Search" type="submit" icon="ti ti-search" :loading="finding" />
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
          <Button v-else-if="wasRequested(item)" label="Requested" severity="secondary" disabled />
          <Button
            v-else
            label="Send request"
            severity="secondary"
            @click="handleSendFriendRequest(item.id)"
          />
        </li>
      </ul>
    </div>
    <SearchPlaceholder v-else />
  </Page>
</template>

<script setup lang="ts">
import apis from '@/apis'
import Page from '@/components/common/Page.vue'
import PageTitle from '@/components/common/PageTitle.vue'
import UserAvatar from '@/components/avatar/UserAvatar.vue'
import SearchPlaceholder from '@/components/placeholder/SearchPlaceholder.vue'
import { useRequest } from 'alova/client'
import { Button, InputGroup, InputText } from 'primevue'
import { inject, ref } from 'vue'

import type { AppGlobalContext, User } from '@/types'
import { useSocketIO } from '@/stores/socket'

const { sentFriendRequests, friends } = inject<AppGlobalContext>('OC')!

const ws = useSocketIO()

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
</script>
