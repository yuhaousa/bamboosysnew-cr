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
      <div v-for="(c, i) in local.courses" :key="c.id" class="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl space-y-2 mb-2">
        <div class="flex justify-between"><span class="text-xs font-semibold text-gray-500">Course {{ i + 1 }}</span>
          <button @click="remove(i)" class="text-red-400"><X class="w-3.5 h-3.5" /></button>
        </div>
        <input v-model="c.title" @input="emit" class="form-input text-sm" placeholder="Title" />
        <textarea v-model="c.description" @input="emit" class="form-textarea text-sm" rows="2" placeholder="Description" />
        <div class="grid grid-cols-3 gap-2">
          <input v-model="c.duration" @input="emit" class="form-input text-sm" placeholder="Duration" />
          <input v-model="c.level" @input="emit" class="form-input text-sm" placeholder="Level" />
          <input v-model="c.price" @input="emit" class="form-input text-sm" placeholder="Price" />
        </div>
        <ImageField :value="c.image" @update="v => { c.image = v; emit() }" label="Thumbnail" />
        <input v-model="c.link" @input="emit" class="form-input text-sm" placeholder="Course URL" />
      </div>
      <button @click="add" class="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-xs text-gray-400 hover:border-brand-400 hover:text-brand-500 transition-colors">
        + Add Course
      </button>
    </FieldGroup>
  </div>
</template>
<script setup lang="ts">
import { reactive, watch } from 'vue'
import { v4 as uuid } from 'uuid'
import { X } from 'lucide-vue-next'
import FieldGroup from './_FieldGroup.vue'
import ImageField from './_ImageField.vue'
import type { CourseListingContent } from '@shared/types'
const props = defineProps<{ content: CourseListingContent }>()
const emit_ = defineEmits<{ update: [CourseListingContent] }>()
const local = reactive<CourseListingContent>({ ...props.content, courses: props.content.courses.map(c => ({ ...c })) })
watch(() => props.content, c => { Object.assign(local, { ...c, courses: c.courses.map(x => ({ ...x })) }) }, { deep: true })
function add() { local.courses.push({ id: uuid(), title: 'Course', description: '' }); emit() }
function remove(i: number) { local.courses.splice(i, 1); emit() }
function emit() { emit_('update', { ...local, courses: local.courses.map(c => ({ ...c })) }) }
</script>
