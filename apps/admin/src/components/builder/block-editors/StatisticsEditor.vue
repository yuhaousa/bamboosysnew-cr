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
    <FieldGroup label="Stats">
      <div v-for="(s, i) in local.stats" :key="s.id" class="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl space-y-2 mb-2">
        <div class="flex justify-between"><span class="text-xs font-semibold text-gray-500">Stat {{ i + 1 }}</span>
          <button @click="remove(i)" class="text-red-400 hover:text-red-600"><X class="w-3.5 h-3.5" /></button>
        </div>
        <div class="grid grid-cols-3 gap-2">
          <input v-model="s.prefix" @input="emit" class="form-input text-sm" placeholder="Prefix" />
          <input v-model="s.value" @input="emit" class="form-input text-sm" placeholder="1000" />
          <input v-model="s.suffix" @input="emit" class="form-input text-sm" placeholder="+" />
        </div>
        <input v-model="s.label" @input="emit" class="form-input text-sm" placeholder="Label" />
      </div>
      <button @click="add" class="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-xs text-gray-400 hover:border-brand-400 hover:text-brand-500 transition-colors">
        + Add Stat
      </button>
    </FieldGroup>
  </div>
</template>
<script setup lang="ts">
import { reactive, watch } from 'vue'
import { v4 as uuid } from 'uuid'
import { X } from 'lucide-vue-next'
import FieldGroup from './_FieldGroup.vue'
import type { StatisticsContent } from '@shared/types'
const props = defineProps<{ content: StatisticsContent }>()
const emit_ = defineEmits<{ update: [StatisticsContent] }>()
const local = reactive<StatisticsContent>({ ...props.content, stats: props.content.stats.map(s => ({ ...s })) })
watch(() => props.content, c => { Object.assign(local, { ...c, stats: c.stats.map(s => ({ ...s })) }) }, { deep: true })
function add() { local.stats.push({ id: uuid(), value: '0', label: 'Label', suffix: '' }); emit() }
function remove(i: number) { local.stats.splice(i, 1); emit() }
function emit() { emit_('update', { ...local, stats: local.stats.map(s => ({ ...s })) }) }
</script>
