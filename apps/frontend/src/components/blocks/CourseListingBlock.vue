<template>
  <section :style="sectionStyle" class="section-padding">
    <div class="container-content">
      <div class="text-center max-w-2xl mx-auto mb-12">
        <span v-if="content.badge" class="badge-section">{{ content.badge }}</span>
        <h2 v-if="content.title" class="heading-lg" :class="isDark ? 'text-white' : 'text-gray-900 dark:text-white'">{{ content.title }}</h2>
        <p v-if="content.description" class="mt-4" :class="isDark ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'">{{ content.description }}</p>
      </div>
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 3" :key="i" class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800/50 animate-pulse h-64" />
      </div>
      <div v-else :style="{ display: 'grid', gridTemplateColumns: `repeat(${content.columns ?? 3}, minmax(0,1fr))`, gap: '1.5rem' }">
        <div v-for="course in displayCourses" :key="course.id"
          class="rounded-2xl border overflow-hidden hover:shadow-lg transition-all group"
          :class="isDark ? 'border-white/10 bg-white/5' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50'"
        >
          <div v-if="course.imageUrl" class="aspect-video overflow-hidden">
            <img :src="course.imageUrl" :alt="course.imageAlt || course.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          </div>
          <div class="p-5">
            <div class="flex items-center gap-2 mb-2">
              <span v-if="course.level" class="text-xs bg-brand-100 dark:bg-brand-950/50 text-brand-700 dark:text-brand-400 px-2 py-0.5 rounded-full font-medium">{{ course.level }}</span>
              <span v-if="course.duration" class="text-xs text-gray-400">{{ course.duration }}</span>
            </div>
            <h3 class="font-semibold mb-2" :class="isDark ? 'text-white' : 'text-gray-900 dark:text-white'">{{ course.title }}</h3>
            <p class="text-sm mb-4" :class="isDark ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'">{{ course.shortDescription }}</p>
            <div class="flex items-center justify-between">
              <span v-if="course.price" class="font-bold text-brand-600 dark:text-brand-400">{{ course.price }}</span>
              <a :href="`/courses/${course.slug}`" class="btn-hero-primary text-sm py-2 px-4">View Course</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useBlockVariant } from '@/composables/useBlockVariant'
import { fetchCourses } from '@/lib/api'
import type { CourseListingContent, BlockStyles, DbCourse } from '@shared/types'
const props = defineProps<{ content: CourseListingContent; styles?: BlockStyles }>()
const { sectionStyle, isDark } = useBlockVariant(() => props.styles)
const dbCourses = ref<DbCourse[]>([])
const loading = ref(false)
async function load() {
  if (!props.content.selectedIds?.length) return
  loading.value = true
  try { dbCourses.value = await fetchCourses(props.content.selectedIds) } finally { loading.value = false }
}
onMounted(load)
watch(() => props.content.selectedIds, load, { deep: true })
const displayCourses = computed(() => {
  if (props.content.selectedIds?.length) return dbCourses.value
  return props.content.courses.map(c => ({
    id: c.id, title: c.title, slug: c.link?.replace(/^\/courses\//, '') || c.id,
    shortDescription: c.description, description: c.description,
    imageUrl: c.image?.url ?? null, imageAlt: c.image?.alt ?? null,
    level: c.level ?? null, duration: c.duration ?? null, price: c.price ?? null,
    category: null, isActive: true, sortOrder: 0, createdAt: '', updatedAt: '',
  } as DbCourse))
})
</script>
