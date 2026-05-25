<template>
  <div class="space-y-2">
    <label v-if="label" class="form-label">{{ label ?? 'Image' }}</label>
    <div v-if="value?.url" class="relative">
      <img :src="value.url" :alt="value.alt" class="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-700" />
      <button @click="$emit('update', undefined)" class="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600">
        <X class="w-3.5 h-3.5" />
      </button>
    </div>
    <!-- Upload / Pick buttons -->
    <div class="flex gap-2">
      <label class="btn-outline text-xs gap-1.5 flex-1 cursor-pointer flex items-center justify-center">
        <Upload class="w-3.5 h-3.5" />
        Upload
        <input type="file" accept="image/*" class="hidden" @change="onUpload" />
      </label>
      <button class="btn-outline text-xs gap-1.5 flex-1" @click="showPicker = true">
        <ImageIcon class="w-3.5 h-3.5" />
        {{ value?.url ? 'Change' : 'Pick' }}
      </button>
    </div>
    <div v-if="uploading" class="text-xs text-brand-500 flex items-center gap-1.5">
      <div class="w-3 h-3 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      Uploading…
    </div>
    <input
      v-if="value?.url"
      v-model="altText"
      @input="updateAlt"
      class="form-input text-xs"
      placeholder="Alt text (for accessibility)"
    />
    <MediaPicker v-model="showPicker" @select="onSelect" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { X, Image as ImageIcon, Upload } from 'lucide-vue-next'
import MediaPicker from '@/components/media/MediaPicker.vue'
import { api } from '@/lib/api'
import type { BlockImage, MediaItem } from '@shared/types'

const props = defineProps<{
  value?: BlockImage
  label?: string
  folder?: string
}>()
const emit = defineEmits<{ update: [BlockImage | undefined] }>()

const showPicker = ref(false)
const altText = ref(props.value?.alt ?? '')
const uploading = ref(false)

watch(() => props.value, v => { altText.value = v?.alt ?? '' })

function onSelect(item: MediaItem) {
  emit('update', { url: item.url, alt: item.alt ?? '' })
  showPicker.value = false
}

function updateAlt() {
  if (props.value) emit('update', { ...props.value, alt: altText.value })
}

async function onUpload(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  uploading.value = true
  try {
    const fd = new FormData()
    fd.append('file', file)
    if (props.folder) fd.append('folder', props.folder)
    const res = await api.post<{ data: { url: string; alt: string } }>('/media/upload', fd)
    emit('update', { url: res.data.url, alt: res.data.alt || file.name })
  } catch (err) {
    console.error('Upload failed', err)
  } finally {
    uploading.value = false
  }
}
</script>
