<template>
  <div class="space-y-4">
    <FieldGroup label="Meta Title">
      <input v-model="local.metaTitle" @input="emit" class="form-input" maxlength="70" />
      <p class="text-xs text-gray-400 mt-0.5">{{ local.metaTitle?.length ?? 0 }}/70 chars</p>
    </FieldGroup>
    <FieldGroup label="Meta Description">
      <textarea v-model="local.metaDescription" @input="emit" class="form-textarea" rows="3" maxlength="160" />
      <p class="text-xs text-gray-400 mt-0.5">{{ local.metaDescription?.length ?? 0 }}/160 chars</p>
    </FieldGroup>
    <FieldGroup label="Slug (URL)">
      <div class="flex items-center gap-2">
        <span class="text-gray-400 text-sm">/</span>
        <input v-model="local.slug" @input="emit" class="form-input flex-1" placeholder="page-slug" pattern="[a-z0-9\-]+" />
      </div>
    </FieldGroup>
    <FieldGroup label="OG Title (social share)">
      <input v-model="local.ogTitle" @input="emit" class="form-input" />
    </FieldGroup>
    <FieldGroup label="OG Description">
      <textarea v-model="local.ogDescription" @input="emit" class="form-textarea" rows="2" />
    </FieldGroup>
    <FieldGroup label="OG Image">
      <ImageField :value="local.ogImage ? { url: local.ogImage, alt: '' } : null" @update="v => { local.ogImage = v?.url ?? ''; emit() }" />
    </FieldGroup>
    <FieldGroup label="Canonical URL (optional)">
      <input v-model="local.canonical" @input="emit" class="form-input" placeholder="https://example.com/page" />
    </FieldGroup>
    <label class="flex items-center gap-2 text-sm">
      <input type="checkbox" v-model="local.noIndex" @change="emit" class="rounded" />
      No-index (hide from search engines)
    </label>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import FieldGroup from '@/components/builder/block-editors/_FieldGroup.vue'
import ImageField from '@/components/builder/block-editors/_ImageField.vue'
import type { PageSEO } from '@shared/types'

interface SEOData extends PageSEO { slug: string }
const props = defineProps<{ data: SEOData }>()
const emit_ = defineEmits<{ update: [SEOData] }>()
const local = reactive<SEOData>({ ...props.data })
watch(() => props.data, d => Object.assign(local, d), { deep: true })
function emit() { emit_('update', { ...local }) }
</script>
