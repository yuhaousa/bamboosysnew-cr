<template>
  <div class="space-y-4">
    <FieldGroup label="Badge"><input v-model="local.badge" @input="emit" class="form-input" /></FieldGroup>
    <FieldGroup label="Title"><input v-model="local.title" @input="emit" class="form-input" /></FieldGroup>
    <FieldGroup label="Description"><textarea v-model="local.description" @input="emit" class="form-textarea" rows="2" /></FieldGroup>

    <!-- Source toggle -->
    <div class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="flex">
        <button
          @click="source = 'db'"
          class="flex-1 py-2 text-xs font-semibold transition-colors"
          :class="source === 'db' ? 'bg-brand-600 text-white' : 'bg-gray-50 dark:bg-gray-800 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'"
        >From Database</button>
        <button
          @click="source = 'static'"
          class="flex-1 py-2 text-xs font-semibold transition-colors"
          :class="source === 'static' ? 'bg-brand-600 text-white' : 'bg-gray-50 dark:bg-gray-800 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'"
        >Static Content</button>
      </div>
    </div>

    <template v-if="source === 'db'">
      <FieldGroup label="Testimonials">
        <p class="text-xs text-gray-500 mb-2">Pick from your Testimonials content library.</p>
        <DbPicker entity="testimonials" label="testimonials" v-model="local.selectedIds" @update:modelValue="emit" />
      </FieldGroup>
    </template>

    <template v-else>
      <div>
        <div class="flex items-center justify-between mb-2">
          <label class="form-label mb-0">Testimonials</label>
          <button @click="addItem" class="text-xs text-brand-500 hover:text-brand-700">+ Add</button>
        </div>
        <div v-for="(t, i) in local.items" :key="t.id" class="p-3 rounded-xl border border-gray-200 dark:border-gray-700 space-y-2 mb-2">
          <div class="flex justify-between items-center">
            <span class="text-xs font-medium text-gray-600 dark:text-gray-400">{{ t.name || 'Testimonial ' + (i+1) }}</span>
            <button @click="removeItem(i)" class="text-red-400"><X class="w-3.5 h-3.5" /></button>
          </div>
          <input v-model="t.name" @input="emit" class="form-input text-sm" placeholder="Author name *" />
          <input v-model="t.role" @input="emit" class="form-input text-sm" placeholder="Role / Title" />
          <input v-model="t.company" @input="emit" class="form-input text-sm" placeholder="Company" />
          <textarea v-model="t.content" @input="emit" class="form-textarea text-sm" rows="3" placeholder="Testimonial quote *" />
          <div class="flex gap-2 items-center">
            <label class="text-xs text-gray-500">Rating:</label>
            <select v-model.number="t.rating" @change="emit" class="form-select text-sm flex-1">
              <option v-for="n in 5" :key="n" :value="n">{{ n }} ★</option>
            </select>
          </div>
        </div>
        <button v-if="!local.items?.length" @click="addItem" class="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-xs text-gray-400 hover:border-brand-400 hover:text-brand-500 transition-colors">
          + Add First Testimonial
        </button>
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { X } from 'lucide-vue-next'
import { v4 as uuid } from 'uuid'
import FieldGroup from './_FieldGroup.vue'
import DbPicker from './_DbPicker.vue'
import type { TestimonialsContent } from '@shared/types'
const props = defineProps<{ content: TestimonialsContent }>()
const emit_ = defineEmits<{ update: [TestimonialsContent] }>()
const local = reactive<TestimonialsContent & { selectedIds: string[] }>({
  ...props.content,
  items: (props.content.items ?? []).map(i => ({ ...i })),
  selectedIds: props.content.selectedIds ?? [],
})
const source = ref<'db' | 'static'>((props.content.selectedIds?.length ?? 0) > 0 ? 'db' : 'static')
watch(() => props.content, c => {
  Object.assign(local, { ...c, items: (c.items ?? []).map(i => ({ ...i })), selectedIds: c.selectedIds ?? [] })
  source.value = (c.selectedIds?.length ?? 0) > 0 ? 'db' : 'static'
}, { deep: true })
function addItem() {
  if (!local.items) local.items = []
  local.items.push({ id: uuid(), name: '', role: '', company: '', content: '', rating: 5 })
  emit()
}
function removeItem(i: number) { local.items.splice(i, 1); emit() }
function emit() {
  emit_('update', {
    ...local,
    selectedIds: source.value === 'db' ? local.selectedIds : [],
    items: local.items.map(i => ({ ...i })),
  })
}
</script>
