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

    <!-- Source toggle -->
    <div class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="flex">
        <button
          @click="source = 'db'"
          class="flex-1 py-2 text-xs font-semibold transition-colors"
          :class="source === 'db' ? 'bg-brand-600 text-white' : 'bg-gray-50 dark:bg-gray-800 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'"
        >From Database</button>
        <button
          @click="source = 'static'"
          class="flex-1 py-2 text-xs font-semibold transition-colors"
          :class="source === 'static' ? 'bg-brand-600 text-white' : 'bg-gray-50 dark:bg-gray-800 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'"
        >Static Content</button>
      </div>
    </div>

    <template v-if="source === 'db'">
      <FieldGroup label="Team Members">
        <p class="text-xs text-gray-500 mb-2">Pick from your Team content library.</p>
        <DbPicker entity="team" label="team members" v-model="local.selectedIds" @update:modelValue="emit" />
      </FieldGroup>
    </template>

    <template v-else>
      <div>
        <div class="flex items-center justify-between mb-2">
          <label class="form-label mb-0">Members</label>
          <button @click="addMember" class="text-xs text-brand-500 hover:text-brand-700">+ Add Member</button>
        </div>
        <div v-for="(m, i) in local.members" :key="m.id" class="p-3 rounded-xl border border-gray-200 dark:border-gray-700 space-y-2 mb-2">
          <div class="flex justify-between items-center">
            <span class="text-xs font-medium text-gray-600 dark:text-gray-400">{{ m.name || 'Member ' + (i+1) }}</span>
            <button @click="removeMember(i)" class="text-red-400"><X class="w-3.5 h-3.5" /></button>
          </div>
          <input v-model="m.name" @input="emit" class="form-input text-sm" placeholder="Name *" />
          <input v-model="m.role" @input="emit" class="form-input text-sm" placeholder="Role / Title" />
          <textarea v-model="m.bio" @input="emit" class="form-textarea text-sm" rows="2" placeholder="Short bio" />
          <ImageField :value="m.image" @update="v => { m.image = v ?? { url: '', alt: '' }; emit() }" label="Photo" />
        </div>
        <button v-if="!local.members?.length" @click="addMember" class="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-xs text-gray-400 hover:border-brand-400 hover:text-brand-500 transition-colors">
          + Add First Member
        </button>
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { X } from 'lucide-vue-next'
import { v4 as uuid } from 'uuid'
import FieldGroup from './_FieldGroup.vue'
import DbPicker from './_DbPicker.vue'
import ImageField from './_ImageField.vue'
import type { TeamSectionContent } from '@shared/types'
const props = defineProps<{ content: TeamSectionContent }>()
const emit_ = defineEmits<{ update: [TeamSectionContent] }>()
const local = reactive<TeamSectionContent & { selectedIds: string[] }>({
  ...props.content,
  members: (props.content.members ?? []).map(m => ({ ...m })),
  selectedIds: props.content.selectedIds ?? [],
})
const source = ref<'db' | 'static'>((props.content.selectedIds?.length ?? 0) > 0 ? 'db' : 'static')
watch(() => props.content, c => {
  Object.assign(local, { ...c, members: (c.members ?? []).map(m => ({ ...m })), selectedIds: c.selectedIds ?? [] })
  source.value = (c.selectedIds?.length ?? 0) > 0 ? 'db' : 'static'
}, { deep: true })
function addMember() {
  if (!local.members) local.members = []
  local.members.push({ id: uuid(), name: '', role: '', bio: '', image: { url: '', alt: '' } })
  emit()
}
function removeMember(i: number) { local.members.splice(i, 1); emit() }
function emit() {
  emit_('update', {
    ...local,
    selectedIds: source.value === 'db' ? local.selectedIds : [],
    members: local.members.map(m => ({ ...m })),
  })
}
</script>
