<template>
  <AppModal :model-value="open" title="Media Library" size="2xl" @update:model-value="$emit('close')">
    <MediaLibrary :multiple="multiple" :selectedIds="selectedIds" @select="onSelect" />
    <template #footer>
      <div class="flex justify-between items-center">
        <span class="text-sm text-gray-500">{{ pendingSelection.length }} selected</span>
        <div class="flex gap-2">
          <button class="btn btn-secondary" @click="$emit('close')">Cancel</button>
          <button class="btn btn-primary" @click="confirm" :disabled="pendingSelection.length === 0">
            {{ multiple ? `Insert ${pendingSelection.length} image(s)` : 'Insert' }}
          </button>
        </div>
      </div>
    </template>
  </AppModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppModal from '@/components/common/AppModal.vue'
import MediaLibrary from './MediaLibrary.vue'
import type { MediaItem } from '@shared/types'

const props = defineProps<{
  open: boolean
  multiple?: boolean
  selectedIds?: string[]
}>()

const emit = defineEmits<{
  close: []
  select: [MediaItem]
  selectMany: [MediaItem[]]
}>()

const pendingSelection = ref<MediaItem[]>([])

function onSelect(items: MediaItem[]) {
  pendingSelection.value = items
}

function confirm() {
  if (props.multiple) {
    emit('selectMany', pendingSelection.value)
  } else if (pendingSelection.value[0]) {
    emit('select', pendingSelection.value[0])
  }
  emit('close')
}
</script>
