<template>
  <div class="space-y-4">
    <div>
      <label class="form-label">Background Color</label>
      <div class="flex gap-2 items-center">
        <input type="color" v-model="local.backgroundColor" @change="emit" class="w-10 h-10 rounded cursor-pointer border border-gray-300 dark:border-gray-600 p-0.5" />
        <input type="text" v-model="local.backgroundColor" @input="emit" class="form-input flex-1" placeholder="#ffffff or transparent" />
        <button @click="local.backgroundColor = ''; emit()" class="btn-ghost p-2">
          <X class="w-4 h-4" />
        </button>
      </div>
    </div>

    <div>
      <label class="form-label">Text Color</label>
      <div class="flex gap-2 items-center">
        <input type="color" v-model="local.textColor" @change="emit" class="w-10 h-10 rounded cursor-pointer border border-gray-300 dark:border-gray-600 p-0.5" />
        <input type="text" v-model="local.textColor" @input="emit" class="form-input flex-1" placeholder="#000000" />
        <button @click="local.textColor = ''; emit()" class="btn-ghost p-2">
          <X class="w-4 h-4" />
        </button>
      </div>
    </div>

    <div>
      <label class="form-label">Background Image URL</label>
      <input type="text" v-model="local.backgroundImage" @input="emit" class="form-input" placeholder="https://..." />
    </div>

    <div>
      <label class="form-label">Text Alignment</label>
      <div class="flex gap-2">
        <button v-for="align in alignments" :key="align.value"
          @click="local.alignment = align.value as 'left' | 'center' | 'right'; emit()"
          class="flex-1 py-2 rounded-lg border text-sm font-medium transition-colors"
          :class="local.alignment === align.value
            ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400'
            : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'"
        >
          {{ align.label }}
        </button>
      </div>
    </div>

    <div>
      <label class="form-label">Container Width</label>
      <select v-model="local.containerWidth" @change="emit" class="form-select">
        <option value="full">Full Width</option>
        <option value="wide">Wide (max 1280px)</option>
        <option value="narrow">Narrow (max 768px)</option>
      </select>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <div>
        <label class="form-label">Padding Top</label>
        <input type="text" v-model="local.paddingTop" @input="emit" class="form-input" placeholder="80px" />
      </div>
      <div>
        <label class="form-label">Padding Bottom</label>
        <input type="text" v-model="local.paddingBottom" @input="emit" class="form-input" placeholder="80px" />
      </div>
      <div>
        <label class="form-label">Padding Left</label>
        <input type="text" v-model="local.paddingLeft" @input="emit" class="form-input" placeholder="24px" />
      </div>
      <div>
        <label class="form-label">Padding Right</label>
        <input type="text" v-model="local.paddingRight" @input="emit" class="form-input" placeholder="24px" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { X } from 'lucide-vue-next'
import type { BlockStyles } from '@shared/types'

const props = defineProps<{ styles: BlockStyles }>()
const emits = defineEmits<{ update: [BlockStyles] }>()

const local = reactive<BlockStyles>({ ...props.styles })

watch(() => props.styles, (s) => Object.assign(local, s), { deep: true })

const alignments = [
  { label: 'Left', value: 'left' },
  { label: 'Center', value: 'center' },
  { label: 'Right', value: 'right' },
]

function emit() {
  emits('update', { ...local })
}
</script>
