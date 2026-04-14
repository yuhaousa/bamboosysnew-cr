<template>
  <div class="relative w-full h-full bg-gray-100 dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
    <!-- Toolbar -->
    <div class="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="flex gap-1.5">
        <button @click="setWidth('100%')" :class="currentWidth === '100%' ? 'text-brand-500' : 'text-gray-400'" class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Desktop">
          <Monitor class="w-4 h-4" />
        </button>
        <button @click="setWidth('768px')" :class="currentWidth === '768px' ? 'text-brand-500' : 'text-gray-400'" class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Tablet">
          <Tablet class="w-4 h-4" />
        </button>
        <button @click="setWidth('375px')" :class="currentWidth === '375px' ? 'text-brand-500' : 'text-gray-400'" class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Mobile">
          <Smartphone class="w-4 h-4" />
        </button>
      </div>
      <div class="flex-1 flex items-center bg-gray-100 dark:bg-gray-900 rounded-lg px-3 py-1 text-xs text-gray-400 truncate">
        {{ previewUrl || 'No preview URL' }}
      </div>
      <button @click="refresh" class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 transition-colors" title="Refresh">
        <RotateCcw class="w-4 h-4" />
      </button>
      <a v-if="previewUrl" :href="previewUrl" target="_blank" class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 transition-colors" title="Open in new tab">
        <ExternalLink class="w-4 h-4" />
      </a>
    </div>
    <!-- Frame area -->
    <div class="flex-1 h-[calc(100%-44px)] overflow-auto flex items-start justify-center bg-gray-200 dark:bg-gray-900/60 p-3">
      <div class="transition-all duration-300 bg-white shadow-xl h-full" :style="{ width: currentWidth, minHeight: '600px' }">
        <iframe
          v-if="previewUrl"
          ref="iframeRef"
          :src="previewUrl"
          :key="refreshKey"
          class="w-full h-full border-0"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
        />
        <div v-else class="w-full h-full flex items-center justify-center text-gray-400 text-sm">
          Save the page to see a preview
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Monitor, Tablet, Smartphone, RotateCcw, ExternalLink } from 'lucide-vue-next'

const props = defineProps<{ previewUrl?: string }>()

const iframeRef = ref<HTMLIFrameElement | null>(null)
const currentWidth = ref('100%')
const refreshKey = ref(0)

function setWidth(w: string) { currentWidth.value = w }
function refresh() { refreshKey.value++ }
</script>
