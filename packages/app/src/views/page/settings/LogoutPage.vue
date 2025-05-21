<template>
  <Page>
    <div class="w-setting-page mx-auto text-center">
      <h1>Log Out</h1>
      <p>Are you sure log out now?</p>
      <Button icon="ti ti-logout" label="Logout Now" severity="danger" @click="logout" />
    </div>
  </Page>
</template>

<script setup lang="ts">
import Page from '@/components/common/Page.vue'
import { Button } from 'primevue'
import { useAuth } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useSocketIO } from '@/stores/socket'

const auth = useAuth()
const ws = useSocketIO()
const router = useRouter()

const logout = async () => {
  ws.disconnect()
  auth.logout()
  await router.replace({ name: 'login' })
  location.reload()
}
</script>
