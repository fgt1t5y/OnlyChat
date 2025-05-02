<template>
  <li :id="`message-Item-${item.id}`">
    <div v-if="isHead" class="message-Item message-Item-Head mt-4">
      <div class="flex justify-center w-15 shrink-0">
        <UserAvatar :user="item.author" :show-online="false" />
      </div>
      <div class="flex flex-col grow">
        <div class="flex gap-2">
          <div class="font-bold">{{ item.author.displayName }}</div>
          <time class="text-[12px] text-muted-color">
            {{ dayjs.utc(item.createdAt).tz().format('LT') }}
          </time>
        </div>
        <article class="text-base grow">
          <MarkdownBlock :text="item.content" />
        </article>
      </div>
    </div>
    <div v-else class="message-Item message-Item-Tail">
      <time class="flex justify-center w-15 text-[12px] text-muted-color shrink-0">
        {{ dayjs.utc(item.createdAt).tz().format('LT') }}
      </time>
      <article class="text-base grow">
        <MarkdownBlock :text="item.content" />
      </article>
    </div>
  </li>
</template>

<script setup lang="ts">
import MarkdownBlock from '@/components/common/MarkdownBlock.vue'
import UserAvatar from '@/components/avatar/UserAvatar.vue'
import dayjs from 'dayjs'

import type { DMMessage } from '@/types'

const props = defineProps<{
  item: DMMessage
  isHead: boolean
}>()
</script>
