<template>
  <div class="space-y-4">
    <FieldGroup label="Badge (optional)">
      <input v-model="local.badge" @input="emit" class="form-input" placeholder="e.g. New" />
    </FieldGroup>

    <FieldGroup label="Title *">
      <input v-model="local.title" @input="emit" class="form-input" placeholder="Your hero title" />
      <div class="flex items-center gap-2 mt-1.5">
        <input type="color" :value="local.titleColor || '#000000'" @input="e => { local.titleColor = (e.target as HTMLInputElement).value; emit() }" class="w-7 h-7 rounded cursor-pointer border border-gray-300 dark:border-gray-600 p-0.5 shrink-0" title="Title color" />
        <input type="text" :value="local.titleColor || ''" @input="e => { local.titleColor = (e.target as HTMLInputElement).value; emit() }" class="form-input text-xs py-1" placeholder="Title color (e.g. #ff0000)" />
        <button v-if="local.titleColor" @click="local.titleColor = ''; emit()" class="text-gray-400 hover:text-gray-600 p-1" title="Clear">
          <X class="w-3.5 h-3.5" />
        </button>
      </div>
    </FieldGroup>

    <FieldGroup label="Subtitle">
      <input v-model="local.subtitle" @input="emit" class="form-input" placeholder="Your subtitle" />
      <div class="flex items-center gap-2 mt-1.5">
        <input type="color" :value="local.subtitleColor || '#000000'" @input="e => { local.subtitleColor = (e.target as HTMLInputElement).value; emit() }" class="w-7 h-7 rounded cursor-pointer border border-gray-300 dark:border-gray-600 p-0.5 shrink-0" title="Subtitle color" />
        <input type="text" :value="local.subtitleColor || ''" @input="e => { local.subtitleColor = (e.target as HTMLInputElement).value; emit() }" class="form-input text-xs py-1" placeholder="Subtitle color (e.g. #333333)" />
        <button v-if="local.subtitleColor" @click="local.subtitleColor = ''; emit()" class="text-gray-400 hover:text-gray-600 p-1" title="Clear">
          <X class="w-3.5 h-3.5" />
        </button>
      </div>
    </FieldGroup>

    <FieldGroup label="Description">
      <textarea v-model="local.description" @input="emit" class="form-textarea" rows="3" placeholder="Short description..." />
      <div class="flex items-center gap-2 mt-1.5">
        <input type="color" :value="local.descriptionColor || '#000000'" @input="e => { local.descriptionColor = (e.target as HTMLInputElement).value; emit() }" class="w-7 h-7 rounded cursor-pointer border border-gray-300 dark:border-gray-600 p-0.5 shrink-0" title="Description color" />
        <input type="text" :value="local.descriptionColor || ''" @input="e => { local.descriptionColor = (e.target as HTMLInputElement).value; emit() }" class="form-input text-xs py-1" placeholder="Description color (e.g. #666666)" />
        <button v-if="local.descriptionColor" @click="local.descriptionColor = ''; emit()" class="text-gray-400 hover:text-gray-600 p-1" title="Clear">
          <X class="w-3.5 h-3.5" />
        </button>
      </div>
    </FieldGroup>

    <FieldGroup label="Hero Image">
      <ImageField :value="local.image" @update="v => { local.image = v; emit() }" />
    </FieldGroup>

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
import { X } from 'lucide-vue-next'
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
