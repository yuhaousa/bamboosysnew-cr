<template>
  <div class="space-y-2">
    <!-- Preview -->
    <div v-if="modelValue" class="relative inline-flex items-start gap-2 group">
      <div class="relative">
        <img
          :src="modelValue"
          class="h-20 w-auto max-w-[160px] rounded-lg border border-gray-200 dark:border-gray-700 object-cover bg-gray-50 dark:bg-gray-800"
          :class="rounded ? 'rounded-full !w-20' : ''"
        />
        <button
          @click="clear"
          class="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity"
          title="Remove image"
        >✕</button>
      </div>
    </div>

    <!-- Buttons row -->
    <div class="flex flex-wrap gap-2">
      <!-- Upload -->
      <label class="btn-secondary text-xs cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg">
        <UploadCloud class="w-3.5 h-3.5" />
        Upload
        <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleUpload" :disabled="uploading" />
      </label>
      <!-- Pick from library -->
      <button @click="showModal = true" class="btn-secondary text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg">
        <Images class="w-3.5 h-3.5" />
        Choose from Library
      </button>
    </div>
    <p v-if="uploading" class="text-xs text-brand-500 animate-pulse">Uploading…</p>

    <!-- Media picker modal -->
    <AppModal v-model="showModal" :title="`Choose Image — ${folderLabel}`" size="xl">
      <div class="p-4">
        <MediaLibrary :multiple="false" :initial-folder="folder" @select="onPick" />
      </div>
      <template #footer>
        <button @click="showModal = false" class="btn-secondary text-sm">Cancel</button>
      </template>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { UploadCloud, Images } from 'lucide-vue-next'
import AppModal from '@/components/common/AppModal.vue'
import MediaLibrary from '@/components/media/MediaLibrary.vue'
import { useMediaStore } from '@/stores/media'
import { useToast } from '@/composables/useToast'
import type { MediaItem } from '@shared/types'

const props = defineProps<{
  modelValue?: string
  folder?: string        // 'courses' | 'testimonials' | 'team' | 'portfolio' | 'services' | 'general'
  rounded?: boolean      // show as circle (avatars)
}>()

const emit = defineEmits<{ 'update:modelValue': [string] }>()

const store = useMediaStore()
const toast = useToast()
const showModal = ref(false)
const uploading = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const folderLabel = computed(() => {
  const map: Record<string, string> = {
    courses: 'Courses', testimonials: 'Testimonials', team: 'Team',
    portfolio: 'Portfolio', services: 'Services', general: 'General',
  }
  return map[props.folder ?? 'general'] ?? 'Media'
})

function clear() {
  emit('update:modelValue', '')
}

async function handleUpload(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  uploading.value = true
  try {
    const item = await store.uploadMedia(file, undefined, props.folder ?? 'general')
    emit('update:modelValue', item.url)
    toast.success('Image uploaded')
  } catch (err: any) {
    toast.error(err.message ?? 'Upload failed')
  } finally {
    uploading.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}

function onPick(items: MediaItem[]) {
  if (items[0]) {
    emit('update:modelValue', items[0].url)
    showModal.value = false
  }
}
</script>
