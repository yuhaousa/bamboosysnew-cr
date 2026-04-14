<template>
  <section :style="sectionStyle" class="section-padding">
    <div class="container-content">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div v-if="content.image?.url">
          <img :src="content.image.url" :alt="content.image.alt" class="w-full rounded-2xl shadow-xl" />
        </div>
        <div class="space-y-6">
          <span v-if="content.badge" class="badge-section">{{ content.badge }}</span>
          <h2 class="heading-lg text-gray-900 dark:text-white">{{ content.title }}</h2>
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{{ content.description }}</p>
          <ul v-if="content.highlights?.length" class="space-y-3">
            <li v-for="h in content.highlights" :key="h" class="flex items-center gap-3">
              <div class="w-5 h-5 rounded-full bg-green-100 dark:bg-green-950/50 flex items-center justify-center flex-shrink-0">
                <svg class="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span class="text-gray-700 dark:text-gray-300 text-sm">{{ h }}</span>
            </li>
          </ul>
          <div v-if="content.stats?.length" class="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div v-for="stat in content.stats" :key="stat.label" class="text-center">
              <p class="text-2xl font-bold text-brand-600 dark:text-brand-400">{{ stat.value }}</p>
              <p class="text-xs text-gray-500">{{ stat.label }}</p>
            </div>
          </div>
          <div v-if="content.buttons?.length" class="flex flex-wrap gap-3">
            <a v-for="btn in content.buttons" :key="btn.id" :href="btn.link" :class="btn.variant === 'primary' ? 'btn-hero-primary' : 'btn-hero-secondary'">{{ btn.text }}</a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import type { AboutSectionContent, BlockStyles } from '@shared/types'
const props = defineProps<{ content: AboutSectionContent; styles?: BlockStyles }>()
const sectionStyle = computed(() => ({ backgroundColor: props.styles?.backgroundColor ?? undefined }))
</script>
