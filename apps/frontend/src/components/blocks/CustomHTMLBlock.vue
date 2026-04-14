<template>
  <section :style="sectionStyle" class="section-padding">
    <div class="container-content">
      <!-- Custom HTML is rendered as-is; CSS is injected in a scoped style tag -->
      <div v-if="content.css" v-html="`<style>${content.css}</style>`" />
      <div v-html="content.html" />
    </div>
  </section>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import type { CustomHTMLContent, BlockStyles } from '@shared/types'
const props = defineProps<{ content: CustomHTMLContent; styles?: BlockStyles }>()
const sectionStyle = computed(() => ({ backgroundColor: props.styles?.backgroundColor ?? undefined }))
</script>
