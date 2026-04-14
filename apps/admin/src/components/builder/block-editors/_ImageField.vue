<template>
  <div class="space-y-2">
    <label v-if="label" class="form-label">{{ label ?? 'Image' }}</label>
    <div v-if="value?.url" class="relative">
      <img :src="value.url" :alt="value.alt" class="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-700" />
      <button @click="$emit('update', undefined)" class="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600">
        <X class="w-3.5 h-3.5" />
      </button>
    </div>
    <div class="flex gap-2">
      <button class="btn-outline text-xs gap-1.5 flex-1" @click="showPicker = true">
        <ImageIcon class="w-3.5 h-3.5" />
        {{ value?.url ? 'Change Image' : 'Select Image' }}
      </button>
    </div>
    <input
      v-if="value"
      v-model="altText"
      @input="$emit('update', { ...value, alt: altText })"
      class="form-input text-xs"
      placeholder="Alt text (for accessibility)"
    />

    <MediaPicker v-model="showPicker" @select="onSelect" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { X, Image as ImageIcon } from 'lucide-vue-next'
import MediaPicker from '@/components/media/MediaPicker.vue'
import type { BlockImage, MediaItem } from '@shared/types'

const props = defineProps<{
  value?: BlockImage
  label?: string
}>()
const emit = defineEmits<{ update: [BlockImage | undefined] }>()

const showPicker = ref(false)
const altText = ref(props.value?.alt ?? '')

watch(() => props.value, v => { altText.value = v?.alt ?? '' })

function onSelect(item: MediaItem) {
  emit('update', { url: item.url, alt: item.alt ?? '' })
  showPicker.value = false
}
</script>
