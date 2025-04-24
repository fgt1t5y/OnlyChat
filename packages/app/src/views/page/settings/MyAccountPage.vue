<template>
  <Page>
    <div class="w-setting-page mx-auto">
      <h1>My Account</h1>
      <div class="rounded-border bg-surface-200 dark:bg-surface-900 overflow-hidden relative">
        <div :style="{ backgroundColor: `#${auth.user!.bannerColor}` }" class="h-banner"></div>
        <div style="padding: 16px 16px 0 120px" class="flex justify-between">
          <div class="absolute left-5 top-20">
            <UserAvatar size="l" :user="auth.user!" bordered is-online />
          </div>
          <div class="text-xl">{{ auth.user!.displayName }}</div>
          <RouterLink :to="{ name: 'settings_profiles' }">
            <Button label="Edit User Profile" />
          </RouterLink>
        </div>
        <div class="rounded-border flex flex-col gap-2 m-5 p-2 bg-surface-50 dark:bg-surface-950">
          <div class="flex items-center justify-between">
            <div class="flex flex-col">
              <div class="text-base">Display Name</div>
              <div class="text-base">{{ auth.user!.displayName }}</div>
            </div>
            <RouterLink :to="{ name: 'settings_profiles' }">
              <Button label="Edit" severity="secondary" />
            </RouterLink>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex flex-col">
              <div class="text-base">Username</div>
              <div class="text-base">{{ auth.user!.username }}</div>
            </div>
            <div>
              <Button label="Edit" severity="secondary" />
            </div>
          </div>
        </div>
      </div>
      <h2>Password and Authentication</h2>
      <div>
        <Button label="Change Password" />
      </div>
      <h3>Account Removal</h3>
      <p>Disabling your account means you can recover it at any time after taking this action.</p>
      <div class="flex gap-2">
        <Button label="Disable Account" severity="danger" />
        <Button label="Delete Account" severity="danger" variant="outlined" />
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
