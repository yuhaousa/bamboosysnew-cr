<template>
  <div class="h-[calc(100vh-64px)] flex flex-col overflow-hidden">
    <!-- Topbar actions -->
    <div class="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex-shrink-0">
      <div class="flex items-center gap-3">
        <RouterLink to="/pages" class="btn btn-ghost py-1.5 px-2.5 text-sm">
          <ArrowLeft class="w-4 h-4" />
        </RouterLink>
        <div>
          <h1 class="text-sm font-semibold text-gray-900 dark:text-white leading-tight">{{ page?.title ?? 'Loading...' }}</h1>
          <div class="flex items-center gap-2">
            <span :class="page?.status === 'published' ? 'badge-green' : 'badge-yellow'" class="badge text-xs">{{ page?.status }}</span>
            <span v-if="autoSaving" class="text-xs text-gray-400">• auto-saving…</span>
            <span v-else-if="isDirty" class="text-xs text-amber-500">• unsaved changes</span>
            <span v-else-if="lastSavedAt" class="text-xs text-gray-400">• saved {{ lastSavedAt }}</span>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <!-- Undo / Redo -->
        <button @click="undo" :disabled="historyIndex <= 0" class="btn btn-ghost py-1.5 px-2 text-sm" title="Undo (Ctrl+Z)">
          <Undo2 class="w-4 h-4" />
        </button>
        <button @click="redo" :disabled="historyIndex >= history.length - 1" class="btn btn-ghost py-1.5 px-2 text-sm" title="Redo (Ctrl+Y)">
          <Redo2 class="w-4 h-4" />
        </button>
        <div class="w-px h-5 bg-gray-200 dark:bg-gray-700" />
        <!-- Panel toggles -->
        <button @click="showSEO = !showSEO" :class="showSEO ? 'bg-gray-100 dark:bg-gray-800' : ''" class="btn btn-ghost py-1.5 px-2.5 text-sm" title="SEO Settings">
          <Search class="w-4 h-4" />
        </button>
        <button @click="showRevisions = !showRevisions" class="btn btn-ghost py-1.5 px-2.5 text-sm" title="Revisions">
          <History class="w-4 h-4" />
        </button>
        <button @click="togglePreview" class="btn btn-ghost py-1.5 px-2.5 text-sm" title="Preview">
          <Eye class="w-4 h-4" />
        </button>
        <button @click="savePage" :disabled="saving" class="btn btn-secondary py-1.5 text-sm">
          <Save class="w-4 h-4" /> {{ saving ? 'Saving...' : 'Save' }}
        </button>
        <button v-if="page?.status !== 'published'" @click="publishPage" :disabled="saving" class="btn btn-primary py-1.5 text-sm">
          <Globe class="w-4 h-4" /> Publish
        </button>
        <button v-else @click="unpublishPage" class="btn btn-secondary py-1.5 text-sm text-amber-500">
          <EyeOff class="w-4 h-4" /> Unpublish
        </button>
      </div>
    </div>

    <!-- Main editor area -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Left: block editor panel -->
      <div class="w-80 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 overflow-y-auto flex flex-col bg-white dark:bg-gray-900">
        <div v-if="!selectedBlock">
          <BlockList
            :blocks="blocksStore.blocks"
            :selected-block-id="selectedBlockId"
            :page-id="pageId"
            @select="selectBlock"
            @add-block="showBlockPicker = true"
            @add-block-after="id => { insertAfterId = id; showBlockPicker = true }"
            @delete="deleteBlock"
            @duplicate="duplicateBlock"
            @toggle-visibility="toggleVisibility"
            @reorder="reorderBlocks"
          />
        </div>
        <div v-else class="flex-1">
          <div class="flex items-center gap-2 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <button @click="selectedBlockId = null" class="btn btn-ghost py-1 px-2">
              <ChevronLeft class="w-4 h-4" />
            </button>
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Edit Block</span>
            <div class="flex-1" />
            <!-- Copy / Paste style buttons -->
            <button
              @click="copyStyles"
              class="btn btn-ghost py-1 px-2 text-xs gap-1"
              title="Copy styles"
            >
              <ClipboardCopy class="w-3.5 h-3.5" />
              <span class="hidden sm:inline">Copy Style</span>
            </button>
            <button
              v-if="copiedStyles"
              @click="pasteStyles"
              class="btn btn-ghost py-1 px-2 text-xs gap-1 text-brand-500"
              title="Paste styles"
            >
              <ClipboardPaste class="w-3.5 h-3.5" />
              <span class="hidden sm:inline">Paste</span>
            </button>
          </div>
          <BlockEditor
            :block="selectedBlock"
            @update-content="updateBlockContent"
            @update-styles="updateBlockStyles"
            @update-visibility="updateBlockVisibility"
          />
        </div>

        <!-- SEO Panel below blocks -->
        <div v-if="showSEO && page" class="border-t border-gray-200 dark:border-gray-700 p-4">
          <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">SEO Settings</h3>
          <SEOPanel :data="seoData" @update="onSEOUpdate" />
        </div>
      </div>

      <!-- Right: Preview -->
      <div class="flex-1 overflow-hidden">
        <PreviewFrame
          :preview-url="previewUrl"
          :blocks="blocksStore.blocks"
          :selected-block-id="selectedBlockId"
          @block-click="onPreviewBlockClick"
          @content-change="onPreviewContentChange"
          @style-change="onPreviewStyleChange"
          @block-action="onPreviewBlockAction"
        />
      </div>
    </div>

    <!-- Block Picker Modal -->
    <BlockPicker v-model="showBlockPicker" @select="addBlock" />

    <!-- Revisions panel via modal -->
    <AppModal v-model="showRevisions" title="Page Revisions" size="lg">
      <div v-if="revisions.length === 0" class="text-center py-8 text-gray-400 text-sm">No revisions yet. Revisions are created when you publish.</div>
      <div v-else class="space-y-2">
        <div v-for="rev in revisions" :key="rev.id" class="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
          <div>
            <p class="text-sm font-medium text-gray-900 dark:text-white">{{ formatDate(rev.createdAt) }}</p>
            <p class="text-xs text-gray-400">{{ rev.blockCount }} blocks</p>
          </div>
          <button @click="restoreRevision(rev.id)" class="btn btn-secondary text-xs py-1">Restore</button>
        </div>
      </div>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import {
  ArrowLeft, Save, Globe, EyeOff, Eye, History, Search, ChevronLeft,
  Undo2, Redo2, ClipboardCopy, ClipboardPaste
} from 'lucide-vue-next'
import { usePagesStore } from '@/stores/pages'
import { useBlocksStore } from '@/stores/blocks'
import { useToast } from '@/composables/useToast'
import { api } from '@/lib/api'
import BlockList from '@/components/builder/BlockList.vue'
import BlockEditor from '@/components/builder/BlockEditor.vue'
import BlockPicker from '@/components/builder/BlockPicker.vue'
import SEOPanel from '@/components/builder/SEOPanel.vue'
import PreviewFrame from '@/components/preview/PreviewFrame.vue'
import AppModal from '@/components/common/AppModal.vue'
import { getDefaultContent, getDefaultStyles } from '@shared/constants/defaultContent'
import type { Block, BlockType, BlockContent, BlockStyles, PageRevision } from '@shared/types'

const route = useRoute()
const pagesStore = usePagesStore()
const blocksStore = useBlocksStore()
const toast = useToast()

const pageId = route.params.id as string
const saving = ref(false)
const autoSaving = ref(false)
const isDirty = ref(false)
const lastSavedAt = ref<string | null>(null)
const showBlockPicker = ref(false)
const insertAfterId = ref<string | null>(null)
const showSEO = ref(false)
const showRevisions = ref(false)
const showPreview = ref(true)
const selectedBlockId = ref<string | null>(null)
const revisions = ref<PageRevision[]>([])

// ── Copy / Paste styles ───────────────────────────────────────────────────────
const copiedStyles = ref<BlockStyles | null>(null)

function copyStyles() {
  if (!selectedBlock.value) return
  copiedStyles.value = JSON.parse(JSON.stringify(selectedBlock.value.styles ?? {}))
  toast.success('Style copied')
}

function pasteStyles() {
  if (!selectedBlock.value || !copiedStyles.value) return
  updateBlockStyles({ ...copiedStyles.value })
  toast.success('Style pasted')
}

// ── Undo / Redo ───────────────────────────────────────────────────────────────
interface HistoryEntry { blocks: Block[] }
const history = ref<HistoryEntry[]>([])
const historyIndex = ref(-1)
const isApplyingHistory = ref(false)

function snapshotHistory() {
  if (isApplyingHistory.value) return
  // Trim future if we branched
  history.value = history.value.slice(0, historyIndex.value + 1)
  history.value.push({ blocks: JSON.parse(JSON.stringify(blocksStore.blocks)) })
  // Keep max 50 states
  if (history.value.length > 50) history.value.shift()
  historyIndex.value = history.value.length - 1
}

function undo() {
  if (historyIndex.value <= 0) return
  historyIndex.value--
  applyHistoryEntry(history.value[historyIndex.value])
}

function redo() {
  if (historyIndex.value >= history.value.length - 1) return
  historyIndex.value++
  applyHistoryEntry(history.value[historyIndex.value])
}

function applyHistoryEntry(entry: HistoryEntry) {
  isApplyingHistory.value = true
  blocksStore.blocks.splice(0, blocksStore.blocks.length, ...JSON.parse(JSON.stringify(entry.blocks)))
  // Stage all blocks as pending changes
  for (const b of blocksStore.blocks) {
    pendingBlockChanges.set(b.id, { content: b.content, styles: b.styles })
  }
  isDirty.value = true
  isApplyingHistory.value = false
}

// ── Auto-save every 30 seconds ────────────────────────────────────────────────
let autoSaveTimer: ReturnType<typeof setInterval>

async function doAutoSave() {
  if (!isDirty.value || saving.value || pendingBlockChanges.size === 0) return
  autoSaving.value = true
  try {
    await Promise.all(
      Array.from(pendingBlockChanges.entries()).map(([id, changes]) =>
        blocksStore.updateBlock(pageId, id, changes)
      )
    )
    pendingBlockChanges.clear()
    isDirty.value = false
    lastSavedAt.value = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  } catch {}
  finally { autoSaving.value = false }
}

const page = computed(() => pagesStore.currentPage)
const selectedBlock = computed(() => selectedBlockId.value ? blocksStore.blocks.find(b => b.id === selectedBlockId.value) : null)
const previewUrl = computed(() => {
  if (!page.value) return ''
  return `http://localhost:8002/preview/${pageId}?token=preview`
})

const seoData = computed(() => ({
  metaTitle: page.value?.seo?.metaTitle ?? '',
  metaDescription: page.value?.seo?.metaDescription ?? '',
  ogTitle: page.value?.seo?.ogTitle ?? '',
  ogDescription: page.value?.seo?.ogDescription ?? '',
  ogImage: page.value?.seo?.ogImage ?? '',
  canonical: page.value?.seo?.canonical ?? '',
  noIndex: page.value?.seo?.noIndex ?? false,
  slug: page.value?.slug ?? '',
}))

onMounted(async () => {
  await Promise.all([pagesStore.fetchPage(pageId), blocksStore.fetchBlocks(pageId)])
  loadRevisions()
  // Initial history snapshot after blocks load
  snapshotHistory()
  // Auto-save interval
  autoSaveTimer = setInterval(doAutoSave, 30_000)
  // Keyboard shortcuts
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  pendingBlockChanges.clear()
  clearInterval(autoSaveTimer)
  window.removeEventListener('keydown', onKeydown)
})

function onKeydown(e: KeyboardEvent) {
  const meta = e.ctrlKey || e.metaKey
  if (!meta) return
  if (e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo() }
  if ((e.key === 'y') || (e.key === 'z' && e.shiftKey)) { e.preventDefault(); redo() }
  if (e.key === 's') { e.preventDefault(); savePage() }
}

async function loadRevisions() {
  try {
    const data = await api.get<{ revisions: PageRevision[] }>(`/revisions/${pageId}`)
    revisions.value = data.revisions ?? []
  } catch {}
}

function selectBlock(id: string) {
  selectedBlockId.value = id
  // Tell iframe to scroll to this block
  // (PreviewFrame watches selectedBlockId and sends PREVIEW_SELECT_BLOCK)
}

async function addBlock(type: BlockType) {
  showBlockPicker.value = false
  const sorted = [...blocksStore.blocks].sort((a, b) => a.sortOrder - b.sortOrder)
  let insertSortOrder: number
  if (insertAfterId.value) {
    const idx = sorted.findIndex(b => b.id === insertAfterId.value)
    insertSortOrder = idx >= 0 ? sorted[idx].sortOrder + 0.5 : sorted.length
  } else {
    insertSortOrder = sorted.length
  }
  insertAfterId.value = null
  const newBlock = await blocksStore.addBlock(pageId, {
    type,
    content: getDefaultContent(type),
    styles: getDefaultStyles(),
    sortOrder: insertSortOrder,
    isVisible: true,
  })
  // Renormalize sort orders
  const allSorted = [...blocksStore.blocks].sort((a, b) => a.sortOrder - b.sortOrder)
  await blocksStore.reorderBlocks(pageId, allSorted.map((b, i) => ({ id: b.id, sortOrder: i })))
  selectedBlockId.value = newBlock.id
  isDirty.value = true
  snapshotHistory()
}

async function deleteBlock(id: string) {
  if (!confirm('Delete this block?')) return
  await blocksStore.deleteBlock(pageId, id)
  if (selectedBlockId.value === id) selectedBlockId.value = null
  isDirty.value = true
  snapshotHistory()
}

async function duplicateBlock(id: string) {
  await blocksStore.duplicateBlock(pageId, id)
  isDirty.value = true
  toast.success('Block duplicated')
  snapshotHistory()
}

async function toggleVisibility(id: string) {
  const block = blocksStore.blocks.find(b => b.id === id)
  if (!block) return
  await blocksStore.updateBlock(pageId, id, { isVisible: !block.isVisible })
  isDirty.value = true
}

async function reorderBlocks(order: { id: string; sortOrder: number }[]) {
  await blocksStore.reorderBlocks(pageId, order)
  isDirty.value = true
  snapshotHistory()
}

// Pending block changes — only written to DB when user clicks Save or auto-save fires
const pendingBlockChanges = new Map<string, Partial<Block>>()

function updateBlockContent(content: BlockContent) {
  if (!selectedBlock.value) return
  const block = blocksStore.blocks.find(b => b.id === selectedBlock.value!.id)
  if (block) block.content = content as Block['content']
  isDirty.value = true
  const id = selectedBlock.value.id
  pendingBlockChanges.set(id, { ...pendingBlockChanges.get(id), content })
  snapshotHistory()
}

function updateBlockContentById(blockId: string, content: unknown) {
  const block = blocksStore.blocks.find(b => b.id === blockId)
  if (block) block.content = content as Block['content']
  isDirty.value = true
  pendingBlockChanges.set(blockId, { ...pendingBlockChanges.get(blockId), content: content as BlockContent })
  snapshotHistory()
}

function updateBlockStyles(styles: BlockStyles) {
  if (!selectedBlock.value) return
  const block = blocksStore.blocks.find(b => b.id === selectedBlock.value!.id)
  if (block) block.styles = styles
  isDirty.value = true
  const id = selectedBlock.value.id
  pendingBlockChanges.set(id, { ...pendingBlockChanges.get(id), styles })
  snapshotHistory()
}

function updateBlockStylesById(blockId: string, styles: BlockStyles) {
  const block = blocksStore.blocks.find(b => b.id === blockId)
  if (block) block.styles = styles
  isDirty.value = true
  pendingBlockChanges.set(blockId, { ...pendingBlockChanges.get(blockId), styles })
  snapshotHistory()
}

// ── Preview iframe interaction handlers ──────────────────────────────────────
async function onPreviewBlockAction(blockId: string, action: string) {
  if (action === 'duplicate') {
    await duplicateBlock(blockId)
  } else if (action === 'delete') {
    await deleteBlock(blockId)
  } else if (action === 'moveUp' || action === 'moveDown') {
    const blocks = blocksStore.blocks
    const idx = blocks.findIndex(b => b.id === blockId)
    if (idx < 0) return
    const order = blocks.map((b, i) => ({ id: b.id, sortOrder: i }))
    if (action === 'moveUp' && idx > 0) {
      ;[order[idx].sortOrder, order[idx - 1].sortOrder] = [order[idx - 1].sortOrder, order[idx].sortOrder]
      await reorderBlocks(order)
    } else if (action === 'moveDown' && idx < blocks.length - 1) {
      ;[order[idx].sortOrder, order[idx + 1].sortOrder] = [order[idx + 1].sortOrder, order[idx].sortOrder]
      await reorderBlocks(order)
    }
  }
}

function onPreviewBlockClick(blockId: string) {
  selectedBlockId.value = blockId
  // Auto-open block editor panel (sidebar switches from block list to block editor)
}

function onPreviewContentChange(blockId: string, field: string, value: string) {
  const block = blocksStore.blocks.find(b => b.id === blockId)
  if (!block) return
  const newContent = { ...(block.content as Record<string, unknown>), [field]: value }
  updateBlockContentById(blockId, newContent)
}

function onPreviewStyleChange(blockId: string, partialStyles: Partial<BlockStyles>) {
  const block = blocksStore.blocks.find(b => b.id === blockId)
  if (!block) return
  const newStyles: BlockStyles = { ...block.styles, ...partialStyles }
  updateBlockStylesById(blockId, newStyles)
}

async function updateBlockVisibility(isVisible: boolean) {
  if (!selectedBlock.value) return
  await blocksStore.updateBlock(pageId, selectedBlock.value.id, { isVisible })
}

async function savePage() {
  if (!page.value) return
  saving.value = true
  try {
    await Promise.all(
      Array.from(pendingBlockChanges.entries()).map(([id, changes]) =>
        blocksStore.updateBlock(pageId, id, changes)
      )
    )
    pendingBlockChanges.clear()
    await pagesStore.updatePage(pageId, {
      title: page.value.title,
      slug: page.value.slug,
      description: page.value.description,
      seo: page.value.seo,
    })
    isDirty.value = false
    lastSavedAt.value = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    toast.success('Saved!')
  } catch { toast.error('Failed to save') }
  finally { saving.value = false }
}

async function publishPage() {
  saving.value = true
  try {
    await savePage()
    await pagesStore.publishPage(pageId)
    toast.success('Page published!')
    loadRevisions()
  } catch { toast.error('Publish failed') }
  finally { saving.value = false }
}

async function unpublishPage() {
  await pagesStore.unpublishPage(pageId)
  toast.success('Page unpublished')
}

async function restoreRevision(revId: string) {
  await api.post(`/revisions/${pageId}/${revId}/restore`, {})
  await blocksStore.fetchBlocks(pageId)
  snapshotHistory()
  showRevisions.value = false
  toast.success('Revision restored')
}

function onSEOUpdate(data: any) {
  if (page.value) {
    Object.assign(page.value.seo!, data)
    isDirty.value = true
  }
}

function togglePreview() { showPreview.value = !showPreview.value }
function formatDate(d?: string) {
  if (!d) return ''
  return new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
}
</script>
