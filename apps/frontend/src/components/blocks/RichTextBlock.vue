<template>
  <section :style="sectionStyle" class="section-padding">
    <div class="container-content">
      <div class="prose prose-gray dark:prose-invert max-w-4xl mx-auto" v-html="content.html" />
    </div>
  </section>
</template>
<script setup lang="ts">
import { useBlockVariant } from '@/composables/useBlockVariant'
import type { RichTextContent, BlockStyles } from '@shared/types'
const props = defineProps<{ content: RichTextContent; styles?: BlockStyles }>()
const { sectionStyle, isDark } = useBlockVariant(() => props.styles)
</script>
