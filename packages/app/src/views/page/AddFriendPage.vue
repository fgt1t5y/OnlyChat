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
        <Button label="Search" type="submit" icon="ti ti-search" :loading="finding" />
      </InputGroup>
    </form>
    <div v-if="foundItems">
      <div class="text-muted-color px-2">Hitted {{ foundItems.length }} user(s)</div>
      <ul v-if="foundItems.length">
        <li v-for="item in foundItems" class="list-Item flex items-center gap-2">
          <UserAvatar :user="item" />
          <div class="grow">
            <div class="font-bold">{{ item.displayName }}</div>
            <div class="text-muted-color">@{{ item.username }}</div>
          </div>
          <Button label="Send request" severity="secondary" />
        </li>
      </ul>
    </div>
    <SearchPlaceholder v-else />
  </Page>
</template>

<script setup lang="ts">
import apis from '@/apis'
import Page from '@/components/common/Page.vue'
import PageTitle from '@/components/PageTitle.vue'
import UserAvatar from '@/components/UserAvatar.vue'
import SearchPlaceholder from '@/components/placeholder/SearchPlaceholder.vue'
import { useRequest } from 'alova/client'
import { Button, InputGroup, InputText } from 'primevue'
import { ref } from 'vue'

const searchKeyword = ref<string>('')

const {
  data: foundItems,
  loading: finding,
  send: find,
} = useRequest(apis.user.find, { immediate: false })

const handleSearch = () => {
  if (!searchKeyword) {
    return
  }

  find(searchKeyword.value)
}
</script>
