<template>
  <div class="p-6 space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
      <p class="text-sm text-gray-500 mt-0.5">Manage admin users and roles</p>
    </div>

    <div class="card overflow-hidden !p-0">
      <div v-if="isLoading" class="p-8 text-center text-gray-400">Loading...</div>
      <table v-else class="w-full text-sm">
        <thead class="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-700">
          <tr>
            <th class="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">User</th>
            <th class="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Role</th>
            <th class="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400 hidden md:table-cell">Joined</th>
            <th class="text-right px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
          <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-950/50 flex items-center justify-center text-brand-600 dark:text-brand-400 font-semibold text-xs">
                  {{ user.name?.charAt(0).toUpperCase() ?? '?' }}
                </div>
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">{{ user.name }}</p>
                  <p class="text-xs text-gray-400">{{ user.email }}</p>
                </div>
              </div>
            </td>
            <td class="px-4 py-3">
              <span :class="roleClass(user.role)" class="badge">{{ user.role }}</span>
            </td>
            <td class="px-4 py-3 text-xs text-gray-400 hidden md:table-cell">{{ formatDate(user.createdAt) }}</td>
            <td class="px-4 py-3 text-right">
              <select @change="changeRole(user.id, ($event.target as HTMLSelectElement).value as any)" :value="user.role" class="form-select py-1 text-xs w-auto">
                <option value="admin">admin</option>
                <option value="editor">editor</option>
                <option value="super_admin">super_admin</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '@/lib/api'
import { useToast } from '@/composables/useToast'

const toast = useToast()
const isLoading = ref(true)
const users = ref<any[]>([])

onMounted(async () => {
  try {
    const data = await api.get<{ users: any[] }>('/api/users')
    users.value = data.users ?? []
  } finally { isLoading.value = false }
})

async function changeRole(id: string, role: string) {
  try {
    await api.put(`/api/users/${id}/role`, { role })
    toast.success('Role updated')
  } catch { toast.error('Failed to update role') }
}

function roleClass(role: string) {
  return role === 'super_admin' ? 'badge-red' : role === 'admin' ? 'badge-blue' : 'badge-gray'
}

function formatDate(d?: string) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>
