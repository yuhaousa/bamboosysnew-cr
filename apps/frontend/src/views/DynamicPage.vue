<template>
  <div>
    <AppHeader />
    <main>
      <!-- Loading skeleton -->
      <div v-if="isLoading" class="section-padding container-content space-y-4">
        <div class="h-12 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse max-w-lg" />
        <div class="h-6 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse max-w-md" />
        <div class="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse mt-8" />
      </div>
      <!-- Error / Not found -->
      <div v-else-if="error" class="section-padding container-content text-center">
        <h1 class="heading-xl text-gray-900 dark:text-white mb-4">Page Not Found</h1>
        <p class="text-gray-500 mb-8">The page you're looking for doesn't exist.</p>
        <a href="/" class="btn-hero-primary inline-flex">Go Home</a>
      </div>
      <!-- Blocks -->
      <template v-else>
        <component
          v-for="block in visibleBlocks"
          :key="block.id"
          :is="blockComponent(block.type)"
          :content="block.content"
          :styles="block.styles"
          :reverse="block.type === 'content_left_image_right'"
          :style="blockCustomStyles(block)"
        />
      </template>
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import { usePageData } from '@/composables/usePageData'
import { useSiteSettings } from '@/composables/useSiteSettings'
import type { Block, BlockType } from '@shared/types'

// Block components
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

const blockMap: Record<BlockType, any> = {
  hero_banner: HeroBlock,
  image_left_content_right: ImageTextBlock,
  content_left_image_right: ImageTextBlock,
  centered_text: CenteredTextBlock,
  feature_cards: FeatureCardsBlock,
  services_section: ServicesBlock,
  course_listing: CourseListingBlock,
  about_section: AboutBlock,
  gallery_section: GalleryBlock,
  video_section: VideoBlock,
  testimonials: TestimonialsBlock,
  faq: FAQBlock,
  call_to_action: CTABlock,
  statistics_counters: StatisticsBlock,
  team_section: TeamBlock,
  pricing_section: PricingBlock,
  contact_section: ContactBlock,
  map_section: MapBlock,
  newsletter_section: NewsletterBlock,
  rich_text: RichTextBlock,
  custom_html: CustomHTMLBlock,
}

const route = useRoute()
const { page, blocks, isLoading, error, loadBySlug } = usePageData()
const { load: loadSettings } = useSiteSettings()

const slug = computed(() => {
  const s = route.params.slug
  return Array.isArray(s) ? s.join('/') || 'home' : s || 'home'
})

onMounted(async () => {
  await loadSettings()
  await loadBySlug(slug.value)
})

watch(slug, (s) => loadBySlug(s))

const visibleBlocks = computed(() => (blocks.value ?? []).filter(b => b.isVisible !== false))

function blockComponent(type: BlockType) {
  return blockMap[type] ?? RichTextBlock
}

function blockCustomStyles(block: Block) {
  const s = block.styles
  if (!s) return {}
  return {
    paddingTop: s.paddingTop ? `${s.paddingTop}px` : undefined,
    paddingBottom: s.paddingBottom ? `${s.paddingBottom}px` : undefined,
    paddingLeft: s.paddingLeft ? `${s.paddingLeft}px` : undefined,
    paddingRight: s.paddingRight ? `${s.paddingRight}px` : undefined,
    color: s.textColor ?? undefined,
    backgroundImage: s.backgroundImage ? `url('${s.backgroundImage}')` : undefined,
  }
}
</script>
