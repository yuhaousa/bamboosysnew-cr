<template>
  <section :style="sectionStyle">
    <div v-if="content.title" class="container-content py-6">
      <h2 class="heading-md text-gray-900 dark:text-white">{{ content.title }}</h2>
    </div>
    <div class="w-full overflow-hidden" :style="{ height: content.height ?? '400px' }">
      <iframe v-if="content.embedUrl" :src="content.embedUrl" :height="content.height ?? '400px'" width="100%" style="border:0" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade" />
    </div>
  </section>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import type { MapSectionContent, BlockStyles } from '@shared/types'
const props = defineProps<{ content: MapSectionContent; styles?: BlockStyles }>()
const sectionStyle = computed(() => ({ backgroundColor: props.styles?.backgroundColor ?? undefined }))
</script>
