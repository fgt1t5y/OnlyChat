<template>
  <RouterView v-slot="{ Component }">
    <template v-if="Component">
      <Suspense>
        <component :is="Component"></component>
      </Suspense>
    </template>
  </RouterView>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuth } from './stores/auth'

const auth = useAuth()
const router = useRouter()

router.beforeEach((to) => {
  if (auth.hasToken && to.name === 'login') {
    return { name: 'home' }
  }

  if (!auth.hasToken && to.name !== 'login') {
    return { name: 'login' }
  }
})
</script>
