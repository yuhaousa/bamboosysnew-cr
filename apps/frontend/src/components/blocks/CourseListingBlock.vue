<template>
  <section :style="sectionStyle" class="section-padding">
    <div class="container-content">
      <div class="text-center max-w-2xl mx-auto mb-12">
        <span v-if="content.badge" class="badge-section">{{ content.badge }}</span>
        <h2 v-if="content.title" class="heading-lg text-gray-900 dark:text-white">{{ content.title }}</h2>
        <p v-if="content.description" class="mt-4 text-gray-600 dark:text-gray-400">{{ content.description }}</p>
      </div>
      <div :class="`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${content.columns ?? 3} gap-6`">
        <div v-for="course in content.courses" :key="course.id" class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 overflow-hidden hover:shadow-lg transition-all group">
          <div v-if="course.image?.url" class="aspect-video overflow-hidden">
            <img :src="course.image.url" :alt="course.image.alt" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          </div>
          <div class="p-5">
            <div class="flex items-center gap-2 mb-2">
              <span v-if="course.level" class="text-xs bg-brand-100 dark:bg-brand-950/50 text-brand-700 dark:text-brand-400 px-2 py-0.5 rounded-full font-medium">{{ course.level }}</span>
              <span v-if="course.duration" class="text-xs text-gray-400">{{ course.duration }}</span>
            </div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-2">{{ course.title }}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">{{ course.description }}</p>
            <div class="flex items-center justify-between">
              <span v-if="course.price" class="font-bold text-brand-600 dark:text-brand-400">{{ course.price }}</span>
              <a v-if="course.link" :href="course.link" class="btn-hero-primary text-sm py-2 px-4">Enroll</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import type { CourseListingContent, BlockStyles } from '@shared/types'
const props = defineProps<{ content: CourseListingContent; styles?: BlockStyles }>()
const sectionStyle = computed(() => ({ backgroundColor: props.styles?.backgroundColor ?? undefined }))
</script>
