<template>
  <section :style="sectionStyle" class="section-padding">
    <div class="container-content text-center max-w-3xl mx-auto space-y-6">
      <span v-if="content.badge" class="badge-section">{{ content.badge }}</span>
      <h2 v-if="content.title" class="heading-lg text-gray-900 dark:text-white">{{ content.title }}</h2>
      <p v-if="content.description" class="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">{{ content.description }}</p>
      <div v-if="content.buttons?.length" class="flex flex-wrap justify-center gap-3 pt-2">
        <a v-for="btn in content.buttons" :key="btn.id" :href="btn.link" :target="btn.openInNewTab ? '_blank' : '_self'" :class="btn.variant === 'primary' ? 'btn-hero-primary' : 'btn-hero-secondary'">{{ btn.text }}</a>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import type { CenteredTextContent, BlockStyles } from '@shared/types'
const props = defineProps<{ content: CenteredTextContent; styles?: BlockStyles }>()
const sectionStyle = computed(() => ({ backgroundColor: props.styles?.backgroundColor ?? undefined }))
</script>
