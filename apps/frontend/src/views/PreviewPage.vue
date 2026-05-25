<template>
  <div>
    <!-- Preview banner (sticky so it scrolls away, header sticks normally below) -->
    <div class="sticky top-0 z-[60] bg-amber-500 text-white text-center py-2 text-sm font-medium shadow-lg">
      Preview Mode — This is a draft page. Changes are not live.
    </div>
    <div>
      <AppHeader />
      <main>
        <div v-if="isLoading" class="section-padding container-content text-center text-gray-400">Loading preview...</div>
        <div v-else-if="error" class="section-padding container-content text-center text-red-400">{{ error }}</div>
        <template v-else>
          <div
            v-for="block in visibleBlocks"
            :key="block.id"
            class="relative"
            :data-block-id="block.id"
            @mouseenter="editMode && (hoveredBlockId = block.id)"
            @mouseleave="editMode && hoveredBlockId === block.id && (hoveredBlockId = null)"
            @click.capture="editMode && handleBlockClick($event, block)"
          >
            <!-- Edit mode overlays -->
            <template v-if="editMode">
              <!-- Outline ring -->
              <div
                class="absolute inset-0 z-20 pointer-events-none transition-all duration-150"
                :class="activeBlockId === block.id
                  ? 'ring-2 ring-inset ring-blue-500'
                  : hoveredBlockId === block.id
                    ? 'ring-2 ring-inset ring-blue-400/50'
                    : ''"
              />
              <!-- Floating action bar -->
              <Transition name="bar-fade">
                <div
                  v-if="hoveredBlockId === block.id || activeBlockId === block.id"
                  data-cms-bar
                  class="absolute top-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-0.5 bg-gray-950 text-white rounded-full shadow-2xl border border-gray-700 px-2 py-1"
                  @click.stop
                >
                  <span class="text-xs text-gray-400 font-medium pr-1.5 pl-1 whitespace-nowrap">{{ blockLabels[block.type] ?? block.type }}</span>
                  <div class="w-px h-3 bg-gray-700 mx-0.5" />
                  <!-- Quick variant switcher -->
                  <button
                    v-for="v in quickVariants" :key="v.value"
                    @click.stop="emitStyleChange(block.id, { variant: block.styles?.variant === v.value ? undefined : v.value })"
                    :title="v.label"
                    :class="[v.dot, block.styles?.variant === v.value ? 'ring-2 ring-blue-400 ring-offset-1 ring-offset-gray-950' : 'opacity-60 hover:opacity-100']"
                    class="inline-flex items-center justify-center w-5 h-5 rounded-full text-[9px] font-bold transition-all shrink-0"
                  >
                    <span :class="v.textColor">{{ v.short }}</span>
                  </button>
                  <div class="w-px h-3 bg-gray-700 mx-0.5" />
                  <!-- Open in sidebar -->
                  <button
                    @click.stop="emitBlockClick(block.id)"
                    class="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors px-1 py-0.5 rounded"
                    title="Edit in sidebar"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                    Edit
                  </button>
                  <div class="w-px h-3 bg-gray-700 mx-0.5" />
                  <!-- Block actions -->
                  <button @click.stop="emitBlockAction(block.id, 'moveUp')" title="Move up" class="p-1 text-gray-400 hover:text-white transition-colors rounded text-sm leading-none">↑</button>
                  <button @click.stop="emitBlockAction(block.id, 'moveDown')" title="Move down" class="p-1 text-gray-400 hover:text-white transition-colors rounded text-sm leading-none">↓</button>
                  <button @click.stop="emitBlockAction(block.id, 'duplicate')" title="Duplicate block" class="p-1 text-gray-400 hover:text-blue-400 transition-colors rounded text-sm leading-none">⎘</button>
                  <button @click.stop="emitBlockAction(block.id, 'delete')" title="Delete block" class="p-1 text-gray-400 hover:text-red-400 transition-colors rounded text-sm leading-none">✕</button>
                </div>
              </Transition>
            </template>

            <!-- Block component -->
            <component
              :is="blockMap[block.type] ?? RichTextBlock"
              :content="block.content"
              :styles="block.styles"
            />
          </div>
        </template>
      </main>
      <AppFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import { usePageData } from '@/composables/usePageData'
import type { Block, BlockType } from '@shared/types'

import HeroBlock from '@/components/blocks/HeroBlock.vue'
import ImageTextBlock from '@/components/blocks/ImageTextBlock.vue'
import CenteredTextBlock from '@/components/blocks/CenteredTextBlock.vue'
import FeatureCardsBlock from '@/components/blocks/FeatureCardsBlock.vue'
import ServicesBlock from '@/components/blocks/ServicesBlock.vue'
import CourseListingBlock from '@/components/blocks/CourseListingBlock.vue'
import AboutBlock from '@/components/blocks/AboutBlock.vue'
import GalleryBlock from '@/components/blocks/GalleryBlock.vue'
import VideoBlock from '@/components/blocks/VideoBlock.vue'
import TestimonialsBlock from '@/components/blocks/TestimonialsBlock.vue'
import FAQBlock from '@/components/blocks/FAQBlock.vue'
import CTABlock from '@/components/blocks/CTABlock.vue'
import StatisticsBlock from '@/components/blocks/StatisticsBlock.vue'
import TeamBlock from '@/components/blocks/TeamBlock.vue'
import PricingBlock from '@/components/blocks/PricingBlock.vue'
import ContactBlock from '@/components/blocks/ContactBlock.vue'
import MapBlock from '@/components/blocks/MapBlock.vue'
import NewsletterBlock from '@/components/blocks/NewsletterBlock.vue'
import RichTextBlock from '@/components/blocks/RichTextBlock.vue'
import CustomHTMLBlock from '@/components/blocks/CustomHTMLBlock.vue'
import PortfolioBlock from '@/components/blocks/PortfolioBlock.vue'

const blockMap: Record<string, any> = {
  hero_banner: HeroBlock, image_left_content_right: ImageTextBlock, content_left_image_right: ImageTextBlock,
  centered_text: CenteredTextBlock, feature_cards: FeatureCardsBlock, services_section: ServicesBlock,
  course_listing: CourseListingBlock, about_section: AboutBlock, gallery_section: GalleryBlock,
  video_section: VideoBlock, testimonials: TestimonialsBlock, faq: FAQBlock, call_to_action: CTABlock,
  statistics_counters: StatisticsBlock, team_section: TeamBlock, pricing_section: PricingBlock,
  contact_section: ContactBlock, map_section: MapBlock, newsletter_section: NewsletterBlock,
  rich_text: RichTextBlock, custom_html: CustomHTMLBlock,
  portfolio_section: PortfolioBlock,
}

const blockLabels: Record<string, string> = {
  hero_banner: 'Hero Banner', image_left_content_right: 'Image + Text', content_left_image_right: 'Text + Image',
  centered_text: 'Centered Text', feature_cards: 'Feature Cards', services_section: 'Services',
  course_listing: 'Courses', about_section: 'About', gallery_section: 'Gallery', video_section: 'Video',
  testimonials: 'Testimonials', faq: 'FAQ', call_to_action: 'Call to Action',
  statistics_counters: 'Statistics', team_section: 'Team', pricing_section: 'Pricing',
  contact_section: 'Contact', map_section: 'Map', newsletter_section: 'Newsletter',
  rich_text: 'Rich Text', custom_html: 'Custom HTML',
  portfolio_section: 'Portfolio',
}

const quickVariants = [
  { value: 'light', label: 'Light background', short: 'L', dot: 'bg-white border border-gray-300', textColor: 'text-gray-700' },
  { value: 'dark', label: 'Dark background', short: 'D', dot: 'bg-gray-900 border border-gray-600', textColor: 'text-white' },
  { value: 'glass', label: 'Glass / Navy', short: 'G', dot: 'bg-gradient-to-br from-slate-700 to-blue-900 border border-blue-700', textColor: 'text-white' },
  { value: 'gradient', label: 'Gradient', short: '~', dot: 'bg-gradient-to-br from-blue-200 to-white border border-blue-300', textColor: 'text-blue-800' },
]

const route = useRoute()
const { blocks, isLoading, error, loadPreview } = usePageData()
const pageId = route.params.pageId as string

const liveBlocks = ref<Block[] | null>(null)
const editMode = ref(false)
const hoveredBlockId = ref<string | null>(null)
const activeBlockId = ref<string | null>(null)

const visibleBlocks = computed(() =>
  (liveBlocks.value?.length ? liveBlocks.value : blocks.value ?? []).filter(b => b.isVisible !== false)
)

// ── Inline text editing ──────────────────────────────────────────────────────
let contentDebounceTimer: ReturnType<typeof setTimeout>

function handleBlockClick(e: MouseEvent, block: Block) {
  // Don't intercept clicks on the floating action bar
  if ((e.target as HTMLElement).closest('[data-cms-bar]')) return

  activeBlockId.value = block.id
  emitBlockClick(block.id)

  const target = e.target as HTMLElement
  const fieldEl = target.closest('[data-cms-field]') as HTMLElement | null
  if (!fieldEl) return

  // Remove previous editable
  document.querySelectorAll<HTMLElement>('[contenteditable="true"]').forEach(el => {
    if (el !== fieldEl) {
      el.removeAttribute('contenteditable')
      el.style.outline = ''
    }
  })

  fieldEl.contentEditable = 'true'
  fieldEl.style.outline = '2px solid rgba(59,130,246,0.6)'
  fieldEl.style.outlineOffset = '2px'
  fieldEl.style.borderRadius = '2px'
  fieldEl.focus()

  const field = fieldEl.dataset.cmsField!
  const onInput = () => {
    clearTimeout(contentDebounceTimer)
    contentDebounceTimer = setTimeout(() => {
      window.parent.postMessage({
        type: 'PREVIEW_CONTENT_CHANGE',
        blockId: block.id,
        field,
        value: fieldEl.textContent ?? '',
      }, '*')
    }, 400)
  }
  const onKeydown = (ke: KeyboardEvent) => {
    if (ke.key === 'Escape' || ke.key === 'Enter') {
      ke.preventDefault()
      fieldEl.removeAttribute('contenteditable')
      fieldEl.style.outline = ''
      fieldEl.removeEventListener('input', onInput)
      fieldEl.removeEventListener('keydown', onKeydown)
    }
  }
  fieldEl.addEventListener('blur', () => {
    fieldEl.removeAttribute('contenteditable')
    fieldEl.style.outline = ''
    fieldEl.removeEventListener('input', onInput)
    fieldEl.removeEventListener('keydown', onKeydown)
  }, { once: true })
  fieldEl.addEventListener('input', onInput)
  fieldEl.addEventListener('keydown', onKeydown)
  e.stopPropagation()
}

function emitBlockClick(blockId: string) {
  window.parent.postMessage({ type: 'PREVIEW_BLOCK_CLICK', blockId }, '*')
}

function emitStyleChange(blockId: string, styles: Record<string, unknown>) {
  // Optimistic update — apply immediately without waiting for round-trip
  if (liveBlocks.value) {
    const b = liveBlocks.value.find(b => b.id === blockId)
    if (b) (b as any).styles = { ...(b.styles ?? {}), ...styles }
  }
  window.parent.postMessage({ type: 'PREVIEW_STYLE_CHANGE', blockId, styles }, '*')
}

function emitBlockAction(blockId: string, action: string) {
  window.parent.postMessage({ type: 'PREVIEW_BLOCK_ACTION', blockId, action }, '*')
}

// ── postMessage handler ──────────────────────────────────────────────────────
function handleMessage(e: MessageEvent) {
  const { type, ...data } = e.data ?? {}
  if (type === 'PREVIEW_BLOCKS' && Array.isArray(data.blocks)) {
    liveBlocks.value = data.blocks
  } else if (type === 'PREVIEW_EDIT_MODE') {
    editMode.value = data.enabled ?? true
  } else if (type === 'PREVIEW_SELECT_BLOCK') {
    activeBlockId.value = data.blockId ?? null
    if (data.blockId) {
      const el = document.querySelector(`[data-block-id="${data.blockId}"]`)
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }
}

onMounted(() => {
  loadPreview(pageId)
  window.addEventListener('message', handleMessage)
  window.parent.postMessage({ type: 'PREVIEW_READY' }, '*')
})

onUnmounted(() => window.removeEventListener('message', handleMessage))
</script>

<style scoped>
.bar-fade-enter-active,
.bar-fade-leave-active { transition: opacity 0.12s, transform 0.12s; }
.bar-fade-enter-from,
.bar-fade-leave-to { opacity: 0; transform: translateX(-50%) translateY(-6px); }
.bar-fade-enter-to,
.bar-fade-leave-from { opacity: 1; transform: translateX(-50%) translateY(0); }
</style>
