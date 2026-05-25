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
      class="flex-1 overflow-y-auto p-3"
      :animation="150"
      handle=".drag-handle"
      @end="onReorder"
    >
      <template v-for="(block, idx) in localBlocks" :key="block.id">
        <!-- Insert-before button (only before first block) -->
        <div v-if="idx === 0" class="relative h-5 flex items-center justify-center mb-0.5">
          <button
            @click="$emit('add-block-after', null)"
            class="opacity-0 hover:opacity-100 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-700 hover:bg-brand-100 transition-all"
          >
            <Plus class="w-3 h-3" /> Insert
          </button>
        </div>

        <BlockItem
          :block="block"
          :selected="selectedBlockId === block.id"
          @click="$emit('select', block.id)"
          @duplicate="$emit('duplicate', block.id)"
          @delete="$emit('delete', block.id)"
          @toggle-visibility="$emit('toggle-visibility', block.id)"
        />

        <!-- Insert-after button between/after blocks -->
        <div class="relative h-5 flex items-center justify-center mt-0.5 mb-0.5 group">
          <div class="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-transparent group-hover:bg-brand-200 dark:group-hover:bg-brand-800 transition-colors" />
          <button
            @click="$emit('add-block-after', block.id)"
            class="relative opacity-0 group-hover:opacity-100 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-700 hover:bg-brand-100 transition-all"
          >
            <Plus class="w-3 h-3" /> Add here
          </button>
        </div>
      </template>
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
  'add-block-after': [string | null]
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
