<template>
  <section :style="sectionStyle" class="overflow-hidden">
    <div class="container-content py-16 md:py-24">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div v-if="content.image?.url" :class="reverse ? 'lg:order-2' : 'lg:order-1'">
          <img :src="content.image.url" :alt="content.image.alt" class="w-full rounded-2xl shadow-xl" />
        </div>
        <div :class="reverse ? 'lg:order-1' : 'lg:order-2'" class="space-y-6">
          <span v-if="content.badge"
            class="inline-block px-3 py-1 text-xs font-semibold rounded-full tracking-wider uppercase"
            :style="{ color: 'var(--color-primary)', border: '1px solid var(--color-primary)', backgroundColor: 'color-mix(in srgb, var(--color-primary) 12%, transparent)' }"
          >{{ content.badge }}</span>
          <h2 v-if="content.title" class="heading-lg" :class="isDark ? 'text-white' : 'text-gray-900 dark:text-white'">{{ content.title }}</h2>
          <p v-if="content.subtitle" class="text-lg font-semibold" :style="{ color: 'var(--color-primary)' }">{{ content.subtitle }}</p>
          <div v-if="content.description" class="leading-relaxed" :class="isDark ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'" v-html="richDescription" />
          <div v-if="content.bullets?.length" class="space-y-2">
            <div v-for="b in content.bullets" :key="b" class="flex items-start gap-2">
              <div class="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                :style="{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 20%, transparent)' }">
                <div class="w-2 h-2 rounded-full" :style="{ backgroundColor: 'var(--color-primary)' }" />
              </div>
              <span class="text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'">{{ b }}</span>
            </div>
          </div>
          <div v-if="content.buttons?.length" class="flex flex-wrap gap-3 pt-2">
            <a v-for="btn in content.buttons" :key="btn.id" :href="btn.link" :target="btn.openInNewTab ? '_blank' : '_self'"
              :class="btn.variant === 'primary' ? 'btn-hero-primary' : 'btn-hero-secondary'">{{ btn.text }}</a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import type { ImageTextContent, BlockStyles } from '@shared/types'
import { useBlockVariant } from '@/composables/useBlockVariant'
const props = defineProps<{ content: ImageTextContent; styles?: BlockStyles; reverse?: boolean }>()
const { isDark, sectionStyle } = useBlockVariant(() => props.styles)
// Parse simple markdown: **bold** → <strong>, newlines → <br>
const richDescription = computed(() => {
  const text = props.content.description
  if (!text) return ''
  const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  return escaped
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-current">$1</strong>')
    .replace(/\n/g, '<br>')
})
</script>
