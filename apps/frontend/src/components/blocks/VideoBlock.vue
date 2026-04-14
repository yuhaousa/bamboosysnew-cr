<template>
  <section :style="sectionStyle" class="section-padding">
    <div class="container-content max-w-4xl mx-auto">
      <h2 v-if="content.title" class="heading-md text-center text-gray-900 dark:text-white mb-4">{{ content.title }}</h2>
      <p v-if="content.description" class="text-center text-gray-600 dark:text-gray-400 mb-8">{{ content.description }}</p>
      <div class="relative rounded-2xl overflow-hidden bg-black shadow-2xl aspect-video">
        <img v-if="content.videoPoster?.url && !playing" :src="content.videoPoster.url" :alt="content.videoPoster.alt" class="w-full h-full object-cover" />
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
import type { VideoSectionContent, BlockStyles } from '@shared/types'
const props = defineProps<{ content: VideoSectionContent; styles?: BlockStyles }>()
const playing = ref(props.content.autoplay ?? false)
const sectionStyle = computed(() => ({ backgroundColor: props.styles?.backgroundColor ?? undefined }))
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
