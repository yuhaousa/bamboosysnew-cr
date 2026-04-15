<template>
  <div class="h-full flex flex-col">
    <template v-if="block">
      <!-- Tabs -->
      <div class="flex border-b border-gray-200 dark:border-gray-800 px-4 shrink-0">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="px-3 py-3 text-sm font-medium border-b-2 transition-colors -mb-px"
          :class="activeTab === tab.id
            ? 'border-brand-500 text-brand-600 dark:text-brand-400'
            : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-4 space-y-4">
        <!-- Content tab -->
        <template v-if="activeTab === 'content'">
          <component
            :is="editorComponent"
            :content="block.content"
            @update="(c: unknown) => $emit('update-content', c)"
          />
        </template>

        <!-- Style tab -->
        <template v-if="activeTab === 'style'">
          <StylePanel :styles="block.styles" @update="(s: unknown) => $emit('update-styles', s)" />
        </template>

        <!-- Visibility tab -->
        <template v-if="activeTab === 'visibility'">
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-gray-100">Block Visibility</p>
                <p class="text-xs text-gray-500 mt-0.5">Toggle whether this block is visible on the page</p>
              </div>
              <button
                @click="$emit('update-visibility', !props.block?.isVisible)"
                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none"
                :class="block.isVisible ? 'bg-brand-600' : 'bg-gray-300 dark:bg-gray-600'"
              >
                <span
                  class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow"
                  :class="block.isVisible ? 'translate-x-6' : 'translate-x-1'"
                />
              </button>
            </div>
          </div>
        </template>
      </div>
    </template>

    <!-- Empty state -->
    <div v-else class="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <MousePointerClick class="w-10 h-10 text-gray-300 dark:text-gray-600 mb-3" />
      <p class="text-sm text-gray-500 dark:text-gray-400">Select a block to edit</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineAsyncComponent } from 'vue'
import { MousePointerClick } from 'lucide-vue-next'
import StylePanel from './StylePanel.vue'
import type { Block } from '@shared/types'

const props = defineProps<{
  block: Block | null
}>()

defineEmits<{
  'update-content': [unknown]
  'update-styles': [unknown]
  'update-visibility': [boolean]
}>()

const activeTab = ref('content')

const tabs = [
  { id: 'content', label: 'Content' },
  { id: 'style', label: 'Style' },
  { id: 'visibility', label: 'Visibility' },
]

const editorMap: Record<string, ReturnType<typeof defineAsyncComponent>> = {
  hero_banner: defineAsyncComponent(() => import('./block-editors/HeroEditor.vue')),
  image_left_content_right: defineAsyncComponent(() => import('./block-editors/ImageTextEditor.vue')),
  content_left_image_right: defineAsyncComponent(() => import('./block-editors/ImageTextEditor.vue')),
  centered_text: defineAsyncComponent(() => import('./block-editors/CenteredTextEditor.vue')),
  feature_cards: defineAsyncComponent(() => import('./block-editors/FeatureCardsEditor.vue')),
  services_section: defineAsyncComponent(() => import('./block-editors/ServicesEditor.vue')),
  course_listing: defineAsyncComponent(() => import('./block-editors/CourseListingEditor.vue')),
  about_section: defineAsyncComponent(() => import('./block-editors/AboutEditor.vue')),
  gallery_section: defineAsyncComponent(() => import('./block-editors/GalleryEditor.vue')),
  video_section: defineAsyncComponent(() => import('./block-editors/VideoEditor.vue')),
  testimonials: defineAsyncComponent(() => import('./block-editors/TestimonialsEditor.vue')),
  faq: defineAsyncComponent(() => import('./block-editors/FAQEditor.vue')),
  call_to_action: defineAsyncComponent(() => import('./block-editors/CTAEditor.vue')),
  statistics_counters: defineAsyncComponent(() => import('./block-editors/StatisticsEditor.vue')),
  team_section: defineAsyncComponent(() => import('./block-editors/TeamEditor.vue')),
  pricing_section: defineAsyncComponent(() => import('./block-editors/PricingEditor.vue')),
  contact_section: defineAsyncComponent(() => import('./block-editors/ContactEditor.vue')),
  map_section: defineAsyncComponent(() => import('./block-editors/MapEditor.vue')),
  newsletter_section: defineAsyncComponent(() => import('./block-editors/NewsletterEditor.vue')),
  rich_text: defineAsyncComponent(() => import('./block-editors/RichTextEditor.vue')),
  custom_html: defineAsyncComponent(() => import('./block-editors/CustomHTMLEditor.vue')),
}

const editorComponent = computed(() => {
  if (!props.block) return null
  return editorMap[props.block.type] ?? null
})
</script>
