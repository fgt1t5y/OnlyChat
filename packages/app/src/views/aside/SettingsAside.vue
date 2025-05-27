<template>
  <div class="p-2">
    <div class="aside-Group-Title">{{ $t('settings.group_user_settings') }}</div>
    <RouterMenu :items="userSettingsAsideMenuItems" />
    <Divider />
    <div class="aside-Group-Title">{{ $t('settings.group_app_settings') }}</div>
    <RouterMenu :items="appSettingsAsideMenuItems" />
    <Divider />
    <RouterMenu :items="logoutAsideMenuItems" />
  </div>
</template>

<script setup lang="ts">
import RouterMenu from '@/components/common/RouterMenu.vue'
import { onMounted, ref, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import { Divider } from 'primevue'

import type { AppGlobalContext, RouterMenuItem } from '@/types'

const { mainTitleText } = inject<AppGlobalContext>('OC')!

const { t } = useI18n()

const userSettingsAsideMenuItems = ref<RouterMenuItem[]>([
  { label: t('settings.my_account'), to: { name: 'settings_my_account' } },
  { label: t('settings.profiles'), to: { name: 'settings_profiles' } },
])

const appSettingsAsideMenuItems = ref<RouterMenuItem[]>([
  { label: t('settings.appearance'), to: { name: 'settings_appearance' } },
])

const logoutAsideMenuItems = ref<RouterMenuItem[]>([
  { label: t('action.logout'), to: { name: 'settings_logout' } },
])

onMounted(() => {
  mainTitleText.value = t('page.settings')
})
</script>
