<template>
  <Page>
    <PageTitle title="Browser Channels" icon="ti ti-list-search" />
    <form class="p-2 mb-5">
      <IconField>
        <InputText placeholder="Search Channels" fluid />
        <InputIcon class="ti ti-search" />
      </IconField>
    </form>
    <div class="p-2">
      <div v-if="uncategorizedChannels.length" class="router-Menu">
        <div class="text-muted-color mx-2">Uncategorized</div>
        <RouterLink
          v-for="channel in uncategorizedChannels"
          class="router-Menu-Item"
          :to="{
            name: 'server_channel_chat',
            params: { serverId: serverId, channelId: channel.id },
          }"
        >
          <i class="ti ti-hash"></i>
          <div class="router-Menu-Item-Text">{{ channel.name }}</div>
        </RouterLink>
      </div>
      <div v-for="channel in categorizedChannels" class="mb-4">
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
      </div>
    </div>
  </Page>
</template>

<script setup lang="ts">
import Page from '@/components/common/Page.vue'
import PageTitle from '@/components/common/PageTitle.vue'
import { computed, inject, ref } from 'vue'
import { useRoute } from 'vue-router'
import { InputText, InputIcon, IconField } from 'primevue'

import type { Server, AppGlobalContext, ChannelTree } from '@/types'

const { joinedServers } = inject<AppGlobalContext>('OC')!

const route = useRoute()

const serverId = Number(route.params.serverId)

const server = ref<Server | undefined>(joinedServers.value.find((server) => server.id === serverId))

const categorizedChannels = computed<ChannelTree[]>(() => {
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

const uncategorizedChannels = computed<ChannelTree[]>(() => {
  if (!server.value || !Array.isArray(server.value.channels) || !server.value.channels.length) {
    return []
  }

  return server.value.channels.filter(
    (channel) => !channel.rootChannelId && !channel.isCategory,
  ) as ChannelTree[]
})
</script>
