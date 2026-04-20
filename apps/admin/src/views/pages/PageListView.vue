<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Pages</h1>
        <p class="text-sm text-gray-500 mt-0.5">Manage all your website pages</p>
      </div>
      <button @click="openCreate" class="btn btn-primary">
        <Plus class="w-4 h-4" /> New Page
      </button>
    </div>

    <!-- Homepage indicator -->
    <div v-if="homePage" class="flex items-center gap-2 px-4 py-2.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm text-blue-700 dark:text-blue-300">
      <Home class="w-4 h-4 flex-shrink-0" />
      <span>Homepage is <strong>{{ homePage.title }}</strong> → <code class="font-mono text-xs">localhost:8002/</code> loads this page.</span>
    </div>
    <div v-else class="flex items-center gap-2 px-4 py-2.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-sm text-amber-700 dark:text-amber-300">
      <Home class="w-4 h-4 flex-shrink-0" />
      <span>No homepage set. Click the <Home class="w-3.5 h-3.5 inline" /> icon on a page to make it the homepage (slug <code class="font-mono text-xs">home</code> = root <code class="font-mono text-xs">/</code>).</span>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap items-center gap-3">
      <div class="relative flex-1 min-w-[200px]">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input v-model="search" class="form-input pl-9 w-full" placeholder="Search pages..." @input="applyFilters" />
      </div>
      <select v-model="statusFilter" @change="applyFilters" class="form-select w-auto">
        <option value="">All Status</option>
        <option value="published">Published</option>
        <option value="draft">Draft</option>
        <option value="archived">Archived</option>
      </select>
    </div>

    <!-- Table -->
    <div class="card overflow-hidden !p-0">
      <div v-if="store.loading" class="p-8 text-center text-gray-400">
        <div class="animate-spin w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full mx-auto mb-3" />
        Loading pages...
      </div>
      <div v-else-if="store.pages.length === 0" class="p-16 text-center">
        <FileText class="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p class="text-gray-500 font-medium">No pages yet</p>
        <p class="text-gray-400 text-sm mt-1">Create your first page to get started</p>
        <button @click="openCreate" class="btn btn-primary mt-4">Create Page</button>
      </div>
      <table v-else class="w-full text-sm">
        <thead class="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-700">
          <tr>
            <th class="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Title</th>
            <th class="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400 hidden md:table-cell">Slug</th>
            <th class="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Status</th>
            <th class="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400 hidden lg:table-cell">Updated</th>
            <th class="text-right px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
          <tr v-for="page in store.pages" :key="page.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
            <td class="px-4 py-3">
              <div class="flex items-center gap-2">
                <span class="font-medium text-gray-900 dark:text-white">{{ page.title }}</span>
                <span v-if="page.slug === 'home'" class="inline-flex items-center gap-1 px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded-md font-medium">
                  <Home class="w-3 h-3" /> Homepage
                </span>
              </div>
            </td>
            <td class="px-4 py-3 text-gray-500 hidden md:table-cell font-mono text-xs">/{{ page.slug }}</td>
            <td class="px-4 py-3">
              <span :class="page.status === 'published' ? 'badge-green' : page.status === 'draft' ? 'badge-yellow' : 'badge-gray'" class="badge">
                {{ page.status }}
              </span>
            </td>
            <td class="px-4 py-3 text-gray-400 text-xs hidden lg:table-cell">{{ formatDate(page.updatedAt) }}</td>
            <td class="px-4 py-3">
              <div class="flex items-center justify-end gap-1">
                <RouterLink :to="`/pages/${page.id}/edit`" class="btn btn-ghost py-1 px-2.5 text-xs">
                  <Pencil class="w-3.5 h-3.5" />
                </RouterLink>
                <button @click="doDuplicate(page.id)" class="btn btn-ghost py-1 px-2.5 text-xs" title="Duplicate">
                  <Copy class="w-3.5 h-3.5" />
                </button>
                <button v-if="page.status === 'published'" @click="doUnpublish(page.id)" class="btn btn-ghost py-1 px-2.5 text-xs text-amber-500" title="Unpublish">
                  <EyeOff class="w-3.5 h-3.5" />
                </button>
                <button v-else @click="doPublish(page.id)" class="btn btn-ghost py-1 px-2.5 text-xs text-green-500" title="Publish">
                  <Globe class="w-3.5 h-3.5" />
                </button>
                <button
                  v-if="page.slug !== 'home'"
                  @click="doSetHomepage(page)"
                  class="btn btn-ghost py-1 px-2.5 text-xs text-blue-400"
                  title="Set as Homepage"
                >
                  <Home class="w-3.5 h-3.5" />
                </button>
                <button @click="doDelete(page)" class="btn btn-ghost py-1 px-2.5 text-xs text-red-400" title="Delete">
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create Page Modal -->
    <AppModal v-model="showCreate" title="Create New Page" size="md">
      <div class="space-y-4">
        <div>
          <label class="form-label">Page Title *</label>
          <input v-model="createForm.title" class="form-input" placeholder="e.g. About Us" />
        </div>
        <div>
          <label class="form-label">URL Slug *</label>
          <div class="flex items-center gap-2">
            <span class="text-gray-400">/</span>
            <input v-model="createForm.slug" class="form-input flex-1" placeholder="about-us" />
          </div>
        </div>
        <div>
          <label class="form-label">Description</label>
          <textarea v-model="createForm.description" class="form-textarea" rows="2" />
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <button class="btn btn-secondary" @click="showCreate = false">Cancel</button>
          <button class="btn btn-primary" @click="doCreate" :disabled="!createForm.title || !createForm.slug">
            Create Page
          </button>
        </div>
      </template>
    </AppModal>

    <ConfirmDialog v-model="showDeleteConfirm" title="Delete Page" :message="`Are you sure you want to delete '${deleteTarget?.title}'? This cannot be undone.`" variant="danger" confirm-text="Delete" @confirm="execDelete" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { Plus, Search, Pencil, Copy, Globe, EyeOff, Trash2, FileText, Home } from 'lucide-vue-next'
import { usePagesStore } from '@/stores/pages'
import { useToast } from '@/composables/useToast'
import AppModal from '@/components/common/AppModal.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import type { Page } from '@shared/types'

const store = usePagesStore()
const router = useRouter()
const toast = useToast()

const search = ref('')
const statusFilter = ref('')
const homePage = computed(() => store.pages.find(p => p.slug === 'home'))
const showCreate = ref(false)
const showDeleteConfirm = ref(false)
const deleteTarget = ref<Page | null>(null)
const createForm = ref({ title: '', slug: '', description: '' })

onMounted(() => store.fetchPages())

watch(() => createForm.value.title, (t) => {
  createForm.value.slug = t.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
})

function applyFilters() {
  store.fetchPages({ search: search.value, status: statusFilter.value as any || undefined })
}

function openCreate() {
  createForm.value = { title: '', slug: '', description: '' }
  showCreate.value = true
}

async function doCreate() {
  try {
    const page = await store.createPage({ title: createForm.value.title, slug: createForm.value.slug })
    showCreate.value = false
    toast.success('Page created!')
    router.push(`/pages/${page.id}/edit`)
  } catch (e: unknown) {
    toast.error(e instanceof Error ? e.message : 'Failed to create page')
  }
}

async function doSetHomepage(page: Page) {
  if (page.slug === 'home') return
  try {
    // If another page currently owns the 'home' slug, rename it first
    const current = homePage.value
    if (current) {
      await store.updatePage(current.id, { slug: `home-${Date.now().toString(36)}` })
    }
    await store.updatePage(page.id, { slug: 'home' })
    toast.success(`"${page.title}" is now the homepage`)
  } catch (e: unknown) {
    toast.error(e instanceof Error ? e.message : 'Failed to set homepage')
  }
}

async function doPublish(id: string) {
  await store.publishPage(id); toast.success('Page published!')
}
async function doUnpublish(id: string) {
  await store.unpublishPage(id); toast.success('Page unpublished')
}
async function doDuplicate(id: string) {
  await store.duplicatePage(id); toast.success('Page duplicated!')
}

function doDelete(page: Page) {
  deleteTarget.value = page; showDeleteConfirm.value = true
}
async function execDelete() {
  if (!deleteTarget.value) return
  try {
    await store.deletePage(deleteTarget.value.id)
    toast.success('Page deleted')
    showDeleteConfirm.value = false
  } catch (e: unknown) {
    toast.error(e instanceof Error ? e.message : 'Failed to delete page')
  }
}

function formatDate(d?: string) {
  if (!d) return '-'
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>
