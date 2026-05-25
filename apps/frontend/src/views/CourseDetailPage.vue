<template>
  <div>
  <AppHeader />
  <!-- Loading -->
  <div v-if="loading" class="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
    <div class="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
  </div>

  <!-- Not found -->
  <div v-else-if="!course" class="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
    <div class="text-center space-y-4">
      <p class="text-5xl">📚</p>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Course not found</h1>
      <a href="/courses" class="inline-flex items-center gap-1 text-brand-500 hover:underline text-sm">← Back to Courses</a>
    </div>
  </div>

  <!-- Course detail -->
  <div v-else class="min-h-screen bg-white dark:bg-gray-950">

    <!-- Hero — full-width image with dark overlay, or gradient fallback -->
    <div class="relative overflow-hidden min-h-[420px] md:min-h-[520px] flex items-end">
      <!-- Background image -->
      <div
        v-if="course.imageUrl"
        class="absolute inset-0 bg-cover bg-center"
        :style="{ backgroundImage: `url(${course.imageUrl})` }"
      />
      <!-- Gradient overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/70 to-gray-950/20" />
      <!-- Gradient fallback when no image -->
      <div v-if="!course.imageUrl" class="absolute inset-0 bg-gradient-to-br from-brand-700 via-brand-800 to-gray-900" />

      <!-- Content -->
      <div class="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-24">
        <!-- Back link -->
        <a href="/courses" class="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm mb-6 transition-colors">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          Back to Courses
        </a>

        <!-- Badges -->
        <div class="flex flex-wrap gap-2 mb-4">
          <span v-if="course.level" class="px-3 py-1 bg-brand-500/30 border border-brand-400/40 text-brand-200 rounded-full text-xs font-semibold uppercase tracking-wide">{{ course.level }}</span>
          <span v-if="course.category" class="px-3 py-1 bg-white/10 border border-white/20 text-white/80 rounded-full text-xs">{{ course.category }}</span>
        </div>

        <!-- Title -->
        <h1 class="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight">{{ course.title }}</h1>
        <p v-if="course.shortDescription" class="text-base md:text-lg text-gray-300 max-w-2xl leading-relaxed mb-6">{{ course.shortDescription }}</p>

        <!-- Stats row -->
        <div class="flex flex-wrap items-center gap-6 text-sm text-gray-400">
          <span v-if="course.duration" class="flex items-center gap-1.5">
            <svg class="w-4 h-4 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            {{ course.duration }}
          </span>
          <span v-if="course.price" class="text-2xl font-bold text-white">{{ course.price }}</span>
        </div>
      </div>
    </div>

    <!-- Body -->
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">

        <!-- Main content -->
        <div class="lg:col-span-2 space-y-8">
          <div v-if="course.description" class="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 md:p-8">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">About this course</h2>
            <p class="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">{{ course.description }}</p>
          </div>

          <!-- Course details pills -->
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div v-if="course.level" class="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 text-center">
              <p class="text-2xl mb-1">📊</p>
              <p class="text-xs text-gray-500 uppercase tracking-wide mb-0.5">Level</p>
              <p class="font-semibold text-gray-900 dark:text-white text-sm">{{ course.level }}</p>
            </div>
            <div v-if="course.duration" class="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 text-center">
              <p class="text-2xl mb-1">⏱</p>
              <p class="text-xs text-gray-500 uppercase tracking-wide mb-0.5">Duration</p>
              <p class="font-semibold text-gray-900 dark:text-white text-sm">{{ course.duration }}</p>
            </div>
            <div v-if="course.category" class="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 text-center">
              <p class="text-2xl mb-1">📁</p>
              <p class="text-xs text-gray-500 uppercase tracking-wide mb-0.5">Category</p>
              <p class="font-semibold text-gray-900 dark:text-white text-sm">{{ course.category }}</p>
            </div>
          </div>
        </div>

        <!-- Sticky Sidebar CTA -->
        <div class="lg:col-span-1">
          <div class="sticky top-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg overflow-hidden">
            <!-- Card image preview -->
            <div v-if="course.imageUrl" class="h-40 bg-cover bg-center" :style="{ backgroundImage: `url(${course.imageUrl})` }" />
            <div class="p-6 space-y-4">
              <p v-if="course.price" class="text-3xl font-extrabold text-brand-600 dark:text-brand-400">{{ course.price }}</p>
              <p v-else class="text-3xl font-extrabold text-green-500">Free</p>
              <button class="w-full py-3 px-6 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white font-bold rounded-xl transition-all duration-150 text-base shadow-md shadow-brand-500/20">
                Enroll Now
              </button>
              <ul class="space-y-2.5 text-sm text-gray-600 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-800">
                <li v-if="course.duration" class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-brand-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  {{ course.duration }}
                </li>
                <li v-if="course.level" class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-brand-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                  {{ course.level }} level
                </li>
                <li v-if="course.category" class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-brand-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>
                  {{ course.category }}
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
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import { fetchCourse } from '@/lib/api'
import type { DbCourse } from '@shared/types'

const route = useRoute()
const course = ref<DbCourse | null>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    course.value = await fetchCourse(route.params.slug as string)
  } catch {
    course.value = null
  } finally {
    loading.value = false
  }
})
</script>
