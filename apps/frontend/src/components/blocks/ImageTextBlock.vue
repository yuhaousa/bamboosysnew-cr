<template>
  <section :style="sectionStyle" class="section-padding">
    <div class="container-content">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center" :class="{ 'lg:flex-row-reverse': reverse }">
        <div v-if="content.image?.url" class="order-2 lg:order-1">
          <img :src="content.image.url" :alt="content.image.alt" class="w-full rounded-2xl shadow-xl" />
        </div>
        <div class="order-1 lg:order-2 space-y-6">
          <span v-if="content.badge" class="badge-section">{{ content.badge }}</span>
          <h2 v-if="content.title" class="heading-lg text-gray-900 dark:text-white">{{ content.title }}</h2>
          <p v-if="content.subtitle" class="text-lg text-brand-600 dark:text-brand-400 font-medium">{{ content.subtitle }}</p>
          <p v-if="content.description" class="text-gray-600 dark:text-gray-400 leading-relaxed">{{ content.description }}</p>
          <div v-if="content.bullets?.length" class="space-y-2">
            <div v-for="b in content.bullets" :key="b" class="flex items-start gap-2">
              <div class="w-5 h-5 rounded-full bg-brand-100 dark:bg-brand-950/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div class="w-2 h-2 rounded-full bg-brand-500" />
              </div>
              <span class="text-gray-600 dark:text-gray-400 text-sm">{{ b }}</span>
            </div>
          </div>
          <div v-if="content.buttons?.length" class="flex flex-wrap gap-3 pt-2">
            <a v-for="btn in content.buttons" :key="btn.id" :href="btn.link" :target="btn.openInNewTab ? '_blank' : '_self'" :class="btn.variant === 'primary' ? 'btn-hero-primary' : 'btn-hero-secondary'">{{ btn.text }}</a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import type { ImageTextContent, BlockStyles } from '@shared/types'
const props = defineProps<{ content: ImageTextContent; styles?: BlockStyles; reverse?: boolean }>()
const sectionStyle = computed(() => ({ backgroundColor: props.styles?.backgroundColor ?? undefined }))
</script>
