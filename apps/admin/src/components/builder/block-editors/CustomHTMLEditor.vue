<template>
  <div class="space-y-4">
    <FieldGroup label="Custom HTML">
      <textarea v-model="local.html" @input="emit" class="form-textarea font-mono text-xs" rows="12" placeholder="<div>Your HTML here</div>" />
    </FieldGroup>
    <FieldGroup label="Custom CSS (optional)">
      <textarea v-model="local.css" @input="emit" class="form-textarea font-mono text-xs" rows="6" placeholder=".my-element { color: red; }" />
    </FieldGroup>
    <div class="rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-3">
      <p class="text-xs text-amber-700 dark:text-amber-400 font-medium">Warning: Custom HTML is rendered as-is. Make sure you trust the content.</p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, watch } from 'vue'
import FieldGroup from './_FieldGroup.vue'
import type { CustomHTMLContent } from '@shared/types'
const props = defineProps<{ content: CustomHTMLContent }>()
const emit_ = defineEmits<{ update: [CustomHTMLContent] }>()
const local = reactive<CustomHTMLContent>({ ...props.content })
watch(() => props.content, c => Object.assign(local, c), { deep: true })
function emit() { emit_('update', { ...local }) }
</script>
