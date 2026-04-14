<template>
  <div class="p-6 space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Site Settings</h1>
      <p class="text-sm text-gray-500 mt-0.5">Configure your website settings</p>
    </div>

    <!-- Tabs -->
    <div class="flex gap-1 border-b border-gray-200 dark:border-gray-700">
      <button v-for="tab in tabs" :key="tab.key"
        @click="activeTab = tab.key"
        :class="activeTab === tab.key ? 'border-brand-500 text-brand-600 dark:text-brand-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'"
        class="px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px">
        {{ tab.label }}
      </button>
    </div>

    <!-- General -->
    <div v-if="activeTab === 'general'" class="card space-y-5 max-w-2xl">
      <h2 class="font-semibold text-gray-800 dark:text-gray-200">General Settings</h2>
      <div>
        <label class="form-label">Site Name</label>
        <input v-model="general.siteName" class="form-input" />
      </div>
      <div>
        <label class="form-label">Tagline</label>
        <input v-model="general.tagline" class="form-input" />
      </div>
      <div>
        <label class="form-label">Contact Email</label>
        <input v-model="general.contactEmail" type="email" class="form-input" />
      </div>
      <div>
        <label class="form-label">Contact Phone</label>
        <input v-model="general.contactPhone" class="form-input" />
      </div>
      <div>
        <label class="form-label">Address</label>
        <textarea v-model="general.address" class="form-textarea" rows="2" />
      </div>
      <label class="flex items-center gap-2 text-sm">
        <input type="checkbox" v-model="general.maintenanceMode" class="rounded" />
        Maintenance Mode
      </label>
      <button @click="saveGeneral" :disabled="saving" class="btn btn-primary">
        {{ saving ? 'Saving...' : 'Save General Settings' }}
      </button>
    </div>

    <!-- SEO -->
    <div v-if="activeTab === 'seo'" class="card space-y-5 max-w-2xl">
      <h2 class="font-semibold text-gray-800 dark:text-gray-200">Default SEO</h2>
      <div>
        <label class="form-label">Meta Title</label>
        <input v-model="seo.metaTitle" class="form-input" />
      </div>
      <div>
        <label class="form-label">Meta Description</label>
        <textarea v-model="seo.metaDescription" class="form-textarea" rows="3" maxlength="160" />
      </div>
      <div>
        <label class="form-label">OG Image URL</label>
        <input v-model="seo.ogImage" class="form-input" placeholder="https://..." />
      </div>
      <div>
        <label class="form-label">Google Analytics ID</label>
        <input v-model="seo.googleAnalyticsId" class="form-input" placeholder="G-XXXXXXXXXX" />
      </div>
      <button @click="saveSEO" :disabled="saving" class="btn btn-primary">Save SEO Settings</button>
    </div>

    <!-- Social -->
    <div v-if="activeTab === 'social'" class="card space-y-5 max-w-2xl">
      <h2 class="font-semibold text-gray-800 dark:text-gray-200">Social Media Links</h2>
      <div v-for="platform in socialPlatforms" :key="platform.key">
        <label class="form-label capitalize">{{ platform.label }}</label>
        <input v-model="social[platform.key as keyof typeof social]" class="form-input" :placeholder="platform.placeholder" />
      </div>
      <button @click="saveSocial" :disabled="saving" class="btn btn-primary">Save Social Links</button>
    </div>

    <!-- Theme -->
    <div v-if="activeTab === 'theme'" class="card space-y-5 max-w-2xl">
      <h2 class="font-semibold text-gray-800 dark:text-gray-200">Theme Colors</h2>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="form-label">Primary Color</label>
          <div class="flex gap-2">
            <input v-model="theme.primaryColor" type="color" class="h-10 w-14 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer" />
            <input v-model="theme.primaryColor" class="form-input flex-1 font-mono text-sm" placeholder="#4f46e5" />
          </div>
        </div>
        <div>
          <label class="form-label">Secondary Color</label>
          <div class="flex gap-2">
            <input v-model="theme.secondaryColor" type="color" class="h-10 w-14 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer" />
            <input v-model="theme.secondaryColor" class="form-input flex-1 font-mono text-sm" placeholder="#10b981" />
          </div>
        </div>
      </div>
      <div>
        <label class="form-label">Logo URL</label>
        <input v-model="theme.logoUrl" class="form-input" />
      </div>
      <div>
        <label class="form-label">Favicon URL</label>
        <input v-model="theme.faviconUrl" class="form-input" />
      </div>
      <div>
        <label class="form-label">Footer Text</label>
        <input v-model="theme.footerText" class="form-input" placeholder="© 2025 My Company" />
      </div>
      <button @click="saveTheme" :disabled="saving" class="btn btn-primary">Save Theme</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { useToast } from '@/composables/useToast'

const store = useSettingsStore()
const toast = useToast()
const saving = ref(false)
const activeTab = ref('general')

const tabs = [
  { key: 'general', label: 'General' },
  { key: 'seo', label: 'SEO' },
  { key: 'social', label: 'Social' },
  { key: 'theme', label: 'Theme' },
]

const general = reactive({ siteName: '', tagline: '', contactEmail: '', contactPhone: '', address: '', maintenanceMode: false })
const seo = reactive({ metaTitle: '', metaDescription: '', ogImage: '', googleAnalyticsId: '' })
const social = reactive({ facebook: '', twitter: '', instagram: '', linkedin: '', youtube: '' })
const theme = reactive({ primaryColor: '#4f46e5', secondaryColor: '#10b981', logoUrl: '', faviconUrl: '', footerText: '' })

const socialPlatforms = [
  { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/...' },
  { key: 'twitter', label: 'Twitter / X', placeholder: 'https://x.com/...' },
  { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/...' },
  { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/...' },
  { key: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/...' },
]

onMounted(async () => {
  await store.fetchSettings()
  const s = store.settings
  if (!s) return
  Object.assign(general, s.general ?? {})
  Object.assign(seo, s.seo ?? {})
  Object.assign(social, s.social ?? {})
  Object.assign(theme, s.theme ?? {})
})

async function saveGeneral() {
  saving.value = true
  try { await store.saveSettings('general', { ...general }); toast.success('Saved!') }
  catch { toast.error('Failed to save') }
  finally { saving.value = false }
}
async function saveSEO() {
  saving.value = true
  try { await store.saveSettings('seo', { ...seo }); toast.success('Saved!') }
  catch { toast.error('Failed to save') }
  finally { saving.value = false }
}
async function saveSocial() {
  saving.value = true
  try { await store.saveSettings('social', { ...social }); toast.success('Saved!') }
  catch { toast.error('Failed to save') }
  finally { saving.value = false }
}
async function saveTheme() {
  saving.value = true
  try { await store.saveSettings('theme', { ...theme }); toast.success('Saved!') }
  catch { toast.error('Failed to save') }
  finally { saving.value = false }
}
</script>
