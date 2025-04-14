<template>
  <Page v-if="dmSession" id="dm-Chat-Page" right-aside>
    <PageTitle :title="dmSession.userB.displayName">
      <template #icon>
        <UserAvatar :user="dmSession.userB" mini />
      </template>
    </PageTitle>
    <div class="grow">
      <ul>
        <li v-for="item in dmMessages" class="chat-Item">
          <UserAvatar :user="item.author" mini />
          <div class="flex flex-col">
            <div class="font-bold">{{ item.author.displayName }}</div>
            <div>{{ item.content }}</div>
          </div>
        </li>
      </ul>
    </div>
    <div class="flex gap-2 py-6">
      <InputText fluid />
      <Button label="Send" />
    </div>

    <template #rightAside>
      <aside class="page-Aside">
        <PageTitle title="Friend Status" icon="ti ti-stars" />
      </aside>
    </template>
  </Page>
</template>

<script setup lang="ts">
import apis from '@/apis'
import Page from '@/components/common/Page.vue'
import PageTitle from '@/components/PageTitle.vue'
import UserAvatar from '@/components/UserAvatar.vue'
import { Button, InputText } from 'primevue'
import { inject, ref } from 'vue'
import { useRoute } from 'vue-router'

import type { AppGlobalContext, DMMessage, DMSession } from '@/types'

const { openedDMSessions } = inject<AppGlobalContext>('OC')!

const route = useRoute()

const dmSessionId = Number(route.params.dmSessionId)

const dmSession = ref<DMSession | undefined>(
  openedDMSessions.value.find((dmSession) => dmSession.id === dmSessionId),
)
const dmMessages = ref<DMMessage[]>(await apis.getDmMessages(dmSessionId, 0, 10))
</script>
