<template>
  <div>
  <AppHeader />
  <!-- Loading -->
  <div v-if="loading" class="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
    <div class="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
  </div>

  <!-- Not found -->
  <div v-else-if="!item" class="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
    <div class="text-center space-y-4">
      <p class="text-5xl">🗂️</p>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Project not found</h1>
      <a href="/portfolio" class="inline-flex items-center gap-1 text-brand-500 hover:underline text-sm">← Back to Portfolio</a>
    </div>
  </div>

  <!-- Project detail -->
  <div v-else class="min-h-screen bg-white dark:bg-gray-950">

    <!-- Hero — full-width image with dark overlay -->
    <div class="relative overflow-hidden min-h-[440px] md:min-h-[540px] flex items-end">
      <!-- Background image -->
      <div
        v-if="item.imageUrl"
        class="absolute inset-0 bg-cover bg-center"
        :style="{ backgroundImage: `url(${item.imageUrl})` }"
      />
      <!-- Overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/65 to-gray-950/10" />
      <!-- Gradient fallback -->
      <div v-if="!item.imageUrl" class="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950" />

      <!-- Content -->
      <div class="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-24">
        <!-- Back -->
        <a href="/portfolio" class="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm mb-6 transition-colors">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          Back to Portfolio
        </a>

        <!-- Client logo + category -->
        <div class="flex items-center gap-4 mb-4">
          <img v-if="item.logoUrl" :src="item.logoUrl" :alt="item.clientName || 'Client logo'" class="h-10 w-10 rounded-full object-cover bg-white/10 ring-2 ring-white/20" />
          <div class="flex flex-wrap gap-2">
            <span v-if="item.category" class="px-3 py-1 bg-brand-500/30 border border-brand-400/40 text-brand-200 rounded-full text-xs font-semibold uppercase tracking-wide">{{ item.category }}</span>
            <span v-if="item.isFeatured" class="px-3 py-1 bg-yellow-500/20 border border-yellow-400/40 text-yellow-200 rounded-full text-xs font-semibold">★ Featured</span>
          </div>
        </div>

        <h1 class="text-3xl md:text-5xl font-extrabold text-white mb-3 leading-tight">{{ item.title }}</h1>
        <p v-if="item.clientName" class="text-gray-400 text-sm mb-4">Client: <span class="text-gray-200 font-medium">{{ item.clientName }}</span></p>
        <p v-if="item.shortDescription" class="text-base md:text-lg text-gray-300 max-w-2xl leading-relaxed">{{ item.shortDescription }}</p>
      </div>
    </div>

    <!-- Body -->
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">

        <!-- Main content -->
        <div class="lg:col-span-2 space-y-8">

          <!-- Tags -->
          <div v-if="tags.length" class="flex flex-wrap gap-2">
            <span
              v-for="tag in tags" :key="tag"
              class="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium"
            >{{ tag }}</span>
          </div>

          <!-- Description -->
          <div v-if="item.description" class="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 md:p-8">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">About this project</h2>
            <p class="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">{{ item.description }}</p>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="lg:col-span-1">
          <div class="sticky top-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg overflow-hidden">
            <!-- Cover thumbnail -->
            <div v-if="item.imageUrl" class="h-44 bg-cover bg-center" :style="{ backgroundImage: `url(${item.imageUrl})` }" />
            <div class="p-6 space-y-4">
              <!-- Client info -->
              <div v-if="item.clientName || item.logoUrl" class="flex items-center gap-3">
                <img v-if="item.logoUrl" :src="item.logoUrl" :alt="item.clientName || 'logo'" class="h-10 w-10 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700" />
                <div v-if="item.clientName">
                  <p class="text-xs text-gray-500 uppercase tracking-wide">Client</p>
                  <p class="font-semibold text-gray-900 dark:text-white text-sm">{{ item.clientName }}</p>
                </div>
              </div>

              <!-- Visit project CTA -->
              <a
                v-if="item.projectUrl"
                :href="item.projectUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center justify-center gap-2 w-full py-3 px-6 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white font-bold rounded-xl transition-all duration-150 text-base shadow-md shadow-brand-500/20"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                Visit Project
              </a>

              <!-- Meta list -->
              <ul v-if="item.category || tags.length" class="space-y-2.5 text-sm text-gray-600 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-800">
                <li v-if="item.category" class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-brand-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>
                  {{ item.category }}
                </li>
                <li v-if="tags.length" class="flex items-start gap-2">
                  <svg class="w-4 h-4 text-brand-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"/></svg>
                  <span>{{ tags.join(', ') }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
  <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import { fetchPortfolioItem } from '@/lib/api'
import type { DbPortfolioItem } from '@shared/types'

const route = useRoute()
const item = ref<DbPortfolioItem | null>(null)
const loading = ref(true)

const tags = computed(() => {
  if (!item.value?.tags) return []
  if (Array.isArray(item.value.tags)) return item.value.tags
  return String(item.value.tags).split(',').map(t => t.trim()).filter(Boolean)
})

onMounted(async () => {
  try {
    item.value = await fetchPortfolioItem(route.params.slug as string)
  } catch {
    item.value = null
  } finally {
    loading.value = false
  }
})
</script>
