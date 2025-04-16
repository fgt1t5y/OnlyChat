<template>
  <Page>
    <div class="w-setting-page mx-auto">
      <PageTitle title="Theme" icon="ti ti-shirt" />
      <Fieldset legend="Theme Mode">
        <SelectButton
          option-label="label"
          option-value="value"
          :options="themeModeList"
          :model-value="theme.theme"
          @change="theme.switchTo($event.value)"
        />
      </Fieldset>
    </div>
  </Page>
</template>

<script setup lang="ts">
import Page from '@/components/common/Page.vue'
import PageTitle from '@/components/common/PageTitle.vue'
import { useTheme } from '@/stores/theme'
import { Fieldset, SelectButton } from 'primevue'
import { ref } from 'vue'

const theme = useTheme()

const themeModeList = ref([
  {
    label: 'Auto',
    value: 'auto',
  },
  {
    label: 'Light',
    value: 'light',
  },
  {
    label: 'Dark',
    value: 'dark',
  },
])
</script>
