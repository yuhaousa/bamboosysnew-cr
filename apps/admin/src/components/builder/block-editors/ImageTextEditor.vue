<template>
  <div class="space-y-4">
    <FieldGroup label="Title *">
      <input v-model="local.title" @input="emit" class="form-input" />
    </FieldGroup>
    <FieldGroup label="Subtitle">
      <input v-model="local.subtitle" @input="emit" class="form-input" />
    </FieldGroup>
    <FieldGroup label="Description">
      <textarea v-model="local.description" @input="emit" class="form-textarea" rows="3" />
    </FieldGroup>
    <FieldGroup label="Image">
      <ImageField :value="local.image" @update="v => { local.image = v!; emit() }" />
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
import type { ImageTextContent } from '@shared/types'

const props = defineProps<{ content: ImageTextContent }>()
const emit_ = defineEmits<{ update: [ImageTextContent] }>()
const local = reactive<ImageTextContent>({ ...props.content })
watch(() => props.content, c => Object.assign(local, c), { deep: true })
function emit() { emit_('update', { ...local }) }
</script>
