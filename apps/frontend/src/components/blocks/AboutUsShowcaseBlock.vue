<template>
  <section :style="sectionStyle" class="relative overflow-hidden">
    <div class="absolute inset-0 pointer-events-none opacity-80">
      <div
        class="absolute -top-24 left-[-4rem] h-72 w-72 rounded-full blur-3xl"
        :style="{ background: 'color-mix(in srgb, var(--color-primary) 16%, transparent)' }"
      />
      <div
        class="absolute bottom-0 right-[-3rem] h-80 w-80 rounded-full blur-3xl"
        :style="{ background: 'color-mix(in srgb, var(--color-secondary) 14%, transparent)' }"
      />
    </div>

    <div class="container-content relative py-16 md:py-24">
      <div class="max-w-3xl mb-12 md:mb-16">
        <span v-if="content.badge" class="badge-section">{{ content.badge }}</span>
        <h2 v-if="content.title" class="heading-lg mt-4" :class="isDark ? 'text-white' : 'text-gray-900 dark:text-white'">
          {{ content.title }}
        </h2>
        <p v-if="content.description" class="mt-4 text-base md:text-lg leading-relaxed max-w-2xl" :class="isDark ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'">
          {{ content.description }}
        </p>
      </div>

      <div v-if="loading" class="space-y-10">
        <div v-for="i in 2" :key="i" class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <div class="h-96 rounded-[2rem] animate-pulse" :class="isDark ? 'bg-white/5' : 'bg-gray-100 dark:bg-gray-800'" />
          <div class="space-y-4">
            <div class="h-5 w-24 rounded animate-pulse" :class="isDark ? 'bg-white/10' : 'bg-gray-100 dark:bg-gray-800'" />
            <div class="h-12 w-3/4 rounded animate-pulse" :class="isDark ? 'bg-white/10' : 'bg-gray-100 dark:bg-gray-800'" />
            <div class="h-24 rounded animate-pulse" :class="isDark ? 'bg-white/10' : 'bg-gray-100 dark:bg-gray-800'" />
          </div>
        </div>
      </div>

      <div v-else-if="sections.length" class="space-y-14 md:space-y-20">
        <div
          v-for="(section, index) in sections"
          :key="section.id"
          class="grid gap-8 lg:gap-12 items-center"
          :class="index % 2 === 0 ? 'lg:grid-cols-[1.05fr_0.95fr]' : 'lg:grid-cols-[0.95fr_1.05fr]'"
        >
          <div :class="index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'">
            <div
              class="overflow-hidden rounded-[2rem] border"
              :class="isDark ? 'border-white/10 bg-white/5' : 'border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/40 shadow-[0_30px_90px_-45px_rgba(15,23,42,0.35)]'"
            >
              <div
                class="relative aspect-[4/3] overflow-hidden"
                :class="section.entries?.[0]?.imageUrl ? '' : (isDark ? 'bg-white/5' : 'bg-gray-100 dark:bg-gray-800')"
              >
                <img
                  v-if="section.entries?.[0]?.imageUrl"
                  :src="section.entries[0].imageUrl"
                  :alt="section.entries[0].title || section.name"
                  class="h-full w-full object-cover"
                />
                <div v-else class="flex h-full w-full items-center justify-center">
                  <div class="rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em]" :class="isDark ? 'bg-white/10 text-gray-300' : 'bg-white text-gray-500 shadow-sm dark:bg-gray-900 dark:text-gray-300'">
                    About Section
                  </div>
                </div>
                <div class="absolute inset-x-0 bottom-0 p-6">
                  <div class="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium backdrop-blur-md" :class="isDark ? 'bg-black/40 text-white' : 'bg-white/85 text-gray-900'">
                    <span class="h-2.5 w-2.5 rounded-full" :style="{ backgroundColor: 'var(--color-primary)' }" />
                    {{ section.entries?.length ?? 0 }} story {{ (section.entries?.length ?? 0) === 1 ? 'chapter' : 'chapters' }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div :class="index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'" class="space-y-6">
            <div>
              <p class="text-sm font-semibold uppercase tracking-[0.24em]" :style="{ color: 'var(--color-primary)' }">{{ section.name }}</p>
              <h3 class="mt-3 text-3xl md:text-4xl font-semibold tracking-tight" :class="isDark ? 'text-white' : 'text-gray-900 dark:text-white'">
                {{ section.entries?.[0]?.title || section.name }}
              </h3>
              <p v-if="section.entries?.[0]?.description" class="mt-4 text-base leading-8" :class="isDark ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'">
                {{ section.entries[0].description }}
              </p>
            </div>

            <div v-if="section.entries && section.entries.length > 1" class="grid gap-4">
              <article
                v-for="entry in section.entries.slice(1)"
                :key="entry.id"
                class="rounded-[1.5rem] border p-5 transition-all duration-300 hover:-translate-y-0.5"
                :class="isDark ? 'border-white/10 bg-white/5 hover:bg-white/[0.07]' : 'border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/40 hover:bg-white'"
              >
                <div class="flex items-start gap-4">
                  <div class="mt-1 flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-semibold" :class="isDark ? 'bg-white/10 text-white' : 'bg-white text-gray-900 shadow-sm dark:bg-gray-900 dark:text-white'">
                    {{ shortLabel(entry.title) }}
                  </div>
                  <div>
                    <h4 class="text-lg font-semibold" :class="isDark ? 'text-white' : 'text-gray-900 dark:text-white'">{{ entry.title }}</h4>
                    <p class="mt-2 text-sm leading-7" :class="isDark ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'">{{ entry.description }}</p>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>

      <p v-else class="py-12 text-center text-gray-400">No about us sections selected.</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useBlockVariant } from '@/composables/useBlockVariant'
import { fetchAboutUs } from '@/lib/api'
import type { AboutUsShowcaseContent, BlockStyles, DbAboutUs } from '@shared/types'

const props = defineProps<{ content: AboutUsShowcaseContent; styles?: BlockStyles }>()
const { sectionStyle, isDark } = useBlockVariant(() => props.styles)

const sections = ref<DbAboutUs[]>([])
const loading = ref(false)

async function load() {
  loading.value = true
  try {
    sections.value = await fetchAboutUs(props.content.selectedIds?.length ? props.content.selectedIds : undefined)
  } finally {
    loading.value = false
  }
}

function shortLabel(title: string) {
  return title
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() ?? '')
    .join('') || 'A'
}

onMounted(load)
watch(() => props.content.selectedIds, load, { deep: true })
</script>
