<template>
  <div class="flex gap-2 mb-4 p-2">
    <Skeleton shape="circle" size="40px"></Skeleton>
    <div class="grow">
      <Skeleton class="mb-2"></Skeleton>
      <Skeleton width="10rem" class="mb-2"></Skeleton>
    </div>
  </div>
  <div class="flex gap-2 mb-4 p-2">
    <Skeleton shape="circle" size="40px"></Skeleton>
    <div class="grow">
      <Skeleton class="mb-2"></Skeleton>
      <Skeleton width="10rem" class="mb-2"></Skeleton>
    </div>
  </div>
  <div class="flex gap-2 mb-4 p-2">
    <Skeleton shape="circle" size="40px"></Skeleton>
    <div class="grow">
      <Skeleton class="mb-2"></Skeleton>
      <Skeleton width="10rem" class="mb-2"></Skeleton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Skeleton } from 'primevue'
</script>
