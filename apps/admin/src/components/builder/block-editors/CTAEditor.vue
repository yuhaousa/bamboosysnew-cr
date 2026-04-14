<template>
  <div class="space-y-4">
    <FieldGroup label="Badge"><input v-model="local.badge" @input="emit" class="form-input" /></FieldGroup>
    <FieldGroup label="Title *"><input v-model="local.title" @input="emit" class="form-input" /></FieldGroup>
    <FieldGroup label="Description"><textarea v-model="local.description" @input="emit" class="form-textarea" rows="2" /></FieldGroup>
    <FieldGroup label="Background Image">
      <ImageField :value="local.backgroundImage" @update="v => { local.backgroundImage = v; emit() }" />
    </FieldGroup>
    <FieldGroup label="Buttons">
      <ButtonsField :buttons="local.buttons" @update="v => { local.buttons = v; emit() }" />
    </FieldGroup>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import FieldGroup from './_FieldGroup.vue'
import ImageField from './_ImageField.vue'
import ButtonsField from './_ButtonsField.vue'
import type { CTAContent } from '@shared/types'

const props = defineProps<{ content: CTAContent }>()
const emit_ = defineEmits<{ update: [CTAContent] }>()
const local = reactive<CTAContent>({ ...props.content })
watch(() => props.content, c => Object.assign(local, c), { deep: true })
function emit() { emit_('update', { ...local }) }
</script>
