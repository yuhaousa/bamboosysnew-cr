<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      <TransitionGroup
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 translate-x-8"
        enter-to-class="opacity-100 translate-x-0"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 translate-x-0"
        leave-to-class="opacity-0 translate-x-8"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg border min-w-[280px] max-w-sm"
          :class="toastClass(toast.type)"
        >
          <component :is="toastIcon(toast.type)" class="w-5 h-5 shrink-0 mt-0.5" />
          <div class="flex-1 min-w-0">
            <p v-if="toast.title" class="font-semibold text-sm">{{ toast.title }}</p>
            <p class="text-sm opacity-90">{{ toast.message }}</p>
          </div>
          <button @click="remove(toast.id)" class="opacity-60 hover:opacity-100 transition-opacity shrink-0">
            <X class="w-4 h-4" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-vue-next'
import { useToast } from '@/composables/useToast'

const { toasts, remove } = useToast()

function toastClass(type: string) {
  return {
    success: 'bg-white dark:bg-gray-900 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400',
    error: 'bg-white dark:bg-gray-900 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400',
    warning: 'bg-white dark:bg-gray-900 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400',
    info: 'bg-white dark:bg-gray-900 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400',
  }[type] ?? ''
}

function toastIcon(type: string) {
  return { success: CheckCircle, error: XCircle, warning: AlertCircle, info: Info }[type] ?? Info
}
</script>
