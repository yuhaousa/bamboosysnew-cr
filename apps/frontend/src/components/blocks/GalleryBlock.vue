<template>
  <section :style="sectionStyle" class="section-padding">
    <div class="container-content">
      <div class="text-center max-w-2xl mx-auto mb-12" v-if="content.title">
        <h2 class="heading-lg text-gray-900 dark:text-white">{{ content.title }}</h2>
        <p v-if="content.description" class="mt-4 text-gray-600 dark:text-gray-400">{{ content.description }}</p>
      </div>
      <div :class="`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-${content.columns ?? 4} gap-3`">
        <div v-for="item in content.items" :key="item.id" class="group relative aspect-square overflow-hidden rounded-xl cursor-pointer"
          @click="lightbox = item.image.url">
          <img :src="item.image.url" :alt="item.image.alt" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
          <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
          </div>
          <div v-if="item.caption" class="absolute bottom-0 inset-x-0 p-2 bg-black/50 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">{{ item.caption }}</div>
        </div>
      </div>
    </div>
    <!-- Lightbox -->
    <Teleport to="body">
      <div v-if="lightbox" class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" @click.self="lightbox = null">
        <button @click="lightbox = null" class="absolute top-4 right-4 text-white/70 hover:text-white">
          <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <img :src="lightbox" class="max-h-[90vh] max-w-full rounded-xl shadow-2xl" />
      </div>
    </Teleport>
  </section>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import type { GallerySectionContent, BlockStyles } from '@shared/types'
const props = defineProps<{ content: GallerySectionContent; styles?: BlockStyles }>()
const lightbox = ref<string | null>(null)
const sectionStyle = computed(() => ({ backgroundColor: props.styles?.backgroundColor ?? undefined }))
</script>
