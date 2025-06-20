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
                {{ $t('start_message_with_somebody', [dmSession.userB.displayName]) }}
              </div>
            </li>
            <div v-else>
              <MessageSkeleton />
              <IntersectionObserver :disabled="reachedHead" @reach="loadPrevBatchMessages" />
            </div>
          </template>

          <template #default="{ item, prev }">
            <TextDivider
              v-if="dayFirstMessageIdDateMap.has(item.id)"
              :text="dayFirstMessageIdDateMap.get(item.id)!"
            />
            <MessageItem
              :item="item"
              :is-head="item.authorId !== prev?.authorId || dayFirstMessageIdDateMap.has(item.id)"
              :key="item.id"
            />
          </template>

          <template #tail>
            <div v-if="!reachedTail">
              <IntersectionObserver :disabled="reachedTail" @reach="loadNextBatchMessages" />
              <MessageSkeleton />
            </div>
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
              <div class="text-muted-color">{{ $t('introduction') }}</div>
              <div>
                <MarkdownBlock :text="dmSession.userB.introduction" inline />
              </div>
            </div>
            <div class="flex flex-col">
              <div class="text-muted-color">{{ $t('member_since') }}</div>
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
import * as apis from '@/apis'
import Page from '@/components/common/Page.vue'
import List from '@/components/common/List.vue'
import PageTitle from '@/components/common/PageTitle.vue'
import UserAvatar from '@/components/avatar/UserAvatar.vue'
import ChatInput from '@/components/input/ChatInput.vue'
import ToggleButton from '@/components/button/ToggleButton.vue'
import MessageItem from '@/components/item/MessageItem.vue'
import TextDivider from '@/components/common/TextDivider.vue'
import MarkdownBlock from '@/components/common/MarkdownBlock.vue'
import MessageSkeleton from '@/components/skeleton/MessageSkeleton.vue'
import IntersectionObserver from '@/components/common/IntersectionObserver.vue'
import dayjs from 'dayjs'
import { last } from 'underscore'
import {
  computed,
  inject,
  onActivated,
  ref,
  useTemplateRef,
  nextTick,
  onMounted,
} from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useRequest } from 'alova/client'
import { MESSAGE_PER_PAGE } from '@/constants'
import { useStorage } from '@vueuse/core'

import type { AppGlobalContext, DMMessage, DMSession } from '@/types'

const { dmSessions, dmMessages, mainTitleText, devLog } = inject<AppGlobalContext>('OC')!

const route = useRoute()
const { t } = useI18n()

const dmSessionId = Number(route.params.dmSessionId)
const dmMessageId = Number(route.params.dmMessageId)

// Config storage
const showUserProfilePanel = useStorage('showUserProfilePanel', true)

const messageContainer = useTemplateRef('messageContainer')
const chatInput = useTemplateRef('chatInput')

const dmSession = ref<DMSession | undefined>(
  dmSessions.value.find((dmSession) => dmSession.id === dmSessionId),
)
const messageContent = ref<string>('')
const reachedHead = ref<boolean>(true)
const reachedTail = ref<boolean>(true)
const fetching = ref<boolean>(false)
const messageContainerTopOffset = ref<number>(0)

const { data: message, send: sendMessage } = useRequest(apis.sendDMMessage, {
  immediate: false,
}).onSuccess(() => {
  onDMMessageSent(message.value)
})

const scrollToSpecificMessage = (messageId: number, highlight: boolean = false) => {
  const messageElement = document.getElementById(`message-Item-${messageId}`)

  if (messageElement) {
    messageElement.scrollIntoView({ block: 'start' })

    if (highlight) {
      messageElement.classList.add('message-Highlighted')

      let timerId = window.setTimeout(() => {
        messageElement.classList.remove('message-Highlighted')

        if (timerId) {
          window.clearTimeout(timerId)
        }
      }, 3000)
    }
  } else {
    messageContainer.value?.scrollTo(messageContainerTopOffset.value)
  }
}

const loadInitialMessages = async () => {
  if (!dmSession.value || !dmSession.value.lastMessageId) {
    dmMessages.value[dmSessionId] = []

    return
  }

  if (dmMessageId) {
    await apis.getDMMessagesAround(dmSessionId, dmMessageId, MESSAGE_PER_PAGE)

    return
  }

  fetching.value = true

  let messages = await apis.getDMMessagesBefore(
    dmSessionId,
    dmSession.value.lastMessageId,
    MESSAGE_PER_PAGE,
  )

  fetching.value = false

  if (messages.length) {
    messages.reverse()

    if (messages.length === MESSAGE_PER_PAGE) {
      reachedHead.value = false
      reachedTail.value = last(messages)!.id === dmSession.value.lastMessageId
    }
  }

  dmMessages.value[dmSessionId] = messages
}

const loadPrevBatchMessages = async () => {
  if (reachedHead.value || fetching.value) {
    return
  }

  fetching.value = true

  const messages = await apis.getDMMessagesBefore(
    dmSessionId,
    dmMessages.value[dmSessionId][0].id - 1, // skip a reduplicate message
    MESSAGE_PER_PAGE,
  )

  fetching.value = false

  if (!messages || !Array.isArray(messages) || !messages.length) {
    reachedHead.value = true

    return
  }

  messages.reverse()
  dmMessages.value[dmSessionId].unshift(...messages)

  reachedHead.value = messages.length < MESSAGE_PER_PAGE

  await nextTick()

  scrollToSpecificMessage(last(messages)!.id, true)
}

const loadNextBatchMessages = async () => {
  if (reachedTail.value || fetching.value) {
    return
  }

  fetching.value = true

  const messages = await apis.getDMMessagesAfter(
    dmSessionId,
    last(dmMessages.value[dmSessionId])!.id,
    MESSAGE_PER_PAGE,
  )

  fetching.value = false

  if (!messages || !Array.isArray(messages) || !messages.length) {
    reachedTail.value = true

    return
  }

  messages.reverse()
  dmMessages.value[dmSessionId].push(...messages)

  reachedTail.value = messages.length < MESSAGE_PER_PAGE

  await nextTick()

  scrollToSpecificMessage(last(messages)!.id, true)
}

const handleSendDMMessage = () => {
  if (!messageContent.value.trim()) {
    return
  }

  sendMessage(dmSessionId, messageContent.value)
}

const onDMMessageSent = (dmMessage: DMMessage) => {
  devLog('You sent this dm message', dmMessage)

  if (!dmMessages.value[dmMessage.sessionId]) {
    dmMessages.value[dmMessage.sessionId] = []
  }

  dmMessages.value[dmMessage.sessionId].push(dmMessage)
  chatInput.value?.textarea?.focus()

  if (reachedTail.value) {
    messageContainer.value?.scrollToBottom()
  }

  dmSession.value!.lastMessageId = dmMessage.id
  messageContent.value = ''
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
      !dayjs
        .utc(message.createdAt)
        .tz()
        .isSame(dayjs.utc(messages[index - 1].createdAt).tz(), 'day')
    ) {
      map.set(message.id, dayjs.utc(message.createdAt).tz().format('LL'))
    }
  })

  return map
})

const chatInputPlaceholder = computed(() => {
  return t('message_to_somebody', [dmSession.value?.userB.displayName])
})

onMounted(() => {
  messageContainerTopOffset.value = messageContainer.value!.el!.scrollHeight || 0
})

onActivated(() => {
  nextTick(() => {
    if (dmMessageId) {
      scrollToSpecificMessage(dmMessageId, true)
    } else {
      messageContainer.value?.scrollTo(messageContainerTopOffset.value)
    }
  })

  chatInput.value?.textarea?.focus()

  document.title = `OnlyChat | @${dmSession.value?.userB.displayName}`
  mainTitleText.value = t('direct_messages')
})

if (!dmMessages.value[dmSessionId]) {
  await loadInitialMessages()
}
</script>
