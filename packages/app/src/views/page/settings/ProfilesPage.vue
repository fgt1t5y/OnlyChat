<template>
  <Page>
    <div class="w-setting-page mx-auto">
      <h1>Profiles</h1>
      <div v-if="auth.userShadow" class="flex gap-6">
        <div class="grow">
          <div class="flex flex-col gap-2">
            <label class="flex flex-col gap-2">
              <div>Display Name</div>
              <InputText v-model="auth.userShadow.displayName" name="displayName" />
            </label>
            <Divider />
            <div class="flex flex-col gap-2">
              <div>Avatar</div>
              <div class="flex gap-2">
                <Button label="Change Avatar" @click="showChangeAvatarModel = true" />
                <Button label="Remove Avatar" variant="text" @click="removeAvatar" />
              </div>
            </div>
            <Divider />
            <div class="flex flex-col gap-2">
              <div>Banner Color</div>
              <ColorPicker v-model="auth.userShadow.bannerColor" />
            </div>
            <Divider />
            <label class="flex flex-col gap-2">
              <div>Introduction</div>
              <div>You can use markdown and links if you’d like.</div>
              <Textarea
                v-model="auth.userShadow.introduction"
                name="introduction"
                rows="3"
                auto-resize
              />
            </label>
          </div>
        </div>
        <div style="max-width: 348px" class="w-full">
          <div>Preview</div>
          <div class="relative rounded-border overflow-hidden bg-surface-200 dark:bg-surface-800">
            <div
              :style="{ backgroundColor: `#${auth.userShadow.bannerColor}` }"
              class="h-banner"
            ></div>
            <div class="absolute left-3 top-15">
              <UserAvatar
                size="l"
                :user="auth.userShadow"
                :is-online="auth.userShadow.isOnline"
                bordered
              />
            </div>
            <div class="mx-3 mt-12">
              <div class="text-xl font-bold">{{ auth.userShadow.displayName }}</div>
              <div>{{ auth.userShadow.username }}</div>
            </div>
            <div v-if="auth.userShadow.introduction" class="m-3">
              <div v-html="markedInstance.parse(auth.userShadow.introduction)"></div>
            </div>
            <div class="flex flex-col m-3">
              <Button label="Example Button" severity="secondary" variant="outlined" />
            </div>
          </div>
        </div>
      </div>
      <Divider />
      <div class="flex gap-2 justify-end">
        <Button label="Reset" variant="text" :disabled="!hasChange" @click="resetChanges" />
        <Button label="Save Changes" :disabled="!hasChange" />
      </div>
    </div>
  </Page>
  <Dialog
    v-model:visible="showChangeAvatarModel"
    class="w-[400px]"
    header="Change Avatar"
    :draggable="false"
    modal
  >
    <div v-if="avatarFile && !imageCropperReady">
      <ProgressBar mode="indeterminate" style="height: 6px"></ProgressBar>
    </div>
    <div v-if="avatarFile" v-show="imageCropperReady" class="flex flex-col gap-2">
      <div class="flex justify-center p-2 bg-surface-200 dark:bg-surface-950 rounded-border">
        <Cropper
          ref="imageCropper"
          :image="avatarFile"
          @load="onImageCropperReady"
          @error="onImageCropperError"
        />
      </div>
      <div class="flex justify-end gap-2">
        <Button
          label="Cancel"
          severity="secondary"
          variant="outlined"
          @click="onImageCropperCancel"
        />
        <Button label="Crop and Apply" @click="onAvatarApplied" />
      </div>
    </div>
    <div v-show="!avatarFile" class="flex flex-col gap-2">
      <div class="flex flex-col">
        <Button label="Select an Image" @click="avatarFileInput?.click()" />
      </div>
      <div class="text-center text-muted-color">OR</div>
      <div
        ref="avatarFileDropZone"
        class="flex items-center justify-center h-[120px] border border-dashed border-content rounded-border"
      >
        <div class="text-muted-color">Drop a image here</div>
      </div>
      <input
        ref="avatarFileInput"
        class="hidden"
        type="file"
        accept=".jpg,.png,.jpeg"
        @change="onAvatarFileInputChange"
      />
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import Page from '@/components/common/Page.vue'
import UserAvatar from '@/components/avatar/UserAvatar.vue'
import Cropper from '@/components/image/Cropper.vue'
import { useAuth } from '@/stores/auth'
import { Button, Divider, Dialog, Textarea, InputText, ColorPicker, ProgressBar } from 'primevue'
import { markedInstance } from '@/utils'
import { computed, ref, useTemplateRef, watch } from 'vue'
import { useDropZone } from '@vueuse/core'

const auth = useAuth()

const imageCropper = useTemplateRef('imageCropper')
const avatarFileDropZone = useTemplateRef('avatarFileDropZone')
const avatarFileInput = useTemplateRef('avatarFileInput')
const showChangeAvatarModel = ref<boolean>(false)
const imageCropperReady = ref<boolean>(false)
const avatarFile = ref<File | null>(null)

const onAvatarFileDropped = (file: File | null) => {
  if (!file) {
    return
  }

  avatarFile.value = file
}

const onAvatarFileInputChange = () => {
  if (!avatarFileInput.value?.value) {
    return
  }

  avatarFile.value = avatarFileInput.value?.files?.[0] || null
}

const onImageCropperReady = () => {
  imageCropperReady.value = true
}

const onImageCropperError = (message: string) => {
  window.alert(message)

  imageCropper.value?.destroyCropper()

  avatarFile.value = null
  imageCropperReady.value = false

  if (avatarFileInput.value && avatarFile.value !== '') {
    avatarFileInput.value.value = ''
  }
}

const onImageCropperCancel = () => {
  imageCropper.value?.destroyCropper()

  avatarFile.value = null
  imageCropperReady.value = false

  if (avatarFileInput.value && avatarFile.value !== '') {
    avatarFileInput.value.value = ''
  }
}

const onAvatarApplied = async () => {
  const blob = await imageCropper.value?.getBlobAsync()

  if (!blob) {
    return
  }

  auth.userShadow!.avatarUrl = window.URL.createObjectURL(blob)

  imageCropper.value?.destroyCropper()

  avatarFile.value = null
  imageCropperReady.value = false

  if (avatarFileInput.value && avatarFile.value !== '') {
    avatarFileInput.value.value = ''
  }

  showChangeAvatarModel.value = false
}

const removeAvatar = () => {
  auth.userShadow!.avatarUrl = null
}

const resetChanges = () => {
  if (!auth.userShadow || !auth.user) {
    return
  }

  auth.userShadow.displayName = auth.user.displayName

  if (auth.userShadow.avatarUrl !== auth.user.avatarUrl) {
    URL.revokeObjectURL(auth.userShadow.avatarUrl!)
    auth.userShadow.avatarUrl = auth.user.avatarUrl
  }

  auth.userShadow.bannerColor = auth.user.bannerColor
  auth.userShadow.introduction = auth.user.introduction
}

const hasChange = computed(() => {
  if (!auth.userShadow || !auth.user) {
    return false
  }

  return (
    auth.userShadow.displayName !== auth.user.displayName ||
    auth.userShadow.avatarUrl !== auth.user.avatarUrl ||
    auth.userShadow.bannerColor !== auth.user.bannerColor ||
    auth.userShadow.introduction !== auth.user.introduction
  )
})

useDropZone(avatarFileDropZone, {
  onDrop: (file) => onAvatarFileDropped(file?.[0] || null),
  dataTypes: ['image/jpeg', 'image/png'],
  multiple: false,
})

watch(
  () => showChangeAvatarModel.value,
  (visible) => {
    if (!visible) {
      if (imageCropperReady.value) {
        imageCropper.value?.destroyCropper()
        imageCropperReady.value = false
      }

      avatarFile.value = null

      if (avatarFileInput.value && avatarFile.value !== '') {
        avatarFileInput.value.value = ''
      }
    }
  },
)
</script>
