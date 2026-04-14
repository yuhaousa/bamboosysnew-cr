<template>
  <div
    class="group flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all"
    :class="[
      selected
        ? 'border-brand-400 dark:border-brand-500 bg-brand-50 dark:bg-brand-900/20'
        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:border-gray-300 dark:hover:border-gray-600',
      !block.visibility ? 'opacity-50' : ''
    ]"
    @click="$emit('click')"
  >
    <!-- Drag handle -->
    <div class="drag-handle cursor-grab active:cursor-grabbing text-gray-300 dark:text-gray-600 hover:text-gray-500 shrink-0">
      <GripVertical class="w-4 h-4" />
    </div>

    <!-- Block type icon + label -->
    <div class="flex-1 min-w-0">
      <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{{ blockLabel }}</p>
      <p class="text-xs text-gray-400 capitalize">{{ block.type.replace(/_/g, ' ') }}</p>
    </div>

    <!-- Actions (show on hover or selected) -->
    <div
      class="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
      :class="selected ? 'opacity-100' : ''"
      @click.stop
    >
      <button
        class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        :title="block.visibility ? 'Hide block' : 'Show block'"
        @click="$emit('toggle-visibility')"
      >
        <Eye v-if="block.visibility" class="w-3.5 h-3.5" />
        <EyeOff v-else class="w-3.5 h-3.5" />
      </button>
      <button
        class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        title="Duplicate block"
        @click="$emit('duplicate')"
      >
        <Copy class="w-3.5 h-3.5" />
      </button>
      <button
        class="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
        title="Delete block"
        @click="$emit('delete')"
      >
        <Trash2 class="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { GripVertical, Eye, EyeOff, Copy, Trash2 } from 'lucide-vue-next'
import { BLOCK_TYPES } from '@shared/constants/blockTypes'
import type { Block } from '@shared/types'

const props = defineProps<{
  block: Block
  selected: boolean
}>()

defineEmits<{
  click: []
  duplicate: []
  delete: []
  'toggle-visibility': []
}>()

const blockLabel = computed(() => {
  const meta = BLOCK_TYPES.find(b => b.type === props.block.type)
  if (meta) return meta.label
  // Try to get title from content
  const content = props.block.content as Record<string, unknown>
  return (content.title as string) || meta?.label || props.block.type
})
</script>
