import { ref } from 'vue'

interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  title?: string
}

const toasts = ref<Toast[]>([])

function add(toast: Omit<Toast, 'id'>, duration = 4000) {
  const id = Math.random().toString(36).slice(2)
  toasts.value.push({ ...toast, id })
  setTimeout(() => remove(id), duration)
}

function remove(id: string) {
  toasts.value = toasts.value.filter(t => t.id !== id)
}

export function useToast() {
  return {
    toasts,
    remove,
    success: (message: string, title?: string) => add({ type: 'success', message, title }),
    error: (message: string, title?: string) => add({ type: 'error', message, title }),
    warning: (message: string, title?: string) => add({ type: 'warning', message, title }),
    info: (message: string, title?: string) => add({ type: 'info', message, title }),
  }
}
