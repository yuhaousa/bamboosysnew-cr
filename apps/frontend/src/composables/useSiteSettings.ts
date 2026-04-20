import { ref, readonly } from 'vue'
import { apiFetch } from '@/lib/api'
import type { SiteSettings } from '@shared/types'

const settings = ref<SiteSettings | null>(null)
const loaded = ref(false)

export function useSiteSettings() {
  async function load() {
    if (loaded.value) return
    try {
      const data = await apiFetch<{ data: Record<string, any> }>('/api/public/settings')
      settings.value = data.data as any
      loaded.value = true
      // Apply theme CSS vars
      const t = (settings.value as any)?.theme
      if (t?.primaryColor) {
        document.documentElement.style.setProperty('--color-brand', t.primaryColor)
        document.documentElement.style.setProperty('--color-primary', t.primaryColor)
        // Compute foreground color for primary-colored backgrounds
        const hex = t.primaryColor
        const r = parseInt(hex.slice(1, 3), 16)
        const g = parseInt(hex.slice(3, 5), 16)
        const b = parseInt(hex.slice(5, 7), 16)
        const fg = (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.55 ? '#111827' : '#ffffff'
        document.documentElement.style.setProperty('--color-primary-fg', fg)
      }
      if (t?.secondaryColor) {
        document.documentElement.style.setProperty('--color-secondary', t.secondaryColor)
      }
      if ((settings.value as any)?.general?.maintenanceMode) {
        window.location.href = '/maintenance'
      }
    } catch {}
  }

  return { settings: readonly(settings), load }
}
