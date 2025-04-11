<template>
  <div class="flex gap-2 fixed bottom-3 right-3 p-3">
    <Button
      label="Socket CON"
      severity="secondary"
      icon="ti ti-tool"
      size="small"
      rounded
      @click="ws.connectAsync()"
    />
    <Button
      label="Socket DIS"
      severity="secondary"
      icon="ti ti-tool"
      size="small"
      rounded
      @click="ws.disconnect()"
    />
  </div>
</template>

<script setup lang="ts">
import { useSocketIO } from '@/stores/socket'
import { Button } from 'primevue'

defineOptions({
  name: 'DebugBar',
})

const ws = useSocketIO()
</script>
