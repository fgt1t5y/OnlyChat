<template>
  <Page>
    <div class="w-setting-page mx-auto">
      <h1>{{ $t('settings.my_account') }}</h1>
      <div class="rounded-border bg-surface-200 dark:bg-surface-950 overflow-hidden relative">
        <div :style="{ backgroundColor: `#${auth.user!.bannerColor}` }" class="h-banner"></div>
        <div style="padding: 16px 16px 0 120px" class="flex justify-between">
          <div class="absolute left-5 top-20">
            <UserAvatar size="l" :user="auth.user!" bordered is-online />
          </div>
          <div class="text-xl">{{ auth.user!.displayName }}</div>
          <RouterLink :to="{ name: 'settings_profiles' }">
            <Button :label="$t('edit_user_profile')" />
          </RouterLink>
        </div>
        <div class="rounded-border flex flex-col gap-2 m-5 p-2 bg-surface-50 dark:bg-surface-900">
          <div class="flex items-center justify-between">
            <div class="flex flex-col">
              <div>{{ $t('display_name') }}</div>
              <div class="text-base">{{ auth.user!.displayName }}</div>
            </div>
            <RouterLink :to="{ name: 'settings_profiles' }">
              <Button severity="secondary" :label="$t('action.edit')" />
            </RouterLink>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex flex-col">
              <div>{{ $t('username') }}</div>
              <div class="text-base">{{ auth.user!.username }}</div>
            </div>
            <div>
              <Button severity="secondary" :label="$t('action.edit')" />
            </div>
          </div>
        </div>
      </div>
      <h2>{{ $t('password_and_authentication') }}</h2>
      <div>
        <Button :label="$t('change_password')" />
      </div>
      <h3>{{ $t('account_removal') }}</h3>
      <p>{{ $t('disable_account_tip') }}</p>
      <div class="flex gap-2">
        <Button severity="danger" :label="$t('disable_account')" />
        <Button severity="danger" variant="text" :label="$t('delete_account')" />
      </div>
    </div>
  </Page>
</template>

<script setup lang="ts">
import Page from '@/components/common/Page.vue'
import UserAvatar from '@/components/avatar/UserAvatar.vue'
import { useAuth } from '@/stores/auth'
import { Button } from 'primevue'

const auth = useAuth()
</script>
