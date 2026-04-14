<template>
  <div class="space-y-4">
    <FieldGroup label="Badge"><input v-model="local.badge" @input="emit" class="form-input" /></FieldGroup>
    <FieldGroup label="Title"><input v-model="local.title" @input="emit" class="form-input" /></FieldGroup>
    <FieldGroup label="Description"><textarea v-model="local.description" @input="emit" class="form-textarea" rows="2" /></FieldGroup>
    <FieldGroup label="Testimonials">
      <div v-for="(t, i) in local.items" :key="t.id" class="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl space-y-2 mb-2">
        <div class="flex justify-between"><span class="text-xs font-semibold text-gray-500">Testimonial {{ i + 1 }}</span>
          <button @click="remove(i)" class="text-red-400"><X class="w-3.5 h-3.5" /></button>
        </div>
        <textarea v-model="t.content" @input="emit" class="form-textarea text-sm" rows="2" placeholder="Testimonial text" />
        <div class="grid grid-cols-2 gap-2">
          <input v-model="t.name" @input="emit" class="form-input text-sm" placeholder="Name" />
          <input v-model="t.role" @input="emit" class="form-input text-sm" placeholder="Role" />
          <input v-model="t.company" @input="emit" class="form-input text-sm" placeholder="Company" />
          <select v-model.number="t.rating" @change="emit" class="form-select text-sm">
            <option v-for="n in 5" :key="n" :value="n">{{ n }} Stars</option>
          </select>
        </div>
      </div>
      <button @click="add" class="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-xs text-gray-400 hover:border-brand-400 hover:text-brand-500 transition-colors">
        + Add Testimonial
      </button>
    </FieldGroup>
  </div>
</template>
<script setup lang="ts">
import { reactive, watch } from 'vue'
import { v4 as uuid } from 'uuid'
import { X } from 'lucide-vue-next'
import FieldGroup from './_FieldGroup.vue'
import type { TestimonialsContent } from '@shared/types'
const props = defineProps<{ content: TestimonialsContent }>()
const emit_ = defineEmits<{ update: [TestimonialsContent] }>()
const local = reactive<TestimonialsContent>({ ...props.content, items: props.content.items.map(i => ({ ...i })) })
watch(() => props.content, c => { Object.assign(local, { ...c, items: c.items.map(i => ({ ...i })) }) }, { deep: true })
function add() { local.items.push({ id: uuid(), name: 'Name', role: '', content: 'Testimonial', rating: 5 }); emit() }
function remove(i: number) { local.items.splice(i, 1); emit() }
function emit() { emit_('update', { ...local, items: local.items.map(i => ({ ...i })) }) }
</script>
