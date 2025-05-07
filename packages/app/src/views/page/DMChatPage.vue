<template>
  <Page v-if="dmSession">
    <PageTitle :title="dmSession.userB.displayName">
      <ToggleButton v-model="showUserProfilePanel" icon="ti ti-user-circle" />

      <template #title="{ title }">
        <div class="text-base">{{ title }}</div>
      </template>
      <template #icon>
        <UserAvatar :user="dmSession.userB" size="s" />
      </template>
    </PageTitle>
    <div class="flex overflow-hidden grow relative">
      <div class="flex flex-col justify-end grow">
        <List
          ref="messageContainer"
          class="min-h-0 overflow-auto pb-2 relative"
          :items="dmMessages[dmSessionId]"
          @scroll="onMessageContainerScroll"
        >
          <template #head>
            <li v-if="reachedHead" class="flex flex-col gap-2 p-2 mb-2">
              <UserAvatar :user="dmSession.userB" size="l" :show-online="false" />
              <div class="text-3xl font-bold">{{ dmSession.userB.displayName }}</div>
              <div class="text-2xl">{{ dmSession.userB.username }}</div>
              <div>
                This is the beginning of your direct message history with
                <span class="font-bold">{{ dmSession.userB.displayName }}</span>
              </div>
            </li>
          </template>

          <template #default="{ item, prev }">
            <TextDivider
              v-if="dayFirstMessageIdDateMap.has(item.id)"
              :text="dayFirstMessageIdDateMap.get(item.id)!"
            />
            <DMMessageItem
              :item="item"
              :is-head="item.authorId !== prev?.authorId || dayFirstMessageIdDateMap.has(item.id)"
              :key="item.id"
            />
          </template>
        </List>
        <ChatInput
          v-model="messageContent"
          ref="chatInput"
          :placeholder="chatInputPlaceholder"
          @submit="handleSendDMMessage"
        />
      </div>
      <div v-if="showUserProfilePanel" class="page-Aside">
        <div class="overflow-hidden relative">
          <div
            :style="{ backgroundColor: `#${dmSession.userB.bannerColor}` }"
            class="h-banner"
          ></div>
          <div class="absolute left-5 top-15">
            <UserAvatar
              size="l"
              :user="dmSession.userB"
              :is-online="dmSession.userB.isOnline"
              bordered
            />
          </div>
          <div class="mx-5 mt-12">
            <div class="text-xl font-bold">{{ dmSession.userB.displayName }}</div>
            <div class="text-muted-color">{{ dmSession.userB.username }}</div>
          </div>
          <div
            class="rounded-border border border-content mx-5 mt-2 p-2 bg-surface-50 dark:bg-surface-700"
          >
            <div v-if="dmSession.userB.introduction" class="flex flex-col">
              <div class="text-muted-color">Introduction</div>
              <div>
                <MarkdownBlock :text="dmSession.userB.introduction" inline />
              </div>
            </div>
            <div class="flex flex-col">
              <div class="text-muted-color">Member Since</div>
              <div class="text-base">
                {{ dayjs.utc(dmSession.userB.createdAt).tz().format('LL') }}
              </div>
            </div>
          </div>
        </div>
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
import DMMessageItem from '@/components/item/DMMessageItem.vue'
import TextDivider from '@/components/common/TextDivider.vue'
import MarkdownBlock from '@/components/common/MarkdownBlock.vue'
import dayjs from 'dayjs'
import _ from 'underscore'
import {
  computed,
  inject,
  onActivated,
  onDeactivated,
  ref,
  useTemplateRef,
  nextTick,
  onMounted,
} from 'vue'
import { useRoute } from 'vue-router'
import { useSocketIO } from '@/stores/socket'
import { MESSAGE_PER_PAGE } from '@/constants'
import { useStorage } from '@vueuse/core'

import type { AppGlobalContext, DMMessage, DMSession } from '@/types'

const { dmSessions, dmMessages } = inject<AppGlobalContext>('OC')!

const route = useRoute()
const ws = useSocketIO()

const dmSessionId = Number(route.params.dmSessionId)

const messageContainer = useTemplateRef('messageContainer')
const chatInput = useTemplateRef('chatInput')
const dmSession = ref<DMSession | undefined>(
  dmSessions.value.find((dmSession) => dmSession.id === dmSessionId),
)
const messageContent = ref<string>('')
const showUserProfilePanel = useStorage('showUserProfilePanel', true)
const reachedHead = ref<boolean>(false)
const reachedTail = ref<boolean>(false)
const messageContainerTopOffset = ref<number>(0)

const loadInitialMessages = async () => {
  const messages = await apis.getDmMessages(
    dmSessionId,
    dmSession.value!.lastMessageId,
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

  dmMessages.value[dmSessionId] = messages.reverse()
}

const handleSendDMMessage = () => {
  if (!messageContent.value.trim()) {
    return
  }

  ws.emit('dm_message.send', { dmSessionId: dmSessionId, content: messageContent.value })
}

const onDMMessageSuccessfullySent = (dmMessage: DMMessage) => {
  console.log('You sent this dm message', dmMessage)

  if (dmMessages.value[dmMessage.sessionId]) {
    dmMessages.value[dmMessage.sessionId].push(dmMessage)
  }

  messageContent.value = ''

  if (chatInput.value) {
    chatInput.value.textarea?.focus()
  }

  messageContainer.value?.scrollToBottom()
}

const onMessageContainerScroll = () => {
  messageContainerTopOffset.value = messageContainer.value!.el!.scrollTop || 0
}

const dayFirstMessageIdDateMap = computed(() => {
  const messages = dmMessages.value[dmSessionId]
  const map = new Map<number, string>()

  messages.forEach((message, index) => {
    if (!messages[index - 1]) {
      map.set(message.id, dayjs.utc(message.createdAt).tz().format('LL'))
      return
    }

    if (
      dayjs
        .utc(message.createdAt)
        .tz()
        .isSame(dayjs.utc(messages[index - 1].createdAt).tz(), 'day')
    ) {
      return
    }

    map.set(message.id, dayjs.utc(message.createdAt).tz().format('LL'))
  })

  return map
})

if (!dmMessages.value[dmSessionId]) {
  await loadInitialMessages()
}

const chatInputPlaceholder = computed(() => {
  return `Message @${dmSession.value?.userB.displayName}`
})

onMounted(() => {
  messageContainerTopOffset.value = messageContainer.value!.el!.scrollHeight || 0
})

onActivated(() => {
  nextTick(() => {
    messageContainer.value?.scrollTo(messageContainerTopOffset.value)
  })

  ws.socket.on('dm_message.send.success', onDMMessageSuccessfullySent)

  if (chatInput.value) {
    chatInput.value.textarea?.focus()
  }

  document.title = `OnlyChat | @${dmSession.value?.userB.displayName}`
})

onDeactivated(() => {
  ws.socket.off('dm_message.send.success', onDMMessageSuccessfullySent)
})
</script>
