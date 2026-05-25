<template>
  <section :style="sectionStyle" class="section-padding">
    <div class="container-content max-w-4xl mx-auto">
      <h2 v-if="content.title" class="heading-md text-center text-gray-900 dark:text-white mb-4">{{ content.title }}</h2>
      <p v-if="content.description" class="text-center text-gray-600 dark:text-gray-400 mb-8">{{ content.description }}</p>
      <div class="relative rounded-2xl overflow-hidden bg-black shadow-2xl aspect-video">
        <img v-if="content.videoPoster?.url && !playing" :src="content.videoPoster.url" :alt="content.videoPoster.alt" class="w-full h-full object-cover" />
        <!-- Placeholder when no poster and not playing -->
        <div v-else-if="!playing" class="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          <div class="text-center space-y-3 text-gray-500">
            <svg class="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
            <p class="text-sm">Video URL not configured</p>
          </div>
        </div>
        <!-- Play button overlay -->
        <button v-if="!playing && embedUrl" @click="playing = true" class="absolute inset-0 flex items-center justify-center group">
          <div class="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg class="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </div>
        </button>
        <iframe v-if="playing && embedUrl" :src="`${embedUrl}?autoplay=1`" class="absolute inset-0 w-full h-full" allow="autoplay; fullscreen" allowfullscreen />
        <video v-if="playing && isDirectVideo" :src="content.videoUrl" class="w-full h-full" :autoplay="true" controls />
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useBlockVariant } from '@/composables/useBlockVariant'
import type { VideoSectionContent, BlockStyles } from '@shared/types'
const props = defineProps<{ content: VideoSectionContent; styles?: BlockStyles }>()
const playing = ref(props.content.autoplay ?? false)
const { sectionStyle, isDark } = useBlockVariant(() => props.styles)
const embedUrl = computed(() => {
  const url = props.content.videoUrl ?? ''
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?]+)/)
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`
  return null
})
const isDirectVideo = computed(() => !embedUrl.value && !!props.content.videoUrl)
</script>
