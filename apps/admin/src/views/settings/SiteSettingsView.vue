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
    <div v-if="activeTab === 'theme'" class="grid grid-cols-1 xl:grid-cols-3 gap-6">

      <!-- LEFT: Preset themes (wider) -->
      <div class="xl:col-span-2 card space-y-4">
        <div>
          <h2 class="font-semibold text-gray-800 dark:text-gray-200">Preset Themes</h2>
          <p class="text-sm text-gray-400 mt-0.5">Click a theme to instantly apply it.</p>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <button
            v-for="preset in presetThemes" :key="preset.name"
            @click="applyPreset(preset)"
            class="group relative rounded-xl overflow-hidden border-2 transition-all hover:scale-[1.03] hover:shadow-lg"
            :class="theme.primaryColor === preset.primaryColor ? 'border-brand-500 shadow-md' : 'border-gray-200 dark:border-gray-700'"
          >
            <div class="flex h-10">
              <div class="flex-1" :style="{ background: preset.bgColor }" />
              <div class="flex-1" :style="{ background: preset.primaryColor }" />
              <div class="flex-1" :style="{ background: preset.accentColor }" />
            </div>
            <div class="p-2 bg-white dark:bg-gray-900 text-left">
              <p class="text-xs font-semibold text-gray-800 dark:text-gray-200 leading-tight">{{ preset.name }}</p>
              <p class="text-[10px] text-gray-400 leading-tight mt-0.5">{{ preset.description }}</p>
            </div>
            <span v-if="theme.primaryColor === preset.primaryColor"
              class="absolute top-1.5 right-1.5 w-4 h-4 bg-brand-500 rounded-full flex items-center justify-center shadow">
              <Check class="w-2.5 h-2.5 text-white" />
            </span>
            <div v-if="saving && theme.primaryColor === preset.primaryColor" class="absolute inset-0 bg-white/50 dark:bg-black/50 flex items-center justify-center">
              <div class="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
            </div>
          </button>
        </div>
        <p class="text-xs text-gray-400">Selecting a preset instantly saves and applies it to your site.</p>
      </div>

      <!-- RIGHT: Custom settings -->
      <div class="space-y-4">

        <!-- Colors -->
        <div class="card space-y-4">
          <h2 class="font-semibold text-gray-800 dark:text-gray-200 text-sm">Custom Colors</h2>
          <div>
            <label class="form-label">Primary Color</label>
            <div class="flex gap-2">
              <input v-model="theme.primaryColor" type="color" class="h-9 w-12 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer" />
              <input v-model="theme.primaryColor" class="form-input flex-1 font-mono text-sm" placeholder="#4f46e5" />
            </div>
          </div>
          <div>
            <label class="form-label">Secondary Color</label>
            <div class="flex gap-2">
              <input v-model="theme.secondaryColor" type="color" class="h-9 w-12 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer" />
              <input v-model="theme.secondaryColor" class="form-input flex-1 font-mono text-sm" placeholder="#10b981" />
            </div>
          </div>
        </div>

        <!-- Header -->
        <div class="card space-y-4">
          <h2 class="font-semibold text-gray-800 dark:text-gray-200 text-sm">Header & Navigation</h2>
          <div>
            <label class="form-label">Header Style</label>
            <div class="flex gap-2">
              <button
                @click="theme.headerStyle = 'light'"
                :class="theme.headerStyle === 'light' ? 'ring-2 ring-brand-500 opacity-100' : 'opacity-50 hover:opacity-80'"
                class="flex-1 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white text-gray-800 text-xs font-medium transition-all"
              >
                ☀️ Light
              </button>
              <button
                @click="theme.headerStyle = 'dark'"
                :class="theme.headerStyle === 'dark' ? 'ring-2 ring-brand-500 opacity-100' : 'opacity-50 hover:opacity-80'"
                class="flex-1 py-2 rounded-lg border border-gray-700 bg-gray-900 text-white text-xs font-medium transition-all"
              >
                🌙 Dark
              </button>
            </div>
          </div>
          <div v-if="theme.headerStyle === 'dark'">
            <label class="form-label">Header BG Color</label>
            <div class="flex gap-2">
              <input v-model="theme.headerBgColor" type="color" class="h-9 w-12 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer" />
              <input v-model="theme.headerBgColor" class="form-input flex-1 font-mono text-sm" placeholder="#0d1117" />
            </div>
          </div>
          <div>
            <label class="form-label">Nav CTA Button Text</label>
            <input v-model="theme.navCtaText" class="form-input" placeholder="Get Started" />
          </div>
          <div>
            <label class="form-label">Nav CTA Button Link</label>
            <input v-model="theme.navCtaLink" class="form-input" placeholder="/contact" />
          </div>
        </div>

        <!-- Identity -->
        <div class="card space-y-4">
          <h2 class="font-semibold text-gray-800 dark:text-gray-200 text-sm">Site Identity</h2>
          <div>
            <label class="form-label">Logo URL</label>
            <input v-model="theme.logoUrl" class="form-input" placeholder="https://..." />
          </div>
          <div>
            <label class="form-label">Favicon URL</label>
            <input v-model="theme.faviconUrl" class="form-input" placeholder="https://..." />
          </div>
          <div>
            <label class="form-label">Footer Text</label>
            <input v-model="theme.footerText" class="form-input" placeholder="© 2025 My Company" />
          </div>
        </div>

        <button @click="saveTheme" :disabled="saving" class="btn btn-primary w-full">
          {{ saving ? 'Saving...' : 'Save Custom Settings' }}
        </button>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Check } from 'lucide-vue-next'
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

interface PresetTheme {
  name: string
  description: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  bgColor: string
  headerStyle?: 'light' | 'dark'
  headerBgColor?: string
}

const presetThemes: PresetTheme[] = [
  { name: 'Indigo Pro', description: 'Clean & corporate', primaryColor: '#4f46e5', secondaryColor: '#6366f1', accentColor: '#a5b4fc', bgColor: '#f8faff' },
  { name: 'Emerald Fresh', description: 'Modern & natural', primaryColor: '#059669', secondaryColor: '#10b981', accentColor: '#6ee7b7', bgColor: '#f0fdf4' },
  { name: 'Rose Bold', description: 'Creative & energetic', primaryColor: '#e11d48', secondaryColor: '#f43f5e', accentColor: '#fda4af', bgColor: '#fff1f2' },
  { name: 'Amber Warm', description: 'Warm & inviting', primaryColor: '#d97706', secondaryColor: '#f59e0b', accentColor: '#fcd34d', bgColor: '#fffbeb' },
  { name: 'Sky Blue', description: 'Friendly & open', primaryColor: '#0284c7', secondaryColor: '#0ea5e9', accentColor: '#7dd3fc', bgColor: '#f0f9ff' },
  { name: 'Slate Dark', description: 'Professional & bold', primaryColor: '#334155', secondaryColor: '#475569', accentColor: '#94a3b8', bgColor: '#f8fafc' },
  { name: 'Violet Studio', description: 'Luxe & creative', primaryColor: '#7c3aed', secondaryColor: '#8b5cf6', accentColor: '#c4b5fd', bgColor: '#faf5ff' },
  { name: 'Teal Ocean', description: 'Calm & trustworthy', primaryColor: '#0d9488', secondaryColor: '#14b8a6', accentColor: '#5eead4', bgColor: '#f0fdfa' },
  { name: 'Orange Buzz', description: 'Fun & youthful', primaryColor: '#ea580c', secondaryColor: '#f97316', accentColor: '#fdba74', bgColor: '#fff7ed' },
  { name: 'Dark Gold', description: 'Education & pro', primaryColor: '#f59e0b', secondaryColor: '#d97706', accentColor: '#fbbf24', bgColor: '#0d1117', headerStyle: 'dark', headerBgColor: '#0d1117' },
  { name: 'Dark Navy', description: 'Tech & enterprise', primaryColor: '#3b82f6', secondaryColor: '#2563eb', accentColor: '#93c5fd', bgColor: '#0f172a', headerStyle: 'dark', headerBgColor: '#0f172a' },
  { name: 'Dark Purple', description: 'Creative & luxury', primaryColor: '#a855f7', secondaryColor: '#9333ea', accentColor: '#d8b4fe', bgColor: '#0c0a1a', headerStyle: 'dark', headerBgColor: '#0c0a1a' },
]

const general = reactive({ siteName: '', tagline: '', contactEmail: '', contactPhone: '', address: '', maintenanceMode: false })
const seo = reactive({ metaTitle: '', metaDescription: '', ogImage: '', googleAnalyticsId: '' })
const social = reactive({ facebook: '', twitter: '', instagram: '', linkedin: '', youtube: '' })
const theme = reactive({ primaryColor: '#4f46e5', secondaryColor: '#10b981', logoUrl: '', faviconUrl: '', footerText: '', headerStyle: 'light' as 'light' | 'dark', headerBgColor: '#0d1117', navCtaText: '', navCtaLink: '' })

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

async function applyPreset(preset: PresetTheme) {
  theme.primaryColor = preset.primaryColor
  theme.secondaryColor = preset.secondaryColor
  if (preset.headerStyle) theme.headerStyle = preset.headerStyle
  if (preset.headerBgColor) theme.headerBgColor = preset.headerBgColor
  await saveTheme()
}
</script>
