<template>
  <div class="space-y-4">
    <FieldGroup label="Badge"><input v-model="local.badge" @input="emit" class="form-input" /></FieldGroup>
    <FieldGroup label="Title"><input v-model="local.title" @input="emit" class="form-input" /></FieldGroup>
    <FieldGroup label="Description"><textarea v-model="local.description" @input="emit" class="form-textarea" rows="2" /></FieldGroup>
    <FieldGroup label="Email Placeholder"><input v-model="local.placeholder" @input="emit" class="form-input" /></FieldGroup>
    <FieldGroup label="Button Text"><input v-model="local.buttonText" @input="emit" class="form-input" /></FieldGroup>
    <FieldGroup label="Privacy Note"><input v-model="local.privacyNote" @input="emit" class="form-input" /></FieldGroup>
  </div>
</template>
<script setup lang="ts">
import { reactive, watch } from 'vue'
import FieldGroup from './_FieldGroup.vue'
import type { NewsletterSectionContent } from '@shared/types'
const props = defineProps<{ content: NewsletterSectionContent }>()
const emit_ = defineEmits<{ update: [NewsletterSectionContent] }>()
const local = reactive<NewsletterSectionContent>({ ...props.content })
watch(() => props.content, c => Object.assign(local, c), { deep: true })
function emit() { emit_('update', { ...local }) }
</script>
