<template>
  <RouterMenu :items="settingsAsideMenuItems" />
  <Button
    class="mt-6"
    label="Logout"
    icon="ti ti-logout"
    severity="danger"
    variant="outlined"
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

import type { RouterMenuItem } from '@/types'

const auth = useAuth()
const router = useRouter()

const logout = async () => {
  auth.logout()
  await router.replace({ name: 'login' })
  location.reload()
}

const settingsAsideMenuItems = ref<RouterMenuItem[]>([
  { label: 'User Profile', icon: 'ti ti-user', to: { name: 'settings_profile' } },
  { label: 'Avatar', icon: 'ti ti-user-circle', to: { name: 'settings_avatar' } },
  { label: 'Theme', icon: 'ti ti-shirt', to: { name: 'settings_theme' } },
])
</script>
