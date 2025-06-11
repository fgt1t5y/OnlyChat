<template>
  <Page>
    <div class="w-setting-page mx-auto">
      <h1>{{ $t('settings.profiles') }}</h1>
      <div v-if="auth.userShadow" class="flex gap-6">
        <div class="grow">
          <div class="flex flex-col gap-2">
            <label class="flex flex-col gap-2">
              <div>{{ $t('display_name') }}</div>
              <InputText
                v-model="auth.userShadow.displayName"
                name="displayName"
                :placeholder="auth.userShadow.username"
              />
            </label>
            <Divider />
            <div class="flex flex-col gap-2">
              <div>{{ $t('avatar') }}</div>
              <div class="flex gap-2">
                <Button
                  :disabled="avatarUploading"
                  :label="$t('change_avatar')"
                  @click="showChangeAvatarModel = true"
                />
                <Button
                  variant="text"
                  :disabled="avatarUploading"
                  :label="$t('remove_avatar')"
                  @click="removeAvatar"
                />
              </div>
            </div>
            <Divider />
            <div class="flex flex-col gap-2">
              <div>{{ $t('banner_color') }}</div>
              <div class="flex gap-2 items-center">
                <ColorPicker v-model="auth.userShadow.bannerColor" />
                <InputText
                  class="w-20 select-all"
                  size="small"
                  maxlength="6"
                  :default-value="auth.userShadow.bannerColor"
                  @update:model-value="onColorHexInputUpdate"
                />
                <Button
                  v-if="isSupported"
                  icon="ti ti-color-picker"
                  size="small"
                  severity="secondary"
                  rounded
                  :title="$t('pick_color_from_screen')"
                  :aria-label="$t('pick_color_from_screen')"
                  @click="pickColorFromScreen"
                />
              </div>
            </div>
            <Divider />
            <label class="flex flex-col gap-2">
              <div>{{ $t('introduction') }}</div>
              <div>{{ $t('markdown_supported_tip') }}</div>
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
          <div class="mb-2">{{ $t('preview') }}</div>
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
              <div class="text-xl font-bold">
                {{ auth.userShadow.displayName || auth.userShadow.username }}
              </div>
              <div>{{ auth.userShadow.username }}</div>
            </div>
            <div v-if="auth.userShadow.introduction" class="m-3">
              <MarkdownBlock :text="auth.userShadow.introduction" inline />
            </div>
            <div class="flex flex-col m-3">
              <Button severity="secondary" variant="outlined" :label="$t('example_button')" />
            </div>
          </div>
        </div>
      </div>
      <Divider />
      <div class="flex gap-2 justify-end">
        <Button variant="text" :disabled="!hasChange" :label="$t('reset')" @click="resetChanges" />
        <Button
          :label="$t('save_changes')"
          :disabled="!hasChange"
          :loading="avatarUploading || profileUpdating"
          @click="saveChanges"
        />
      </div>
    </div>
  </Page>
  <Dialog
    v-model:visible="showChangeAvatarModel"
    class="w-[400px]"
    modal
    :header="$t('change_avatar')"
    :draggable="false"
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
          severity="secondary"
          variant="outlined"
          :label="$t('cancel')"
          @click="onImageCropperCancel"
        />
        <Button :label="$t('crop_and_apply')" @click="onAvatarApplied" />
      </div>
    </div>
    <div v-show="!avatarFile" class="flex flex-col gap-2">
      <div
        ref="avatarFileDropZone"
        class="flex items-center justify-center h-[120px] border border-dashed border-content rounded-border"
      >
        <div class="text-muted-color">{{ $t('drop_an_image_here') }}</div>
      </div>
      <div class="text-center text-muted-color">{{ $t('or') }}</div>
      <div class="flex flex-col">
        <Button :label="$t('action.pick_image')" @click="avatarFileInput?.click()" />
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
import * as apis from '@/apis'
import Page from '@/components/common/Page.vue'
import UserAvatar from '@/components/avatar/UserAvatar.vue'
import Cropper from '@/components/image/Cropper.vue'
import MarkdownBlock from '@/components/common/MarkdownBlock.vue'
import { useAuth } from '@/stores/auth'
import { Button, Divider, Dialog, Textarea, InputText, ColorPicker, ProgressBar } from 'primevue'
import { computed, onDeactivated, ref, useTemplateRef, watch } from 'vue'
import { useDropZone, useEyeDropper } from '@vueuse/core'
import { useToast } from 'primevue/usetoast'
import { useRequest } from 'alova/client'

const auth = useAuth()
const toast = useToast()

const imageCropper = useTemplateRef('imageCropper')
const avatarFileDropZone = useTemplateRef('avatarFileDropZone')
const avatarFileInput = useTemplateRef('avatarFileInput')
const showChangeAvatarModel = ref<boolean>(false)
const imageCropperReady = ref<boolean>(false)
const avatarFile = ref<File | null>(null)
const cropoedAvatarFileBlob = ref<Blob | null>(null)

const { send: uploadAvatar, loading: avatarUploading } = useRequest(apis.uploadAvatar, {
  immediate: false,
})

const { send: updateProfiles, loading: profileUpdating } = useRequest(apis.updateProfiles, {
  immediate: false,
})

const { isSupported, sRGBHex, open: openColorPicker } = useEyeDropper()

const pickColorFromScreen = () => {
  openColorPicker()
}

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

  if (avatarFileInput.value) {
    avatarFileInput.value.value = ''
  }
}

const onAvatarApplied = async () => {
  const blob = await imageCropper.value?.getBlobAsync()

  if (!blob) {
    return
  }

  cropoedAvatarFileBlob.value = blob
  auth.userShadow!.avatarUrl = window.URL.createObjectURL(blob)

  imageCropper.value?.destroyCropper()

  avatarFile.value = null
  imageCropperReady.value = false

  if (avatarFileInput.value) {
    avatarFileInput.value.value = ''
  }

  showChangeAvatarModel.value = false
}

const onColorHexInputUpdate = (value: string | undefined) => {
  if (!value || value.length < 6 || value.startsWith('#')) {
    return
  }

  auth.userShadow!.bannerColor = value
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
    cropoedAvatarFileBlob.value = null
  }

  auth.userShadow.bannerColor = auth.user.bannerColor
  auth.userShadow.introduction = auth.user.introduction
}

const saveChanges = async () => {
  if (!hasChange.value) {
    return
  }

  if (cropoedAvatarFileBlob.value) {
    try {
      const uploadResult = await uploadAvatar(cropoedAvatarFileBlob.value)

      if (uploadResult && uploadResult.avatarUrl) {
        URL.revokeObjectURL(auth.userShadow!.avatarUrl!)

        cropoedAvatarFileBlob.value = null
        auth.userShadow!.avatarUrl = uploadResult.avatarUrl
      }
    } catch {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to upload avatar',
      })
    }
  }

  try {
    await updateProfiles({
      displayName: auth.userShadow!.displayName,
      avatarUrl: auth.userShadow!.avatarUrl,
      bannerColor: auth.userShadow!.bannerColor,
      introduction: auth.userShadow!.introduction,
    })

    auth.user!.displayName = auth.userShadow!.displayName
    auth.user!.avatarUrl = auth.userShadow!.avatarUrl
    auth.user!.bannerColor = auth.userShadow!.bannerColor
    auth.user!.introduction = auth.userShadow!.introduction
  } catch {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to update profile',
    })
  }
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

      if (avatarFileInput.value) {
        avatarFileInput.value.value = ''
      }
    }
  },
)

watch(
  () => sRGBHex.value,
  (colorHex) => {
    if (!auth.userShadow) {
      return
    }

    auth.userShadow.bannerColor = colorHex.slice(1) // Remove the leading '#'
  },
)

onDeactivated(resetChanges)
</script>
