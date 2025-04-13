<template>
  <Avatar
    v-if="user.avatarUrl"
    :size="size"
    shape="circle"
    :image="`/api/content/avatars/${user.avatarUrl}`"
  />
  <Avatar v-else :size="size" shape="circle" :label="user.displayName.slice(0, 1)" />
</template>

<script setup lang="ts">
import { Avatar } from 'primevue'
import { computed } from 'vue';

import type { User } from '@/types'

defineOptions({
  name: 'UserAvatar',
})

const props = defineProps<{
  user: User
  mini?: boolean
}>()

const size = computed(() => {
  return props.mini ? 'normal' : 'large'
})
</script>
