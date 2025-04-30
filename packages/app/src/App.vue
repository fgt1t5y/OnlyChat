<template>
  <RouterView v-slot="{ Component }">
    <template v-if="Component">
      <Suspense>
        <component :is="Component"></component>

        <template #fallback>
          <AppSplash />
        </template>
      </Suspense>
    </template>
  </RouterView>
  <Toast />
</template>

<script setup lang="ts">
import AppSplash from './components/AppSplash.vue'
import Toast from 'primevue/toast'
import { useRouter } from 'vue-router'
import { useAuth } from './stores/auth'
import { useTheme } from './stores/theme'

const auth = useAuth()
const router = useRouter()
const theme = useTheme()

theme.init()

router.beforeEach((to) => {
  if (auth.hasToken && to.name === 'login') {
    return { name: 'home' }
  }

  if (!auth.hasToken && to.name !== 'login') {
    return { name: 'login' }
  }
})
</script>
