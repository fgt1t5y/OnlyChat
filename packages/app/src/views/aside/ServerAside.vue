<template>
  <RouterMenu :items="serverAsideMenuItems" />
  <Divider />
  <div v-for="channel in resolvedChannels" class="mb-4">
    <div v-if="channel.children.length">
      <div class="text-muted-color mx-2 mb-1">{{ channel.name }}</div>
      <RouterLink
        v-for="subChannel in channel.children"
        class="router-Menu-Item"
        :to="{ name: 'server_channel_chat', params: { channelId: subChannel.id } }"
      >
        <i class="ti ti-hash"></i>
        <div>{{ subChannel.name }}</div>
      </RouterLink>
    </div>
    <RouterLink
      v-else
      class="router-Menu-Item"
      :to="{ name: 'server_channel_chat', params: { channelId: channel.id } }"
    >
      <i class="ti ti-hash"></i>
      <div>{{ channel.name }}</div>
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import RouterMenu from '@/components/common/RouterMenu.vue'
import { computed, inject, ref } from 'vue'
import { useRoute } from 'vue-router'
import { Divider } from 'primevue'

import type { Server, AppGlobalContext, RouterMenuItem, ChannelTree } from '@/types'

const { joinedServers } = inject<AppGlobalContext>('OC')!

const route = useRoute()

const serverId = Number(route.params.serverId)

const server = ref<Server | undefined>(joinedServers.value.find((server) => server.id === serverId))
const serverAsideMenuItems = ref<RouterMenuItem[]>([
  {
    label: 'Browser Channels',
    icon: 'ti ti-list-search',
    to: { name: 'server_channels' },
  },
])

const resolvedChannels = computed<ChannelTree[]>(() => {
  if (!server.value || !Array.isArray(server.value.channels) || !server.value.channels.length) {
    return []
  }

  const channelMap = new Map<number, ChannelTree>() // 用于快速查找频道
  const tree: ChannelTree[] = [] // 存储最终的树结构

  // 初始化每个频道，并添加 `children` 属性
  server.value.channels.forEach((channel) => {
    channelMap.set(channel.id, { ...channel, children: [] })
  })

  // 构建树结构
  server.value.channels.forEach((channel) => {
    if (channel.rootChannelId) {
      // 如果有父节点，将当前频道添加到父节点的 `children` 中
      const parent = channelMap.get(channel.rootChannelId)
      if (parent) {
        parent.children.push(channelMap.get(channel.id)!)
      }
    } else {
      // 如果没有父节点，说明是顶级节点，直接添加到树中
      tree.push(channelMap.get(channel.id)!)
    }
  })

  return tree
})

console.log(resolvedChannels.value)
</script>
