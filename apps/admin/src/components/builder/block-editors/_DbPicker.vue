<template>
  <div>
    <div class="mb-2">
      <input v-model="search" class="form-input text-sm" :placeholder="`Search ${label}...`" />
    </div>
    <div v-if="loading" class="py-4 text-center text-xs text-gray-400">Loading…</div>
    <div v-else class="space-y-1 max-h-56 overflow-y-auto pr-1">
      <label
        v-for="item in filtered" :key="item.id"
        class="flex items-center gap-2.5 p-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        :class="selected.has(item.id) ? 'bg-brand-50 dark:bg-brand-950/40' : ''"
      >
        <input type="checkbox" :checked="selected.has(item.id)" @change="toggle(item.id)" class="rounded accent-brand-600" />
        <div class="flex items-center gap-2 min-w-0">
          <img v-if="item.imageUrl" :src="item.imageUrl" class="w-7 h-7 rounded object-cover flex-shrink-0" />
          <div v-else-if="item.icon" class="w-7 h-7 rounded bg-brand-100 dark:bg-brand-950/50 flex items-center justify-center text-sm flex-shrink-0">{{ item.icon }}</div>
          <div class="min-w-0">
            <p class="text-xs font-medium truncate text-gray-900 dark:text-gray-100">{{ item.title || item.name || item.authorName || item.question }}</p>
            <p v-if="item.sub" class="text-[10px] text-gray-400 truncate">{{ item.sub }}</p>
          </div>
        </div>
      </label>
      <p v-if="filtered.length === 0 && !loading" class="py-3 text-center text-xs text-gray-400">No {{ label }} found</p>
    </div>
    <p class="mt-1 text-[10px] text-gray-400">{{ selected.size }} selected</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { api } from '@/lib/api'

interface PickerItem {
  id: string
  title?: string
  name?: string
  authorName?: string
  question?: string
  imageUrl?: string
  icon?: string
  sub?: string
}

const props = defineProps<{
  entity: string    // 'courses' | 'testimonials' | 'team' | 'services-entity' | 'faqs'
  label: string
  modelValue: string[]
}>()
const emit = defineEmits<{ 'update:modelValue': [string[]] }>()

const items = ref<PickerItem[]>([])
const loading = ref(true)
const search = ref('')
const selected = computed(() => new Set(props.modelValue))

onMounted(async () => {
  try {
    const data = await api.get<{ data: any[] }>(`/${props.entity}?limit=200`)
    items.value = (data.data ?? []).map(normalise)
  } finally {
    loading.value = false
  }
})

function normalise(raw: any): PickerItem {
  return {
    id: String(raw.id),
    title: raw.title ?? raw.name ?? raw.author_name ?? raw.authorName ?? raw.question,
    name: raw.name,
    authorName: raw.author_name ?? raw.authorName,
    question: raw.question,
    imageUrl: raw.image_url ?? raw.imageUrl ?? raw.image ?? raw.avatar_url ?? raw.avatarUrl ?? null,
    icon: raw.icon ?? null,
    sub: raw.short_description ?? raw.shortDescription ?? raw.role ?? raw.author_role ?? raw.authorRole ?? raw.category ?? null,
  }
}

const filtered = computed(() =>
  search.value
    ? items.value.filter(i =>
        (i.title ?? '').toLowerCase().includes(search.value.toLowerCase()) ||
        (i.sub ?? '').toLowerCase().includes(search.value.toLowerCase())
      )
    : items.value
)

function toggle(id: string) {
  const next = new Set(props.modelValue)
  next.has(id) ? next.delete(id) : next.add(id)
  emit('update:modelValue', [...next])
}
</script>
