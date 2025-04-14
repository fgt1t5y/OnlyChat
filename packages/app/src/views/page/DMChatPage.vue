<template>
  <Page v-if="dmSession" id="dm-Chat-Page" right-aside>
    <PageTitle :title="dmSession.userB.displayName">
      <template #icon>
        <UserAvatar :user="dmSession.userB" mini />
      </template>
    </PageTitle>
    <div class="grow">123</div>
    <div class="flex gap-2 my-6">
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
import Page from '@/components/common/Page.vue'
import PageTitle from '@/components/PageTitle.vue'
import UserAvatar from '@/components/UserAvatar.vue'
import { Button, InputText } from 'primevue'
import { inject, ref } from 'vue'
import { useRoute } from 'vue-router'

import type { AppGlobalContext, DMSession } from '@/types'

const { openedDMSessions } = inject<AppGlobalContext>('OC')!

const route = useRoute()

const currentDMSessionId = Number(route.params.dmSessionId)

const dmSession = ref<DMSession | undefined>(
  openedDMSessions.value.find((session) => session.id === currentDMSessionId),
)
</script>
