<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Features</h1>
        <p class="text-sm text-gray-500 mt-0.5">Manage your product features</p>
      </div>
      <button @click="openForm()" class="btn-primary text-sm">+ Add Feature</button>
    </div>

    <!-- Modal Form -->
    <AppModal v-model="showForm" :title="editing?.id ? 'Edit Feature' : 'New Feature'" size="2xl">
      <div class="p-6 space-y-4">
        <!-- Feature Title & Summary -->
        <div>
          <label class="form-label">Feature Title *</label>
          <input v-model="form.title" class="form-input" />
        </div>
        <div>
          <label class="form-label">Summary</label>
          <textarea v-model="form.summary" class="form-textarea" rows="2" />
        </div>

        <!-- Feature Items List -->
        <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div class="flex items-center justify-between mb-3">
            <label class="form-label">Feature Items</label>
            <button @click="addItem" type="button" class="text-sm text-blue-600 hover:text-blue-700">+ Add Item</button>
          </div>

          <div class="space-y-3 max-h-96 overflow-y-auto">
            <div v-for="(item, idx) in form.items" :key="item.id || idx" class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Item {{ idx + 1 }}</span>
                <button @click="removeItem(idx)" type="button" class="text-xs text-red-600 hover:text-red-700">Remove</button>
              </div>

              <div>
                <label class="form-label text-xs">Title *</label>
                <input v-model="item.title" class="form-input text-sm" />
              </div>

              <div>
                <label class="form-label text-xs">Description</label>
                <textarea v-model="item.description" class="form-textarea text-sm" rows="2" />
              </div>

              <div>
                <label class="form-label text-xs">Image</label>
                <ImagePicker v-model="item.imageUrl" folder="features" />
              </div>

              <div>
                <label class="form-label text-xs">Stack/Technologies</label>
                <input v-model="item.stack" class="form-input text-sm" placeholder="e.g. React, Node.js, PostgreSQL" />
              </div>
            </div>
          </div>
        </div>

        <!-- Active & Sort Order -->
        <div class="border-t border-gray-200 dark:border-gray-700 pt-4 grid grid-cols-2 gap-4">
          <div>
            <label class="form-label">Sort Order</label>
            <input v-model.number="form.sortOrder" type="number" class="form-input" />
          </div>
          <div class="flex items-center gap-2 pt-6">
            <input type="checkbox" v-model="form.isActive" id="active" class="rounded" />
            <label for="active" class="text-sm text-gray-700 dark:text-gray-300">Active</label>
          </div>
        </div>
      </div>

      <template #footer>
        <button @click="showForm = false" class="btn-secondary text-sm">Cancel</button>
        <button @click="save" :disabled="saving" class="btn-primary text-sm">{{ saving ? 'Saving…' : 'Save Feature' }}</button>
      </template>
    </AppModal>

    <!-- Features Table -->
    <div class="card overflow-hidden !p-0">
      <div v-if="loading" class="p-8 text-center text-gray-400">Loading…</div>
      <table v-else class="w-full text-sm">
        <thead class="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-700">
          <tr>
            <th class="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Title</th>
            <th class="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400 hidden md:table-cell">Items</th>
            <th class="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400 hidden md:table-cell">Status</th>
            <th class="text-right px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
          <tr v-if="!features.length">
            <td colspan="4" class="px-4 py-6 text-center text-gray-400">No features yet.</td>
          </tr>
          <tr v-for="feature in features" :key="feature.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
            <td class="px-4 py-3 font-medium text-gray-900 dark:text-white">{{ feature.title }}</td>
            <td class="px-4 py-3 text-gray-600 dark:text-gray-400 hidden md:table-cell">{{ feature.items?.length || 0 }} items</td>
            <td class="px-4 py-3 hidden md:table-cell">
              <span :class="feature.isActive ? 'badge-success' : 'badge-gray'">{{ feature.isActive ? 'Active' : 'Inactive' }}</span>
            </td>
            <td class="px-4 py-3 text-right space-x-2">
              <button @click="editFeature(feature)" class="btn-ghost text-xs">Edit</button>
              <button @click="deleteFeature(feature.id)" class="btn-ghost text-xs text-red-600">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AppModal from '../../components/common/AppModal.vue'
import ImagePicker from '../../components/media/ImagePicker.vue'
import { useToast } from '../../composables/useToast'
import { api } from '../../lib/api'

interface FeatureItem {
  id?: string
  title: string
  description: string
  imageUrl?: string
  stack: string
  sortOrder: number
}

interface Feature {
  id?: string
  title: string
  summary: string
  items: FeatureItem[]
  isActive: boolean
  sortOrder: number
}

interface FeatureResponse {
  id?: string
  title: string
  summary: string
  items?: FeatureItem[]
  isActive: boolean
  sortOrder: number
}

const toast = useToast()
const loading = ref(true)
const showForm = ref(false)
const saving = ref(false)
const features = ref<Feature[]>([])
const editing = ref<Feature | null>(null)

const form = ref<Feature>({
  title: '',
  summary: '',
  items: [],
  isActive: true,
  sortOrder: 0
})

async function load() {
  loading.value = true
  try {
    const res = await api.get<{ data: FeatureResponse[] }>('/features?limit=200')
    features.value = (res.data || []).map(normalizeFeature)
  } catch (err: any) {
    toast.error(err.message || 'Failed to load features')
  } finally {
    loading.value = false
  }
}

function openForm() {
  editing.value = null
  form.value = {
    title: '',
    summary: '',
    items: [{ title: '', description: '', imageUrl: '', stack: '', sortOrder: 0 }],
    isActive: true,
    sortOrder: 0
  }
  showForm.value = true
}

async function editFeature(feature: Feature) {
  try {
    const res = await api.get<{ data: FeatureResponse }>(`/features/${feature.id}`)
    const fullFeature = normalizeFeature(res.data)
    editing.value = fullFeature
    form.value = {
      ...fullFeature,
      items: fullFeature.items.map((item) => ({ ...item }))
    }
    showForm.value = true
  } catch (err: any) {
    toast.error(err.message || 'Failed to load feature details')
  }
}

function addItem() {
  form.value.items.push({
    title: '',
    description: '',
    imageUrl: '',
    stack: '',
    sortOrder: form.value.items.length
  })
}

function removeItem(idx: number) {
  form.value.items.splice(idx, 1)
}

async function save() {
  if (!form.value.title.trim()) {
    toast.error('Title is required')
    return
  }

  if (form.value.items.some(item => !item.title.trim())) {
    toast.error('All items must have a title')
    return
  }

  saving.value = true
  try {
    const payload = {
      title: form.value.title,
      summary: form.value.summary,
      items: form.value.items.map((item, idx) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        image_url: item.imageUrl || null,
        stack: item.stack,
        sort_order: item.sortOrder ?? idx
      })),
      is_active: form.value.isActive,
      sort_order: form.value.sortOrder
    }

    if (editing.value?.id) {
      await api.put(`/features/${editing.value.id}`, payload)
      toast.success('Feature updated')
    } else {
      await api.post('/features', payload)
      toast.success('Feature created')
    }

    showForm.value = false
    await load()
  } catch (err: any) {
    toast.error(err.message || 'Failed to save feature')
  } finally {
    saving.value = false
  }
}

async function deleteFeature(id: string) {
  if (!confirm('Are you sure?')) return

  try {
    await api.delete(`/features/${id}`)
    toast.success('Feature deleted')
    await load()
  } catch (err: any) {
    toast.error(err.message || 'Failed to delete feature')
  }
}

onMounted(() => load())

function normalizeFeature(feature: FeatureResponse): Feature {
  return {
    id: feature.id,
    title: feature.title,
    summary: feature.summary ?? '',
    items: (feature.items || []).map((item, idx) => ({
      id: item.id,
      title: item.title ?? '',
      description: item.description ?? '',
      imageUrl: item.imageUrl ?? '',
      stack: item.stack ?? '',
      sortOrder: item.sortOrder ?? idx
    })),
    isActive: feature.isActive,
    sortOrder: feature.sortOrder ?? 0
  }
}
</script>
