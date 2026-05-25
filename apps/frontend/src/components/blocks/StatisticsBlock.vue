<template>
  <section ref="sectionRef" :style="sectionStyle" class="section-padding">
    <div class="container-content">
      <div :class="`grid grid-cols-2 md:grid-cols-${content.columns ?? 4} gap-8`">
        <div v-for="stat in content.stats" :key="stat.id" class="text-center">
          <p class="text-4xl md:text-5xl font-bold text-brand-600 dark:text-brand-400">
            {{ stat.prefix }}{{ displayValues[stat.id] ?? stat.value }}{{ stat.suffix }}
          </p>
          <p class="mt-2 text-gray-600 dark:text-gray-400 font-medium">{{ stat.label }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useBlockVariant } from '@/composables/useBlockVariant'
import type { StatisticsContent, BlockStyles } from '@shared/types'

const props = defineProps<{ content: StatisticsContent; styles?: BlockStyles }>()
const { sectionStyle } = useBlockVariant(() => props.styles)

const sectionRef = ref<HTMLElement | null>(null)
const displayValues = reactive<Record<string, string | number>>({})
let observer: IntersectionObserver | null = null
let animated = false

function animateAll() {
  if (animated) return
  animated = true
  ;(props.content.stats ?? []).forEach(stat => {
    const raw = String(stat.value).replace(/[^\d.]/g, '')
    const target = parseFloat(raw)
    if (isNaN(target)) { displayValues[stat.id] = stat.value; return }
    const duration = 1400
    const start = performance.now()
    function tick(now: number) {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      displayValues[stat.id] = Math.round(eased * target)
      if (t < 1) requestAnimationFrame(tick)
      else displayValues[stat.id] = stat.value
    }
    requestAnimationFrame(tick)
  })
}

onMounted(() => {
  ;(props.content.stats ?? []).forEach(s => { displayValues[s.id] = 0 })
  observer = new IntersectionObserver(
    entries => { if (entries.some(e => e.isIntersecting)) { animateAll(); observer?.disconnect() } },
    { threshold: 0.25 }
  )
  if (sectionRef.value) observer.observe(sectionRef.value)
})
onUnmounted(() => observer?.disconnect())
</script>
