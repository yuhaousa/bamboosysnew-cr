<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Testimonials</h1>
        <p class="text-sm text-gray-500 mt-0.5">Manage customer testimonials</p>
      </div>
      <button @click="openForm()" class="btn-primary text-sm">+ Add Testimonial</button>
    </div>

    <!-- Modal Form -->
    <AppModal v-model="showForm" :title="editing?.id ? 'Edit Testimonial' : 'New Testimonial'" size="xl">
      <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label class="form-label">Author Name *</label><input v-model="form.authorName" class="form-input" /></div>
        <div><label class="form-label">Role</label><input v-model="form.authorRole" class="form-input" placeholder="e.g. CEO" /></div>
        <div><label class="form-label">Company</label><input v-model="form.authorCompany" class="form-input" /></div>
        <div>
          <label class="form-label">Avatar Photo</label>
          <ImagePicker v-model="form.avatarUrl" folder="testimonials" :rounded="true" />
        </div>
        <div class="md:col-span-2"><label class="form-label">Quote *</label><textarea v-model="form.quote" class="form-textarea" rows="3" /></div>
        <div><label class="form-label">Rating (1–5)</label>
          <select v-model.number="form.rating" class="form-select">
            <option v-for="n in 5" :key="n" :value="n">{{ n }} ★</option>
          </select>
        </div>
        <div><label class="form-label">Sort Order</label><input v-model.number="form.sortOrder" type="number" class="form-input" /></div>
        <div class="flex items-center gap-2 pt-1">
          <input type="checkbox" v-model="form.isActive" id="active" class="rounded" />
          <label for="active" class="text-sm text-gray-700 dark:text-gray-300">Active</label>
        </div>
      </div>
      <template #footer>
        <button @click="showForm = false" class="btn-secondary text-sm">Cancel</button>
        <button @click="save" :disabled="saving" class="btn-primary text-sm">{{ saving ? 'Saving…' : 'Save Testimonial' }}</button>
      </template>
    </AppModal>

    <div class="card overflow-hidden !p-0">
      <div v-if="loading" class="p-8 text-center text-gray-400">Loading…</div>
      <table v-else class="w-full text-sm">
        <thead class="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-700">
          <tr>
            <th class="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Author</th>
            <th class="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400 hidden md:table-cell">Quote</th>
            <th class="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Rating</th>
            <th class="text-right px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
          <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/40">
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <img v-if="item.avatarUrl" :src="item.avatarUrl" class="w-8 h-8 rounded-full object-cover" />
                <div v-else class="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-950/50 flex items-center justify-center text-brand-600 text-xs font-semibold">{{ item.authorName?.charAt(0) }}</div>
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">{{ item.authorName }}</p>
                  <p class="text-xs text-gray-400">{{ item.authorRole }}<span v-if="item.authorCompany"> · {{ item.authorCompany }}</span></p>
                </div>
              </div>
            </td>
            <td class="px-4 py-3 text-gray-500 dark:text-gray-400 hidden md:table-cell max-w-xs">
              <p class="truncate">"{{ item.quote }}"</p>
            </td>
            <td class="px-4 py-3 text-amber-400">{{ '★'.repeat(item.rating ?? 5) }}</td>
            <td class="px-4 py-3 text-right flex justify-end gap-2">
              <button @click="openForm(item)" class="text-xs text-brand-500 hover:underline">Edit</button>
              <button @click="remove(item.id)" class="text-xs text-red-400 hover:underline">Delete</button>
            </td>
          </tr>
          <tr v-if="!items.length"><td colspan="4" class="px-4 py-8 text-center text-gray-400">No testimonials yet.</td></tr>
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
  return { authorName: '', authorRole: '', authorCompany: '', avatarUrl: '', quote: '', rating: 5, isActive: true, sortOrder: 0 }
}

onMounted(async () => {
  try { const d = await api.get<{ data: any[] }>('/testimonials?limit=200'); items.value = d.data ?? [] }
  finally { loading.value = false }
})

function openForm(item?: any) {
  editing.value = item ?? null
  form.value = item ? { ...item } : blank()
  showForm.value = true
}

function toApi(f: any) {
  return {
    author_name: f.authorName, author_role: f.authorRole, author_company: f.authorCompany,
    avatar_url: f.avatarUrl, quote: f.quote, rating: f.rating,
    is_active: f.isActive ? 1 : 0, sort_order: f.sortOrder,
  }
}

async function save() {
  if (!form.value.authorName || !form.value.quote) return toast.error('Author name and quote are required')
  saving.value = true
  try {
    if (editing.value?.id) {
      const d = await api.put<{ data: any }>(`/testimonials/${editing.value.id}`, toApi(form.value))
      const idx = items.value.findIndex(i => i.id === editing.value.id)
      if (idx >= 0) items.value[idx] = d.data
    } else {
      const d = await api.post<{ data: any }>('/testimonials', toApi(form.value))
      items.value.unshift(d.data)
    }
    toast.success('Saved!')
    showForm.value = false
  } catch (e: any) { toast.error(e.message) }
  finally { saving.value = false }
}

async function remove(id: string) {
  if (!confirm('Delete this testimonial?')) return
  try {
    await api.delete(`/testimonials/${id}`)
    items.value = items.value.filter(i => i.id !== id)
    toast.success('Deleted')
  } catch (e: any) { toast.error(e.message) }
}
</script>
