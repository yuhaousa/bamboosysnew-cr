<template>
  <div class="space-y-4">
    <FieldGroup label="Badge"><input v-model="local.badge" @input="emit" class="form-input" /></FieldGroup>
    <FieldGroup label="Title"><input v-model="local.title" @input="emit" class="form-input" /></FieldGroup>
    <FieldGroup label="Description"><textarea v-model="local.description" @input="emit" class="form-textarea" rows="2" /></FieldGroup>
    <FieldGroup label="FAQ Items">
      <div class="space-y-3">
        <div v-for="(item, i) in local.items" :key="item.id" class="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl space-y-2">
          <div class="flex justify-between items-center">
            <span class="text-xs font-semibold text-gray-500">Question {{ i + 1 }}</span>
            <button @click="remove(i)" class="text-red-400 hover:text-red-600"><X class="w-3.5 h-3.5" /></button>
          </div>
          <input v-model="item.question" @input="emit" class="form-input text-sm" placeholder="Question" />
          <textarea v-model="item.answer" @input="emit" class="form-textarea text-sm" rows="2" placeholder="Answer" />
        </div>
        <button @click="add" class="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-xs text-gray-400 hover:border-brand-400 hover:text-brand-500 transition-colors">
          + Add FAQ Item
        </button>
      </div>
    </FieldGroup>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { v4 as uuid } from 'uuid'
import { X } from 'lucide-vue-next'
import FieldGroup from './_FieldGroup.vue'
import type { FAQContent } from '@shared/types'

const props = defineProps<{ content: FAQContent }>()
const emit_ = defineEmits<{ update: [FAQContent] }>()
const local = reactive<FAQContent>({ ...props.content, items: props.content.items.map(i => ({ ...i })) })
watch(() => props.content, c => { Object.assign(local, { ...c, items: c.items.map(i => ({ ...i })) }) }, { deep: true })
function add() { local.items.push({ id: uuid(), question: 'New Question?', answer: 'Answer here' }); emit() }
function remove(i: number) { local.items.splice(i, 1); emit() }
function emit() { emit_('update', { ...local, items: local.items.map(i => ({ ...i })) }) }
</script>
