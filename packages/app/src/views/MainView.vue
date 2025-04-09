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
import { useAuth } from '@/stores/auth'
import { onMounted } from 'vue'
import UserAvatar from '@/components/UserAvatar.vue'
import { io } from 'socket.io-client'

const auth = useAuth()

await auth.getUserProfile()

const wsSocket = io('http://localhost:3000', {
  autoConnect: false,
  withCredentials: true,
  transports: ['websocket'],
  query: {
    userId: auth.user?.id,
  },
})

const connectWSSocket = () => {
  wsSocket.connect()
}

onMounted(async () => {
  // connectWSSocket()
})
</script>
