<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Portfolio</h1>
        <p class="text-sm text-gray-500 mt-0.5">Manage your client portfolio / projects</p>
      </div>
      <button @click="openForm()" class="btn-primary text-sm">+ Add Project</button>
    </div>

    <!-- Form -->
    <div v-if="showForm" class="card space-y-4">
      <h2 class="font-semibold text-gray-900 dark:text-white">{{ editing?.id ? 'Edit Project' : 'New Project' }}</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label class="form-label">Title *</label><input v-model="form.title" class="form-input" /></div>
        <div><label class="form-label">Client Name</label><input v-model="form.clientName" class="form-input" placeholder="e.g. Braincore" /></div>
        <div><label class="form-label">Category</label><input v-model="form.category" class="form-input" placeholder="e.g. K12 Learning" /></div>
        <div><label class="form-label">Tags (comma-separated)</label><input v-model="form.tags" class="form-input" placeholder="LMS, AI, Mobile" /></div>
        <div class="md:col-span-2"><label class="form-label">Short Description</label><textarea v-model="form.shortDescription" class="form-textarea" rows="2" /></div>
        <div class="md:col-span-2"><label class="form-label">Full Description</label><textarea v-model="form.description" class="form-textarea" rows="4" /></div>
        <div class="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="form-label">Screenshot / Cover Image</label>
            <ImagePicker v-model="form.imageUrl" folder="portfolio" />
          </div>
          <div>
            <label class="form-label">Client Logo</label>
            <ImagePicker v-model="form.logoUrl" folder="portfolio" :rounded="false" />
          </div>
        </div>
        <div><label class="form-label">Image Alt</label><input v-model="form.imageAlt" class="form-input" /></div>
        <div><label class="form-label">Project URL</label><input v-model="form.projectUrl" class="form-input" placeholder="https://..." /></div>
        <div><label class="form-label">Sort Order</label><input v-model.number="form.sortOrder" type="number" class="form-input" /></div>
        <div class="flex gap-4 items-center pt-2">
          <label class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input type="checkbox" v-model="form.isActive" class="rounded" /> Active
          </label>
          <label class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input type="checkbox" v-model="form.isFeatured" class="rounded" /> Featured
          </label>
        </div>
      </div>
      <div class="flex gap-2 pt-2">
        <button @click="save" :disabled="saving" class="btn-primary text-sm">{{ saving ? 'Saving…' : 'Save' }}</button>
        <button @click="showForm = false" class="btn-secondary text-sm">Cancel</button>
      </div>
    </div>

    <!-- Table -->
    <div class="card overflow-hidden !p-0">
      <div v-if="loading" class="p-8 text-center text-gray-400">Loading…</div>
      <table v-else class="w-full text-sm">
        <thead class="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-700">
          <tr>
            <th class="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Project</th>
            <th class="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400 hidden md:table-cell">Category</th>
            <th class="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Status</th>
            <th class="text-right px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
          <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/40">
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <div class="w-14 h-10 rounded overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                  <img v-if="item.imageUrl" :src="item.imageUrl" class="w-full h-full object-cover object-top" />
                </div>
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">{{ item.title }}</p>
                  <p class="text-xs text-gray-400">{{ item.clientName }}</p>
                </div>
              </div>
            </td>
            <td class="px-4 py-3 text-gray-500 dark:text-gray-400 hidden md:table-cell">
              {{ item.category || '—' }}
              <span v-if="item.isFeatured" class="ml-2 badge badge-yellow">Featured</span>
            </td>
            <td class="px-4 py-3">
              <span :class="item.isActive ? 'badge-green' : 'badge-gray'" class="badge">{{ item.isActive ? 'Active' : 'Hidden' }}</span>
            </td>
            <td class="px-4 py-3 text-right">
              <div class="flex justify-end gap-2">
                <a v-if="item.projectUrl" :href="item.projectUrl" target="_blank" class="text-xs text-gray-400 hover:text-brand-500">↗</a>
                <button @click="openForm(item)" class="text-xs text-brand-500 hover:underline">Edit</button>
                <button @click="remove(item.id)" class="text-xs text-red-400 hover:underline">Delete</button>
              </div>
            </td>
          </tr>
          <tr v-if="!items.length">
            <td colspan="4" class="px-4 py-8 text-center text-gray-400">No projects yet. Click "+ Add Project" to create one.</td>
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
  return {
    title: '', clientName: '', category: '', tags: '',
    shortDescription: '', description: '',
    imageUrl: '', imageAlt: '', logoUrl: '', projectUrl: '',
    isActive: true, isFeatured: false, sortOrder: 0,
  }
}

onMounted(async () => {
  try { const d = await api.get<{ data: any[] }>('/portfolio?limit=200'); items.value = d.data ?? [] }
  finally { loading.value = false }
})

function openForm(item?: any) {
  editing.value = item ?? null
  if (item) {
    form.value = {
      ...item,
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : (item.tags ?? ''),
    }
  } else {
    form.value = blank()
  }
  showForm.value = true
}

function toApi(f: any) {
  return {
    title: f.title, client_name: f.clientName, category: f.category,
    tags: f.tags, short_description: f.shortDescription, description: f.description,
    image_url: f.imageUrl, image_alt: f.imageAlt, logo_url: f.logoUrl,
    project_url: f.projectUrl, is_active: f.isActive ? 1 : 0,
    is_featured: f.isFeatured ? 1 : 0, sort_order: f.sortOrder,
  }
}

async function save() {
  if (!form.value.title) return toast.error('Title is required')
  saving.value = true
  try {
    if (editing.value?.id) {
      const d = await api.put<{ data: any }>(`/portfolio/${editing.value.id}`, toApi(form.value))
      const idx = items.value.findIndex(i => i.id === editing.value.id)
      if (idx >= 0) items.value[idx] = d.data
    } else {
      const d = await api.post<{ data: any }>('/portfolio', toApi(form.value))
      items.value.unshift(d.data)
    }
    toast.success('Saved!')
    showForm.value = false
  } catch (e: any) { toast.error(e.message) }
  finally { saving.value = false }
}

async function remove(id: string) {
  if (!confirm('Delete this project?')) return
  try {
    await api.delete(`/portfolio/${id}`)
    items.value = items.value.filter(i => i.id !== id)
    toast.success('Deleted')
  } catch (e: any) { toast.error(e.message) }
}
</script>
