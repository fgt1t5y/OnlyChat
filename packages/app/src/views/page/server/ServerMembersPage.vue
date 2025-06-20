<template>
  <Page v-if="server">
    <PageTitle icon="ti ti-users" :title="$t('members')" />
    <div class="p-2">
      <div>
        <div class="p-2 flex items-center justify-end border-b border-content">
          <div class="flex gap-2">
            <IconField>
              <InputText :placeholder="$t('search_members')" />
              <InputIcon class="ti ti-search" />
            </IconField>
            <Button icon="ti ti-list" size="small" severity="secondary" :label="$t('sort')" />
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th class="table-Cell" style="width: 3%">
                <Checkbox size="large" binary />
              </th>
              <th class="table-Cell" style="width: 30%">{{ $t('member_name') }}</th>
              <th class="table-Cell" style="width: 10%">{{ $t('member_since') }}</th>
              <th class="table-Cell" style="width: 10%">{{ $t('joined_since') }}</th>
              <th class="table-Cell" style="width: 30%">{{ $t('role') }}</th>
              <th class="table-Cell" style="width: 10%">{{ $t('handlers') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="member in serverMembers" class="table-Body-Row">
              <td class="table-Cell">
                <Checkbox size="large" binary />
              </td>
              <td class="table-Cell flex items-center gap-2">
                <UserAvatar size="s" :user="member.user" />
                <div class="flex flex-col">
                  <div>{{ member.user.displayName }}</div>
                  <div class="text-muted-color">{{ member.user.username }}</div>
                </div>
              </td>
              <td class="table-Cell">{{ dayjs.utc(member.createdAt).tz().fromNow() }}</td>
              <td class="table-Cell">
                {{ dayjs.utc(member.user.createdAt).tz().fromNow() }}
              </td>
              <td class="table-Cell">123</td>
              <td class="table-Cell">
                <Button icon="ti ti-dots" severity="secondary" rounded />
              </td>
            </tr>
          </tbody>
        </table>
        <div class="p-2 text-muted-color">
          Showing
          <b>{{ serverMembers.length }}</b>
          members
        </div>
      </div>
    </div>
  </Page>
</template>

<script setup lang="ts">
import * as apis from '@/apis'
import dayjs from 'dayjs'
import Page from '@/components/common/Page.vue'
import PageTitle from '@/components/common/PageTitle.vue'
import UserAvatar from '@/components/avatar/UserAvatar.vue'
import { inject, onActivated, ref } from 'vue'
import { useRoute } from 'vue-router'
import { Button, Checkbox, IconField, InputText, InputIcon } from 'primevue'

import type { Server, AppGlobalContext, ServerMember } from '@/types'

const { joinedServers } = inject<AppGlobalContext>('OC')!

const route = useRoute()

const serverId = Number(route.params.serverId)

const server = ref<Server | undefined>(joinedServers.value.find((server) => server.id === serverId))
const serverMembers = ref<ServerMember[]>(await apis.getServerMembers(serverId))

onActivated(() => {
  if (server.value) {
    document.title = `OnlyChat | Member | ${server.value.name}`
  }
})
</script>
