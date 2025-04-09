<template>
  <div class="flex h-screen">
    <nav class="flex flex-col min-w-[350px] border-r border-content">
      <section class="flex grow">
        <menu class="w-[72px] border-r border-content">1</menu>
        <aside class="grow">
          <RouterView name="aside" />
        </aside>
      </section>
      <section class="flex gap-2 border-t border-content p-3">
        <UserAvatar :user="auth.user!" />
        <div>{{ auth.user?.username }}</div>
      </section>
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
import { useRouter } from 'vue-router'
import UserAvatar from '@/components/UserAvatar.vue'

const auth = useAuth()
const router = useRouter()

const getUserInfo = async () => {
  try {
    auth.user = await apis.auth.me()
  } catch {
    auth.clearAccessToken()
    router.replace({ name: 'login' })
  }
}

onMounted(getUserInfo)
</script>
