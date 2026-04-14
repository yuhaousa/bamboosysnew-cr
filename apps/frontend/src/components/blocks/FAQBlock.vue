<template>
  <section :style="sectionStyle" class="section-padding">
    <div class="container-content">
      <div class="text-center max-w-2xl mx-auto mb-12">
        <span v-if="content.badge" class="badge-section">{{ content.badge }}</span>
        <h2 v-if="content.title" class="heading-lg text-gray-900 dark:text-white">{{ content.title }}</h2>
        <p v-if="content.description" class="mt-4 text-gray-600 dark:text-gray-400">{{ content.description }}</p>
      </div>
      <div class="max-w-3xl mx-auto space-y-3">
        <div v-for="(faq, i) in content.faqs" :key="faq.id" class="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
          <button @click="open === i ? open = -1 : open = i" class="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
            <span class="font-medium text-gray-900 dark:text-white pr-4">{{ faq.question }}</span>
            <svg :class="open === i ? 'rotate-180' : ''" class="w-5 h-5 text-gray-400 flex-shrink-0 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <Transition name="accordion">
            <div v-if="open === i" class="px-5 pb-5 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{{ faq.answer }}</div>
          </Transition>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import type { FAQContent, BlockStyles } from '@shared/types'
const props = defineProps<{ content: FAQContent; styles?: BlockStyles }>()
const open = ref(-1)
const sectionStyle = computed(() => ({ backgroundColor: props.styles?.backgroundColor ?? undefined }))
</script>
<style scoped>
.accordion-enter-active, .accordion-leave-active { transition: all 0.25s ease; overflow: hidden; }
.accordion-enter-from, .accordion-leave-to { max-height: 0; opacity: 0; }
.accordion-enter-to, .accordion-leave-from { max-height: 300px; opacity: 1; }
</style>
