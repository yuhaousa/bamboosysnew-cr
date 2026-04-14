<template>
  <div class="space-y-4">
    <FieldGroup label="Title"><input v-model="local.title" @input="emit" class="form-input" /></FieldGroup>
    <FieldGroup label="Description"><textarea v-model="local.description" @input="emit" class="form-textarea" rows="2" /></FieldGroup>
    <FieldGroup label="Columns">
      <select v-model.number="local.columns" @change="emit" class="form-select">
        <option :value="2">2</option><option :value="3">3</option><option :value="4">4</option>
      </select>
    </FieldGroup>
    <FieldGroup label="Images">
      <div v-for="(item, i) in local.items" :key="item.id" class="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl space-y-2 mb-2">
        <div class="flex justify-between"><span class="text-xs text-gray-500">Image {{ i + 1 }}</span>
          <button @click="remove(i)" class="text-red-400"><X class="w-3.5 h-3.5" /></button>
        </div>
        <ImageField :value="item.image" @update="v => { item.image = v!; emit() }" />
        <input v-model="item.caption" @input="emit" class="form-input text-sm" placeholder="Caption (optional)" />
      </div>
      <button @click="add" class="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-xs text-gray-400 hover:border-brand-400 hover:text-brand-500 transition-colors">
        + Add Image
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
import type { GallerySectionContent } from '@shared/types'
const props = defineProps<{ content: GallerySectionContent }>()
const emit_ = defineEmits<{ update: [GallerySectionContent] }>()
const local = reactive<GallerySectionContent>({ ...props.content, items: props.content.items.map(i => ({ ...i, image: { ...i.image } })) })
watch(() => props.content, c => { Object.assign(local, { ...c, items: c.items.map(i => ({ ...i, image: { ...i.image } })) }) }, { deep: true })
function add() { local.items.push({ id: uuid(), image: { url: '', alt: '' } }); emit() }
function remove(i: number) { local.items.splice(i, 1); emit() }
function emit() { emit_('update', { ...local, items: local.items.map(i => ({ ...i })) }) }
</script>
