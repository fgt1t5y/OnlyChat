<template>
  <Page v-if="server">
    <PageTitle title="Members" icon="ti ti-users" />
    <div class="p-2">
      <div>
        <div class="p-2 flex items-center justify-end border-b border-content">
          <div class="flex gap-2">
            <IconField>
              <InputText placeholder="Search Member" />
              <InputIcon class="ti ti-search" />
            </IconField>
            <Button icon="ti ti-list" label="Sort" size="small" severity="secondary" />
          </div>
        </div>
        <div>
          <table class="w-full">
            <thead>
              <tr>
                <th class="text-start p-2" style="width: 30%">Name</th>
                <th class="text-start p-2" style="width: 10%">Member Since</th>
                <th class="text-start p-2" style="width: 10%">Joined At</th>
                <th class="text-start p-2" style="width: 30%">Roles</th>
                <th class="text-start p-2" style="width: 10%">Handlers</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="member in serverMembers" class="hoverable">
                <td class="text-start p-2 flex items-center gap-2">
                  <UserAvatar size="s" :user="member.user" />
                  <div class="flex flex-col">
                    <div>{{ member.user.displayName }}</div>
                    <div class="text-muted-color">{{ member.user.username }}</div>
                  </div>
                </td>
                <td class="text-start p-2">{{ dayjs.utc(member.createdAt).tz().fromNow() }}</td>
                <td class="text-start p-2">
                  {{ dayjs.utc(member.user.createdAt).tz().fromNow() }}
                </td>
                <td class="text-start p-2">123</td>
                <td class="text-start p-2">
                  <Button icon="ti ti-dots" severity="secondary" rounded />
                </td>
              </tr>
            </tbody>
          </table>
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
import { inject, ref } from 'vue'
import { useRoute } from 'vue-router'
import { Button, IconField, InputText, InputIcon } from 'primevue'

import type { Server, AppGlobalContext, ServerMember } from '@/types'

const { joinedServers } = inject<AppGlobalContext>('OC')!

const route = useRoute()

const serverId = Number(route.params.serverId)

const server = ref<Server | undefined>(joinedServers.value.find((server) => server.id === serverId))
const serverMembers = ref<ServerMember[]>(await apis.getServerMembers(serverId))
</script>
