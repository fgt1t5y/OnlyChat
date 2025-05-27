<template>
  <RouterView v-slot="{ Component }">
    <template v-if="Component">
      <Suspense>
        <component :is="Component"></component>

        <template #fallback>
          <div class="h-screen w-full flex flex-col gap-2 justify-center items-center">
            <div class="text-2xl text-center text-primary">OnlyChat</div>
            <div id="app-loading" class="text-muted-color">{{ $t('loading') }}</div>
            <ProgressBar
              mode="indeterminate"
              style="height: 6px; width: 300px"
              aria-labelledby="app-loading"
            />
          </div>
        </template>
      </Suspense>
    </template>
  </RouterView>
  <Toast />
</template>

<script setup lang="ts">
import Toast from 'primevue/toast'
import { useRouter } from 'vue-router'
import { ProgressBar } from 'primevue'
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
