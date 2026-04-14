<template>
  <section :style="sectionStyle" class="section-padding">
    <div class="container-content">
      <div class="text-center max-w-2xl mx-auto mb-12">
        <span v-if="content.badge" class="badge-section">{{ content.badge }}</span>
        <h2 v-if="content.title" class="heading-lg text-gray-900 dark:text-white">{{ content.title }}</h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="t in content.items" :key="t.id" class="p-6 bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div class="flex gap-1 mb-4">
            <svg v-for="i in 5" :key="i" :class="i <= (t.rating ?? 5) ? 'text-amber-400' : 'text-gray-200 dark:text-gray-700'" class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-5">"{{ t.content }}"</p>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-950/50 flex items-center justify-center text-brand-600 dark:text-brand-400 font-semibold text-sm flex-shrink-0">
              {{ t.name?.charAt(0).toUpperCase() }}
            </div>
            <div>
              <p class="font-semibold text-sm text-gray-900 dark:text-white">{{ t.name }}</p>
              <p class="text-xs text-gray-400">{{ t.role }}<span v-if="t.company"> · {{ t.company }}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import type { TestimonialsContent, BlockStyles } from '@shared/types'
const props = defineProps<{ content: TestimonialsContent; styles?: BlockStyles }>()
const sectionStyle = computed(() => ({ backgroundColor: props.styles?.backgroundColor ?? undefined }))
</script>
