<template>
  <div>
    <!-- Preview banner -->
    <div class="fixed top-0 inset-x-0 z-50 bg-amber-500 text-white text-center py-2 text-sm font-medium shadow-lg">
      Preview Mode — This is a draft page. Changes are not live.
    </div>
    <div class="pt-10">
      <AppHeader />
      <main>
        <div v-if="isLoading" class="section-padding container-content text-center text-gray-400">Loading preview...</div>
        <div v-else-if="error" class="section-padding container-content text-center text-red-400">{{ error }}</div>
        <template v-else>
          <component v-for="block in visibleBlocks" :key="block.id"
            :is="blockMap[block.type] ?? RichTextBlock"
            :content="block.content" :styles="block.styles" />
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

const blockMap: Record<string, any> = {
  hero_banner: HeroBlock, image_left_content_right: ImageTextBlock, content_left_image_right: ImageTextBlock,
  centered_text: CenteredTextBlock, feature_cards: FeatureCardsBlock, services_section: ServicesBlock,
  course_listing: CourseListingBlock, about_section: AboutBlock, gallery_section: GalleryBlock,
  video_section: VideoBlock, testimonials: TestimonialsBlock, faq: FAQBlock, call_to_action: CTABlock,
  statistics_counters: StatisticsBlock, team_section: TeamBlock, pricing_section: PricingBlock,
  contact_section: ContactBlock, map_section: MapBlock, newsletter_section: NewsletterBlock,
  rich_text: RichTextBlock, custom_html: CustomHTMLBlock,
}

const route = useRoute()
const { blocks, isLoading, error, loadPreview } = usePageData()
const pageId = route.params.pageId as string

// Live blocks pushed via postMessage from the admin editor
const liveBlocks = ref<Block[] | null>(null)

// Only use liveBlocks when it actually has entries (guards against race
// condition where admin sends [] before the store finishes loading)
const visibleBlocks = computed(() =>
  (liveBlocks.value?.length ? liveBlocks.value : blocks.value ?? []).filter(b => b.isVisible !== false)
)

function handleMessage(e: MessageEvent) {
  if (e.data?.type === 'PREVIEW_BLOCKS' && Array.isArray(e.data.blocks)) {
    liveBlocks.value = e.data.blocks
  }
}

onMounted(() => {
  loadPreview(pageId)
  window.addEventListener('message', handleMessage)
  // Signal to the parent (PreviewFrame) that this page is ready to receive blocks
  window.parent.postMessage({ type: 'PREVIEW_READY' }, '*')
})

onUnmounted(() => {
  window.removeEventListener('message', handleMessage)
})
</script>
