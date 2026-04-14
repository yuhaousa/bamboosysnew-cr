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
    <FieldGroup label="Team Members">
      <div v-for="(m, i) in local.members" :key="m.id" class="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl space-y-2 mb-2">
        <div class="flex justify-between"><span class="text-xs font-semibold text-gray-500">Member {{ i + 1 }}</span>
          <button @click="remove(i)" class="text-red-400"><X class="w-3.5 h-3.5" /></button>
        </div>
        <input v-model="m.name" @input="emit" class="form-input text-sm" placeholder="Name" />
        <input v-model="m.role" @input="emit" class="form-input text-sm" placeholder="Role/Position" />
        <textarea v-model="m.bio" @input="emit" class="form-textarea text-sm" rows="2" placeholder="Short bio" />
        <ImageField :value="m.image" @update="v => { m.image = v; emit() }" label="Photo" />
      </div>
      <button @click="add" class="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-xs text-gray-400 hover:border-brand-400 hover:text-brand-500 transition-colors">
        + Add Member
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
import type { TeamSectionContent } from '@shared/types'
const props = defineProps<{ content: TeamSectionContent }>()
const emit_ = defineEmits<{ update: [TeamSectionContent] }>()
const local = reactive<TeamSectionContent>({ ...props.content, members: props.content.members.map(m => ({ ...m })) })
watch(() => props.content, c => { Object.assign(local, { ...c, members: c.members.map(m => ({ ...m })) }) }, { deep: true })
function add() { local.members.push({ id: uuid(), name: 'Name', role: 'Role', bio: '' }); emit() }
function remove(i: number) { local.members.splice(i, 1); emit() }
function emit() { emit_('update', { ...local, members: local.members.map(m => ({ ...m })) }) }
</script>
