<template>
  <div class="space-y-4">
    <!-- Folder tabs -->
    <div class="flex flex-wrap gap-1 border-b border-gray-200 dark:border-gray-700 pb-2">
      <button
        v-for="f in folders" :key="f.value"
        @click="setFolder(f.value)"
        class="px-3 py-1 text-xs font-semibold rounded-full transition-colors"
        :class="activeFolder === f.value
          ? 'bg-brand-500 text-white'
          : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'"
      >{{ f.label }}</button>
    </div>
    <!-- Upload Dropzone -->
    <UploadDropzone @upload="handleUpload" />
    <!-- Search -->
    <div class="relative">
      <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input v-model="search" @input="onSearch" class="form-input pl-9" placeholder="Search media..." />
    </div>
    <!-- Grid -->
    <div v-if="store.loading" class="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
      <div v-for="i in 12" :key="i" class="aspect-square rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
    </div>
    <div v-else-if="store.items.length === 0" class="text-center py-16 text-gray-400">
      <ImageIcon class="w-12 h-12 mx-auto mb-3 opacity-30" />
      <p class="text-sm">No media found</p>
    </div>
    <div v-else class="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
      <div v-for="item in store.items" :key="item.id"
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
        <!-- Folder badge -->
        <div v-if="activeFolder === 'all'" class="absolute bottom-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-black/60 text-white">
          {{ itemFolder(item) }}
        </div>
        <!-- Delete button -->
        <button @click.stop="confirmDelete(item)" class="absolute top-2 left-2 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity">
          <Trash2 class="w-3 h-3" />
        </button>
      </div>
    </div>
    <!-- Pagination hint -->
    <p class="text-xs text-center text-gray-400">Showing {{ store.items.length }} of {{ store.total }} items</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Search, Image as ImageIcon, Check, Trash2 } from 'lucide-vue-next'
import { useMediaStore } from '@/stores/media'
import { useToast } from '@/composables/useToast'
import UploadDropzone from './UploadDropzone.vue'
import type { MediaItem } from '@shared/types'

const props = defineProps<{ multiple?: boolean; selectedIds?: string[]; initialFolder?: string }>()
const emit = defineEmits<{ select: [MediaItem[]]; delete: [string] }>()

const store = useMediaStore()
const toast = useToast()
const search = ref('')
const selected = ref<Set<string>>(new Set(props.selectedIds ?? []))
const activeFolder = ref(props.initialFolder ?? 'all')

const folders = [
  { value: 'all', label: 'All' },
  { value: 'general', label: 'General' },
  { value: 'courses', label: 'Courses' },
  { value: 'testimonials', label: 'Testimonials' },
  { value: 'team', label: 'Team' },
  { value: 'portfolio', label: 'Portfolio' },
  { value: 'services', label: 'Services' },
]

onMounted(() => reload())

function reload() {
  store.fetchMedia({
    folder: activeFolder.value !== 'all' ? activeFolder.value : undefined,
    search: search.value || undefined,
  })
}

function itemFolder(item: MediaItem) {
  return (item as MediaItem & { folder?: string }).folder ?? 'general'
}

function setFolder(f: string) {
  activeFolder.value = f
  reload()
}

let searchTimer: ReturnType<typeof setTimeout>
function onSearch() {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(reload, 300)
}

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
  const folder = activeFolder.value !== 'all' ? activeFolder.value : 'general'
  for (const file of files) {
    await store.uploadMedia(file, undefined, folder)
  }
  toast.success(`Uploaded ${files.length} file(s) to ${folder}`)
}

async function confirmDelete(item: MediaItem) {
  if (!confirm(`Delete "${item.filename}"?`)) return
  await store.deleteMedia(item.id)
  toast.success('Media deleted')
  emit('delete', item.id)
}
</script>
