<template>
  <div :class="userAvatarClass">
    <img v-if="user.avatarUrl" :src="imageUrl" class="user-Avatar-Image" alt="My Avatar" />
    <div v-else class="user-Avatar-Empty">
      <span>{{ user.displayName.slice(0, 1) }}</span>
    </div>
    <div v-if="showOnline" class="user-Avatar-Dot"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { User } from '@/types'

defineOptions({
  name: 'UserAvatar',
})

const props = withDefaults(
  defineProps<{
    user: User
    size?: 'l' | 'm' | 's'
    isOnline?: boolean
    showOnline?: boolean
    bordered?: boolean
  }>(),
  {
    size: 'm',
    showOnline: true,
    bordered: false,
  },
)

const userAvatarClass = computed(() => {
  return {
    'user-Avatar': true,
    'user-Avatar-S-Size': props.size === 's',
    'user-Avatar-M-Size': props.size === 'm',
    'user-Avatar-L-Size': props.size === 'l',
    'user-Avatar-Is-Online': props.isOnline || props.user.isOnline,
    'user-Avatar-Bordered': props.bordered,
  }
})

const imageUrl = computed(() => {
  if (props.user.avatarUrl) {
    if (props.user.avatarUrl.startsWith('blob:')) {
      return props.user.avatarUrl
    } else {
      return `/api/content/avatars/${props.user.avatarUrl}`
    }
  } else {
    return ''
  }
})
</script>
