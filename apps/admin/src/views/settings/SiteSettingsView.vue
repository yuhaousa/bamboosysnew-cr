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
    <div v-if="activeTab === 'theme'" class="space-y-6 max-w-2xl">

      <!-- Preset themes -->
      <div class="card space-y-4">
        <h2 class="font-semibold text-gray-800 dark:text-gray-200">Preset Themes</h2>
        <p class="text-sm text-gray-500">Click a theme to instantly apply its color palette.</p>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <button
            v-for="preset in presetThemes" :key="preset.name"
            @click="applyPreset(preset)"
            class="group relative rounded-xl overflow-hidden border-2 transition-all hover:scale-105 hover:shadow-lg"
            :class="theme.primaryColor === preset.primaryColor ? 'border-gray-900 dark:border-white shadow-md' : 'border-gray-200 dark:border-gray-700'"
          >
            <!-- Color swatches -->
            <div class="flex h-12">
              <div class="flex-1" :style="{ background: preset.bgColor }" />
              <div class="flex-1" :style="{ background: preset.primaryColor }" />
              <div class="flex-1" :style="{ background: preset.accentColor }" />
            </div>
            <div class="p-2 bg-white dark:bg-gray-900">
              <p class="text-xs font-semibold text-gray-800 dark:text-gray-200">{{ preset.name }}</p>
              <p class="text-xs text-gray-400">{{ preset.description }}</p>
            </div>
            <span v-if="theme.primaryColor === preset.primaryColor"
              class="absolute top-1.5 right-1.5 w-4 h-4 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center">
              <Check class="w-2.5 h-2.5 text-white dark:text-gray-900" />
            </span>
          </button>
        </div>
      </div>

      <!-- Custom colors -->
      <div class="card space-y-5">
        <h2 class="font-semibold text-gray-800 dark:text-gray-200">Custom Colors</h2>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="form-label">Primary Color</label>
            <div class="flex gap-2">
              <input v-model="theme.primaryColor" type="color" class="h-10 w-14 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer" />
              <input v-model="theme.primaryColor" class="form-input flex-1 font-mono text-sm" placeholder="#4f46e5" />
            </div>
          </div>
          <div>
            <label class="form-label">Secondary / Accent Color</label>
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

        <!-- Header Style -->
        <div>
          <label class="form-label">Header Style</label>
          <div class="flex gap-2">
            <button
              @click="theme.headerStyle = 'light'"
              :class="theme.headerStyle === 'light' ? 'ring-2 ring-brand-500' : 'opacity-60 hover:opacity-100'"
              class="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white text-gray-800 text-sm font-medium transition-all"
            >
              ☀️ Light Header
            </button>
            <button
              @click="theme.headerStyle = 'dark'"
              :class="theme.headerStyle === 'dark' ? 'ring-2 ring-brand-500' : 'opacity-60 hover:opacity-100'"
              class="flex-1 py-3 rounded-xl border border-gray-700 bg-gray-900 text-white text-sm font-medium transition-all"
            >
              🌙 Dark Header
            </button>
          </div>
        </div>
        <div v-if="theme.headerStyle === 'dark'">
          <label class="form-label">Header Background Color</label>
          <div class="flex gap-2">
            <input v-model="theme.headerBgColor" type="color" class="h-10 w-14 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer" />
            <input v-model="theme.headerBgColor" class="form-input flex-1 font-mono text-sm" placeholder="#0d1117" />
          </div>
        </div>

        <!-- Logo Icon Shape -->
        <div>
          <label class="form-label">Logo Icon (when no image uploaded)</label>
          <div class="flex gap-2">
            <button
              @click="theme.logoShape = 'circle'"
              :class="theme.logoShape !== 'none' ? 'ring-2 ring-brand-500' : 'opacity-60 hover:opacity-100'"
              class="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium transition-all"
            >
              🔵 Circle with Initials
            </button>
            <button
              @click="theme.logoShape = 'none'"
              :class="theme.logoShape === 'none' ? 'ring-2 ring-brand-500' : 'opacity-60 hover:opacity-100'"
              class="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium transition-all"
            >
              Ⓐ Text Only
            </button>
          </div>
        </div>

        <!-- Nav CTA Button -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="form-label">Nav CTA Button Text</label>
            <input v-model="theme.navCtaText" class="form-input" placeholder="Get Started" />
          </div>
          <div>
            <label class="form-label">Nav CTA Button Link</label>
            <input v-model="theme.navCtaLink" class="form-input" placeholder="/contact" />
          </div>
        </div>

        <!-- Language Selector -->
        <div>
          <label class="form-label">Language Selector in Header</label>
          <div class="flex items-center gap-4">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" v-model="theme.navShowLanguage" class="rounded" />
              <span class="text-sm text-gray-700 dark:text-gray-300">Show language selector (Globe icon)</span>
            </label>
            <input
              v-if="theme.navShowLanguage"
              v-model="theme.navLanguageText"
              class="form-input w-20 text-sm"
              placeholder="EN"
              maxlength="5"
            />
          </div>
        </div>

        <button @click="saveTheme" :disabled="saving" class="btn btn-primary">Save Theme</button>
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
  { name: 'Dark Blue', description: 'Education & pro', primaryColor: '#2563eb', secondaryColor: '#1d4ed8', accentColor: '#60a5fa', bgColor: '#0d1117', headerStyle: 'dark', headerBgColor: '#0d1117' },
  { name: 'Dark Navy', description: 'Tech & enterprise', primaryColor: '#3b82f6', secondaryColor: '#2563eb', accentColor: '#93c5fd', bgColor: '#0f172a', headerStyle: 'dark', headerBgColor: '#0f172a' },
  { name: 'Dark Purple', description: 'Creative & luxury', primaryColor: '#a855f7', secondaryColor: '#9333ea', accentColor: '#d8b4fe', bgColor: '#0c0a1a', headerStyle: 'dark', headerBgColor: '#0c0a1a' },
]

const general = reactive({ siteName: '', tagline: '', contactEmail: '', contactPhone: '', address: '', maintenanceMode: false })
const seo = reactive({ metaTitle: '', metaDescription: '', ogImage: '', googleAnalyticsId: '' })
const social = reactive({ facebook: '', twitter: '', instagram: '', linkedin: '', youtube: '' })
const theme = reactive({ primaryColor: '#4f46e5', secondaryColor: '#10b981', logoUrl: '', faviconUrl: '', footerText: '', headerStyle: 'light' as 'light' | 'dark', headerBgColor: '#0d1117', logoShape: 'circle' as 'circle' | 'none', navCtaText: '', navCtaLink: '', navShowLanguage: false, navLanguageText: 'EN' })

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
