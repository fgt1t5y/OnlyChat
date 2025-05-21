<template>
  <Page v-if="server">
    <PageTitle title="Members" icon="ti ti-users" />
    <div>1</div>
  </Page>
</template>

<script setup lang="ts">
import Page from '@/components/common/Page.vue'
import PageTitle from '@/components/common/PageTitle.vue'
import { inject, ref } from 'vue'
import { useRoute } from 'vue-router'

import type { Server, AppGlobalContext } from '@/types'

const { joinedServers } = inject<AppGlobalContext>('OC')!

const route = useRoute()

const serverId = Number(route.params.serverId)

const server = ref<Server | undefined>(joinedServers.value.find((server) => server.id === serverId))
</script>
