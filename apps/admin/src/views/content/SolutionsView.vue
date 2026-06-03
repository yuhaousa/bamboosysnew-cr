<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Solutions</h1>
        <p class="text-sm text-gray-500 mt-0.5">Manage solutions and their detail rows</p>
      </div>
      <button @click="openCreate()" class="btn-primary text-sm">+ Add Solution</button>
    </div>

    <AppModal v-model="showCreateForm" title="New Solution" size="lg">
      <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="md:col-span-2">
          <label class="form-label">Solution Name *</label>
          <input v-model="createForm.name" class="form-input" />
        </div>
        <div>
          <label class="form-label">Sort Order</label>
          <input v-model.number="createForm.sortOrder" type="number" class="form-input" />
        </div>
        <div class="flex items-center gap-2 pt-7">
          <input id="solution-active" v-model="createForm.isActive" type="checkbox" class="rounded" />
          <label for="solution-active" class="text-sm text-gray-700 dark:text-gray-300">Active</label>
        </div>
      </div>
      <template #footer>
        <button @click="showCreateForm = false" class="btn-secondary text-sm">Cancel</button>
        <button @click="saveCreate" :disabled="savingCreate" class="btn-primary text-sm">{{ savingCreate ? 'Saving…' : 'Save Solution' }}</button>
      </template>
    </AppModal>

    <AppModal v-model="showEditForm" :title="editForm.name ? `Edit ${editForm.name}` : 'Edit Solution'" size="2xl">
      <div class="p-6 space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="md:col-span-2">
            <label class="form-label">Solution Name *</label>
            <input v-model="editForm.name" class="form-input" />
          </div>
          <div>
            <label class="form-label">Sort Order</label>
            <input v-model.number="editForm.sortOrder" type="number" class="form-input" />
          </div>
          <div class="flex items-center gap-2 pt-7">
            <input id="edit-solution-active" v-model="editForm.isActive" type="checkbox" class="rounded" />
            <label for="edit-solution-active" class="text-sm text-gray-700 dark:text-gray-300">Active</label>
          </div>
        </div>

        <div class="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-sm font-semibold text-gray-900 dark:text-white">Solution Rows</h2>
              <p class="text-xs text-gray-500">Add multiple title, image, and description rows for this solution.</p>
            </div>
            <button @click="addEntry" type="button" class="text-sm text-brand-500 hover:underline">+ Add Row</button>
          </div>

          <div v-if="!editForm.entries.length" class="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-6 text-center text-sm text-gray-400">
            No rows yet. Add one to start building this solution.
          </div>

          <div v-for="(entry, index) in editForm.entries" :key="entry.id || index" class="rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-4">
            <div class="flex items-center justify-between">
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Row {{ index + 1 }}</p>
              <button @click="removeEntry(index)" type="button" class="text-xs text-red-400 hover:underline">Remove</button>
            </div>

            <div>
              <label class="form-label">Title</label>
              <input v-model="entry.title" class="form-input" />
            </div>

            <div>
              <label class="form-label">Image</label>
              <ImagePicker v-model="entry.imageUrl" folder="solutions" />
            </div>

            <div>
              <label class="form-label">Description</label>
              <textarea v-model="entry.description" class="form-textarea" rows="4" />
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <button @click="showEditForm = false" class="btn-secondary text-sm">Cancel</button>
        <button @click="saveEdit" :disabled="savingEdit" class="btn-primary text-sm">{{ savingEdit ? 'Saving…' : 'Save Solution' }}</button>
      </template>
    </AppModal>

    <div class="card overflow-hidden !p-0">
      <div v-if="loading" class="p-8 text-center text-gray-400">Loading…</div>
      <table v-else class="w-full text-sm">
        <thead class="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-700">
          <tr>
            <th class="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Solution</th>
            <th class="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400 hidden md:table-cell">Rows</th>
            <th class="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Status</th>
            <th class="text-right px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
          <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/40">
            <td class="px-4 py-3">
              <p class="font-medium text-gray-900 dark:text-white">{{ item.name }}</p>
            </td>
            <td class="px-4 py-3 text-gray-500 dark:text-gray-400 hidden md:table-cell">{{ item.entryCount ?? item.entries?.length ?? 0 }} rows</td>
            <td class="px-4 py-3">
              <span :class="item.isActive ? 'badge-green' : 'badge-gray'" class="badge">{{ item.isActive ? 'Active' : 'Hidden' }}</span>
            </td>
            <td class="px-4 py-3 text-right flex justify-end gap-2">
              <button @click="openEdit(item.id)" class="text-xs text-brand-500 hover:underline">Edit</button>
              <button @click="removeSolution(item.id)" class="text-xs text-red-400 hover:underline">Delete</button>
            </td>
          </tr>
          <tr v-if="!items.length">
            <td colspan="4" class="px-4 py-8 text-center text-gray-400">No solutions yet.</td>
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
import AppModal from '@/components/common/AppModal.vue'
import ImagePicker from '@/components/media/ImagePicker.vue'

interface SolutionEntry {
  id?: string
  title: string
  imageUrl: string
  description: string
  sortOrder: number
}

interface SolutionItem {
  id: string
  name: string
  isActive: boolean
  sortOrder: number
  entryCount?: number
  entries: SolutionEntry[]
}

const toast = useToast()
const loading = ref(true)
const items = ref<SolutionItem[]>([])
const showCreateForm = ref(false)
const showEditForm = ref(false)
const savingCreate = ref(false)
const savingEdit = ref(false)

const createForm = ref(blankCreate())
const editForm = ref(blankEdit())

function blankCreate() {
  return { name: '', isActive: true, sortOrder: 0 }
}

function blankEdit() {
  return { id: '', name: '', isActive: true, sortOrder: 0, entries: [] as SolutionEntry[] }
}

async function load() {
  loading.value = true
  try {
    const res = await api.get<{ data: SolutionItem[] }>('/solutions?limit=200')
    items.value = (res.data || []).map((item) => ({ ...item, entries: item.entries || [] }))
  } catch (e: any) {
    toast.error(e.message || 'Failed to load solutions')
  } finally {
    loading.value = false
  }
}

function openCreate() {
  createForm.value = blankCreate()
  showCreateForm.value = true
}

async function saveCreate() {
  if (!createForm.value.name.trim()) return toast.error('Solution name is required')
  savingCreate.value = true
  try {
    const res = await api.post<{ data: SolutionItem }>('/solutions', {
      name: createForm.value.name,
      is_active: createForm.value.isActive ? 1 : 0,
      sort_order: createForm.value.sortOrder,
    })
    items.value.unshift({ ...res.data, entries: [] })
    showCreateForm.value = false
    toast.success('Solution created')
  } catch (e: any) {
    toast.error(e.message || 'Failed to create solution')
  } finally {
    savingCreate.value = false
  }
}

async function openEdit(id: string) {
  try {
    const res = await api.get<{ data: SolutionItem }>(`/solutions/${id}`)
    editForm.value = {
      id: res.data.id,
      name: res.data.name,
      isActive: res.data.isActive,
      sortOrder: res.data.sortOrder,
      entries: (res.data.entries || []).map((entry, index) => ({
        id: entry.id,
        title: entry.title || '',
        imageUrl: entry.imageUrl || '',
        description: entry.description || '',
        sortOrder: entry.sortOrder ?? index,
      })),
    }
    showEditForm.value = true
  } catch (e: any) {
    toast.error(e.message || 'Failed to load solution')
  }
}

function addEntry() {
  editForm.value.entries.push({
    title: '',
    imageUrl: '',
    description: '',
    sortOrder: editForm.value.entries.length,
  })
}

function removeEntry(index: number) {
  editForm.value.entries.splice(index, 1)
}

async function saveEdit() {
  if (!editForm.value.name.trim()) return toast.error('Solution name is required')
  savingEdit.value = true
  try {
    const res = await api.put<{ data: SolutionItem }>(`/solutions/${editForm.value.id}`, {
      name: editForm.value.name,
      is_active: editForm.value.isActive ? 1 : 0,
      sort_order: editForm.value.sortOrder,
      entries: editForm.value.entries.map((entry, index) => ({
        id: entry.id,
        title: entry.title,
        image_url: entry.imageUrl || null,
        description: entry.description,
        sort_order: index,
      })),
    })

    const next = { ...res.data, entries: res.data.entries || [] }
    const itemIndex = items.value.findIndex((item) => item.id === next.id)
    if (itemIndex >= 0) items.value[itemIndex] = next
    showEditForm.value = false
    toast.success('Solution updated')
  } catch (e: any) {
    toast.error(e.message || 'Failed to save solution')
  } finally {
    savingEdit.value = false
  }
}

async function removeSolution(id: string) {
  if (!confirm('Delete this solution?')) return
  try {
    await api.delete(`/solutions/${id}`)
    items.value = items.value.filter((item) => item.id !== id)
    toast.success('Deleted')
  } catch (e: any) {
    toast.error(e.message || 'Failed to delete solution')
  }
}

onMounted(() => {
  load()
})
</script>
