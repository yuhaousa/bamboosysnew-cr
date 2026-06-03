<template>
  <section :style="sectionStyle" class="relative overflow-hidden">
    <div class="absolute inset-0 pointer-events-none opacity-70">
      <div
        class="absolute -top-16 right-0 h-64 w-64 rounded-full blur-3xl"
        :style="{ background: 'color-mix(in srgb, var(--color-primary) 18%, transparent)' }"
      />
      <div
        class="absolute bottom-0 left-0 h-72 w-72 rounded-full blur-3xl"
        :style="{ background: 'color-mix(in srgb, var(--color-secondary) 15%, transparent)' }"
      />
    </div>

    <div class="container-content relative py-16 md:py-24">
      <div class="max-w-3xl mb-10 md:mb-14">
        <span v-if="content.badge" class="badge-section">{{ content.badge }}</span>
        <h2 v-if="content.title" class="heading-lg mt-4" :class="isDark ? 'text-white' : 'text-gray-900 dark:text-white'">
          {{ content.title }}
        </h2>
        <p v-if="content.description" class="mt-4 text-base md:text-lg leading-relaxed max-w-2xl" :class="isDark ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'">
          {{ content.description }}
        </p>
      </div>

      <div v-if="loading" class="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div class="space-y-4">
          <div v-for="i in 3" :key="i" class="h-24 rounded-3xl animate-pulse" :class="isDark ? 'bg-white/5' : 'bg-gray-100 dark:bg-gray-800'" />
        </div>
        <div class="h-[28rem] rounded-[2rem] animate-pulse" :class="isDark ? 'bg-white/5' : 'bg-gray-100 dark:bg-gray-800'" />
      </div>

      <div v-else-if="solutions.length" class="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)] items-start">
        <div class="space-y-3 lg:sticky lg:top-28">
          <button
            v-for="solution in solutions"
            :key="solution.id"
            type="button"
            @click="activeId = solution.id"
            class="w-full rounded-3xl border px-5 py-4 text-left transition-all duration-300"
            :class="activeId === solution.id
              ? activeButtonClass
              : inactiveButtonClass"
          >
            <div class="flex items-center justify-between gap-3">
              <div>
                <p class="text-sm font-semibold uppercase tracking-[0.22em]" :style="{ color: activeId === solution.id ? activeLabelColor : 'var(--color-primary)' }">
                  Solution
                </p>
                <h3 class="mt-2 text-lg font-semibold" :class="activeId === solution.id ? activeHeadingClass : inactiveHeadingClass">
                  {{ solution.name }}
                </h3>
              </div>
              <div
                class="flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-semibold"
                :class="activeId === solution.id ? activePillClass : inactivePillClass"
              >
                {{ solution.entries?.length ?? 0 }}
              </div>
            </div>
          </button>
        </div>

        <div
          class="rounded-[2rem] border p-6 md:p-8 lg:p-10"
          :class="isDark ? 'border-white/10 bg-white/5 backdrop-blur-sm' : 'border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-900/40 shadow-[0_20px_80px_-40px_rgba(15,23,42,0.25)]'"
        >
          <div v-if="activeSolution" class="space-y-8">
            <div class="flex flex-col gap-4 border-b pb-6 md:flex-row md:items-end md:justify-between" :class="isDark ? 'border-white/10' : 'border-gray-200 dark:border-gray-700'">
              <div class="max-w-2xl">
                <p class="text-sm font-semibold uppercase tracking-[0.24em]" :style="{ color: 'var(--color-primary)' }">Selected Solution</p>
                <h3 class="mt-3 text-3xl md:text-4xl font-semibold tracking-tight" :class="isDark ? 'text-white' : 'text-gray-900 dark:text-white'">
                  {{ activeSolution.name }}
                </h3>
                <p class="mt-3 text-sm md:text-base leading-relaxed" :class="isDark ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'">
                  {{ activeIntro }}
                </p>
              </div>
              <div class="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium" :class="isDark ? 'bg-white/10 text-gray-200' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200'">
                <span class="h-2.5 w-2.5 rounded-full" :style="{ backgroundColor: 'var(--color-primary)' }" />
                {{ activeSolution.entries?.length ?? 0 }} detail {{ (activeSolution.entries?.length ?? 0) === 1 ? 'entry' : 'entries' }}
              </div>
            </div>

            <div class="grid gap-5 md:grid-cols-2">
              <article
                v-for="entry in activeSolution.entries || []"
                :key="entry.id"
                class="group overflow-hidden rounded-[1.75rem] border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                :class="isDark ? 'border-white/10 bg-black/20 hover:bg-white/[0.06]' : 'border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/50'"
              >
                <div class="relative aspect-[16/10] overflow-hidden" :class="entry.imageUrl ? '' : (isDark ? 'bg-white/5' : 'bg-gray-100 dark:bg-gray-800')">
                  <img
                    v-if="entry.imageUrl"
                    :src="entry.imageUrl"
                    :alt="entry.title"
                    class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div v-else class="flex h-full w-full items-center justify-center">
                    <div class="rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]" :class="isDark ? 'bg-white/10 text-gray-300' : 'bg-white text-gray-500 shadow-sm dark:bg-gray-900 dark:text-gray-300'">
                      Solution Detail
                    </div>
                  </div>
                  <div class="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div class="p-6">
                  <h4 class="text-xl font-semibold tracking-tight" :class="isDark ? 'text-white' : 'text-gray-900 dark:text-white'">
                    {{ entry.title }}
                  </h4>
                  <p class="mt-3 text-sm leading-7" :class="isDark ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'">
                    {{ entry.description }}
                  </p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>

      <p v-else class="py-12 text-center text-gray-400">No solutions selected.</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useBlockVariant } from '@/composables/useBlockVariant'
import { fetchSolutions } from '@/lib/api'
import type { BlockStyles, DbSolution, SolutionsShowcaseContent } from '@shared/types'

const props = defineProps<{ content: SolutionsShowcaseContent; styles?: BlockStyles }>()
const { sectionStyle, isDark } = useBlockVariant(() => props.styles)

const solutions = ref<DbSolution[]>([])
const loading = ref(false)
const activeId = ref('')

async function load() {
  loading.value = true
  try {
    solutions.value = await fetchSolutions(props.content.selectedIds?.length ? props.content.selectedIds : undefined)
    if (!solutions.value.find((solution) => solution.id === activeId.value)) {
      activeId.value = solutions.value[0]?.id ?? ''
    }
  } finally {
    loading.value = false
  }
}

onMounted(load)
watch(() => props.content.selectedIds, load, { deep: true })

const activeSolution = computed(() => solutions.value.find((solution) => solution.id === activeId.value) ?? solutions.value[0] ?? null)

const activeIntro = computed(() => {
  const count = activeSolution.value?.entries?.length ?? 0
  if (!count) return 'This solution is ready to be expanded with detailed content blocks.'
  return `A curated overview of ${count} focused ${count === 1 ? 'capability' : 'capabilities'} inside this solution family.`
})

const activeButtonClass = computed(() =>
  isDark.value
    ? 'border-white/10 bg-white/10 shadow-[0_18px_50px_-30px_rgba(255,255,255,0.35)]'
    : 'border-transparent bg-gray-900 text-white shadow-[0_20px_50px_-24px_rgba(15,23,42,0.45)]'
)
const inactiveButtonClass = computed(() =>
  isDark.value
    ? 'border-white/10 bg-white/5 hover:bg-white/[0.08]'
    : 'border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/30 hover:bg-white'
)
const activeHeadingClass = computed(() => isDark.value ? 'text-white' : 'text-white')
const inactiveHeadingClass = computed(() => isDark.value ? 'text-white' : 'text-gray-900 dark:text-white')
const activePillClass = computed(() => isDark.value ? 'bg-white text-gray-900' : 'bg-white/10 text-white')
const inactivePillClass = computed(() => isDark.value ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200')
const activeLabelColor = computed(() => isDark.value ? 'var(--color-primary)' : '#ffffff')
</script>
