<template>
  <div class="space-y-4">
    <FieldGroup label="Badge"><input v-model="local.badge" @input="emit" class="form-input" /></FieldGroup>
    <FieldGroup label="Title"><input v-model="local.title" @input="emit" class="form-input" /></FieldGroup>
    <FieldGroup label="Description"><textarea v-model="local.description" @input="emit" class="form-textarea" rows="3" /></FieldGroup>
    <FieldGroup label="About Us Sections">
      <p class="text-xs text-gray-500 mb-2">Select about us entries from your about us content library.</p>
      <DbPicker entity="about-us" label="about us" v-model="local.selectedIds" @update:modelValue="emit" />
    </FieldGroup>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import FieldGroup from './_FieldGroup.vue'
import DbPicker from './_DbPicker.vue'
import type { AboutUsShowcaseContent } from '@shared/types'

const props = defineProps<{ content: AboutUsShowcaseContent }>()
const emit_ = defineEmits<{ update: [AboutUsShowcaseContent] }>()

const local = reactive<AboutUsShowcaseContent>({
  ...props.content,
  selectedIds: props.content.selectedIds ?? [],
})

watch(() => props.content, (content) => {
  Object.assign(local, {
    ...content,
    selectedIds: content.selectedIds ?? [],
  })
}, { deep: true })

function emit() {
  emit_('update', { ...local })
}
</script>
