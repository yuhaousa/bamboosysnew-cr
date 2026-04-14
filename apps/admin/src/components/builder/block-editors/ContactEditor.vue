<template>
  <div class="space-y-4">
    <FieldGroup label="Badge"><input v-model="local.badge" @input="emit" class="form-input" /></FieldGroup>
    <FieldGroup label="Title"><input v-model="local.title" @input="emit" class="form-input" /></FieldGroup>
    <FieldGroup label="Description"><textarea v-model="local.description" @input="emit" class="form-textarea" rows="2" /></FieldGroup>
    <FieldGroup label="Email"><input v-model="local.email" @input="emit" class="form-input" placeholder="hello@example.com" /></FieldGroup>
    <FieldGroup label="Phone"><input v-model="local.phone" @input="emit" class="form-input" placeholder="+1 234 567 890" /></FieldGroup>
    <FieldGroup label="Address"><textarea v-model="local.address" @input="emit" class="form-textarea" rows="2" /></FieldGroup>
    <label class="flex items-center gap-2 text-sm">
      <input type="checkbox" v-model="local.showForm" @change="emit" class="rounded" />
      Show contact form
    </label>
    <FieldGroup v-if="local.showForm" label="Form Title"><input v-model="local.formTitle" @input="emit" class="form-input" /></FieldGroup>
  </div>
</template>
<script setup lang="ts">
import { reactive, watch } from 'vue'
import FieldGroup from './_FieldGroup.vue'
import type { ContactSectionContent } from '@shared/types'
const props = defineProps<{ content: ContactSectionContent }>()
const emit_ = defineEmits<{ update: [ContactSectionContent] }>()
const local = reactive<ContactSectionContent>({ ...props.content })
watch(() => props.content, c => Object.assign(local, c), { deep: true })
function emit() { emit_('update', { ...local }) }
</script>
