<template>
  <section :style="sectionStyle" class="overflow-hidden">
    <div class="container-content py-16 md:py-24">
      <div class="text-center max-w-2xl mx-auto mb-12">
        <span v-if="content.badge"
          class="inline-block px-3 py-1 text-xs font-semibold rounded-full tracking-wider uppercase mb-4"
          :style="{ color: 'var(--color-primary)', border: '1px solid var(--color-primary)', backgroundColor: 'color-mix(in srgb, var(--color-primary) 12%, transparent)' }"
        >{{ content.badge }}</span>
        <h2 v-if="content.title" class="heading-lg" :class="isDark ? 'text-white' : 'text-gray-900 dark:text-white'">{{ content.title }}</h2>
        <p v-if="content.subtitle || content.description" class="mt-4" :class="isDark ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'">{{ content.subtitle || content.description }}</p>
      </div>
      <div :style="{ display: 'grid', gridTemplateColumns: `repeat(${content.columns ?? 3}, minmax(0,1fr))`, gap: '1.5rem' }">
        <div
          v-for="s in displayServices" :key="s.id"
          class="p-6 rounded-2xl border hover:shadow-lg hover:-translate-y-1 transition-all"
          :class="isDark ? 'border-white/10 bg-white/5 hover:bg-white/[0.08]' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50'"
        >
          <div v-if="s.icon"
            class="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-2xl"
            :style="{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 15%, transparent)' }"
          >{{ s.icon }}</div>
          <h3 class="font-semibold mb-2" :class="isDark ? 'text-white' : 'text-gray-900 dark:text-white'">{{ s.title }}</h3>
          <p class="text-sm mb-4" :class="isDark ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'">{{ s.shortDescription }}</p>
          <a v-if="s.slug" :href="`/services/${s.slug}`" class="text-sm font-medium" :style="{ color: 'var(--color-primary)' }">Learn more →</a>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useBlockVariant } from '@/composables/useBlockVariant'
import { fetchServices } from '@/lib/api'
import type { ServicesSectionContent, BlockStyles, DbService } from '@shared/types'
const props = defineProps<{ content: ServicesSectionContent & { columns?: number }; styles?: BlockStyles }>()
const { isDark, sectionStyle } = useBlockVariant(() => props.styles)
const dbServices = ref<DbService[]>([])
async function load() {
  if (!props.content.selectedIds?.length) return
  dbServices.value = await fetchServices(props.content.selectedIds)
}
onMounted(load)
watch(() => props.content.selectedIds, load, { deep: true })
const displayServices = computed(() => {
  if (props.content.selectedIds?.length) return dbServices.value
  return props.content.services.map(s => ({
    id: s.id, title: s.title, slug: '',
    icon: s.icon, shortDescription: s.description, description: s.description,
    imageUrl: null, imageAlt: null, isActive: true, sortOrder: 0,
    createdAt: '', updatedAt: '',
  } as DbService))
})
</script>
