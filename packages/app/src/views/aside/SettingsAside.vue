<template>
  <div class="p-2">
    <div class="aside-Group-Title">User Settings</div>
    <RouterMenu :items="userSettingsAsideMenuItems" />
    <Divider />
    <div class="aside-Group-Title">App Settings</div>
    <RouterMenu :items="appSettingsAsideMenuItems" />
    <Button
      class="mt-6"
      label="Logout"
      icon="ti ti-logout"
      severity="secondary"
      fluid
      @click="logout"
    />
  </div>
</template>

<script setup lang="ts">
import RouterMenu from '@/components/common/RouterMenu.vue'
import { ref } from 'vue'
import { Button, Divider } from 'primevue'
import { useAuth } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useSocketIO } from '@/stores/socket'

import type { RouterMenuItem } from '@/types'

const auth = useAuth()
const ws = useSocketIO()
const router = useRouter()

const logout = async () => {
  ws.disconnect()
  auth.logout()
  await router.replace({ name: 'login' })
  location.reload()
}

const userSettingsAsideMenuItems = ref<RouterMenuItem[]>([
  { label: 'My Account', to: { name: 'settings_my_account' } },
  { label: 'Profiles', to: { name: 'settings_profiles' } },
  { label: 'Avatar', to: { name: 'settings_avatar' } },
])

const appSettingsAsideMenuItems = ref<RouterMenuItem[]>([
  { label: 'Appearance', to: { name: 'settings_appearance' } },
])
</script>
