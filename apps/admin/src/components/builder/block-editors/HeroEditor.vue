<template>
  <div class="space-y-4">
    <FieldGroup label="Badge (optional)">
      <input v-model="local.badge" @input="emit" class="form-input" placeholder="e.g. New" />
    </FieldGroup>
    <FieldGroup label="Title *">
      <input v-model="local.title" @input="emit" class="form-input" placeholder="Your hero title" />
    </FieldGroup>
    <FieldGroup label="Subtitle">
      <input v-model="local.subtitle" @input="emit" class="form-input" placeholder="Your subtitle" />
    </FieldGroup>
    <FieldGroup label="Description">
      <textarea v-model="local.description" @input="emit" class="form-textarea" rows="3" placeholder="Short description..." />
    </FieldGroup>

    <FieldGroup label="Hero Image">
      <ImageField :value="local.image" @update="v => { local.image = v; emit() }" />
    </FieldGroup>

    <FieldGroup label="Background Image">
      <ImageField :value="local.backgroundImage" @update="v => { local.backgroundImage = v; emit() }" label="Background Image" />
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
import type { HeroBannerContent } from '@shared/types'

const props = defineProps<{ content: HeroBannerContent }>()
const emit_ = defineEmits<{ update: [HeroBannerContent] }>()
const local = reactive<HeroBannerContent>({ ...props.content })
watch(() => props.content, c => Object.assign(local, c), { deep: true })
function emit() { emit_('update', { ...local }) }
</script>
