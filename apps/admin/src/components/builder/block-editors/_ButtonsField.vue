<template>
  <div class="space-y-2">
    <div v-for="(btn, i) in local" :key="i" class="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl space-y-2">
      <div class="flex items-center justify-between mb-1">
        <span class="text-xs font-semibold text-gray-500">Button {{ i + 1 }}</span>
        <button @click="remove(i)" class="text-red-400 hover:text-red-600 p-0.5">
          <X class="w-3.5 h-3.5" />
        </button>
      </div>
      <input v-model="btn.text" @input="emitUpdate" class="form-input text-sm" placeholder="Button text" />
      <input v-model="btn.link" @input="emitUpdate" class="form-input text-sm" placeholder="/page or https://..." />
      <div class="grid grid-cols-2 gap-2">
        <select v-model="btn.variant" @change="emitUpdate" class="form-select text-xs">
          <option value="primary">Primary</option>
          <option value="secondary">Secondary</option>
          <option value="outline">Outline</option>
          <option value="ghost">Ghost</option>
        </select>
        <select v-model="btn.target" @change="emitUpdate" class="form-select text-xs">
          <option value="_self">Same tab</option>
          <option value="_blank">New tab</option>
        </select>
      </div>
    </div>
    <button
      v-if="local.length < 4"
      @click="add"
      class="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-xs text-gray-400 hover:border-brand-400 hover:text-brand-500 transition-colors"
    >
      + Add Button
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { X } from 'lucide-vue-next'
import type { BlockButton } from '@shared/types'

const props = defineProps<{ buttons: BlockButton[] }>()
const emit = defineEmits<{ update: [BlockButton[]] }>()

const local = ref<BlockButton[]>(props.buttons.map(b => ({ ...b })))
watch(() => props.buttons, bs => { local.value = bs.map(b => ({ ...b })) })

function add() {
  local.value.push({ text: 'Button', link: '/', variant: 'primary', target: '_self' })
  emitUpdate()
}

function remove(i: number) {
  local.value.splice(i, 1)
  emitUpdate()
}

function emitUpdate() {
  emit('update', local.value.map(b => ({ ...b })))
}
</script>
