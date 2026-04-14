<template>
  <section :style="sectionStyle" class="section-padding">
    <div class="container-content">
      <div class="text-center max-w-2xl mx-auto mb-12">
        <span v-if="content.badge" class="badge-section">{{ content.badge }}</span>
        <h2 v-if="content.title" class="heading-lg text-gray-900 dark:text-white">{{ content.title }}</h2>
        <p v-if="content.description" class="mt-4 text-gray-600 dark:text-gray-400">{{ content.description }}</p>
      </div>
      <div :class="`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${content.columns ?? 3} gap-6`">
        <div v-for="card in content.cards" :key="card.id" class="group p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:shadow-lg hover:-translate-y-1 transition-all">
          <div v-if="card.icon" class="w-12 h-12 rounded-xl bg-brand-100 dark:bg-brand-950/50 flex items-center justify-center mb-4 text-2xl">{{ card.icon }}</div>
          <h3 class="font-semibold text-gray-900 dark:text-white mb-2">{{ card.title }}</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">{{ card.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import type { FeatureCardsContent, BlockStyles } from '@shared/types'
const props = defineProps<{ content: FeatureCardsContent; styles?: BlockStyles }>()
const sectionStyle = computed(() => ({ backgroundColor: props.styles?.backgroundColor ?? undefined }))
</script>
