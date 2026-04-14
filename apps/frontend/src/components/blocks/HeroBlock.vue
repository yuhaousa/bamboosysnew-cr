<template>
  <section
    :style="sectionStyle"
    class="relative overflow-hidden"
  >
    <!-- Background image overlay -->
    <div v-if="content.backgroundImage?.url" class="absolute inset-0 bg-cover bg-center" :style="`background-image: url('${content.backgroundImage.url}')`">
      <div class="absolute inset-0 bg-black/50" />
    </div>
    <div class="relative container-content section-padding z-10">
      <div class="max-w-3xl" :class="textAlignClass">
        <span v-if="content.badge" class="badge-section">{{ content.badge }}</span>
        <h1 v-if="content.title" class="heading-xl text-gray-900 dark:text-white" :class="{ 'text-white': !!content.backgroundImage?.url }">
          {{ content.title }}
        </h1>
        <p v-if="content.subtitle" class="mt-4 text-xl text-gray-600 dark:text-gray-300" :class="{ 'text-gray-200': !!content.backgroundImage?.url }">
          {{ content.subtitle }}
        </p>
        <p v-if="content.description" class="mt-4 text-lg text-gray-500 dark:text-gray-400" :class="{ 'text-gray-300': !!content.backgroundImage?.url }">
          {{ content.description }}
        </p>
        <div v-if="content.buttons?.length" class="mt-8 flex flex-wrap gap-3" :class="alignClass">
          <a v-for="btn in content.buttons" :key="btn.id" :href="btn.link" :target="btn.openInNewTab ? '_blank' : '_self'"
            :class="btn.variant === 'primary' ? 'btn-hero-primary' : 'btn-hero-secondary'">
            {{ btn.text }}
          </a>
        </div>
      </div>
      <div v-if="content.heroImage?.url" class="mt-12">
        <img :src="content.heroImage.url" :alt="content.heroImage.alt" class="w-full max-w-2xl mx-auto rounded-2xl shadow-2xl" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { HeroBannerContent, BlockStyles } from '@shared/types'
const props = defineProps<{ content: HeroBannerContent; styles?: BlockStyles }>()
const sectionStyle = computed(() => ({
  backgroundColor: props.styles?.backgroundColor ?? undefined,
  paddingTop: props.styles?.paddingTop ? `${props.styles.paddingTop}px` : undefined,
  paddingBottom: props.styles?.paddingBottom ? `${props.styles.paddingBottom}px` : undefined,
}))
const textAlignClass = computed(() => ({ 'text-left': props.styles?.textAlign === 'left', 'text-center': props.styles?.textAlign === 'center' || !props.styles?.textAlign, 'text-right': props.styles?.textAlign === 'right', 'mx-auto': props.styles?.textAlign !== 'left' }))
const alignClass = computed(() => ({ 'justify-start': props.styles?.textAlign === 'left', 'justify-center': props.styles?.textAlign === 'center' || !props.styles?.textAlign }))
</script>
