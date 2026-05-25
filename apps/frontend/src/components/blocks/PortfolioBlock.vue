<template>
  <section :style="sectionStyle" class="section-padding">
    <div class="container-content">
      <!-- Header -->
      <div class="text-center max-w-2xl mx-auto mb-10">
        <span v-if="content.badge" class="badge-section">{{ content.badge }}</span>
        <h2 v-if="content.title" class="heading-lg" :class="isDark ? 'text-white' : 'text-gray-900 dark:text-white'">
          {{ content.title }}
        </h2>
        <p v-if="content.description" class="mt-4 text-base" :class="isDark ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'">
          {{ content.description }}
        </p>
      </div>

      <!-- Category filter tabs -->
      <div v-if="content.showFilter !== false && categories.length > 1" class="flex flex-wrap justify-center gap-2 mb-10">
        <button
          v-for="cat in ['ALL', ...categories]" :key="cat"
          @click="activeFilter = cat"
          class="px-5 py-1.5 text-sm font-semibold tracking-wide uppercase transition-all border-b-2"
          :class="activeFilter === cat
            ? 'border-brand-500 text-brand-600 dark:text-brand-400'
            : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'"
        >{{ cat }}</button>
      </div>

      <!-- Grid -->
      <div v-if="loading" :style="gridStyle" class="grid gap-6">
        <div v-for="i in (content.columns ?? 3)" :key="i" class="rounded-2xl overflow-hidden animate-pulse">
          <div class="bg-gray-200 dark:bg-gray-700 aspect-[16/10]" />
          <div class="p-4 space-y-2">
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          </div>
        </div>
      </div>

      <div v-else :style="gridStyle" class="grid gap-6">
        <a
          v-for="item in filteredItems" :key="item.id"
          :href="`/portfolio/${item.slug}`"
          class="group rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 block"
          :class="isDark ? 'border-white/10 bg-white/5' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50'"
        >
          <!-- Screenshot / Image -->
          <div class="relative aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-gray-800">
            <img
              v-if="item.imageUrl"
              :src="item.imageUrl"
              :alt="item.imageAlt || item.title"
              class="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-600">
              <svg class="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <!-- Logo overlay -->
            <div v-if="item.logoUrl" class="absolute top-3 left-3 bg-white/90 dark:bg-gray-900/80 rounded-lg p-1.5 shadow-sm">
              <img :src="item.logoUrl" :alt="item.clientName || item.title" class="h-6 w-auto object-contain" />
            </div>
            <!-- Featured badge -->
            <div v-if="item.isFeatured" class="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase text-white" :style="{ backgroundColor: 'var(--color-primary)' }">
              Featured
            </div>
          </div>

          <!-- Card body -->
          <div class="p-5">
            <h3 class="font-bold text-base mb-1" :class="isDark ? 'text-white' : 'text-gray-900 dark:text-white'">{{ item.title }}</h3>
            <p v-if="item.category" class="text-xs font-semibold uppercase tracking-wider mb-2" :style="{ color: 'var(--color-primary)' }">
              {{ item.category }}
            </p>
            <p v-if="item.shortDescription" class="text-sm leading-relaxed" :class="isDark ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'">
              {{ item.shortDescription }}
            </p>
          </div>
        </a>
      </div>

      <p v-if="!loading && filteredItems.length === 0" class="text-center text-gray-400 py-12">No projects found.</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useBlockVariant } from '@/composables/useBlockVariant'
import { fetchPortfolio } from '@/lib/api'
import type { PortfolioSectionContent, BlockStyles, DbPortfolioItem } from '@shared/types'

const props = defineProps<{ content: PortfolioSectionContent; styles?: BlockStyles }>()
const { sectionStyle, isDark } = useBlockVariant(() => props.styles)

const dbItems = ref<DbPortfolioItem[]>([])
const loading = ref(false)
const activeFilter = ref('ALL')

async function load() {
  loading.value = true
  try {
    dbItems.value = await fetchPortfolio(
      props.content.selectedIds?.length ? props.content.selectedIds : undefined
    )
  } finally {
    loading.value = false
  }
}

onMounted(load)
watch(() => props.content.selectedIds, load, { deep: true })

const categories = computed(() => {
  const cats = [...new Set(dbItems.value.map(i => i.category).filter(Boolean) as string[])]
  return cats.sort()
})

const filteredItems = computed(() => {
  if (activeFilter.value === 'ALL') return dbItems.value
  return dbItems.value.filter(i => i.category === activeFilter.value)
})

const gridStyle = computed(() => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${props.content.columns ?? 3}, minmax(0, 1fr))`,
}))
</script>
