<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Menu Builder</h1>
        <p class="text-sm text-gray-500 mt-0.5">Manage navigation menus for your site</p>
      </div>
      <button @click="openCreate" class="btn btn-primary">
        <Plus class="w-4 h-4" /> New Menu
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Menu list -->
      <div class="space-y-2">
        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1 mb-3">Your Menus</p>
        <div v-if="store.menus.length === 0" class="text-center py-10 text-gray-400 text-sm">
          No menus yet. Create one to get started.
        </div>
        <div
          v-for="menu in store.menus" :key="menu.id"
          @click="selectMenu(menu)"
          :class="selected?.id === menu.id
            ? 'ring-2 ring-brand-500 bg-brand-50 dark:bg-brand-950/20'
            : 'hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600'"
          class="card cursor-pointer transition-all group"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                <MenuIcon class="w-4 h-4 text-gray-400" />
              </div>
              <div class="min-w-0">
                <p class="font-medium text-gray-900 dark:text-white text-sm truncate">{{ menu.name }}</p>
                <p class="text-xs text-gray-400 mt-0.5">{{ menu.slug }} · {{ menu.items.length }} item{{ menu.items.length !== 1 ? 's' : '' }}</p>
              </div>
            </div>
            <button @click.stop="doDelete(menu.id)" class="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded">
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Menu Editor -->
      <div class="lg:col-span-2">
        <div v-if="!selected" class="card text-center py-20 text-gray-400">
          <List class="w-10 h-10 mx-auto mb-3 opacity-20" />
          <p class="text-sm font-medium">Select a menu to edit</p>
          <p class="text-xs text-gray-300 dark:text-gray-600 mt-1">Click any menu on the left to manage its items</p>
        </div>
        <div v-else class="card space-y-5">
          <div class="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
            <div>
              <h2 class="font-semibold text-gray-900 dark:text-white">{{ selected.name }}</h2>
              <p class="text-xs text-gray-400 mt-0.5">slug: <code class="bg-gray-100 dark:bg-gray-800 px-1 rounded">{{ selected.slug }}</code></p>
            </div>
            <button @click="saveMenu" :disabled="saving" class="btn btn-primary">
              <Save class="w-4 h-4" />
              {{ saving ? 'Saving...' : 'Save' }}
            </button>
          </div>

          <!-- Items -->
          <div>
            <VueDraggable v-model="editItems" handle=".drag-handle" class="space-y-2">
              <div
                v-for="(item, i) in editItems" :key="item.id"
                class="group border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-xl overflow-hidden"
              >
                <div class="flex items-center gap-3 p-3">
                  <GripVertical class="w-4 h-4 text-gray-300 dark:text-gray-600 cursor-grab drag-handle flex-shrink-0" />
                  <div class="flex-1 space-y-2">
                    <div>
                      <label class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Label</label>
                      <input v-model="item.label" class="form-input text-sm mt-0.5" placeholder="e.g. About Us" />
                    </div>
                    <div>
                      <label class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Link</label>
                      <div class="flex gap-2 mt-0.5">
                        <select
                          class="form-select text-sm flex-1"
                          :value="getPagePickerValue(item.url)"
                          @change="onPagePickerChange(i, $event)"
                        >
                          <option value="">— Pick a page —</option>
                          <optgroup label="Site Pages">
                            <option v-for="p in availablePages" :key="p.id" :value="'/' + p.slug">
                              {{ p.title }} (/{{ p.slug }})
                            </option>
                          </optgroup>
                          <option value="__custom__">Custom URL…</option>
                        </select>
                        <input
                          v-if="isCustomUrl(item.url)"
                          v-model="item.url"
                          class="form-input text-sm flex-1"
                          placeholder="/path or https://..."
                        />
                      </div>
                    </div>
                  </div>
                  <div class="flex flex-col items-center gap-2 self-stretch justify-between py-0.5">
                    <label class="flex items-center gap-1 text-xs text-gray-400 cursor-pointer">
                      <input type="checkbox" v-model="item.openInNewTab" class="rounded" />
                      <span class="hidden sm:inline">New tab</span>
                    </label>
                    <button @click="removeItem(i)" class="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20">
                      <X class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </VueDraggable>

            <button
              @click="addItem"
              class="mt-3 w-full py-2.5 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-400 hover:border-brand-400 hover:text-brand-500 dark:hover:border-brand-500 transition-colors flex items-center justify-center gap-2"
            >
              <Plus class="w-4 h-4" /> Add Menu Item
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
          <input v-model="createForm.name" class="form-input" placeholder="e.g. Main Navigation" />
        </div>
        <div>
          <label class="form-label">Slug</label>
          <input v-model="createForm.slug" class="form-input" placeholder="e.g. main-navigation" />
          <p class="text-xs text-gray-400 mt-1">Used to reference this menu in theme code</p>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <button class="btn btn-secondary" @click="showCreate = false">Cancel</button>
          <button class="btn btn-primary" @click="doCreate">Create Menu</button>
        </div>
      </template>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { v4 as uuid } from 'uuid'
import { VueDraggable } from 'vue-draggable-plus'
import { Plus, Trash2, X, GripVertical, List, Save, Menu as MenuIcon } from 'lucide-vue-next'
import { useSettingsStore } from '@/stores/settings'
import { usePagesStore } from '@/stores/pages'
import { useToast } from '@/composables/useToast'
import AppModal from '@/components/common/AppModal.vue'
import type { Menu, MenuItem } from '@shared/types'

const store = useSettingsStore()
const pagesStore = usePagesStore()
const toast = useToast()
const saving = ref(false)
const showCreate = ref(false)
const selected = ref<Menu | null>(null)
const editItems = ref<MenuItem[]>([])
const createForm = ref({ name: '', slug: '' })

const availablePages = computed(() =>
  pagesStore.pages.filter(p => p.status === 'published')
)

const knownPaths = computed(() => availablePages.value.map(p => '/' + p.slug))

function isCustomUrl(url: string) {
  if (!url) return false
  if (knownPaths.value.includes(url)) return false
  return true
}

function getPagePickerValue(url: string) {
  if (!url) return ''
  if (knownPaths.value.includes(url)) return url
  return '__custom__'
}

function onPagePickerChange(i: number, e: Event) {
  const val = (e.target as HTMLSelectElement).value
  if (val === '__custom__') {
    editItems.value[i].url = ''
  } else {
    editItems.value[i].url = val
  }
}

onMounted(async () => {
  await Promise.all([store.fetchMenus(), pagesStore.fetchPages({ limit: 200 })])
})

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
  if (!createForm.value.name) return
  await store.createMenu({ name: createForm.value.name, slug: createForm.value.slug, items: [] })
  showCreate.value = false
  toast.success('Menu created!')
}

async function doDelete(id: string) {
  if (!confirm('Delete this menu? This cannot be undone.')) return
  await store.deleteMenu(id)
  toast.success('Menu deleted')
  if (selected.value?.id === id) selected.value = null
}
</script>
