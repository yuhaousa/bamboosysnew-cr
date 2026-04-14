import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/lib/api'
import type { SiteSettings, Menu } from '@shared/types'

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'My Website',
  tagline: '',
  logo: '',
  favicon: '',
  contactEmail: '',
  contactPhone: '',
  address: '',
  socialLinks: {},
  theme: {
    primaryColor: '#3B82F6',
    secondaryColor: '#1E40AF',
    accentColor: '#F59E0B',
    fontHeading: 'Inter',
    fontBody: 'Inter',
  },
  maintenanceMode: false,
  maintenanceMessage: 'We are currently down for maintenance.',
}

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref<SiteSettings>({ ...DEFAULT_SETTINGS })
  const menus = ref<Menu[]>([])
  const loading = ref(false)

  async function fetchSettings() {
    loading.value = true
    try {
      const res = await api.get<{ data: Record<string, Record<string, unknown>> }>('/settings')
      const data = res.data
      settings.value = {
        siteName: (data.general?.siteName as string) ?? DEFAULT_SETTINGS.siteName,
        tagline: (data.general?.tagline as string) ?? '',
        logo: (data.general?.logo as string) ?? '',
        favicon: (data.general?.favicon as string) ?? '',
        defaultMetaTitle: (data.seo?.defaultMetaTitle as string) ?? '',
        defaultMetaDescription: (data.seo?.defaultMetaDescription as string) ?? '',
        contactEmail: (data.seo?.contactEmail as string) ?? '',
        contactPhone: (data.seo?.contactPhone as string) ?? '',
        address: (data.seo?.address as string) ?? '',
        socialLinks: (data.social as SiteSettings['socialLinks']) ?? {},
        theme: (data.theme as SiteSettings['theme']) ?? DEFAULT_SETTINGS.theme,
        maintenanceMode: (data.general?.maintenanceMode as boolean) ?? false,
        maintenanceMessage: (data.general?.maintenanceMessage as string) ?? '',
      }
    } finally {
      loading.value = false
    }
  }

  async function saveSettings(key: string, value: Record<string, unknown>) {
    await api.put(`/settings/${key}`, value)
    await fetchSettings()
  }

  async function fetchMenus() {
    const res = await api.get<{ data: Menu[] }>('/menus')
    menus.value = res.data
  }

  async function updateMenu(id: string, data: { name?: string; items?: unknown[] }) {
    await api.put(`/menus/${id}`, data)
    await fetchMenus()
  }

  async function createMenu(data: { name: string; slug: string; items?: unknown[] }) {
    await api.post('/menus', data)
    await fetchMenus()
  }

  async function deleteMenu(id: string) {
    await api.delete(`/menus/${id}`)
    menus.value = menus.value.filter(m => m.id !== id)
  }

  return { settings, menus, loading, fetchSettings, saveSettings, fetchMenus, updateMenu, createMenu, deleteMenu }
})
