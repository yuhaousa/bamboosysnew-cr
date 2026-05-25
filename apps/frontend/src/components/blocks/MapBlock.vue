<template>
  <section :style="sectionStyle">
    <div v-if="content.title" class="container-content py-6">
      <h2 class="heading-md text-gray-900 dark:text-white">{{ content.title }}</h2>
    </div>
    <div class="w-full overflow-hidden" :style="{ height: content.height ?? '400px' }">
      <iframe v-if="content.embedUrl" :src="content.embedUrl" :height="content.height ?? '400px'" width="100%" style="border:0" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade" />
      <!-- Placeholder when no embed URL -->
      <div v-else class="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex flex-col items-center justify-center gap-3 text-gray-400 dark:text-gray-500">
        <svg class="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
        <p class="text-sm font-medium">Map embed URL not configured</p>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { useBlockVariant } from '@/composables/useBlockVariant'
import type { MapSectionContent, BlockStyles } from '@shared/types'
const props = defineProps<{ content: MapSectionContent; styles?: BlockStyles }>()
const { sectionStyle, isDark } = useBlockVariant(() => props.styles)
</script>
