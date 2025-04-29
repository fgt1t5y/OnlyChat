<template>
  <Page>
    <div class="w-setting-page mx-auto">
      <h1>Profiles</h1>
      <div class="flex gap-6">
        <div class="grow">
          <div class="flex flex-col gap-2">
            <label class="flex flex-col gap-2">
              <div>Display Name</div>
              <InputText :model-value="auth.user?.displayName" name="displayName" />
            </label>
            <Divider />
            <label class="flex flex-col gap-2">
              <div>Pronouns</div>
              <InputText :model-value="auth.user?.displayName" name="displayName" />
            </label>
            <Divider />
            <div class="flex flex-col gap-2">
              <div>Avatar</div>
              <div class="flex gap-2">
                <Button label="Change Avatar" />
                <Button label="Remove Avatar" variant="text" />
              </div>
            </div>
            <Divider />
            <div class="flex flex-col gap-2">
              <div>Avatar Decoration</div>
              <div class="flex gap-2">
                <Button label="Change Decoration" />
              </div>
            </div>
            <Divider />
            <div class="flex flex-col gap-2">
              <div>Banner Color</div>
              <ColorPicker v-model="auth.user!.bannerColor" />
            </div>
            <Divider />
            <label class="flex flex-col gap-2">
              <div>Introduction</div>
              <div>You can use markdown and links if you’d like.</div>
              <Textarea
                :model-value="auth.user?.introduction"
                name="introduction"
                rows="3"
                auto-resize
              />
            </label>
          </div>
        </div>
        <div style="max-width: 348px" class="w-full">
          <div>Preview</div>
          <div class="relative rounded-border overflow-hidden bg-surface-200 dark:bg-surface-800">
            <div :style="{ backgroundColor: `#${auth.user!.bannerColor}` }" class="h-banner"></div>
            <div class="absolute left-3 top-15">
              <UserAvatar size="l" :user="auth.user!" :is-online="auth.user!.isOnline" bordered />
            </div>
            <div class="mx-3 mt-12">
              <div class="text-xl font-bold">{{ auth.user!.displayName }}</div>
              <div>{{ auth.user!.username }}</div>
            </div>
            <div class="flex flex-col">
              <Button class="m-3" label="Example Button" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </Page>
</template>

<script setup lang="ts">
import Page from '@/components/common/Page.vue'
import UserAvatar from '@/components/avatar/UserAvatar.vue'
import { useAuth } from '@/stores/auth'
import { Button, Divider, Textarea, InputText, ColorPicker } from 'primevue'

const auth = useAuth()
</script>
