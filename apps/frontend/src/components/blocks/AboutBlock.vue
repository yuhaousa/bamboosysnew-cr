<template>
  <section :style="sectionStyle" class="overflow-hidden">
    <div class="container-content py-16 md:py-24">

      <!-- Centered section header -->
      <div class="text-center mb-16 max-w-3xl mx-auto">
        <span v-if="content.badge"
          class="text-xs font-semibold tracking-wider uppercase mb-4 inline-block"
          :style="{ color: 'var(--color-primary)' }"
        >{{ content.badge }}</span>
        <h2 class="heading-lg mt-3" :class="isDark ? 'text-white' : 'text-gray-900'">
          <template v-if="titleSecondLine">
            {{ titleFirstLine }}<br />
            <span :style="{ color: 'var(--color-primary)' }">{{ titleSecondLine }}</span>
          </template>
          <template v-else>{{ content.title }}</template>
        </h2>
        <p v-if="content.description" class="mt-6 max-w-2xl mx-auto leading-relaxed" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
          {{ content.description }}
        </p>
      </div>

      <!-- 2-col: image + content -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        <!-- Image (aspect-video with floating card) -->
        <div v-if="content.image?.url" class="relative">
          <div class="aspect-video rounded-2xl overflow-hidden" :class="isDark ? 'bg-white/5' : 'bg-gray-100'">
            <img :src="content.image.url" :alt="content.image.alt" class="w-full h-full object-cover" />
          </div>
        </div>

        <!-- Content column: highlights + stats + buttons -->
        <div class="space-y-6">

          <!-- Rich highlights (icon + title + description) -->
          <div v-if="richHighlights.length" class="space-y-5">
            <div v-for="h in richHighlights" :key="h.id" class="flex gap-4 p-4 rounded-xl border" :class="cardClass">
              <div class="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-xl"
                :style="{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 15%, transparent)' }"
              >{{ h.icon || '📌' }}</div>
              <div>
                <p class="font-semibold mb-1 text-base" :class="isDark ? 'text-white' : 'text-gray-900'">{{ h.title }}</p>
                <p class="text-sm leading-relaxed" :class="isDark ? 'text-gray-400' : 'text-gray-500'">{{ h.description }}</p>
              </div>
            </div>
          </div>

          <!-- Simple string highlights -->
          <ul v-if="simpleHighlights.length" class="space-y-2">
            <li v-for="h in simpleHighlights" :key="h" class="flex items-center gap-3 text-sm">
              <span class="w-1.5 h-1.5 rounded-full flex-shrink-0" :style="{ backgroundColor: 'var(--color-primary)' }" />
              <span :class="isDark ? 'text-gray-300' : 'text-gray-700'">{{ h }}</span>
            </li>
          </ul>

          <!-- Stats — inline row -->
          <div v-if="content.stats?.length" class="flex gap-8 pt-4 border-t" :class="isDark ? 'border-white/10' : 'border-gray-200'">
            <div v-for="stat in content.stats" :key="stat.label">
              <div class="text-2xl font-bold" :style="{ color: 'var(--color-primary)' }">{{ stat.value }}</div>
              <div class="text-xs mt-0.5" :class="isDark ? 'text-gray-400' : 'text-gray-500'">{{ stat.label }}</div>
            </div>
          </div>

          <!-- Buttons -->
          <div v-if="content.buttons?.length" class="flex flex-wrap gap-3">
            <a v-for="btn in content.buttons" :key="btn.id"
              :href="btn.link" :target="btn.openInNewTab ? '_blank' : '_self'"
              :class="btn.variant === 'primary' ? 'btn-hero-primary' : isDark ? 'btn-hero-secondary' : 'btn-hero-secondary-light'"
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
import { useBlockVariant } from '@/composables/useBlockVariant'
const props = defineProps<{ content: AboutSectionContent; styles?: BlockStyles }>()

const { isDark, sectionStyle, cardClass } = useBlockVariant(() => props.styles)

// If subtitle appears at end of title, split for two-tone heading
const titleSecondLine = computed(() => {
  const t = props.content.title ?? ''
  const s = props.content.subtitle ?? ''
  if (!s) return ''
  const idx = t.toLowerCase().lastIndexOf(s.toLowerCase())
  if (idx > 0 && idx + s.length >= t.length - 1) return s
  return ''
})
const titleFirstLine = computed(() => {
  if (!titleSecondLine.value) return props.content.title ?? ''
  return (props.content.title ?? '').slice(0, (props.content.title ?? '').toLowerCase().lastIndexOf(titleSecondLine.value.toLowerCase())).trim()
})

const richHighlights = computed(() =>
  (props.content.highlights ?? []).filter((h): h is AboutHighlight => typeof h === 'object' && h !== null)
)
const simpleHighlights = computed(() =>
  (props.content.highlights ?? []).filter((h): h is string => typeof h === 'string')
)
</script>

