<template>
  <div class="p-6 space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Audit Logs</h1>
      <p class="text-sm text-gray-500 mt-0.5">Track all administrative actions</p>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-3">
      <select v-model="resourceFilter" @change="load" class="form-select w-auto">
        <option value="">All Resources</option>
        <option value="page">Pages</option>
        <option value="block">Blocks</option>
        <option value="media">Media</option>
        <option value="settings">Settings</option>
        <option value="menu">Menus</option>
        <option value="user">Users</option>
      </select>
    </div>

    <div class="card overflow-hidden !p-0">
      <div v-if="isLoading" class="p-8 text-center text-gray-400">
        <div class="animate-spin w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full mx-auto mb-2" />
        Loading...
      </div>
      <div v-else-if="logs.length === 0" class="p-12 text-center text-gray-400">No audit logs found.</div>
      <table v-else class="w-full text-sm">
        <thead class="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-700">
          <tr>
            <th class="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Action</th>
            <th class="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400 hidden md:table-cell">Resource</th>
            <th class="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400 hidden lg:table-cell">User</th>
            <th class="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Time</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
          <tr v-for="log in logs" :key="log.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/40">
            <td class="px-4 py-3">
              <span :class="actionClass(log.action)" class="badge">{{ log.action }}</span>
            </td>
            <td class="px-4 py-3 text-gray-500 hidden md:table-cell">
              <span class="capitalize">{{ log.resourceType }}</span>
              <span v-if="log.resourceTitle" class="text-gray-400"> · {{ log.resourceTitle }}</span>
            </td>
            <td class="px-4 py-3 text-gray-400 text-xs hidden lg:table-cell">{{ log.userName }}</td>
            <td class="px-4 py-3 text-xs text-gray-400">{{ formatDate(log.createdAt) }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Load more -->
      <div v-if="hasMore" class="p-4 text-center border-t border-gray-100 dark:border-gray-800">
        <button @click="loadMore" class="btn btn-secondary text-sm">Load more</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '@/lib/api'

const isLoading = ref(true)
const logs = ref<any[]>([])
const resourceFilter = ref('')
const page = ref(1)
const hasMore = ref(false)

onMounted(() => load())

async function load() {
  isLoading.value = true; page.value = 1
  try {
    const data = await api.get<{ logs: any[]; total: number }>(`/audit?resourceType=${resourceFilter.value}&limit=50`)
    logs.value = data.logs ?? []
    hasMore.value = (data.logs?.length ?? 0) < (data.total ?? 0)
  } finally { isLoading.value = false }
}

async function loadMore() {
  page.value++
  const data = await api.get<{ logs: any[] }>(`/audit?resourceType=${resourceFilter.value}&limit=50&offset=${(page.value - 1) * 50}`)
  logs.value.push(...(data.logs ?? []))
}

function actionClass(action: string) {
  if (action.includes('delete')) return 'badge-red'
  if (action.includes('create')) return 'badge-green'
  if (action.includes('publish')) return 'badge-blue'
  return 'badge-gray'
}

function formatDate(d?: string) {
  if (!d) return ''
  return new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
}
</script>
