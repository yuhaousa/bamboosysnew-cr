<template>
  <div class="space-y-4">
    <FieldGroup label="Badge"><input v-model="local.badge" @input="emit" class="form-input" /></FieldGroup>
    <FieldGroup label="Title"><input v-model="local.title" @input="emit" class="form-input" /></FieldGroup>
    <FieldGroup label="Description"><textarea v-model="local.description" @input="emit" class="form-textarea" rows="2" /></FieldGroup>
    <FieldGroup label="Columns">
      <select v-model.number="local.columns" @change="emit" class="form-select">
        <option :value="2">2</option>
        <option :value="3">3</option>
        <option :value="4">4</option>
        <option :value="5">5</option>
        <option :value="6">6</option>
      </select>
    </FieldGroup>
    <FieldGroup label="Clients">
      <p class="text-xs text-gray-500 mb-2">Select client logos from your clients content library.</p>
      <DbPicker entity="clients" label="clients" v-model="local.selectedIds" @update:modelValue="emit" />
    </FieldGroup>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import FieldGroup from './_FieldGroup.vue'
import DbPicker from './_DbPicker.vue'
import type { ClientsGridContent } from '@shared/types'

const props = defineProps<{ content: ClientsGridContent }>()
const emit_ = defineEmits<{ update: [ClientsGridContent] }>()

const local = reactive<ClientsGridContent>({
  ...props.content,
  columns: props.content.columns ?? 5,
  selectedIds: props.content.selectedIds ?? [],
})

watch(() => props.content, (content) => {
  Object.assign(local, {
    ...content,
    columns: content.columns ?? 5,
    selectedIds: content.selectedIds ?? [],
  })
}, { deep: true })

function emit() {
  emit_('update', { ...local })
}
</script>
