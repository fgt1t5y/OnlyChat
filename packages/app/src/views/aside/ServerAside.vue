<template>
  <button class="server-Menu-Button" title="Server Main Menu" @click="serverMainMenu?.toggle">
    <div class="font-bold">{{ server?.name }}</div>
    <i class="ti ti-chevron-down"></i>
  </button>
  <div class="p-2">
    <RouterMenu :items="serverAsideMenuItems" />
    <Divider />
    <div v-for="channel in resolvedChannels" class="mb-4">
      <div v-if="channel.children.length" class="router-Menu">
        <div class="text-muted-color mx-2">{{ channel.name }}</div>
        <RouterLink
          v-for="subChannel in channel.children"
          class="router-Menu-Item"
          :to="{
            name: 'server_channel_chat',
            params: { serverId: serverId, channelId: subChannel.id },
          }"
        >
          <i class="ti ti-hash"></i>
          <div class="router-Menu-Item-Text">{{ subChannel.name }}</div>
        </RouterLink>
      </div>
      <RouterLink
        v-else
        class="router-Menu-Item"
        :to="{ name: 'server_channel_chat', params: { serverId: serverId, channelId: channel.id } }"
      >
        <i class="ti ti-hash"></i>
        <div class="router-Menu-Item-Text">{{ channel.name }}</div>
      </RouterLink>
    </div>
  </div>
  <ContextMenu ref="serverMainMenu" :model="serverMainMenuItems">
    <template #item="{ item, props }">
      <a class="flex items-center justify-between" v-bind="props.action">
        <div>{{ item.label }}</div>
        <i style="font-size: 1.25rem" :class="item.icon"></i>
        <i v-if="item.items" class="pi pi-angle-right ml-auto"></i>
      </a>
    </template>
  </ContextMenu>
</template>

<script setup lang="ts">
import RouterMenu from '@/components/common/RouterMenu.vue'
import { useAuth } from '@/stores/auth'
import { computed, inject, ref, useTemplateRef } from 'vue'
import { useRoute } from 'vue-router'
import { ContextMenu, Divider } from 'primevue'

import type { MenuItem } from 'primevue/menuitem'
import type { Server, AppGlobalContext, RouterMenuItem, ChannelTree } from '@/types'

const { joinedServers } = inject<AppGlobalContext>('OC')!

const auth = useAuth()
const route = useRoute()

const serverId = Number(route.params.serverId)

const serverMainMenu = useTemplateRef('serverMainMenu')

const server = ref<Server | undefined>(joinedServers.value.find((server) => server.id === serverId))

const serverAsideMenuItems = computed<RouterMenuItem[]>(() => {
  if (!server.value) {
    return []
  }

  const items: RouterMenuItem[] = []

  items.push({
    label: 'Browser Channels',
    icon: 'ti ti-list-search',
    to: { name: 'server_channels' },
  })

  if (server.value?.creatorId === auth.user!.id) {
    items.push({
      label: 'Members',
      icon: 'ti ti-users',
      to: { name: 'server_members' },
    })
  }

  return items
})

const resolvedChannels = computed<ChannelTree[]>(() => {
  if (!server.value || !Array.isArray(server.value.channels) || !server.value.channels.length) {
    return []
  }

  const channelMap = new Map<number, ChannelTree>()
  const tree: ChannelTree[] = []

  server.value.channels.forEach((channel) => {
    channelMap.set(channel.id, { ...channel, children: [] })
  })

  server.value.channels.forEach((channel) => {
    if (channel.rootChannelId) {
      const parent = channelMap.get(channel.rootChannelId)

      if (parent) {
        parent.children.push(channelMap.get(channel.id)!)
      }
    } else {
      tree.push(channelMap.get(channel.id)!)
    }
  })

  return tree
})

const serverMainMenuItems = computed<MenuItem[]>(() => {
  return [
    { label: 'Server Settings', icon: 'ti ti-settings' },
    { label: 'Create Channel', icon: 'ti ti-circle-plus' },
    { label: 'Create Category', icon: 'ti ti-folder-plus' },
  ]
})
</script>
