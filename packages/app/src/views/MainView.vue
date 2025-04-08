<template>
  <div class="flex h-screen">
    <nav class="flex min-w-[350px]">
      <menu class="w-[72px] border-r border-content">1</menu>
      <aside class="grow border-r border-content">
        <RouterView name="aside" />
      </aside>
    </nav>
    <main class="grow">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import apis from '@/apis'
import { useAuth } from '@/stores/auth'
import { onMounted } from 'vue'

const auth = useAuth()

const getUserInfo = async () => {
  try {
    auth.user = await apis.auth.me()
  } catch (e) {}
}

onMounted(getUserInfo)
</script>
