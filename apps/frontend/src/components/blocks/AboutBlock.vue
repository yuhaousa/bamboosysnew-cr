<template>
  <section :style="sectionStyle" class="overflow-hidden">
    <div class="container-content py-16 md:py-24">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        <!-- Image -->
        <div v-if="content.image?.url">
          <img :src="content.image.url" :alt="content.image.alt" class="w-full rounded-2xl shadow-xl" />
        </div>

        <!-- Content -->
        <div class="space-y-6">
          <span v-if="content.badge"
            class="inline-block px-3 py-1 text-xs font-semibold rounded-full tracking-wider uppercase"
            :style="{ color: 'var(--color-primary)', border: '1px solid var(--color-primary)', backgroundColor: 'color-mix(in srgb, var(--color-primary) 12%, transparent)' }"
          >{{ content.badge }}</span>

          <h2 class="heading-lg" :class="isDark ? 'text-white' : 'text-gray-900 dark:text-white'">
            {{ content.title }}
          </h2>
          <p v-if="content.subtitle" class="text-xl font-bold" :style="{ color: 'var(--color-primary)' }">
            {{ content.subtitle }}
          </p>
          <p class="leading-relaxed text-base" :class="isDark ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'">
            {{ content.description }}
          </p>

          <!-- Rich highlights (objects with icon + title + description) -->
          <div v-if="richHighlights.length" class="space-y-3">
            <div
              v-for="h in richHighlights" :key="h.id"
              class="flex items-start gap-4 p-4 rounded-xl border"
              :class="isDark ? 'border-white/10 bg-white/5' : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'"
            >
              <div class="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                :style="{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 15%, transparent)' }">
                {{ h.icon || '📌' }}
              </div>
              <div>
                <p class="font-semibold mb-1" :class="isDark ? 'text-white' : 'text-gray-900 dark:text-white'">{{ h.title }}</p>
                <p class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'">{{ h.description }}</p>
              </div>
            </div>
          </div>

          <!-- Simple string highlights (checkmark list) -->
          <ul v-if="simpleHighlights.length" class="space-y-2">
            <li v-for="h in simpleHighlights" :key="h" class="flex items-center gap-3">
              <div class="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                :style="{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 20%, transparent)' }">
                <svg class="w-3 h-3" :style="{ color: 'var(--color-primary)' }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span class="text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'">{{ h }}</span>
            </li>
          </ul>

          <!-- Stats -->
          <div v-if="content.stats?.length"
            class="grid gap-4 pt-4 border-t"
            :class="[isDark ? 'border-white/10' : 'border-gray-200 dark:border-gray-700', `grid-cols-${content.stats.length}`]"
          >
            <div v-for="stat in content.stats" :key="stat.label" class="text-center">
              <p class="text-2xl font-bold" :style="{ color: 'var(--color-primary)' }">{{ stat.value }}</p>
              <p class="text-xs mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-500'">{{ stat.label }}</p>
            </div>
          </div>

          <!-- Buttons -->
          <div v-if="content.buttons?.length" class="flex flex-wrap gap-3 pt-2">
            <a v-for="btn in content.buttons" :key="btn.id"
              :href="btn.link" :target="btn.openInNewTab ? '_blank' : '_self'"
              :class="btn.variant === 'primary' ? 'btn-hero-primary' : 'btn-hero-secondary'"
            >{{ btn.text }}</a>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { AboutSectionContent, AboutHighlight, BlockStyles } from '@shared/types'
const props = defineProps<{ content: AboutSectionContent; styles?: BlockStyles }>()

const isDark = computed(() => {
  const bg = props.styles?.backgroundColor
  if (!bg || !bg.startsWith('#') || bg.length < 7) return false
  const r = parseInt(bg.slice(1, 3), 16)
  const g = parseInt(bg.slice(3, 5), 16)
  const b = parseInt(bg.slice(5, 7), 16)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5
})

const richHighlights = computed(() =>
  (props.content.highlights ?? []).filter((h): h is AboutHighlight => typeof h === 'object' && h !== null)
)
const simpleHighlights = computed(() =>
  (props.content.highlights ?? []).filter((h): h is string => typeof h === 'string')
)

const sectionStyle = computed(() => ({
  backgroundColor: props.styles?.backgroundColor || undefined,
  paddingTop: props.styles?.paddingTop || undefined,
  paddingBottom: props.styles?.paddingBottom || undefined,
}))
</script>

