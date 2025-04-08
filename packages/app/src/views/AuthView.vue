<template>
  <div class="flex h-screen w-full justify-center items-center">
    <div class="w-[400px]">
      <div class="text-2xl text-center text-primary mb-6">OnlyChat</div>
      <form class="flex flex-col gap-2" @submit.prevent.stop="handleSubmit">
        <div class="form-field">
          <Field
            name="username"
            :validators="{
              onChange: ({ value }) => (!value ? `Username is required` : undefined),
            }"
          >
            <template v-slot="{ field, state }">
              <label :for="field.name">Username</label>
              <input
                class="input"
                type="text"
                :name="field.name"
                :id="field.name"
                :value="field.state.value"
                @input="field.handleChange(($event.target as HTMLInputElement).value)"
                @blur="field.handleBlur"
              />
              <FieldError :state="state" />
            </template>
          </Field>
        </div>
        <div class="form-field">
          <Field
            name="password"
            :validators="{
              onChange: ({ value }) =>
                !value
                  ? `Password is required`
                  : value.length < 8
                    ? `Password must be at least 8 characters`
                    : undefined,
            }"
          >
            <template v-slot="{ field, state }">
              <label :for="field.name">Password</label>
              <input
                class="input"
                type="password"
                :name="field.name"
                :id="field.name"
                :value="field.state.value"
                @input="(e) => field.handleChange((e.target as HTMLInputElement).value)"
                @blur="field.handleBlur"
              />
              <FieldError :state="state" />
            </template>
          </Field>
        </div>
        <Subscribe>
          <template v-slot="{ canSubmit }">
            <button class="btn-primary btn-md" type="submit" :disabled="!canSubmit || loading">
              Login
            </button>
          </template>
        </Subscribe>
        <div v-if="error?.message" class="form-field-error">{{ error.message }}</div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useForm } from '@tanstack/vue-form'
import { useRequest } from 'alova/client'
import FieldError from '@/components/form/FieldError.vue'
import apis from '@/apis'
import { useRouter } from 'vue-router'
import { useAuth } from '@/stores/auth'

const auth = useAuth()
const router = useRouter()

const {
  data,
  error,
  loading,
  send: sendLogin,
} = useRequest(apis.auth.login, { immediate: false }).onSuccess(() => {
  if (data.value.token) {
    auth.setAccessToken(data.value.token)
    router.replace({ name: 'home' })
  }
})

const { Field, Subscribe, handleSubmit } = useForm({
  defaultValues: {
    username: '',
    password: '',
  },
  onSubmit: async ({ value }) => {
    sendLogin(value)
  },
})
</script>
