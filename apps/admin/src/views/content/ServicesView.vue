<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Services</h1>
        <p class="text-sm text-gray-500 mt-0.5">Manage your service offerings</p>
      </div>
      <button @click="openForm()" class="btn-primary text-sm">+ Add Service</button>
    </div>

    <!-- Modal Form -->
    <AppModal v-model="showForm" :title="editing?.id ? 'Edit Service' : 'New Service'" size="xl">
      <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label class="form-label">Title *</label><input v-model="form.title" class="form-input" /></div>
        <div><label class="form-label">Icon (emoji)</label><input v-model="form.icon" class="form-input" placeholder="🚀" /></div>
        <div class="md:col-span-2"><label class="form-label">Short Description</label><textarea v-model="form.shortDescription" class="form-textarea" rows="2" /></div>
        <div class="md:col-span-2"><label class="form-label">Full Description</label><textarea v-model="form.description" class="form-textarea" rows="4" /></div>
        <div class="md:col-span-2">
          <label class="form-label">Service Image</label>
          <ImagePicker v-model="form.imageUrl" folder="services" />
        </div>
        <div><label class="form-label">Image Alt</label><input v-model="form.imageAlt" class="form-input" /></div>
        <div><label class="form-label">Sort Order</label><input v-model.number="form.sortOrder" type="number" class="form-input" /></div>
        <div class="flex items-center gap-2 pt-1">
          <input type="checkbox" v-model="form.isActive" id="active" class="rounded" />
          <label for="active" class="text-sm text-gray-700 dark:text-gray-300">Active</label>
        </div>
      </div>
      <template #footer>
        <button @click="showForm = false" class="btn-secondary text-sm">Cancel</button>
        <button @click="save" :disabled="saving" class="btn-primary text-sm">{{ saving ? 'Saving…' : 'Save Service' }}</button>
      </template>
    </AppModal>

    <div class="card overflow-hidden !p-0">
      <div v-if="loading" class="p-8 text-center text-gray-400">Loading…</div>
      <table v-else class="w-full text-sm">
        <thead class="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-700">
          <tr>
            <th class="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Service</th>
            <th class="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400 hidden md:table-cell">Description</th>
            <th class="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Status</th>
            <th class="text-right px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
          <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/40">
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <div v-if="item.icon" class="w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-950/50 flex items-center justify-center text-lg">{{ item.icon }}</div>
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">{{ item.title }}</p>
                  <p class="text-xs text-gray-400">{{ item.slug }}</p>
                </div>
              </div>
            </td>
            <td class="px-4 py-3 text-gray-500 dark:text-gray-400 hidden md:table-cell max-w-xs">
              <p class="truncate">{{ item.shortDescription }}</p>
            </td>
            <td class="px-4 py-3">
              <span :class="item.isActive ? 'badge-green' : 'badge-gray'" class="badge">{{ item.isActive ? 'Active' : 'Hidden' }}</span>
            </td>
            <td class="px-4 py-3 text-right flex justify-end gap-2">
              <button @click="openForm(item)" class="text-xs text-brand-500 hover:underline">Edit</button>
              <button @click="remove(item.id)" class="text-xs text-red-400 hover:underline">Delete</button>
            </td>
          </tr>
          <tr v-if="!items.length"><td colspan="4" class="px-4 py-8 text-center text-gray-400">No services yet.</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '@/lib/api'
import { useToast } from '@/composables/useToast'
import ImagePicker from '@/components/media/ImagePicker.vue'
import AppModal from '@/components/common/AppModal.vue'
const toast = useToast()
const loading = ref(true)
const saving = ref(false)
const showForm = ref(false)
const items = ref<any[]>([])
const editing = ref<any>(null)
const form = ref(blank())

function blank() {
  return { title: '', icon: '', shortDescription: '', description: '', imageUrl: '', imageAlt: '', isActive: true, sortOrder: 0 }
}

onMounted(async () => {
  try { const d = await api.get<{ data: any[] }>('/services-entity?limit=200'); items.value = d.data ?? [] }
  finally { loading.value = false }
})

function openForm(item?: any) {
  editing.value = item ?? null
  form.value = item ? { ...item } : blank()
  showForm.value = true
}

function toApi(f: any) {
  return {
    title: f.title, icon: f.icon,
    short_description: f.shortDescription, description: f.description,
    image_url: f.imageUrl, image_alt: f.imageAlt,
    is_active: f.isActive ? 1 : 0, sort_order: f.sortOrder,
  }
}

async function save() {
  if (!form.value.title) return toast.error('Title is required')
  saving.value = true
  try {
    if (editing.value?.id) {
      const d = await api.put<{ data: any }>(`/services-entity/${editing.value.id}`, toApi(form.value))
      const idx = items.value.findIndex(i => i.id === editing.value.id)
      if (idx >= 0) items.value[idx] = d.data
    } else {
      const d = await api.post<{ data: any }>('/services-entity', toApi(form.value))
      items.value.unshift(d.data)
    }
    toast.success('Saved!')
    showForm.value = false
  } catch (e: any) { toast.error(e.message) }
  finally { saving.value = false }
}

async function remove(id: string) {
  if (!confirm('Delete this service?')) return
  try {
    await api.delete(`/services-entity/${id}`)
    items.value = items.value.filter(i => i.id !== id)
    toast.success('Deleted')
  } catch (e: any) { toast.error(e.message) }
}
</script>
