<template>
  <AppModal v-model="open" title="Confirm Action" size="sm" persistent>
    <div class="p-6">
      <div class="flex items-start gap-4">
        <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0" :class="variantClass">
          <component :is="icon" class="w-5 h-5" />
        </div>
        <div>
          <p class="font-semibold text-gray-900 dark:text-white">{{ title }}</p>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ message }}</p>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="flex justify-end gap-3">
        <button class="btn-outline" @click="cancel">{{ cancelText }}</button>
        <button :class="confirmClass" @click="confirm" :disabled="loading">
          <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
          {{ confirmText }}
        </button>
      </div>
    </template>
  </AppModal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Trash2, AlertTriangle, Loader2 } from 'lucide-vue-next'
import AppModal from './AppModal.vue'

const props = defineProps<{
  modelValue: boolean
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'default'
  loading?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [boolean]
  confirm: []
  cancel: []
}>()

const open = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const variantClass = computed(() => ({
  danger: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
  warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
  default: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
}[props.variant ?? 'danger']))

const confirmClass = computed(() => ({
  danger: 'btn-danger',
  warning: 'btn btn-yellow',
  default: 'btn-primary',
}[props.variant ?? 'danger']))

const icon = computed(() => props.variant === 'warning' ? AlertTriangle : Trash2)

function confirm() {
  emit('confirm')
}

function cancel() {
  emit('update:modelValue', false)
  emit('cancel')
}
</script>
