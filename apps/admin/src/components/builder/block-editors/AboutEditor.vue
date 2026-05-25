<template>
  <div class="space-y-4">
    <FieldGroup label="Badge"><input v-model="local.badge" @input="emit" class="form-input" /></FieldGroup>
    <FieldGroup label="Title"><input v-model="local.title" @input="emit" class="form-input" /></FieldGroup>
    <FieldGroup label="Description"><textarea v-model="local.description" @input="emit" class="form-textarea" rows="3" /></FieldGroup>

    <!-- Highlights -->
    <div>
      <div class="flex items-center justify-between mb-2">
        <label class="form-label mb-0">Highlights</label>
        <button @click="toggleHighlightMode" class="text-xs text-brand-500 hover:text-brand-700 underline">
          {{ isRich ? 'Switch to simple list' : 'Switch to rich cards' }}
        </button>
      </div>

      <!-- Rich highlights (icon + title + description) -->
      <div v-if="isRich" class="space-y-2">
        <div v-for="(h, i) in richHighlights" :key="h.id" class="p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 space-y-2">
          <div class="flex gap-2 items-center">
            <input v-model="h.icon" @input="emit" class="form-input w-14 text-center text-lg" placeholder="📌" />
            <input v-model="h.title" @input="emit" class="form-input flex-1 font-medium" placeholder="Title" />
            <button @click="removeRichHighlight(i)" class="text-red-400 hover:text-red-600 flex-shrink-0"><X class="w-4 h-4" /></button>
          </div>
          <textarea v-model="h.description" @input="emit" class="form-textarea text-sm" rows="2" placeholder="Description (optional)" />
        </div>
        <button @click="addRichHighlight" class="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-xs text-gray-400 hover:border-brand-400 hover:text-brand-500 transition-colors">
          + Add Highlight Card
        </button>
      </div>

      <!-- Simple highlights (one per line) -->
      <textarea v-else
        :value="simpleHighlights.join('\n')"
        @input="e => { local.highlights = (e.target as HTMLTextAreaElement).value.split('\n').filter(Boolean) as any; emit() }"
        class="form-textarea" rows="4" placeholder="Highlight 1&#10;Highlight 2" />
    </div>

    <FieldGroup label="Image">
      <ImageField :value="local.image" @update="v => { local.image = v!; emit() }" />
    </FieldGroup>
    <FieldGroup label="Stats">
      <div v-for="(s, i) in local.stats" :key="i" class="flex gap-2 mb-2">
        <input v-model="s.value" @input="emit" class="form-input text-sm flex-1" placeholder="Value e.g. 100+" />
        <input v-model="s.label" @input="emit" class="form-input text-sm flex-1" placeholder="Label" />
        <button @click="removeStat(i)" class="text-red-400 hover:text-red-600"><X class="w-4 h-4" /></button>
      </div>
      <button @click="addStat" class="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-xs text-gray-400 hover:border-brand-400 hover:text-brand-500 transition-colors">
        + Add Stat
      </button>
    </FieldGroup>
    <FieldGroup label="Buttons">
      <ButtonsField :buttons="local.buttons" @update="v => { local.buttons = v; emit() }" />
    </FieldGroup>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref, watch, computed } from 'vue'
import { X } from 'lucide-vue-next'
import FieldGroup from './_FieldGroup.vue'
import ImageField from './_ImageField.vue'
import ButtonsField from './_ButtonsField.vue'
import type { AboutSectionContent, AboutHighlight } from '@shared/types'
const props = defineProps<{ content: AboutSectionContent }>()
const emit_ = defineEmits<{ update: [AboutSectionContent] }>()
const local = reactive<AboutSectionContent>({ ...props.content, highlights: [...props.content.highlights], stats: props.content.stats.map(s => ({ ...s })) })
watch(() => props.content, c => { Object.assign(local, { ...c, highlights: [...c.highlights], stats: c.stats.map(s => ({ ...s })) }) }, { deep: true })

// Determine if current highlights are rich objects or simple strings
const isRich = ref(local.highlights.length > 0 && typeof local.highlights[0] === 'object')
const richHighlights = computed(() => (local.highlights as AboutHighlight[]))
const simpleHighlights = computed(() => (local.highlights as string[]))

function toggleHighlightMode() {
  if (isRich.value) {
    // Convert rich → simple strings
    local.highlights = (local.highlights as AboutHighlight[]).map(h => h.title) as any
    isRich.value = false
  } else {
    // Convert simple → rich objects
    local.highlights = (local.highlights as string[]).map((s, i) => ({ id: String(i + 1), icon: '📌', title: s, description: '' })) as any
    isRich.value = true
  }
  emit()
}

function addRichHighlight() {
  ;(local.highlights as AboutHighlight[]).push({ id: String(Date.now()), icon: '📌', title: 'New Item', description: '' })
  emit()
}

function removeRichHighlight(i: number) {
  local.highlights.splice(i, 1)
  emit()
}

function addStat() { local.stats.push({ label: 'Label', value: '0' }); emit() }
function removeStat(i: number) { local.stats.splice(i, 1); emit() }
function emit() { emit_('update', { ...local, highlights: [...local.highlights] as any, stats: local.stats.map(s => ({ ...s })) }) }
</script>
