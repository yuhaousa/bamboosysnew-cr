<template>
  <div class="space-y-4">
    <FieldGroup label="Title"><input v-model="local.title" @input="emit" class="form-input" /></FieldGroup>
    <FieldGroup label="Description"><textarea v-model="local.description" @input="emit" class="form-textarea" rows="2" /></FieldGroup>
    <FieldGroup label="Video URL (YouTube, Vimeo, or direct)">
      <input v-model="local.videoUrl" @input="emit" class="form-input" placeholder="https://youtube.com/watch?v=..." />
    </FieldGroup>
    <FieldGroup label="Poster Image (thumbnail)">
      <ImageField :value="local.videoPoster" @update="v => { local.videoPoster = v; emit() }" />
    </FieldGroup>
    <div class="flex gap-4">
      <label class="flex items-center gap-2 text-sm">
        <input type="checkbox" v-model="local.autoplay" @change="emit" class="rounded" />
        Autoplay
      </label>
      <label class="flex items-center gap-2 text-sm">
        <input type="checkbox" v-model="local.muted" @change="emit" class="rounded" />
        Muted
      </label>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, watch } from 'vue'
import FieldGroup from './_FieldGroup.vue'
import ImageField from './_ImageField.vue'
import type { VideoSectionContent } from '@shared/types'
const props = defineProps<{ content: VideoSectionContent }>()
const emit_ = defineEmits<{ update: [VideoSectionContent] }>()
const local = reactive<VideoSectionContent>({ ...props.content })
watch(() => props.content, c => Object.assign(local, c), { deep: true })
function emit() { emit_('update', { ...local }) }
</script>
