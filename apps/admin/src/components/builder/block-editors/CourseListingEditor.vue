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
    <FieldGroup label="Courses">
      <p class="text-xs text-gray-500 mb-2">Select courses from your content library.</p>
      <DbPicker entity="courses" label="courses" v-model="local.selectedIds" @update:modelValue="emit" />
    </FieldGroup>
  </div>
</template>
<script setup lang="ts">
import { reactive, watch } from 'vue'
import FieldGroup from './_FieldGroup.vue'
import DbPicker from './_DbPicker.vue'
import type { CourseListingContent } from '@shared/types'
const props = defineProps<{ content: CourseListingContent }>()
const emit_ = defineEmits<{ update: [CourseListingContent] }>()
const local = reactive<CourseListingContent & { selectedIds: string[] }>({
  ...props.content,
  courses: props.content.courses ?? [],
  selectedIds: props.content.selectedIds ?? [],
})
watch(() => props.content, c => {
  Object.assign(local, { ...c, courses: c.courses ?? [], selectedIds: c.selectedIds ?? [] })
}, { deep: true })
function emit() { emit_('update', { ...local }) }
</script>
