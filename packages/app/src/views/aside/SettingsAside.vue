<template>
  <div class="p-2">
    <div class="aside-Group-Title">User Settings</div>
    <RouterMenu :items="userSettingsAsideMenuItems" />
    <Divider />
    <div class="aside-Group-Title">App Settings</div>
    <RouterMenu :items="appSettingsAsideMenuItems" />
    <Divider />
    <RouterMenu :items="logoutAsideMenuItems" />
  </div>
</template>

<script setup lang="ts">
import RouterMenu from '@/components/common/RouterMenu.vue'
import { onMounted, ref, inject } from 'vue'
import { Divider } from 'primevue'

import type { AppGlobalContext, RouterMenuItem } from '@/types'

const { mainTitleText } = inject<AppGlobalContext>('OC')!

const userSettingsAsideMenuItems = ref<RouterMenuItem[]>([
  { label: 'My Account', to: { name: 'settings_my_account' } },
  { label: 'Profiles', to: { name: 'settings_profiles' } },
])

const appSettingsAsideMenuItems = ref<RouterMenuItem[]>([
  { label: 'Appearance', to: { name: 'settings_appearance' } },
])

const logoutAsideMenuItems = ref<RouterMenuItem[]>([
  { label: 'Log Out', to: { name: 'settings_logout' } },
])

onMounted(() => {
  mainTitleText.value = 'Settings'
})
</script>
