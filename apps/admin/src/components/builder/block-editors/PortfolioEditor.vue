<template>
  <div class="space-y-4">
    <FieldGroup label="Badge"><input v-model="local.badge" @input="emit" class="form-input" /></FieldGroup>
    <FieldGroup label="Title"><input v-model="local.title" @input="emit" class="form-input" /></FieldGroup>
    <FieldGroup label="Description"><textarea v-model="local.description" @input="emit" class="form-textarea" rows="2" /></FieldGroup>
    <FieldGroup label="Columns">
      <select v-model.number="local.columns" @change="emit" class="form-select">
        <option :value="2">2</option><option :value="3">3</option><option :value="4">4</option>
      </select>
    </FieldGroup>
    <FieldGroup label="Show Category Filter">
      <label class="flex items-center gap-2 text-sm">
        <input type="checkbox" v-model="local.showFilter" @change="emit" class="rounded" />
        Show filter tabs
      </label>
    </FieldGroup>
    <FieldGroup label="Portfolio Items">
      <p class="text-xs text-gray-500 mb-2">Select projects from your portfolio library.</p>
      <DbPicker entity="portfolio" label="projects" v-model="local.selectedIds" @update:modelValue="emit" />
    </FieldGroup>
  </div>
</template>
<script setup lang="ts">
import { reactive, watch } from 'vue'
import FieldGroup from './_FieldGroup.vue'
import DbPicker from './_DbPicker.vue'
import type { PortfolioSectionContent } from '@shared/types'
const props = defineProps<{ content: PortfolioSectionContent }>()
const emit_ = defineEmits<{ update: [PortfolioSectionContent] }>()
const local = reactive<PortfolioSectionContent & { selectedIds: string[] }>({
  ...props.content,
  selectedIds: props.content.selectedIds ?? [],
  columns: props.content.columns ?? 3,
  showFilter: props.content.showFilter !== false,
})
watch(() => props.content, c => {
  Object.assign(local, { ...c, selectedIds: c.selectedIds ?? [], columns: c.columns ?? 3 })
}, { deep: true })
function emit() { emit_('update', { ...local }) }
</script>
