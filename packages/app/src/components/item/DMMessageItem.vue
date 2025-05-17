<template>
  <li :id="`message-Item-${item.id}`">
    <div v-if="isHead" class="message-Item message-Item-Head mt-4">
      <div class="flex justify-center w-15 shrink-0">
        <UserAvatar :user="author" :show-online="false" />
      </div>
      <div class="flex flex-col grow">
        <div class="flex gap-2">
          <div class="font-bold">{{ author.displayName }}</div>
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
import { computed } from 'vue'
import { useAuth } from '@/stores/auth'

import type { DMMessage } from '@/types'

const { item, isHead } = defineProps<{
  item: DMMessage
  isHead: boolean
}>()

const auth = useAuth()

const author = computed(() => {
  if (item.authorId === auth.user?.id) {
    return auth.user
  }

  return item.author
})
</script>
