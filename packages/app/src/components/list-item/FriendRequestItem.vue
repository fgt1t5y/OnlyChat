<template>
  <li class="list-Item flex items-center gap-2">
    <UserAvatar :user="item.sender" />
    <div class="grow">
      <div class="font-bold">{{ item.sender.displayName }}</div>
      <div class="text-muted-color">@{{ item.sender.username }}</div>
    </div>
    <Button label="Accept" />
    <Button label="Ignore" severity="secondary" />
  </li>
</template>

<script setup lang="ts">
import UserAvatar from '../UserAvatar.vue'
import { Button } from 'primevue'

import type { FriendRequest } from '@/types'

defineOptions({
  name: 'FriendRequestItem',
})

const props = defineProps<{
  item: FriendRequest
}>()
</script>
