<template>
  <Page>
    <div>Chat</div>
  </Page>
</template>

<script setup lang="ts">
import Page from '@/components/common/Page.vue'
import { onActivated } from 'vue'

onActivated(() => {
  document.title = 'OnlyChat | Server Chat'
})
</script>
