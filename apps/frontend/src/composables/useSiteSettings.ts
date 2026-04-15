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
      // Apply theme color as CSS var
      if ((settings.value as any)?.theme?.primaryColor) {
        document.documentElement.style.setProperty('--color-brand', (settings.value as any).theme.primaryColor)
      }
      if ((settings.value as any)?.general?.maintenanceMode) {
        window.location.href = '/maintenance'
      }
    } catch {}
  }

  return { settings: readonly(settings), load }
}
