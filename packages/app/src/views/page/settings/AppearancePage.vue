<template>
  <Page>
    <div class="w-setting-page mx-auto">
      <h1>{{ $t('settings.appearance') }}</h1>
      <div class="border border-content rounded-border p-2 bg-surface-200 dark:bg-surface-900">
        <div class="font-bold mb-2">Preview Text</div>
        <div>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
          sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum.
        </div>
      </div>
      <h2>{{ $t('theme') }}</h2>
      <h3>{{ $t('default_theme') }}</h3>
      <p>{{ $t('adjust_theme_tip') }}</p>
      <div class="flex gap-2">
        <div class="flex flex-col gap-2 items-center">
          <label
            for="lightRadio"
            class="h-15 w-15 bg-surface-200 rounded-full cursor-pointer"
          ></label>
          <RadioButton v-model="currentThemeMode" inputId="lightRadio" value="light" />
        </div>
        <div class="flex flex-col gap-2 items-center">
          <label
            for="darkRadio"
            class="h-15 w-15 bg-surface-950 rounded-full cursor-pointer"
          ></label>
          <RadioButton v-model="currentThemeMode" inputId="darkRadio" value="dark" />
        </div>
        <div class="flex flex-col gap-2 items-center">
          <label
            for="autoRadio"
            class="flex items-center justify-center h-15 w-15 rounded-full border border-surface-500 cursor-pointer"
          >
            <div class="text-[12px]">{{ $t('auto') }}</div>
          </label>
          <RadioButton v-model="currentThemeMode" inputId="autoRadio" value="auto" />
        </div>
      </div>
    </div>
  </Page>
</template>

<script setup lang="ts">
import Page from '@/components/common/Page.vue'
import { useTheme } from '@/stores/theme'
import { ref, watch } from 'vue'
import { RadioButton } from 'primevue'

const theme = useTheme()

const currentThemeMode = ref(theme.theme)

watch(currentThemeMode, (newTheme) => {
  theme.switchTo(newTheme)
})
</script>
