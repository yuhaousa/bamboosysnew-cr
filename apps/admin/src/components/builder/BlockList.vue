<template>
  <div class="flex flex-col h-full">
    <!-- Toolbar -->
    <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
      <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">
        Blocks <span class="text-gray-400">({{ blocks.length }})</span>
      </h3>
      <button class="btn-primary text-xs gap-1.5" @click="$emit('add-block')">
        <Plus class="w-3.5 h-3.5" />
        Add Block
      </button>
    </div>

    <!-- Empty state -->
    <div v-if="blocks.length === 0" class="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-3">
        <Layers class="w-8 h-8 text-gray-400" />
      </div>
      <p class="text-sm font-medium text-gray-700 dark:text-gray-300">No blocks yet</p>
      <p class="text-xs text-gray-400 mt-1">Add blocks to build your page</p>
      <button class="btn-primary mt-4 text-xs" @click="$emit('add-block')">
        <Plus class="w-3.5 h-3.5" />
        Add First Block
      </button>
    </div>

    <!-- Draggable list -->
    <VueDraggable
      v-else
      v-model="localBlocks"
      class="flex-1 overflow-y-auto p-3 space-y-2"
      :animation="150"
      handle=".drag-handle"
      @end="onReorder"
    >
      <BlockItem
        v-for="block in localBlocks"
        :key="block.id"
        :block="block"
        :selected="selectedBlockId === block.id"
        @click="$emit('select', block.id)"
        @duplicate="$emit('duplicate', block.id)"
        @delete="$emit('delete', block.id)"
        @toggle-visibility="$emit('toggle-visibility', block.id)"
      />
    </VueDraggable>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { Plus, Layers } from 'lucide-vue-next'
import BlockItem from './BlockItem.vue'
import type { Block } from '@shared/types'

const props = defineProps<{
  blocks: Block[]
  selectedBlockId?: string | null
  pageId: string
}>()

const emit = defineEmits<{
  'add-block': []
  'select': [string]
  'duplicate': [string]
  'delete': [string]
  'toggle-visibility': [string]
  'reorder': [{ id: string; sortOrder: number }[]]
}>()

const localBlocks = computed({
  get: () => [...props.blocks].sort((a, b) => a.sortOrder - b.sortOrder),
  set: () => {},
})

function onReorder() {
  // After drag, compute new order
  const order = localBlocks.value.map((b, i) => ({ id: b.id, sortOrder: i }))
  emit('reorder', order)
}
</script>
