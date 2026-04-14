<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Menu Builder</h1>
        <p class="text-sm text-gray-500 mt-0.5">Manage navigation menus</p>
      </div>
      <button @click="openCreate" class="btn btn-primary">
        <Plus class="w-4 h-4" /> New Menu
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Menu list -->
      <div class="space-y-2">
        <div v-for="menu in store.menus" :key="menu.id"
          @click="selectMenu(menu)"
          :class="selected?.id === menu.id ? 'ring-2 ring-brand-500 bg-brand-50 dark:bg-brand-950/20' : ''"
          class="card cursor-pointer hover:shadow-md transition-all group"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium text-gray-900 dark:text-white">{{ menu.name }}</p>
              <p class="text-xs text-gray-400 mt-0.5">slug: {{ menu.slug }} · {{ menu.items.length }} items</p>
            </div>
            <button @click.stop="doDelete(menu.id)" class="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Menu Editor -->
      <div class="lg:col-span-2">
        <div v-if="!selected" class="card text-center py-16 text-gray-400">
          <List class="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p class="text-sm">Select a menu to edit it</p>
        </div>
        <div v-else class="card space-y-4">
          <div>
            <h2 class="font-semibold text-gray-900 dark:text-white mb-4">{{ selected.name }}</h2>
            <VueDraggable v-model="editItems" handle=".drag-handle" class="space-y-2">
              <div v-for="(item, i) in editItems" :key="item.id" class="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center gap-3">
                <GripVertical class="w-4 h-4 text-gray-400 cursor-grab drag-handle flex-shrink-0" />
                <div class="flex-1 grid grid-cols-2 gap-2">
                  <input v-model="item.label" class="form-input text-sm" placeholder="Label" />
                  <input v-model="item.url" class="form-input text-sm" placeholder="/url or https://" />
                </div>
                <label class="flex items-center gap-1 text-xs text-gray-400">
                  <input type="checkbox" v-model="item.openInNewTab" class="rounded" />
                  New tab
                </label>
                <button @click="removeItem(i)" class="text-red-400 hover:text-red-600">
                  <X class="w-4 h-4" />
                </button>
              </div>
            </VueDraggable>
            <button @click="addItem" class="mt-2 w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-xs text-gray-400 hover:border-brand-400 hover:text-brand-500 transition-colors">
              + Add Menu Item
            </button>
          </div>
          <div class="flex justify-end">
            <button @click="saveMenu" :disabled="saving" class="btn btn-primary">
              {{ saving ? 'Saving...' : 'Save Menu' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Menu Modal -->
    <AppModal v-model="showCreate" title="Create Menu" size="sm">
      <div class="space-y-4">
        <div>
          <label class="form-label">Menu Name</label>
          <input v-model="createForm.name" class="form-input" placeholder="Main Navigation" />
        </div>
        <div>
          <label class="form-label">Slug</label>
          <input v-model="createForm.slug" class="form-input" placeholder="main-navigation" />
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <button class="btn btn-secondary" @click="showCreate = false">Cancel</button>
          <button class="btn btn-primary" @click="doCreate">Create</button>
        </div>
      </template>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { v4 as uuid } from 'uuid'
import { VueDraggable } from 'vue-draggable-plus'
import { Plus, Trash2, X, GripVertical, List } from 'lucide-vue-next'
import { useSettingsStore } from '@/stores/settings'
import { useToast } from '@/composables/useToast'
import AppModal from '@/components/common/AppModal.vue'
import type { Menu, MenuItem } from '@shared/types'

const store = useSettingsStore()
const toast = useToast()
const saving = ref(false)
const showCreate = ref(false)
const selected = ref<Menu | null>(null)
const editItems = ref<MenuItem[]>([])
const createForm = ref({ name: '', slug: '' })

onMounted(() => store.fetchMenus())

watch(() => createForm.value.name, (n) => {
  createForm.value.slug = n.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
})

function selectMenu(menu: Menu) {
  selected.value = menu
  editItems.value = menu.items.map(i => ({ ...i }))
}

function addItem() {
  editItems.value.push({ id: uuid(), label: 'New Item', url: '/', openInNewTab: false })
}

function removeItem(i: number) { editItems.value.splice(i, 1) }

async function saveMenu() {
  if (!selected.value) return
  saving.value = true
  try {
    await store.updateMenu(selected.value.id, { items: editItems.value })
    toast.success('Menu saved!')
  } catch { toast.error('Failed to save') }
  finally { saving.value = false }
}

function openCreate() { createForm.value = { name: '', slug: '' }; showCreate.value = true }

async function doCreate() {
  await store.createMenu({ name: createForm.value.name, slug: createForm.value.slug, items: [] })
  showCreate.value = false; toast.success('Menu created!')
}

async function doDelete(id: string) {
  if (!confirm('Delete this menu?')) return
  await store.deleteMenu(id); toast.success('Deleted')
  if (selected.value?.id === id) selected.value = null
}
</script>
