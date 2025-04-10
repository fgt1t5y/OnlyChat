<template>
  <Page>
    <PageTitle title="Add Friend" icon="ti ti-user-search" />
    <form @submit.prevent.stop="handleSearch">
      <InputGroup>
        <InputText
          v-model="searchKeyword"
          placeholder="Search username here..."
          autofocus
          fluid
          required
        />
        <Button label="Search" type="submit" icon="ti ti-search" :loading="loading" />
      </InputGroup>
    </form>
    <div v-if="hittedItems">
      <div class="text-muted-color">Hitted {{ hittedItems.length }} user(s)</div>
      <ul v-if="hittedItems.length">
        <FindFriendItem v-for="item in hittedItems" :key="item.id" :item="item" />
      </ul>
    </div>
    <SearchPlaceholder v-else />
  </Page>
</template>

<script setup lang="ts">
import apis from '@/apis'
import Page from '@/components/common/Page.vue'
import PageTitle from '@/components/PageTitle.vue'
import FindFriendItem from '@/components/list-item/FindFriendItem.vue'
import SearchPlaceholder from '@/components/placeholder/SearchPlaceholder.vue'
import { useRequest } from 'alova/client'
import { Button, InputGroup, InputText } from 'primevue'
import { ref } from 'vue'

const searchKeyword = ref<string>('')

const { data: hittedItems, loading, send } = useRequest(apis.user.find, { immediate: false })

const handleSearch = () => {
  if (!searchKeyword) {
    return
  }

  send(searchKeyword.value)
}
</script>
