<template>
  <Page>
    <PageTitle title="Find Friend" icon="ti ti-user-search" />
    <InputGroup>
      <InputGroupAddon>
        <i class="ti ti-search"></i>
      </InputGroupAddon>
      <InputText placeholder="Search username here..." fluid />
      <Button label="Search" />
    </InputGroup>
    <SearchPlaceholder />
  </Page>
</template>

<script setup lang="ts">
import Page from '@/components/common/Page.vue'
import PageTitle from '@/components/PageTitle.vue'
import SearchPlaceholder from '@/components/placeholder/SearchPlaceholder.vue'
import { Button, InputGroup, InputText, InputIcon, InputGroupAddon } from 'primevue'
</script>
