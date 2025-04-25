<template>
  <div :class="serverAvatarClass">
    <img
      v-if="server.avatarUrl"
      :src="`/api/content/avatars/${server.avatarUrl}`"
      class="server-Avatar-Image"
      alt="Server Avatar"
    />
    <div v-else class="server-Avatar-Empty">
      <span>{{ server.name.slice(0, 2) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { Server } from '@/types'

defineOptions({
  name: 'ServerAvatar',
})

const props = withDefaults(
  defineProps<{
    server: Server
    size?: 'l' | 'm' | 's'
    bordered?: boolean
  }>(),
  {
    size: 'm',
    showOnline: true,
    bordered: false,
  },
)

const serverAvatarClass = computed(() => {
  return {
    'server-Avatar': true,
    'server-Avatar-S-Size': props.size === 's',
    'server-Avatar-M-Size': props.size === 'm',
    'server-Avatar-L-Size': props.size === 'l',
    'server-Avatar-Bordered': props.bordered,
  }
})
</script>
