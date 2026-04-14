<template>
  <div class="space-y-4">
    <FieldGroup label="Badge"><input v-model="local.badge" @input="emit" class="form-input" /></FieldGroup>
    <FieldGroup label="Title"><input v-model="local.title" @input="emit" class="form-input" /></FieldGroup>
    <FieldGroup label="Description"><textarea v-model="local.description" @input="emit" class="form-textarea" rows="3" /></FieldGroup>
    <FieldGroup label="Highlights (one per line)">
      <textarea
        :value="local.highlights.join('\n')"
        @input="e => { local.highlights = (e.target as HTMLTextAreaElement).value.split('\n').filter(Boolean); emit() }"
        class="form-textarea" rows="4" placeholder="Highlight 1&#10;Highlight 2" />
    </FieldGroup>
    <FieldGroup label="Image">
      <ImageField :value="local.image" @update="v => { local.image = v!; emit() }" />
    </FieldGroup>
    <FieldGroup label="Stats">
      <div v-for="(s, i) in local.stats" :key="i" class="flex gap-2 mb-2">
        <input v-model="s.value" @input="emit" class="form-input text-sm flex-1" placeholder="Value e.g. 100+" />
        <input v-model="s.label" @input="emit" class="form-input text-sm flex-1" placeholder="Label" />
        <button @click="removeStat(i)" class="text-red-400 hover:text-red-600"><X class="w-4 h-4" /></button>
      </div>
      <button @click="addStat" class="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-xs text-gray-400 hover:border-brand-400 hover:text-brand-500 transition-colors">
        + Add Stat
      </button>
    </FieldGroup>
    <FieldGroup label="Buttons">
      <ButtonsField :buttons="local.buttons" @update="v => { local.buttons = v; emit() }" />
    </FieldGroup>
  </div>
</template>
<script setup lang="ts">
import { reactive, watch } from 'vue'
import { X } from 'lucide-vue-next'
import FieldGroup from './_FieldGroup.vue'
import ImageField from './_ImageField.vue'
import ButtonsField from './_ButtonsField.vue'
import type { AboutSectionContent } from '@shared/types'
const props = defineProps<{ content: AboutSectionContent }>()
const emit_ = defineEmits<{ update: [AboutSectionContent] }>()
const local = reactive<AboutSectionContent>({ ...props.content, highlights: [...props.content.highlights], stats: props.content.stats.map(s => ({ ...s })) })
watch(() => props.content, c => { Object.assign(local, { ...c, highlights: [...c.highlights], stats: c.stats.map(s => ({ ...s })) }) }, { deep: true })
function addStat() { local.stats.push({ label: 'Label', value: '0' }); emit() }
function removeStat(i: number) { local.stats.splice(i, 1); emit() }
function emit() { emit_('update', { ...local, highlights: [...local.highlights], stats: local.stats.map(s => ({ ...s })) }) }
</script>
