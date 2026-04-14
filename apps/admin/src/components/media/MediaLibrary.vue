<template>
  <div class="space-y-4">
    <!-- Upload Dropzone -->
    <UploadDropzone @upload="handleUpload" />
    <!-- Search -->
    <div class="relative">
      <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input v-model="search" class="form-input pl-9" placeholder="Search media..." />
    </div>
    <!-- Grid -->
    <div v-if="store.isLoading" class="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
      <div v-for="i in 12" :key="i" class="aspect-square rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
    </div>
    <div v-else-if="filtered.length === 0" class="text-center py-16 text-gray-400">
      <ImageIcon class="w-12 h-12 mx-auto mb-3 opacity-30" />
      <p class="text-sm">No media found</p>
    </div>
    <div v-else class="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
      <div v-for="item in filtered" :key="item.id"
        class="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-pointer ring-2 transition-all"
        :class="selected.has(item.id) ? 'ring-brand-500' : 'ring-transparent hover:ring-brand-300'"
        @click="toggleSelect(item)"
      >
        <img :src="item.url" :alt="item.alt" class="w-full h-full object-cover" loading="lazy" />
        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
          <p class="text-white text-xs truncate">{{ item.filename }}</p>
        </div>
        <div v-if="selected.has(item.id)" class="absolute top-2 right-2 w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center">
          <Check class="w-3 h-3 text-white" />
        </div>
        <!-- Delete button -->
        <button @click.stop="confirmDelete(item)" class="absolute top-2 left-2 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity">
          <Trash2 class="w-3 h-3" />
        </button>
      </div>
    </div>
    <!-- Pagination hint -->
    <p class="text-xs text-center text-gray-400">Showing {{ filtered.length }} items</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Search, Image as ImageIcon, Check, Trash2 } from 'lucide-vue-next'
import { useMediaStore } from '@/stores/media'
import { useToast } from '@/composables/useToast'
import UploadDropzone from './UploadDropzone.vue'
import type { MediaItem } from '@shared/types'

const props = defineProps<{ multiple?: boolean; selectedIds?: string[] }>()
const emit = defineEmits<{ select: [MediaItem[]]; delete: [string] }>()

const store = useMediaStore()
const toast = useToast()
const search = ref('')
const selected = ref<Set<string>>(new Set(props.selectedIds ?? []))

const filtered = computed(() =>
  store.items.filter(i => !search.value || i.filename.toLowerCase().includes(search.value.toLowerCase()) || i.alt.toLowerCase().includes(search.value.toLowerCase()))
)

onMounted(() => store.fetchMedia())

function toggleSelect(item: MediaItem) {
  if (!props.multiple) {
    selected.value.clear()
    selected.value.add(item.id)
  } else {
    if (selected.value.has(item.id)) selected.value.delete(item.id)
    else selected.value.add(item.id)
  }
  const selectedItems = store.items.filter(i => selected.value.has(i.id))
  emit('select', selectedItems)
}

async function handleUpload(files: File[]) {
  for (const file of files) {
    await store.uploadMedia(file)
  }
  toast.success(`Uploaded ${files.length} file(s)`)
}

async function confirmDelete(item: MediaItem) {
  if (!confirm(`Delete "${item.filename}"?`)) return
  await store.deleteMedia(item.id)
  toast.success('Media deleted')
  emit('delete', item.id)
}
</script>
