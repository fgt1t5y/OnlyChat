<template>
  <Page v-if="dmSession" id="dm-Chat-Page" right-aside>
    <PageTitle :title="dmSession.userB.displayName">
      <template #title="{ title }">
        <div class="text-base">{{ title }}</div>
      </template>

      <template #icon>
        <UserAvatar :user="dmSession.userB" size="s" />
      </template>
    </PageTitle>
    <div ref="dmChatContainer" class="flex flex-col justify-end grow overflow-auto p-2">
      <ul class="min-h-0">
        <li class="flex flex-col gap-2 py-2 mb-2 border-b border-surface">
          <UserAvatar :user="dmSession.userB" size="l" :show-online="false" />
          <div class="text-3xl font-bold">{{ dmSession.userB.displayName }}</div>
          <div class="text-2xl">{{ dmSession.userB.username }}</div>
          <div>
            This is the beginning of your direct message history with
            <span class="font-bold">{{ dmSession.userB.displayName }}</span>
          </div>
        </li>
        <li v-for="item in dmMessages[dmSessionId]" :id="`chat-Item-${item.id}`" class="chat-Item">
          <UserAvatar :user="item.author" :show-online="false" />
          <div class="flex flex-col">
            <div class="flex gap-2">
              <div class="font-bold">{{ item.author.displayName }}</div>
              <div class="text-muted-color">
                {{ dayjs.utc(item.createdAt).tz('Asia/Shanghai').format('LT') }}
              </div>
            </div>
            <div v-html="markedInstance.parse(item.content)" class="text-base"></div>
          </div>
        </li>
      </ul>
    </div>
    <form @submit.prevent.stop="handleSendDMMessage" class="flex gap-2 px-2 pb-6">
      <InputText v-model="dmMessageContent" fluid required />
    </form>

    <template #rightAside>
      <aside class="page-Aside">
        <PageTitle title="Friend Status" icon="ti ti-stars" />
      </aside>
    </template>
  </Page>
</template>

<script setup lang="ts">
import apis from '@/apis'
import Page from '@/components/common/Page.vue'
import PageTitle from '@/components/page/PageTitle.vue'
import UserAvatar from '@/components/avatar/UserAvatar.vue'
import dayjs from 'dayjs'
import { InputText } from 'primevue'
import { inject, onMounted, onUnmounted, ref, useTemplateRef } from 'vue'
import { useRoute } from 'vue-router'
import { markedInstance } from '@/utils'
import { useSocketIO } from '@/stores/socket'

import type { AppGlobalContext, DMMessage, DMSession } from '@/types'

const { dmSessions, dmMessages } = inject<AppGlobalContext>('OC')!

const route = useRoute()
const ws = useSocketIO()

const dmSessionId = Number(route.params.dmSessionId)

const dmChatContainer = useTemplateRef('dmChatContainer')
const dmSession = ref<DMSession | undefined>(
  dmSessions.value.find((dmSession) => dmSession.id === dmSessionId),
)
const dmMessageContent = ref<string>('')

if (!dmMessages.value[dmSessionId]) {
  dmMessages.value[dmSessionId] = await apis.getDmMessages(
    dmSessionId,
    dmSession.value!.lastMessageId - 50,
    50,
  )
}

const scrollChatContainerToBottom = (dmMessage: DMMessage) => {
  setTimeout(() => {
    const chatItemElement = document.getElementById(`chat-Item-${dmMessage.id}`)

    if (chatItemElement) {
      chatItemElement.scrollIntoView()
    }
  }, 0)
}

const handleSendDMMessage = () => {
  ws.emit('dm_message.send', { dmSessionId: dmSessionId, content: dmMessageContent.value })

  dmMessageContent.value = ''
}

onMounted(() => {
  dmChatContainer.value?.scrollTo({
    top: dmChatContainer.value.scrollHeight,
  })

  ws.socket.on('dm_message.send.success', scrollChatContainerToBottom)
  ws.socket.on('dm_message.received', scrollChatContainerToBottom)
})

onUnmounted(() => {
  ws.socket.off('dm_message.send.success', scrollChatContainerToBottom)
  ws.socket.off('dm_message.received', scrollChatContainerToBottom)
})
</script>
