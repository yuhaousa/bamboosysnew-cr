<template>
  <section
    :style="sectionStyle"
    class="relative overflow-hidden"
  >
    <!-- Background image with dark gradient overlay -->
    <div v-if="content.backgroundImage?.url" class="absolute inset-0 bg-cover bg-center" :style="`background-image: url('${content.backgroundImage.url}')`">
      <div class="absolute inset-0" style="background: linear-gradient(to bottom, rgba(13, 17, 23, 0.82), rgba(13, 17, 23, 0.95))" />
    </div>
    <div class="relative container-content section-padding z-10">
      <div class="max-w-3xl" :class="textAlignClass">
        <!-- Badge -->
        <span v-if="content.badge"
          class="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-8 border"
          :style="{ color: 'var(--color-primary)', borderColor: 'color-mix(in srgb, var(--color-primary) 40%, transparent)', backgroundColor: 'color-mix(in srgb, var(--color-primary) 12%, transparent)' }"
        >{{ content.badge }}</span>

        <h1
          v-if="content.title"
          class="heading-xl"
          :style="(content.titleColor || props.styles?.textColor) ? { color: content.titleColor || props.styles?.textColor } : {}"
          :class="!(content.titleColor || props.styles?.textColor) ? (hasBackgroundImage ? 'text-white' : isDark ? 'text-white' : 'text-gray-900') : ''"
        >
          {{ content.title }}
        </h1>
        <p
          v-if="content.subtitle"
          class="mt-4 text-xl"
          :style="(content.subtitleColor || props.styles?.textColor) ? { color: content.subtitleColor || props.styles?.textColor } : {}"
          :class="!(content.subtitleColor || props.styles?.textColor) ? (hasBackgroundImage || isDark ? 'text-gray-200' : 'text-gray-600') : ''"
        >
          {{ content.subtitle }}
        </p>
        <p
          v-if="content.description"
          class="mt-6 text-lg leading-relaxed"
          :style="(content.descriptionColor || props.styles?.textColor) ? { color: content.descriptionColor || props.styles?.textColor } : {}"
          :class="!(content.descriptionColor || props.styles?.textColor) ? (hasBackgroundImage || isDark ? 'text-gray-400' : 'text-gray-500') : ''"
        >
          {{ content.description }}
        </p>
        <div v-if="content.buttons?.length" class="mt-10 flex flex-wrap gap-4" :class="alignClass">
          <a v-for="btn in content.buttons" :key="btn.id" :href="btn.link" :target="btn.openInNewTab ? '_blank' : '_self'"
            :class="btn.variant === 'primary' ? 'btn-hero-primary' : (hasBackgroundImage || isDark ? 'btn-hero-secondary' : 'btn-hero-secondary-light')">
            {{ btn.text }}
          </a>
        </div>
      </div>
      <div v-if="content.image?.url" class="mt-12">
        <img :src="content.image.url" :alt="content.image.alt" class="w-full max-w-2xl mx-auto rounded-2xl shadow-2xl" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { HeroBannerContent, BlockStyles } from '@shared/types'
import { useBlockVariant } from '@/composables/useBlockVariant'
const props = defineProps<{ content: HeroBannerContent; styles?: BlockStyles }>()

const { isDark, sectionStyle: sectionStyleBase } = useBlockVariant(() => props.styles)
const hasBackgroundImage = computed(() => !!props.content.backgroundImage?.url)

const sectionStyle = computed(() => ({
  ...sectionStyleBase.value,
  backgroundImage: (!props.content.backgroundImage?.url && props.styles?.backgroundImage)
    ? `url('${props.styles.backgroundImage}')` : undefined,
  backgroundSize: props.styles?.backgroundImage && !props.content.backgroundImage?.url ? 'cover' : undefined,
  backgroundPosition: props.styles?.backgroundImage && !props.content.backgroundImage?.url ? 'center' : undefined,
}))
const textAlignClass = computed(() => ({
  'text-left': props.styles?.alignment === 'left',
  'text-center': props.styles?.alignment === 'center' || !props.styles?.alignment,
  'text-right': props.styles?.alignment === 'right',
  'mx-auto': props.styles?.alignment !== 'left',
}))
const alignClass = computed(() => ({
  'justify-start': props.styles?.alignment === 'left',
  'justify-center': props.styles?.alignment === 'center' || !props.styles?.alignment,
  'justify-end': props.styles?.alignment === 'right',
}))
</script>

