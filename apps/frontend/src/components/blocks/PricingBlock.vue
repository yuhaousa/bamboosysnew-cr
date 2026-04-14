<template>
  <section :style="sectionStyle" class="section-padding">
    <div class="container-content">
      <div class="text-center max-w-2xl mx-auto mb-12">
        <span v-if="content.badge" class="badge-section">{{ content.badge }}</span>
        <h2 class="heading-lg text-gray-900 dark:text-white">{{ content.title }}</h2>
        <p v-if="content.description" class="mt-4 text-gray-600 dark:text-gray-400">{{ content.description }}</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="tier in content.tiers" :key="tier.id"
          :class="tier.highlighted ? 'ring-2 ring-brand-500 scale-105 shadow-xl shadow-brand-500/10' : 'border border-gray-200 dark:border-gray-700'"
          class="relative rounded-2xl p-6 bg-white dark:bg-gray-800/50 flex flex-col">
          <div v-if="tier.badge" class="absolute -top-3 left-1/2 -translate-x-1/2">
            <span class="bg-brand-500 text-white text-xs font-semibold px-3 py-1 rounded-full">{{ tier.badge }}</span>
          </div>
          <div class="mb-6">
            <h3 class="font-bold text-lg text-gray-900 dark:text-white">{{ tier.name }}</h3>
            <p v-if="tier.description" class="text-sm text-gray-500 mt-1">{{ tier.description }}</p>
          </div>
          <div class="mb-6">
            <span class="text-4xl font-bold text-gray-900 dark:text-white">{{ tier.price }}</span>
            <span v-if="tier.period" class="text-gray-400 text-sm ml-1">{{ tier.period }}</span>
          </div>
          <ul class="space-y-3 mb-8 flex-1">
            <li v-for="f in tier.features" :key="f" class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <svg class="w-4 h-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              {{ f }}
            </li>
          </ul>
          <a v-if="tier.cta" :href="tier.cta.link" :class="tier.highlighted ? 'btn-hero-primary justify-center' : 'btn-hero-secondary justify-center'">
            {{ tier.cta.text }}
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import type { PricingSectionContent, BlockStyles } from '@shared/types'
const props = defineProps<{ content: PricingSectionContent; styles?: BlockStyles }>()
const sectionStyle = computed(() => ({ backgroundColor: props.styles?.backgroundColor ?? undefined }))
</script>
