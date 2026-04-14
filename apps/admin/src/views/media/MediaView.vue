<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Media Library</h1>
        <p class="text-sm text-gray-500 mt-0.5">Manage your images, videos, and files</p>
      </div>
    </div>
    <div class="card">
      <MediaLibrary :multiple="true" @select="onSelect" />
    </div>
  </div>
</template>

<script setup lang="ts">
import MediaLibrary from '@/components/media/MediaLibrary.vue'
import type { MediaItem } from '@shared/types'

function onSelect(items: MediaItem[]) {
  // In full-page view, selection just shows visual feedback
}
</script>
