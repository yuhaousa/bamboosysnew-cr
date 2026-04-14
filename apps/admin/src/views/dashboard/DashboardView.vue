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

      <!-- Quick Actions -->
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
            <RouterLink to="/settings" class="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div class="w-9 h-9 rounded-xl bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center">
                <Settings class="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">Site Settings</p>
                <p class="text-xs text-gray-400">Configure your website</p>
              </div>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { FileText, Image as ImageIcon, Plus, Settings, LayoutDashboard, CheckCircle, Clock } from 'lucide-vue-next'
import { usePagesStore } from '@/stores/pages'
import { useMediaStore } from '@/stores/media'

const pagesStore = usePagesStore()
const mediaStore = useMediaStore()
const isLoading = ref(true)

onMounted(async () => {
  await Promise.all([pagesStore.fetchPages(), mediaStore.fetchMedia()])
  isLoading.value = false
})

const recentPages = computed(() => pagesStore.pages.slice(0, 5))

const stats = computed(() => [
  { label: 'Total Pages', value: pagesStore.pages.length, icon: FileText, iconBg: 'bg-brand-50 dark:bg-brand-950/30', iconColor: 'text-brand-500' },
  { label: 'Published', value: pagesStore.pages.filter(p => p.status === 'published').length, icon: CheckCircle, iconBg: 'bg-green-50 dark:bg-green-950/30', iconColor: 'text-green-500' },
  { label: 'Drafts', value: pagesStore.pages.filter(p => p.status === 'draft').length, icon: Clock, iconBg: 'bg-amber-50 dark:bg-amber-950/30', iconColor: 'text-amber-500' },
  { label: 'Media Files', value: mediaStore.items.length, icon: ImageIcon, iconBg: 'bg-purple-50 dark:bg-purple-950/30', iconColor: 'text-purple-500' },
])
</script>
