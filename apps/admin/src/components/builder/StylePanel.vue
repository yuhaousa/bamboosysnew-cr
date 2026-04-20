<template>
  <div class="space-y-5">

    <!-- Block Style Variant -->
    <div>
      <label class="form-label">Block Style</label>
      <div class="grid grid-cols-4 gap-2">
        <button
          v-for="v in variantOptions" :key="v.value"
          @click="toggleVariant(v.value)"
          class="py-3 px-2 rounded-xl border text-xs font-medium flex flex-col items-center gap-1.5 transition-all"
          :class="local.variant === v.value
            ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 shadow-sm'
            : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500'"
        >
          <div class="w-8 h-5 rounded-md flex-shrink-0 border overflow-hidden" :class="v.preview" />
          <span>{{ v.label }}</span>
        </button>
      </div>
      <p class="text-xs text-gray-400 dark:text-gray-500 mt-1.5">{{ variantHint }}</p>
    </div>

    <!-- Background Color with swatch picker -->
    <div>
      <label class="form-label">Background Color</label>
      <!-- Quick swatches -->
      <div class="flex flex-wrap gap-2 mb-2">
        <button
          v-for="swatch in bgSwatches" :key="swatch.value"
          @click="applyBgSwatch(swatch.value)"
          :title="swatch.label"
          class="relative group w-7 h-7 rounded-lg border-2 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-brand-500"
          :class="local.backgroundColor === swatch.value ? 'border-brand-500 ring-2 ring-brand-400' : 'border-white/20 dark:border-gray-600'"
          :style="swatch.style"
        >
          <span v-if="local.backgroundColor === swatch.value"
            class="absolute inset-0 flex items-center justify-center text-white text-xs font-bold drop-shadow">✓</span>
          <!-- Tooltip -->
          <span class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-0.5 rounded bg-gray-900 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
            {{ swatch.label }}
          </span>
        </button>
        <!-- Custom color picker pill -->
        <label
          class="relative w-7 h-7 rounded-lg border-2 border-dashed border-gray-400 dark:border-gray-600 flex items-center justify-center cursor-pointer hover:scale-110 transition-all"
          title="Custom color"
        >
          <span class="text-gray-400 text-lg leading-none">+</span>
          <input type="color" :value="local.backgroundColor || '#ffffff'"
            @input="onBgColorInput"
            class="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
        </label>
      </div>
      <!-- Text input for manual hex -->
      <div class="flex gap-2 items-center">
        <div class="w-6 h-6 rounded-md border border-gray-300 dark:border-gray-600 flex-shrink-0 transition-colors"
          :style="{ backgroundColor: local.backgroundColor || 'transparent' }" />
        <input type="text" v-model="local.backgroundColor" @input="emit" class="form-input flex-1 font-mono text-sm" placeholder="transparent / #0d1117" />
        <button @click="local.backgroundColor = ''; emit()" class="btn-ghost p-1.5" title="Clear">
          <X class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Text Color with swatch picker -->
    <div>
      <label class="form-label">Text Color</label>
      <div class="flex flex-wrap gap-2 mb-2">
        <button
          v-for="swatch in textSwatches" :key="swatch.value"
          @click="applyTextSwatch(swatch.value)"
          :title="swatch.label"
          class="relative group w-7 h-7 rounded-lg border-2 transition-all hover:scale-110 focus:outline-none"
          :class="local.textColor === swatch.value ? 'border-brand-500 ring-2 ring-brand-400' : 'border-white/20 dark:border-gray-600'"
          :style="swatch.style"
        >
          <span v-if="local.textColor === swatch.value"
            class="absolute inset-0 flex items-center justify-center text-xs font-bold drop-shadow"
            :class="swatch.value === '#ffffff' ? 'text-gray-800' : 'text-white'">✓</span>
          <span class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-0.5 rounded bg-gray-900 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
            {{ swatch.label }}
          </span>
        </button>
        <label class="relative w-7 h-7 rounded-lg border-2 border-dashed border-gray-400 dark:border-gray-600 flex items-center justify-center cursor-pointer hover:scale-110 transition-all" title="Custom">
          <span class="text-gray-400 text-lg leading-none">+</span>
          <input type="color" :value="local.textColor || '#000000'"
            @input="onTextColorInput"
            class="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
        </label>
      </div>
      <div class="flex gap-2 items-center">
        <div class="w-6 h-6 rounded-md border border-gray-300 dark:border-gray-600 flex-shrink-0"
          :style="{ backgroundColor: local.textColor || 'transparent' }" />
        <input type="text" v-model="local.textColor" @input="emit" class="form-input flex-1 font-mono text-sm" placeholder="auto / #ffffff" />
        <button @click="local.textColor = ''; emit()" class="btn-ghost p-1.5">
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
          @click="setAlignment(align.value)"
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
import { reactive, watch, computed } from 'vue'
import { X } from 'lucide-vue-next'
import type { BlockStyles } from '@shared/types'
import { useSettingsStore } from '@/stores/settings'

const props = defineProps<{ styles: BlockStyles }>()
const emits = defineEmits<{ update: [BlockStyles] }>()

const local = reactive<BlockStyles>({ ...props.styles })
watch(() => props.styles, (s) => Object.assign(local, s), { deep: true })

const settingsStore = useSettingsStore()
const primary = computed(() => settingsStore.settings?.theme?.primaryColor || '#2563eb')

// ─── Background color swatches ───────────────────────────────────────────────
const bgSwatches = computed(() => [
  { label: 'White', value: '#ffffff', style: { background: '#ffffff', border: '1px solid #e5e7eb' } },
  { label: 'Light Gray', value: '#f9fafb', style: { background: '#f9fafb', border: '1px solid #e5e7eb' } },
  { label: 'Light Blue', value: '#f0f9ff', style: { background: '#f0f9ff', border: '1px solid #bae6fd' } },
  { label: 'Primary Tint', value: 'color-mix(in srgb, ' + primary.value + ' 10%, #f8faff)',
    style: { background: 'linear-gradient(135deg,' + primary.value + '20, #f8faff)' } },
  { label: 'Dark', value: '#0d1117', style: { background: '#0d1117' } },
  { label: 'Dark Navy', value: '#0f172a', style: { background: '#0f172a' } },
  { label: 'Dark Slate', value: '#1e293b', style: { background: '#1e293b' } },
  { label: 'Dark Glass', value: '#070e1c', style: { background: 'linear-gradient(135deg,#070e1c,#0f1f3d)' } },
  { label: 'Primary', value: primary.value, style: { background: primary.value } },
])

// ─── Text color swatches ─────────────────────────────────────────────────────
const textSwatches = computed(() => [
  { label: 'White', value: '#ffffff', style: { background: '#ffffff', border: '1px solid #e5e7eb' } },
  { label: 'Light Gray', value: '#e5e7eb', style: { background: '#e5e7eb' } },
  { label: 'Dark', value: '#111827', style: { background: '#111827' } },
  { label: 'Gray', value: '#6b7280', style: { background: '#6b7280' } },
  { label: 'Primary', value: primary.value, style: { background: primary.value } },
])

function applyBgSwatch(value: string) {
  local.backgroundColor = local.backgroundColor === value ? '' : value
  emit()
}

function applyTextSwatch(value: string) {
  local.textColor = local.textColor === value ? '' : value
  emit()
}

function onBgColorInput(e: Event) {
  local.backgroundColor = (e.target as HTMLInputElement).value
  emit()
}

function onTextColorInput(e: Event) {
  local.textColor = (e.target as HTMLInputElement).value
  emit()
}

function setAlignment(value: string) {
  local.alignment = value as 'left' | 'center' | 'right'
  emit()
}

const variantOptions = [
  { value: 'light', label: 'Light', preview: 'bg-white border-gray-200' },
  { value: 'dark', label: 'Dark', preview: 'bg-gray-900 border-gray-700' },
  { value: 'glass', label: 'Glass', preview: 'bg-gradient-to-br from-slate-800 to-blue-900 border-blue-700' },
  { value: 'gradient', label: 'Gradient', preview: 'bg-gradient-to-br from-blue-100 to-white border-blue-200' },
]

const variantHint = computed(() => {
  switch (local.variant) {
    case 'light': return 'White background with dark text.'
    case 'dark': return 'Dark background with white text and primary accents.'
    case 'glass': return 'Deep navy with frosted-glass inner cards.'
    case 'gradient': return 'Soft primary-color gradient background.'
    default: return 'Auto-detect from background color below.'
  }
})

const alignments = [
  { label: 'Left', value: 'left' },
  { label: 'Center', value: 'center' },
  { label: 'Right', value: 'right' },
]

function toggleVariant(value: string) {
  local.variant = local.variant === value ? undefined : (value as BlockStyles['variant'])
  emit()
}

function emit() {
  emits('update', { ...local })
}
</script>
