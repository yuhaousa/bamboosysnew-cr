<template>
  <div class="space-y-4">
    <FieldGroup label="Badge"><input v-model="local.badge" @input="emit" class="form-input" /></FieldGroup>
    <FieldGroup label="Title"><input v-model="local.title" @input="emit" class="form-input" /></FieldGroup>
    <FieldGroup label="Description"><textarea v-model="local.description" @input="emit" class="form-textarea" rows="2" /></FieldGroup>
    <FieldGroup label="FAQ Items">
      <p class="text-xs text-gray-500 mb-2">Select FAQs from your content library.</p>
      <DbPicker entity="faqs" label="FAQs" v-model="local.selectedIds" @update:modelValue="emit" />
    </FieldGroup>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import FieldGroup from './_FieldGroup.vue'
import DbPicker from './_DbPicker.vue'
import type { FAQContent } from '@shared/types'

const props = defineProps<{ content: FAQContent }>()
const emit_ = defineEmits<{ update: [FAQContent] }>()
const local = reactive<FAQContent & { selectedIds: string[] }>({
  ...props.content,
  items: props.content.items ?? [],
  selectedIds: props.content.selectedIds ?? [],
})
watch(() => props.content, c => {
  Object.assign(local, { ...c, items: c.items ?? [], selectedIds: c.selectedIds ?? [] })
}, { deep: true })
function emit() { emit_('update', { ...local }) }
</script>
