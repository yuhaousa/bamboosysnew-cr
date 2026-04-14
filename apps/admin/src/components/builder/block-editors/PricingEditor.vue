<template>
  <div class="space-y-4">
    <FieldGroup label="Badge"><input v-model="local.badge" @input="emit" class="form-input" /></FieldGroup>
    <FieldGroup label="Title"><input v-model="local.title" @input="emit" class="form-input" /></FieldGroup>
    <FieldGroup label="Description"><textarea v-model="local.description" @input="emit" class="form-textarea" rows="2" /></FieldGroup>
    <FieldGroup label="Pricing Tiers">
      <div v-for="(t, i) in local.tiers" :key="t.id" class="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl space-y-2 mb-2">
        <div class="flex justify-between"><span class="text-xs font-semibold text-gray-500">Tier {{ i + 1 }}</span>
          <button @click="remove(i)" class="text-red-400"><X class="w-3.5 h-3.5" /></button>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <input v-model="t.name" @input="emit" class="form-input text-sm" placeholder="Plan name" />
          <input v-model="t.badge" @input="emit" class="form-input text-sm" placeholder="Badge (e.g. Popular)" />
          <input v-model="t.price" @input="emit" class="form-input text-sm" placeholder="$29" />
          <input v-model="t.period" @input="emit" class="form-input text-sm" placeholder="/month" />
        </div>
        <textarea v-model="t.description" @input="emit" class="form-textarea text-sm" rows="2" placeholder="Plan description" />
        <div class="space-y-1">
          <label class="text-xs text-gray-500">Features (one per line)</label>
          <textarea
            :value="t.features.join('\n')"
            @input="e => { t.features = (e.target as HTMLTextAreaElement).value.split('\n').filter(Boolean); emit() }"
            class="form-textarea text-sm" rows="4" placeholder="Feature 1&#10;Feature 2" />
        </div>
        <label class="flex items-center gap-2 text-sm">
          <input type="checkbox" v-model="t.highlighted" @change="emit" class="rounded" />
          Highlight this tier
        </label>
      </div>
      <button @click="add" class="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-xs text-gray-400 hover:border-brand-400 hover:text-brand-500 transition-colors">
        + Add Tier
      </button>
    </FieldGroup>
  </div>
</template>
<script setup lang="ts">
import { reactive, watch } from 'vue'
import { v4 as uuid } from 'uuid'
import { X } from 'lucide-vue-next'
import FieldGroup from './_FieldGroup.vue'
import type { PricingSectionContent } from '@shared/types'
const props = defineProps<{ content: PricingSectionContent }>()
const emit_ = defineEmits<{ update: [PricingSectionContent] }>()
const local = reactive<PricingSectionContent>({ ...props.content, tiers: props.content.tiers.map(t => ({ ...t, features: [...t.features], cta: { ...t.cta } })) })
watch(() => props.content, c => { Object.assign(local, { ...c, tiers: c.tiers.map(t => ({ ...t, features: [...t.features], cta: { ...t.cta } })) }) }, { deep: true })
function add() { local.tiers.push({ id: uuid(), name: 'Plan', price: '$0', features: [], cta: { text: 'Get Started', link: '/', variant: 'primary' } }); emit() }
function remove(i: number) { local.tiers.splice(i, 1); emit() }
function emit() { emit_('update', { ...local, tiers: local.tiers.map(t => ({ ...t, features: [...t.features], cta: { ...t.cta } })) }) }
</script>
