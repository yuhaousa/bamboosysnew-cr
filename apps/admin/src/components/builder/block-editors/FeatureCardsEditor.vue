<template>
  <div class="space-y-4">
    <FieldGroup label="Badge"><input v-model="local.badge" @input="emit" class="form-input" /></FieldGroup>
    <FieldGroup label="Title"><input v-model="local.title" @input="emit" class="form-input" /></FieldGroup>
    <FieldGroup label="Description"><textarea v-model="local.description" @input="emit" class="form-textarea" rows="2" /></FieldGroup>
    <FieldGroup label="Columns">
      <select v-model.number="local.columns" @change="emit" class="form-select">
        <option :value="2">2 Columns</option>
        <option :value="3">3 Columns</option>
        <option :value="4">4 Columns</option>
      </select>
    </FieldGroup>
    <FieldGroup label="Cards">
      <div class="space-y-3">
        <div v-for="(card, i) in local.cards" :key="card.id" class="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl space-y-2">
          <div class="flex justify-between items-center">
            <span class="text-xs font-semibold text-gray-500">Card {{ i + 1 }}</span>
            <button @click="removeCard(i)" class="text-red-400 hover:text-red-600"><X class="w-3.5 h-3.5" /></button>
          </div>
          <input v-model="card.icon" @input="emit" class="form-input text-sm" placeholder="Icon name (e.g. star)" />
          <input v-model="card.title" @input="emit" class="form-input text-sm" placeholder="Card title" />
          <textarea v-model="card.description" @input="emit" class="form-textarea text-sm" rows="2" placeholder="Card description" />
          <input v-model="card.link" @input="emit" class="form-input text-sm" placeholder="Link (optional)" />
        </div>
        <button @click="addCard" class="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-xs text-gray-400 hover:border-brand-400 hover:text-brand-500 transition-colors">
          + Add Card
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
import type { FeatureCardsContent } from '@shared/types'

const props = defineProps<{ content: FeatureCardsContent }>()
const emit_ = defineEmits<{ update: [FeatureCardsContent] }>()
const local = reactive<FeatureCardsContent>({ ...props.content, cards: props.content.cards.map(c => ({ ...c })) })
watch(() => props.content, c => { Object.assign(local, { ...c, cards: c.cards.map(x => ({ ...x })) }) }, { deep: true })

function addCard() { local.cards.push({ id: uuid(), icon: '', title: 'New Card', description: '' }); emit() }
function removeCard(i: number) { local.cards.splice(i, 1); emit() }
function emit() { emit_('update', { ...local, cards: local.cards.map(c => ({ ...c })) }) }
</script>
