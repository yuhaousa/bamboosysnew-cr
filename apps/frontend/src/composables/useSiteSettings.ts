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
