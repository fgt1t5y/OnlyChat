<template>
  <div v-if="auth.user" class="flex h-screen">
    <nav class="flex flex-col min-w-[350px] border-r border-content">
      <section class="flex grow">
        <menu class="flex flex-col gap-3 p-3 items-center border-r border-content">
          <RouterLink class="menu-Link" :to="{ name: 'home' }">
            <Avatar icon="ti ti-home" size="large" />
          </RouterLink>
        </menu>
        <aside class="grow p-2">
          <RouterView name="aside" />
        </aside>
      </section>
      <section class="flex gap-2 items-center border-t border-content p-3">
        <UserAvatar :user="auth.user!" />
        <div class="flex flex-col justify-center grow">
          <div>{{ auth.user.username }}</div>
          <div class="text-primary">Online</div>
        </div>
        <Button
          icon="ti ti-settings"
          size="large"
          severity="secondary"
          rounded
          title="Settings"
          aria-label="Settings"
          @click="$router.push({ name: 'settings' })"
        />
      </section>
    </nav>
    <RouterView />
  </div>
  <div v-else class="text-center">Failed to load user profile, plase try refresh page.</div>
</template>

<script setup lang="ts">
import apis from '@/apis'
import UserAvatar from '@/components/UserAvatar.vue'
import { useAuth } from '@/stores/auth'
import { useSocketIO } from '@/stores/socket'
import { Avatar, Button } from 'primevue'
import { provide } from 'vue'

import type { AppGlobalContext } from '@/types'

const auth = useAuth()
const socket = useSocketIO()

await auth.getUserProfile()
// await socket.connectAsync()

provide<AppGlobalContext>('OC', {
  receivedFriendRequests: await apis.friendRequest.getReceived(),
})
</script>
