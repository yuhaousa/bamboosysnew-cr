<template>
  <section :style="sectionStyle" class="section-padding">
    <div class="container-content">
      <div :class="`grid grid-cols-2 md:grid-cols-${content.columns ?? 4} gap-8`">
        <div v-for="stat in content.stats" :key="stat.id" class="text-center">
          <p class="text-4xl md:text-5xl font-bold text-brand-600 dark:text-brand-400">
            {{ stat.prefix }}{{ stat.value }}{{ stat.suffix }}
          </p>
          <p class="mt-2 text-gray-600 dark:text-gray-400 font-medium">{{ stat.label }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import type { StatisticsContent, BlockStyles } from '@shared/types'
const props = defineProps<{ content: StatisticsContent; styles?: BlockStyles }>()
const sectionStyle = computed(() => ({ backgroundColor: props.styles?.backgroundColor ?? undefined }))
</script>
