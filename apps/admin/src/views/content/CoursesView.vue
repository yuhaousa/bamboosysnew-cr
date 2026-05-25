<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Courses</h1>
        <p class="text-sm text-gray-500 mt-0.5">Manage your course catalog</p>
      </div>
      <button @click="openForm()" class="btn-primary text-sm">+ Add Course</button>
    </div>

    <!-- Modal Form -->
    <AppModal v-model="showForm" :title="editing?.id ? 'Edit Course' : 'New Course'" size="2xl">
      <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label class="form-label">Title *</label><input v-model="form.title" class="form-input" /></div>
        <div><label class="form-label">Category</label><input v-model="form.category" class="form-input" placeholder="e.g. Web Development" /></div>
        <div class="md:col-span-2"><label class="form-label">Short Description</label><textarea v-model="form.shortDescription" class="form-textarea" rows="2" /></div>
        <div class="md:col-span-2"><label class="form-label">Full Description</label><textarea v-model="form.description" class="form-textarea" rows="4" /></div>
        <div><label class="form-label">Level</label>
          <select v-model="form.level" class="form-select">
            <option value="">Any</option>
            <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
          </select>
        </div>
        <div><label class="form-label">Duration</label><input v-model="form.duration" class="form-input" placeholder="e.g. 8 weeks" /></div>
        <div><label class="form-label">Price</label><input v-model="form.price" class="form-input" placeholder="e.g. ₱5,000 or Free" /></div>
        <div><label class="form-label">Sort Order</label><input v-model.number="form.sortOrder" type="number" class="form-input" /></div>
        <div class="md:col-span-2">
          <label class="form-label">Course Image</label>
          <ImagePicker v-model="form.imageUrl" folder="courses" />
        </div>
        <div><label class="form-label">Image Alt</label><input v-model="form.imageAlt" class="form-input" /></div>
        <div class="flex items-center gap-2 pt-1">
          <input type="checkbox" v-model="form.isActive" id="active" class="rounded" />
          <label for="active" class="text-sm text-gray-700 dark:text-gray-300">Active</label>
        </div>
      </div>
      <template #footer>
        <button @click="showForm = false" class="btn-secondary text-sm">Cancel</button>
        <button @click="save" :disabled="saving" class="btn-primary text-sm">{{ saving ? 'Saving…' : 'Save Course' }}</button>
      </template>
    </AppModal
    <!-- Table -->
    <div class="card overflow-hidden !p-0">
      <div v-if="loading" class="p-8 text-center text-gray-400">Loading…</div>
      <table v-else class="w-full text-sm">
        <thead class="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-700">
          <tr>
            <th class="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Title</th>
            <th class="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400 hidden md:table-cell">Level / Category</th>
            <th class="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Status</th>
            <th class="text-right px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
          <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/40">
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <img v-if="item.imageUrl" :src="item.imageUrl" class="w-8 h-8 rounded object-cover" />
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">{{ item.title }}</p>
                  <p class="text-xs text-gray-400">{{ item.slug }}</p>
                </div>
              </div>
            </td>
            <td class="px-4 py-3 text-gray-500 dark:text-gray-400 hidden md:table-cell">{{ [item.level, item.category].filter(Boolean).join(' · ') }}</td>
            <td class="px-4 py-3">
              <span :class="item.isActive ? 'badge-green' : 'badge-gray'" class="badge">{{ item.isActive ? 'Active' : 'Draft' }}</span>
            </td>
            <td class="px-4 py-3 text-right flex justify-end gap-2">
              <button @click="openForm(item)" class="text-xs text-brand-500 hover:underline">Edit</button>
              <button @click="remove(item.id)" class="text-xs text-red-400 hover:underline">Delete</button>
            </td>
          </tr>
          <tr v-if="!items.length"><td colspan="4" class="px-4 py-8 text-center text-gray-400">No courses yet. Click "Add Course" to create one.</td></tr>
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
  return { title: '', shortDescription: '', description: '', category: '', level: '', duration: '', price: '', imageUrl: '', imageAlt: '', isActive: true, sortOrder: 0 }
}

onMounted(async () => {
  try { const d = await api.get<{ data: any[] }>('/courses?limit=200'); items.value = d.data ?? [] }
  finally { loading.value = false }
})

function openForm(item?: any) {
  editing.value = item ?? null
  form.value = item ? { ...item } : blank()
  showForm.value = true
}

function toApi(f: any) {
  return {
    title: f.title, short_description: f.shortDescription, description: f.description,
    category: f.category, level: f.level, duration: f.duration, price: f.price,
    image_url: f.imageUrl, image_alt: f.imageAlt, is_active: f.isActive ? 1 : 0, sort_order: f.sortOrder,
  }
}

async function save() {
  if (!form.value.title) return toast.error('Title is required')
  saving.value = true
  try {
    if (editing.value?.id) {
      const d = await api.put<{ data: any }>(`/courses/${editing.value.id}`, toApi(form.value))
      const idx = items.value.findIndex(i => i.id === editing.value.id)
      if (idx >= 0) items.value[idx] = d.data
    } else {
      const d = await api.post<{ data: any }>('/courses', toApi(form.value))
      items.value.unshift(d.data)
    }
    toast.success('Saved!')
    showForm.value = false
  } catch (e: any) { toast.error(e.message) }
  finally { saving.value = false }
}

async function remove(id: string) {
  if (!confirm('Delete this course?')) return
  try {
    await api.delete(`/courses/${id}`)
    items.value = items.value.filter(i => i.id !== id)
    toast.success('Deleted')
  } catch (e: any) { toast.error(e.message) }
}
</script>
