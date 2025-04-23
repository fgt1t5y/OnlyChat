<template>
  <RouterMenu :items="settingsAsideMenuItems" />
  <Button
    class="mt-6"
    label="Logout"
    icon="ti ti-logout"
    severity="secondary"
    fluid
    @click="logout"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import RouterMenu from '@/components/common/RouterMenu.vue'
import { Button } from 'primevue'
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

const settingsAsideMenuItems = ref<RouterMenuItem[]>([
  { label: 'My Account', to: { name: 'settings_my_account' } },
  { label: 'Profiles', to: { name: 'settings_profile' } },
  { label: 'Avatar', to: { name: 'settings_avatar' } },
  { label: 'Theme', to: { name: 'settings_theme' } },
])
</script>
