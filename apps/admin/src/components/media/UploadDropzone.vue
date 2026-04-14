<template>
  <div
    class="relative border-2 border-dashed rounded-xl p-6 transition-colors text-center cursor-pointer"
    :class="isDragging ? 'border-brand-400 bg-brand-50 dark:bg-brand-950/20' : 'border-gray-300 dark:border-gray-600 hover:border-brand-400'"
    @dragover.prevent="isDragging = true"
    @dragleave="isDragging = false"
    @drop.prevent="handleDrop"
    @click="fileInput?.click()"
  >
    <UploadCloud class="w-8 h-8 mx-auto mb-2 text-gray-400" />
    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
      Drag & drop files here or <span class="text-brand-500">browse</span>
    </p>
    <p class="text-xs text-gray-400 mt-1">PNG, JPG, GIF, WebP, SVG up to 10MB</p>
    <input ref="fileInput" type="file" class="hidden" multiple accept="image/*,video/*" @change="handleChange" />
    <div v-if="uploading" class="mt-3">
      <div class="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div class="h-full bg-brand-500 rounded-full animate-pulse transition-all" style="width: 60%" />
      </div>
      <p class="text-xs text-gray-400 mt-1">Uploading...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { UploadCloud } from 'lucide-vue-next'

const emit = defineEmits<{ upload: [File[]] }>()

const isDragging = ref(false)
const uploading = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

function handleDrop(e: DragEvent) {
  isDragging.value = false
  const files = Array.from(e.dataTransfer?.files ?? [])
  if (files.length) processFiles(files)
}

function handleChange(e: Event) {
  const files = Array.from((e.target as HTMLInputElement).files ?? [])
  if (files.length) processFiles(files)
}

async function processFiles(files: File[]) {
  uploading.value = true
  emit('upload', files)
  await new Promise(r => setTimeout(r, 1000))
  uploading.value = false
  if (fileInput.value) fileInput.value.value = ''
}
</script>
