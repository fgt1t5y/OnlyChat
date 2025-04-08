<template>
  <div class="flex h-screen">
    <nav class="flex min-w-[350px]">
      <menu class="w-[72px] border-r border-content">1</menu>
      <aside class="grow border-r border-content">
        <RouterView name="aside" />
      </aside>
    </nav>
    <main class="grow">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts"></script>
