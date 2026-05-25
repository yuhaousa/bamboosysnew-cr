<template>
  <div class="space-y-4">
    <FieldGroup label="Badge"><input v-model="local.badge" @input="emit" class="form-input" /></FieldGroup>
    <FieldGroup label="Title"><input v-model="local.title" @input="emit" class="form-input" /></FieldGroup>
    <FieldGroup label="Description"><textarea v-model="local.description" @input="emit" class="form-textarea" rows="2" /></FieldGroup>
    <FieldGroup label="Services">
      <p class="text-xs text-gray-500 mb-2">Select services from your content library.</p>
      <DbPicker entity="services-entity" label="services" v-model="local.selectedIds" @update:modelValue="emit" />
    </FieldGroup>
  </div>
</template>
<script setup lang="ts">
import { reactive, watch } from 'vue'
import FieldGroup from './_FieldGroup.vue'
import DbPicker from './_DbPicker.vue'
import type { ServicesSectionContent } from '@shared/types'
const props = defineProps<{ content: ServicesSectionContent }>()
const emit_ = defineEmits<{ update: [ServicesSectionContent] }>()
const local = reactive<ServicesSectionContent & { selectedIds: string[] }>({
  ...props.content,
  services: props.content.services ?? [],
  selectedIds: props.content.selectedIds ?? [],
})
watch(() => props.content, c => {
  Object.assign(local, { ...c, services: c.services ?? [], selectedIds: c.selectedIds ?? [] })
}, { deep: true })
function emit() { emit_('update', { ...local }) }
</script>
