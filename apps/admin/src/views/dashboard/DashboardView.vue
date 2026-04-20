<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Welcome back! Here's an overview of your website.</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="stat in stats" :key="stat.label" class="card flex items-center gap-4">
        <div :class="`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${stat.iconBg}`">
          <component :is="stat.icon" :class="`w-6 h-6 ${stat.iconColor}`" />
        </div>
        <div>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">
            <span v-if="isLoading" class="inline-block w-8 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <template v-else>{{ stat.value }}</template>
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ stat.label }}</p>
        </div>
      </div>
    </div>

    <!-- Main grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Recent Pages -->
      <div class="lg:col-span-2 card">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-semibold text-gray-900 dark:text-white">Recent Pages</h2>
          <RouterLink to="/pages" class="text-sm text-brand-500 hover:text-brand-600">View all →</RouterLink>
        </div>
        <div v-if="isLoading" class="space-y-3">
          <div v-for="i in 4" :key="i" class="h-14 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
        </div>
        <div v-else-if="pagesStore.pages.length === 0" class="text-center py-8 text-gray-400 text-sm">No pages yet.</div>
        <div v-else class="divide-y divide-gray-100 dark:divide-gray-800">
          <div v-for="page in recentPages" :key="page.id" class="flex items-center justify-between py-3">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                <FileText class="w-4 h-4 text-gray-400" />
              </div>
              <div class="min-w-0">
                <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ page.title }}</p>
                <p class="text-xs text-gray-400">/{{ page.slug }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2 flex-shrink-0">
              <span :class="page.status === 'published' ? 'badge-green' : 'badge-yellow'" class="badge">
                {{ page.status }}
              </span>
              <RouterLink :to="`/pages/${page.id}/edit`" class="btn btn-ghost py-1 px-2 text-xs">Edit</RouterLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions + Theme -->
      <div class="space-y-4">
        <div class="card">
          <h2 class="font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
          <div class="space-y-2">
            <RouterLink to="/pages" class="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
              <div class="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950/30 flex items-center justify-center">
                <Plus class="w-5 h-5 text-brand-500" />
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">Create New Page</p>
                <p class="text-xs text-gray-400">Add a new website page</p>
              </div>
            </RouterLink>
            <RouterLink to="/media" class="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div class="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/30 flex items-center justify-center">
                <ImageIcon class="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">Upload Media</p>
                <p class="text-xs text-gray-400">Add images & files</p>
              </div>
            </RouterLink>
            <RouterLink to="/templates" class="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div class="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/30 flex items-center justify-center">
                <LayoutTemplate class="w-5 h-5 text-teal-500" />
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">Use a Template</p>
                <p class="text-xs text-gray-400">Create page from template</p>
              </div>
            </RouterLink>
          </div>
        </div>

        <!-- Quick Theme Picker -->
        <div class="card">
          <div class="flex items-center justify-between mb-3">
            <h2 class="font-semibold text-gray-900 dark:text-white text-sm">Quick Theme</h2>
            <RouterLink to="/settings?tab=theme" class="text-xs text-brand-500 hover:text-brand-600">Customize →</RouterLink>
          </div>
          <!-- Active indicator -->
          <div class="flex items-center gap-2 mb-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div class="flex gap-1">
              <div class="w-4 h-4 rounded-full border border-white/20 shadow-sm" :style="{ background: settingsStore.settings?.theme?.primaryColor || '#4f46e5' }" />
              <div class="w-4 h-4 rounded-full border border-white/20 shadow-sm" :style="{ background: settingsStore.settings?.theme?.secondaryColor || '#6366f1' }" />
            </div>
            <span class="text-xs text-gray-500 dark:text-gray-400">Active colors</span>
          </div>
          <!-- Presets grid -->
          <div class="grid grid-cols-4 gap-1.5">
            <button
              v-for="preset in quickPresets" :key="preset.name"
              @click="applyQuickPreset(preset)"
              :title="preset.name"
              class="relative rounded-lg overflow-hidden border transition-all hover:scale-105"
              :class="settingsStore.settings?.theme?.primaryColor === preset.primaryColor ? 'border-brand-500 ring-1 ring-brand-500' : 'border-gray-200 dark:border-gray-700'"
            >
              <div class="flex h-7">
                <div class="flex-1" :style="{ background: preset.bgColor }" />
                <div class="flex-1" :style="{ background: preset.primaryColor }" />
                <div class="flex-1" :style="{ background: preset.accentColor }" />
              </div>
              <div v-if="quickSaving === preset.name" class="absolute inset-0 bg-white/60 dark:bg-black/60 flex items-center justify-center">
                <div class="w-3 h-3 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
              </div>
            </button>
          </div>
          <p class="text-[10px] text-gray-400 mt-2 text-center">Click any swatch to apply instantly</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { FileText, Image as ImageIcon, Plus, LayoutTemplate, CheckCircle, Clock } from 'lucide-vue-next'
import { usePagesStore } from '@/stores/pages'
import { useMediaStore } from '@/stores/media'
import { useSettingsStore } from '@/stores/settings'

const pagesStore = usePagesStore()
const mediaStore = useMediaStore()
const settingsStore = useSettingsStore()
const isLoading = ref(true)
const quickSaving = ref<string | null>(null)

onMounted(async () => {
  await Promise.all([pagesStore.fetchPages(), mediaStore.fetchMedia(), settingsStore.fetchSettings()])
  isLoading.value = false
})

const recentPages = computed(() => pagesStore.pages.slice(0, 5))

const stats = computed(() => [
  { label: 'Total Pages', value: pagesStore.pages.length, icon: FileText, iconBg: 'bg-brand-50 dark:bg-brand-950/30', iconColor: 'text-brand-500' },
  { label: 'Published', value: pagesStore.pages.filter(p => p.status === 'published').length, icon: CheckCircle, iconBg: 'bg-green-50 dark:bg-green-950/30', iconColor: 'text-green-500' },
  { label: 'Drafts', value: pagesStore.pages.filter(p => p.status === 'draft').length, icon: Clock, iconBg: 'bg-amber-50 dark:bg-amber-950/30', iconColor: 'text-amber-500' },
  { label: 'Media Files', value: mediaStore.items.length, icon: ImageIcon, iconBg: 'bg-purple-50 dark:bg-purple-950/30', iconColor: 'text-purple-500' },
])

interface QuickPreset {
  name: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  bgColor: string
  headerStyle?: 'light' | 'dark'
  headerBgColor?: string
}

const quickPresets: QuickPreset[] = [
  { name: 'Indigo Pro', primaryColor: '#4f46e5', secondaryColor: '#6366f1', accentColor: '#a5b4fc', bgColor: '#f8faff' },
  { name: 'Emerald Fresh', primaryColor: '#059669', secondaryColor: '#10b981', accentColor: '#6ee7b7', bgColor: '#f0fdf4' },
  { name: 'Rose Bold', primaryColor: '#e11d48', secondaryColor: '#f43f5e', accentColor: '#fda4af', bgColor: '#fff1f2' },
  { name: 'Sky Blue', primaryColor: '#0284c7', secondaryColor: '#0ea5e9', accentColor: '#7dd3fc', bgColor: '#f0f9ff' },
  { name: 'Violet Studio', primaryColor: '#7c3aed', secondaryColor: '#8b5cf6', accentColor: '#c4b5fd', bgColor: '#faf5ff' },
  { name: 'Teal Ocean', primaryColor: '#0d9488', secondaryColor: '#14b8a6', accentColor: '#5eead4', bgColor: '#f0fdfa' },
  { name: 'Dark Gold', primaryColor: '#f59e0b', secondaryColor: '#d97706', accentColor: '#fbbf24', bgColor: '#0d1117', headerStyle: 'dark', headerBgColor: '#0d1117' },
  { name: 'Dark Navy', primaryColor: '#3b82f6', secondaryColor: '#2563eb', accentColor: '#93c5fd', bgColor: '#0f172a', headerStyle: 'dark', headerBgColor: '#0f172a' },
  { name: 'Dark Purple', primaryColor: '#a855f7', secondaryColor: '#9333ea', accentColor: '#d8b4fe', bgColor: '#0c0a1a', headerStyle: 'dark', headerBgColor: '#0c0a1a' },
  { name: 'Amber Warm', primaryColor: '#d97706', secondaryColor: '#f59e0b', accentColor: '#fcd34d', bgColor: '#fffbeb' },
  { name: 'Slate Dark', primaryColor: '#334155', secondaryColor: '#475569', accentColor: '#94a3b8', bgColor: '#f8fafc' },
  { name: 'Orange Buzz', primaryColor: '#ea580c', secondaryColor: '#f97316', accentColor: '#fdba74', bgColor: '#fff7ed' },
]

async function applyQuickPreset(preset: QuickPreset) {
  quickSaving.value = preset.name
  try {
    const themeData: Record<string, unknown> = {
      ...(settingsStore.settings?.theme ?? {}),
      primaryColor: preset.primaryColor,
      secondaryColor: preset.secondaryColor,
    }
    if (preset.headerStyle) themeData.headerStyle = preset.headerStyle
    if (preset.headerBgColor) themeData.headerBgColor = preset.headerBgColor
    await settingsStore.saveSettings('theme', themeData)
  } finally {
    quickSaving.value = null
  }
}
</script>
</script>
