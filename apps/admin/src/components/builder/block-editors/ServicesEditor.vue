<template>
  <div class="space-y-4">
    <FieldGroup label="Badge"><input v-model="local.badge" @input="emit" class="form-input" /></FieldGroup>
    <FieldGroup label="Title"><input v-model="local.title" @input="emit" class="form-input" /></FieldGroup>
    <FieldGroup label="Description"><textarea v-model="local.description" @input="emit" class="form-textarea" rows="2" /></FieldGroup>
    <FieldGroup label="Services">
      <div v-for="(s, i) in local.services" :key="s.id" class="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl space-y-2 mb-2">
        <div class="flex justify-between"><span class="text-xs font-semibold text-gray-500">Service {{ i + 1 }}</span>
          <button @click="remove(i)" class="text-red-400"><X class="w-3.5 h-3.5" /></button>
        </div>
        <input v-model="s.icon" @input="emit" class="form-input text-sm" placeholder="Icon name" />
        <input v-model="s.title" @input="emit" class="form-input text-sm" placeholder="Service title" />
        <textarea v-model="s.description" @input="emit" class="form-textarea text-sm" rows="2" placeholder="Description" />
        <div class="space-y-1">
          <label class="text-xs text-gray-500">Features (one per line)</label>
          <textarea
            :value="s.features.join('\n')"
            @input="e => { s.features = (e.target as HTMLTextAreaElement).value.split('\n').filter(Boolean); emit() }"
            class="form-textarea text-sm" rows="3" placeholder="Feature 1&#10;Feature 2" />
        </div>
      </div>
      <button @click="add" class="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-xs text-gray-400 hover:border-brand-400 hover:text-brand-500 transition-colors">
        + Add Service
      </button>
    </FieldGroup>
  </div>
</template>
<script setup lang="ts">
import { reactive, watch } from 'vue'
import { v4 as uuid } from 'uuid'
import { X } from 'lucide-vue-next'
import FieldGroup from './_FieldGroup.vue'
import type { ServicesSectionContent } from '@shared/types'
const props = defineProps<{ content: ServicesSectionContent }>()
const emit_ = defineEmits<{ update: [ServicesSectionContent] }>()
const local = reactive<ServicesSectionContent>({ ...props.content, services: props.content.services.map(s => ({ ...s, features: [...s.features] })) })
watch(() => props.content, c => { Object.assign(local, { ...c, services: c.services.map(s => ({ ...s, features: [...s.features] })) }) }, { deep: true })
function add() { local.services.push({ id: uuid(), title: 'Service', description: '', features: [], icon: '' }); emit() }
function remove(i: number) { local.services.splice(i, 1); emit() }
function emit() { emit_('update', { ...local, services: local.services.map(s => ({ ...s, features: [...s.features] })) }) }
</script>
