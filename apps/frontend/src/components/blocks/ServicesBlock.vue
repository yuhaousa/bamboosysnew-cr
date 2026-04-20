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
      <div :class="`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${content.columns ?? 3} gap-6`">
        <div
          v-for="s in content.services" :key="s.id"
          class="p-6 rounded-2xl border hover:shadow-lg hover:-translate-y-1 transition-all"
          :class="isDark ? 'border-white/10 bg-white/5 hover:bg-white/[0.08]' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50'"
        >
          <div v-if="s.icon"
            class="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-2xl"
            :style="{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 15%, transparent)' }"
          >{{ s.icon }}</div>
          <h3 class="font-semibold mb-2" :class="isDark ? 'text-white' : 'text-gray-900 dark:text-white'">{{ s.title }}</h3>
          <p class="text-sm mb-4" :class="isDark ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'">{{ s.description }}</p>
          <ul v-if="s.features?.length" class="space-y-1.5">
            <li v-for="f in s.features" :key="f" class="text-xs flex items-center gap-2" :class="isDark ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'">
              <span class="w-1.5 h-1.5 rounded-full flex-shrink-0" :style="{ backgroundColor: 'var(--color-primary)' }" />
              {{ f }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import type { ServicesSectionContent, BlockStyles } from '@shared/types'
const props = defineProps<{ content: ServicesSectionContent; styles?: BlockStyles }>()
const isDark = computed(() => {
  const bg = props.styles?.backgroundColor
  if (!bg || !bg.startsWith('#') || bg.length < 7) return false
  const r = parseInt(bg.slice(1, 3), 16); const g = parseInt(bg.slice(3, 5), 16); const b = parseInt(bg.slice(5, 7), 16)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5
})
const sectionStyle = computed(() => ({
  backgroundColor: props.styles?.backgroundColor || undefined,
  paddingTop: props.styles?.paddingTop || undefined,
  paddingBottom: props.styles?.paddingBottom || undefined,
}))
</script>
