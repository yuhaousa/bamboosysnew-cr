<template>
  <section :style="sectionStyle" class="section-padding relative overflow-hidden">
    <div v-if="content.backgroundImage?.url" class="absolute inset-0 bg-cover bg-center" :style="`background-image:url('${content.backgroundImage.url}')`">
      <div class="absolute inset-0 bg-black/60" />
    </div>
    <div class="relative container-content text-center max-w-2xl mx-auto space-y-6 z-10">
      <span v-if="content.badge" class="badge-section">{{ content.badge }}</span>
      <h2 class="heading-lg" :class="content.backgroundImage?.url ? 'text-white' : 'text-gray-900 dark:text-white'">{{ content.title }}</h2>
      <p v-if="content.description" class="text-lg" :class="content.backgroundImage?.url ? 'text-gray-200' : 'text-gray-600 dark:text-gray-400'">{{ content.description }}</p>
      <div v-if="content.buttons?.length" class="flex flex-wrap justify-center gap-3">
        <a v-for="btn in content.buttons" :key="btn.id" :href="btn.link" :target="btn.openInNewTab ? '_blank' : '_self'" :class="btn.variant === 'primary' ? 'btn-hero-primary' : 'btn-hero-secondary'">{{ btn.text }}</a>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import type { CTAContent, BlockStyles } from '@shared/types'
const props = defineProps<{ content: CTAContent; styles?: BlockStyles }>()
const sectionStyle = computed(() => ({ backgroundColor: props.styles?.backgroundColor ?? undefined }))
</script>
