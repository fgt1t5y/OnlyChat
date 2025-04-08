<template>
  <div class="flex h-screen w-full justify-center items-center">
    <div class="w-[400px]">
      <div class="text-2xl text-center text-primary mb-6">OnlyChat</div>
      <form class="flex flex-col gap-2" @submit.prevent="console.log(12)">
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
                @input="(e) => field.handleChange((e.target as HTMLInputElement).value)"
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
          <template v-slot="{ canSubmit, isSubmitting }">
            <button class="btn-primary btn-md" type="submit" :disabled="!canSubmit || isSubmitting">
              Login
            </button>
          </template>
        </Subscribe>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useForm } from '@tanstack/vue-form'
import FieldError from '@/components/form/FieldError.vue'

const { Field, Subscribe } = useForm({
  defaultValues: {
    username: '',
    password: '',
  },
})

// const loginUser = async () => {
//   loading.value = true;
//   const res = await login(username.value, password.value);

//   if (res.success) {
//     if (res.data.token) {
//       localStorage.setItem("nmToken", res.data.token);
//     }
//     router.replace({ name: "welcome" });
//   } else {
//     errorMessage.value = res.message || "";
//     loading.value = false;
//   }
// };
</script>
