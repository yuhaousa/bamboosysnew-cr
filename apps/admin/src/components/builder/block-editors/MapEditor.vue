<template>
  <div class="space-y-4">
    <FieldGroup label="Title (optional)"><input v-model="local.title" @input="emit" class="form-input" /></FieldGroup>
    <FieldGroup label="Description"><textarea v-model="local.description" @input="emit" class="form-textarea" rows="2" /></FieldGroup>
    <FieldGroup label="Map Embed URL">
      <input v-model="local.embedUrl" @input="emit" class="form-input" placeholder="Google Maps embed URL (iframe src)" />
      <p class="text-xs text-gray-400 mt-1">Get from Google Maps → Share → Embed a map → copy the src= value</p>
    </FieldGroup>
    <FieldGroup label="Height">
      <input v-model="local.height" @input="emit" class="form-input" placeholder="400px" />
    </FieldGroup>
    <div v-if="local.embedUrl" class="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
      <iframe :src="local.embedUrl" :height="local.height ?? '300px'" width="100%" style="border:0" allowfullscreen loading="lazy" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, watch } from 'vue'
import FieldGroup from './_FieldGroup.vue'
import type { MapSectionContent } from '@shared/types'
const props = defineProps<{ content: MapSectionContent }>()
const emit_ = defineEmits<{ update: [MapSectionContent] }>()
const local = reactive<MapSectionContent>({ ...props.content })
watch(() => props.content, c => Object.assign(local, c), { deep: true })
function emit() { emit_('update', { ...local }) }
</script>
