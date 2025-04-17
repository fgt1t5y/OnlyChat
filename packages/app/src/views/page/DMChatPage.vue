<template>
  <Page v-if="dmSession" id="dm-Chat-Page">
    <PageTitle :title="dmSession.userB.displayName">
      <ToggleButton v-model="showUserProfilePanel" icon="ti ti-user-circle" />

      <template #title="{ title }">
        <div class="text-base">{{ title }}</div>
      </template>
      <template #icon>
        <UserAvatar :user="dmSession.userB" size="s" />
      </template>
    </PageTitle>
    <div class="flex overflow-hidden grow">
      <div class="flex flex-col justify-end grow">
        <List
          ref="dmChatContainer"
          :items="dmMessages[dmSessionId]"
          class="min-h-0 overflow-auto pb-2"
        >
          <template #head>
            <li v-if="reachedHead" class="flex flex-col gap-2 p-2 mb-2 border-b border-surface">
              <UserAvatar :user="dmSession.userB" size="l" :show-online="false" />
              <div class="text-3xl font-bold">{{ dmSession.userB.displayName }}</div>
              <div class="text-2xl">{{ dmSession.userB.username }}</div>
              <div>
                This is the beginning of your direct message history with
                <span class="font-bold">{{ dmSession.userB.displayName }}</span>
              </div>
            </li>
          </template>

          <template #default="{ item, newer }">
            <li :id="`message-Item-${item.id}`">
              <div v-if="item.authorId !== newer?.authorId" class="message-Item mt-4">
                <div class="w-12 shrink-0">
                  <UserAvatar :user="item.author" :show-online="false" />
                </div>
                <div class="flex flex-col">
                  <div class="flex gap-2">
                    <div class="font-bold">{{ item.author.displayName }}</div>
                    <div class="text-muted-color">
                      {{ dayjs.utc(item.createdAt).tz('Asia/Shanghai').format('LT') }}
                    </div>
                  </div>
                  <div v-html="markedInstance.parse(item.content)" class="text-base"></div>
                </div>
              </div>
              <div v-else class="message-Item">
                <div class="w-12"></div>
                <div v-html="markedInstance.parse(item.content)" class="text-base"></div>
              </div>
            </li>
          </template>
        </List>
        <ChatInput v-model="dmMessageContent" ref="dmChatInput" @submit="handleSendDMMessage" />
      </div>
      <div v-if="showUserProfilePanel" class="page-Aside">
        <UserAvatar :user="dmSession.userB" size="l" :show-online="false" />
        <div class="text-xl font-bold">{{ dmSession.userB.displayName }}</div>
        <div class="text-base">{{ dmSession.userB.username }}</div>
      </div>
    </div>
  </Page>
</template>

<script setup lang="ts">
import apis from '@/apis'
import Page from '@/components/common/Page.vue'
import List from '@/components/common/List.vue'
import PageTitle from '@/components/common/PageTitle.vue'
import UserAvatar from '@/components/avatar/UserAvatar.vue'
import ChatInput from '@/components/chat/ChatInput.vue'
import ToggleButton from '@/components/button/ToggleButton.vue'
import dayjs from 'dayjs'
import _ from 'underscore'
import { inject, onMounted, onUnmounted, ref, useTemplateRef } from 'vue'
import { useRoute } from 'vue-router'
import { markedInstance } from '@/utils'
import { useSocketIO } from '@/stores/socket'
import { MESSAGE_PER_PAGE } from '@/constants'

import type { AppGlobalContext, DMMessage, DMSession } from '@/types'

const { dmSessions, dmMessages } = inject<AppGlobalContext>('OC')!

const route = useRoute()
const ws = useSocketIO()

const dmSessionId = Number(route.params.dmSessionId)

const dmChatContainer = useTemplateRef('dmChatContainer')
const dmChatInput = useTemplateRef('dmChatInput')
const dmSession = ref<DMSession | undefined>(
  dmSessions.value.find((dmSession) => dmSession.id === dmSessionId),
)
const dmMessageContent = ref<string>('')
const showUserProfilePanel = ref<boolean>(true)
const reachedHead = ref<boolean>(false)
const reachedTail = ref<boolean>(false)

const scrollChatContainerToBottom = (dmMessage: DMMessage) => {
  setTimeout(() => {
    const chatItemElement = document.getElementById(`message-Item-${dmMessage.id}`)

    if (chatItemElement) {
      chatItemElement.scrollIntoView()
    }
  })
}

const loadInitialMessages = async () => {
  const messages = await apis.getDmMessages(
    dmSessionId,
    dmSession.value!.lastMessageId - MESSAGE_PER_PAGE,
    MESSAGE_PER_PAGE,
  )

  if (!messages || !Array.isArray(messages)) {
    reachedHead.value = reachedTail.value = true

    dmMessages.value[dmSessionId] = []
    return
  }

  if (messages.length < MESSAGE_PER_PAGE) {
    reachedHead.value = reachedTail.value = true
  }

  dmMessages.value[dmSessionId] = messages
}

const handleSendDMMessage = () => {
  if (!dmMessageContent.value.trim()) {
    return
  }

  ws.emit('dm_message.send', { dmSessionId: dmSessionId, content: dmMessageContent.value })

  dmMessageContent.value = ''
}

const onDMMessageSuccessfullySent = (dmMessage: DMMessage) => {
  console.log('You sent this dm message', dmMessage)

  if (dmMessages.value[dmMessage.sessionId]) {
    dmMessages.value[dmMessage.sessionId].push(dmMessage)
  }

  scrollChatContainerToBottom(dmMessage)
}

if (!dmMessages.value[dmSessionId]) {
  await loadInitialMessages()
}

onMounted(() => {
  dmChatContainer.value?.el?.scrollTo({
    top: dmChatContainer.value.el.scrollHeight,
  })

  ws.socket.on('dm_message.send.success', onDMMessageSuccessfullySent)

  if (dmChatInput.value) {
    dmChatInput.value.input?.focus()
  }

  document.title = `OnlyChat | @${dmSession.value?.userB.displayName}`
})

onUnmounted(() => {
  ws.socket.off('dm_message.send.success', onDMMessageSuccessfullySent)
})
</script>
