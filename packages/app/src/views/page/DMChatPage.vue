<template>
  <Page v-if="dmSession" id="dm-Chat-Page" right-aside>
    <PageTitle :title="dmSession.userB.displayName">
      <template #icon>
        <UserAvatar :user="dmSession.userB" mini />
      </template>
    </PageTitle>
    <div ref="dmChatContainerRef" class="grow overflow-auto">
      <ul>
        <li v-for="item in dmMessages[dmSessionId]" :id="`chat-Item-${item.id}`" class="chat-Item">
          <UserAvatar :user="item.author" mini />
          <div class="flex flex-col">
            <div class="font-bold">{{ item.author.displayName }}</div>
            <div v-html="markedInstance.parse(item.content)"></div>
          </div>
        </li>
      </ul>
    </div>
    <form @submit.prevent.stop="handleSendDMMessage" class="flex gap-2 pb-6">
      <InputText v-model="dmMessageContent" fluid required />
      <Button label="Send" type="submit" />
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
import PageTitle from '@/components/PageTitle.vue'
import UserAvatar from '@/components/UserAvatar.vue'
import { Button, InputText } from 'primevue'
import { inject, onMounted, onUnmounted, ref, useTemplateRef } from 'vue'
import { useRoute } from 'vue-router'
import { markedInstance } from '@/utils'
import { useSocketIO } from '@/stores/socket'

import type { AppGlobalContext, DMMessage, DMSession } from '@/types'

const { dmSessions, dmMessages } = inject<AppGlobalContext>('OC')!

const route = useRoute()
const ws = useSocketIO()

const dmSessionId = Number(route.params.dmSessionId)

const dmChatContainer = useTemplateRef('dmChatContainerRef')
const dmSession = ref<DMSession | undefined>(
  dmSessions.value.find((dmSession) => dmSession.id === dmSessionId),
)
const dmMessageContent = ref<string>('')

if (!dmMessages.value[dmSessionId]) {
  dmMessages.value[dmSessionId] = await apis.getDmMessages(dmSessionId, dmSession.value!.lastMessageId - 50, 50)
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
