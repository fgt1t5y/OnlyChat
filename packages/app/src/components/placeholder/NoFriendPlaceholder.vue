<template>
  <div class="flex flex-col gap-2 items-center my-6 text-muted-color">
    <i class="ti ti-users text-4xl"></i>
    <div>{{ $t('no_friend_yet') }}</div>
    <RouterLink :to="{ name: 'add_friend' }">
      <Button :label="$t('add_friend')" />
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { Button } from 'primevue'

defineOptions({
  name: 'NoFriendPlaceholder',
})
</script>
