<template>
  <section :style="sectionStyle" class="section-padding">
    <div class="container-content">
      <div class="text-center max-w-2xl mx-auto mb-12">
        <span v-if="content.badge" class="badge-section">{{ content.badge }}</span>
        <h2 class="heading-lg text-gray-900 dark:text-white">{{ content.title }}</h2>
        <p v-if="content.description" class="mt-4 text-gray-600 dark:text-gray-400">{{ content.description }}</p>
      </div>
      <div :class="`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${content.columns ?? 4} gap-6`">
        <div v-for="m in content.members" :key="m.id" class="text-center group">
          <div class="w-24 h-24 rounded-2xl overflow-hidden mx-auto mb-4 bg-brand-100 dark:bg-brand-950/50">
            <img v-if="m.image?.url" :src="m.image.url" :alt="m.image.alt" class="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            <div v-else class="w-full h-full flex items-center justify-center text-brand-600 dark:text-brand-400 font-bold text-3xl">{{ m.name?.charAt(0) }}</div>
          </div>
          <h3 class="font-semibold text-gray-900 dark:text-white">{{ m.name }}</h3>
          <p class="text-sm text-brand-600 dark:text-brand-400 font-medium">{{ m.role }}</p>
          <p v-if="m.bio" class="mt-2 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{{ m.bio }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import type { TeamSectionContent, BlockStyles } from '@shared/types'
const props = defineProps<{ content: TeamSectionContent; styles?: BlockStyles }>()
const sectionStyle = computed(() => ({ backgroundColor: props.styles?.backgroundColor ?? undefined }))
</script>
