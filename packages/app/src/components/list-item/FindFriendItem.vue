<template>
  <li class="list-Item flex items-center gap-2">
    <UserAvatar :user="item" />
    <div class="grow">
      <div class="font-bold">{{ item.displayName }}</div>
      <div class="text-muted-color">@{{ item.username }}</div>
    </div>
    <Button label="Send request" severity="secondary" />
  </li>
</template>

<script setup lang="ts">
import UserAvatar from '../UserAvatar.vue'
import { Button } from 'primevue';

import type { User } from '@/types'

defineOptions({
  name: 'FindFriendItem',
})

const props = defineProps<{
  item: User
}>()
</script>
