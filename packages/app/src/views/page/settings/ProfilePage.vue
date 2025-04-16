<template>
  <Page>
    <div class="w-setting-page mx-auto">
      <PageTitle title="User Profile" icon="ti ti-user" />
      <Fieldset legend="My Profile">
        <div class="flex flex-col gap-2">
          <label class="flex flex-col text-muted-color">
            <span>Display Name</span>
            <InputText :model-value="auth.user?.displayName" name="displayName" />
          </label>
          <label class="flex flex-col text-muted-color">
            <span>Introduction</span>
            <Textarea
              :model-value="auth.user?.introduction"
              name="introduction"
              placeholder="Some about you... (Markdown is supported)"
              rows="3"
              auto-resize
            />
          </label>
          <div>
            <Button label="Save Profile" />
          </div>
        </div>
      </Fieldset>
    </div>
  </Page>
</template>

<script setup lang="ts">
import Page from '@/components/common/Page.vue'
import PageTitle from '@/components/common/PageTitle.vue'
import { useAuth } from '@/stores/auth'
import { Button, Fieldset, Textarea, InputText } from 'primevue'

const auth = useAuth()
</script>
