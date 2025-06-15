<template>
  <Page v-if="server && channel">
    <PageTitle :title="channel.name">
      <template #title="{ title }">
        <div class="text-base">{{ title }}</div>
      </template>

      <template #icon>
        <i class="ti ti-hash"></i>
      </template>
    </PageTitle>
    <div class="flex overflow-hidden grow relative">
      <div class="flex flex-col justify-end grow">
        <List
          ref="messageContainer"
          class="min-h-0 overflow-auto pb-2 relative"
          :items="channelMessages[channelId]"
        >
          <template #head>
            <li v-if="reachedHead" class="flex flex-col gap-2 p-2 mb-2">
              <div>
                <i
                  class="ti ti-hash text-4xl bg-surface-200 dark:bg-surface-800 p-2 rounded-full"
                ></i>
              </div>
              <div class="text-3xl font-bold">
                {{ $t('welcome_to_channel', [channel.name]) }}
              </div>
              <div>
                {{ $t('start_channel_message', [channel.name]) }}
              </div>
            </li>
            <div v-else>
              <MessageSkeleton />
              <IntersectionObserver :disabled="reachedHead" />
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
              <IntersectionObserver :disabled="reachedTail" />
              <MessageSkeleton />
            </div>
          </template>
        </List>
        <ChatInput v-model="messageContent" ref="chatInput" :placeholder="chatInputPlaceholder" />
      </div>
    </div>
  </Page>
</template>

<script setup lang="ts">
import * as apis from '@/apis'
import Page from '@/components/common/Page.vue'
import List from '@/components/common/List.vue'
import PageTitle from '@/components/common/PageTitle.vue'
import ChatInput from '@/components/input/ChatInput.vue'
import MessageItem from '@/components/item/MessageItem.vue'
import TextDivider from '@/components/common/TextDivider.vue'
import MessageSkeleton from '@/components/skeleton/MessageSkeleton.vue'
import IntersectionObserver from '@/components/common/IntersectionObserver.vue'
import dayjs from 'dayjs'
import { last } from 'underscore'
import { computed, inject, onActivated, ref, useTemplateRef, nextTick, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { MESSAGE_PER_PAGE } from '@/constants'

import type { AppGlobalContext, Server, Channel } from '@/types'

const { joinedServers, channelMessages } = inject<AppGlobalContext>('OC')!

const route = useRoute()
const { t } = useI18n()

const serverId = Number(route.params.serverId)
const channelId = Number(route.params.channelId)

const server = ref<Server | undefined>(joinedServers.value.find((server) => server.id === serverId))
const channel = ref<Channel | undefined>(
  server.value?.channels.find((channel) => channel.id === channelId),
)
const messageContent = ref<string>('')
const reachedHead = ref<boolean>(true)
const reachedTail = ref<boolean>(true)
const fetching = ref<boolean>(false)

const loadInitialMessages = async () => {
  if (server.value || !channel.value || !channel.value.lastMessageId) {
    channelMessages.value[channelId] = []

    return
  }

  // if (dmMessageId) {
  //   await apis.getDMMessagesAround(dmSessionId, dmMessageId, MESSAGE_PER_PAGE)

  //   return
  // }

  fetching.value = true

  let messages = await apis.getChannelMessagesBefore(
    channelId,
    channel.value.lastMessageId,
    MESSAGE_PER_PAGE,
  )

  fetching.value = false

  if (messages.length) {
    messages.reverse()

    if (messages.length === MESSAGE_PER_PAGE) {
      reachedHead.value = false
      reachedTail.value = last(messages)!.id === channel.value.lastMessageId
    }
  }

  channelMessages.value[channelId] = messages
}

const dayFirstMessageIdDateMap = computed(() => {
  const messages = channelMessages.value[channelId]
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
  return t('message_to_channel', [channel.value?.name])
})

onActivated(() => {
  document.title = 'OnlyChat | Server Chat'
})

if (!channelMessages.value[channelId]) {
  await loadInitialMessages()
}
</script>
