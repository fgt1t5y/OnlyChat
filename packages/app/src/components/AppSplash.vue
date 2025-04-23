<template>
  <div class="h-screen w-full flex flex-col gap-2 justify-center items-center">
    <div class="text-2xl text-center text-primary">OnlyChat</div>
    <div id="app-loading" class="text-muted-color">App is loading.</div>
    <ProgressBar
      mode="indeterminate"
      style="height: 6px; width: 300px"
      aria-labelledby="app-loading"
    />
  </div>
</template>

<script setup lang="ts">
import { ProgressBar } from 'primevue'

defineOptions({
  name: 'AppSplash',
})
</script>
