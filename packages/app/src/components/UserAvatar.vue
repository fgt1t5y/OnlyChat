<template>
  <Avatar v-if="user.avatarUrl" size="large" shape="circle" :image="user.avatarUrl" />
  <Avatar v-else size="large" shape="circle" :label="user.displayName.slice(0, 1)" />
</template>

<script setup lang="ts">
import { Avatar } from 'primevue'

import type { User } from '@/types'

defineOptions({
  name: 'UserAvatar',
})

const props = defineProps<{
  user: User
}>()
</script>
