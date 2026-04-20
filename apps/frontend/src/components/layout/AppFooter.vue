<template>
  <footer :style="footerBgStyle" class="text-gray-400">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

        <!-- Brand column -->
        <div class="lg:col-span-1">
          <div class="flex items-center gap-2.5 mb-4">
            <img v-if="siteSettings?.theme?.logoUrl" :src="siteSettings.theme.logoUrl" class="h-9 w-auto" alt="" />
            <template v-else>
              <div v-if="siteSettings?.theme?.logoShape !== 'none'"
                class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                :style="{ backgroundColor: 'var(--color-primary, #4f46e5)' }"
              >
                <span class="text-sm font-bold leading-none" :style="{ color: 'var(--color-primary-fg, #fff)' }">{{ siteInitials }}</span>
              </div>
              <span class="text-white font-bold text-xl tracking-tight">{{ siteSettings?.general?.siteName }}</span>
            </template>
          </div>
          <p v-if="siteSettings?.general?.tagline" class="text-sm leading-relaxed text-gray-400 mb-6 max-w-xs">
            {{ siteSettings.general.tagline }}
          </p>
          <!-- Social icons -->
          <div v-if="socialLinks.length" class="flex gap-2">
            <a
              v-for="s in socialLinks" :key="s.url"
              :href="s.url" target="_blank" rel="noopener noreferrer"
              class="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              :aria-label="s.label"
            >
              <component :is="s.icon" class="w-4 h-4" />
            </a>
          </div>
        </div>

        <!-- Company column (footer menu) -->
        <div v-if="footerMenu?.items?.length">
          <h4 class="text-white font-semibold mb-5 text-sm">Company</h4>
          <ul class="space-y-3">
            <li v-for="item in footerMenu.items" :key="item.id">
              <a
                :href="item.url || '#'"
                :target="item.openInNewTab ? '_blank' : '_self'"
                class="text-sm text-gray-400 hover:text-white transition-colors"
              >{{ item.label }}</a>
            </li>
          </ul>
        </div>

        <!-- Resources column (footer-resources menu, optional) -->
        <div v-if="resourcesMenu?.items?.length">
          <h4 class="text-white font-semibold mb-5 text-sm">Resources</h4>
          <ul class="space-y-3">
            <li v-for="item in resourcesMenu.items" :key="item.id">
              <a
                :href="item.url || '#'"
                :target="item.openInNewTab ? '_blank' : '_self'"
                class="text-sm text-gray-400 hover:text-white transition-colors"
              >{{ item.label }}</a>
            </li>
          </ul>
        </div>

        <!-- Offices / Contact column -->
        <div v-if="siteSettings?.general?.address || siteSettings?.general?.contactPhone || siteSettings?.general?.contactEmail">
          <h4 class="text-white font-semibold mb-5 text-sm">Offices</h4>
          <div class="space-y-4 text-sm">
            <div v-if="siteSettings?.general?.address" class="flex items-start gap-2 text-gray-400">
              <MapPin class="w-4 h-4 shrink-0 mt-0.5 flex-shrink-0" :style="{ color: 'var(--color-primary)' }" />
              <span class="whitespace-pre-line">{{ siteSettings.general.address }}</span>
            </div>
            <div v-if="siteSettings?.general?.contactPhone" class="flex items-center gap-2 text-gray-400">
              <Phone class="w-4 h-4 shrink-0 flex-shrink-0" :style="{ color: 'var(--color-primary)' }" />
              {{ siteSettings.general.contactPhone }}
            </div>
            <a v-if="siteSettings?.general?.contactEmail"
              :href="`mailto:${siteSettings.general.contactEmail}`"
              class="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <Mail class="w-4 h-4 shrink-0 flex-shrink-0" :style="{ color: 'var(--color-primary)' }" />
              {{ siteSettings.general.contactEmail }}
            </a>
          </div>
        </div>

      </div>

      <!-- Bottom bar -->
      <div class="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
        <span>{{ siteSettings?.theme?.footerText ?? `© ${new Date().getFullYear()} ${siteSettings?.general?.siteName ?? ''}. All rights reserved.` }}</span>
        <div class="flex items-center gap-4">
          <a href="/privacy" class="hover:text-white transition-colors">Privacy Policy</a>
          <a href="/terms" class="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>

    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-vue-next'
import { apiFetch } from '@/lib/api'
import { useSiteSettings } from '@/composables/useSiteSettings'
import type { MenuData } from '@shared/types'

const { settings: siteSettings } = useSiteSettings()
const footerMenu = ref<MenuData | null>(null)
const resourcesMenu = ref<MenuData | null>(null)

onMounted(async () => {
  try {
    const data = await apiFetch<{ data: MenuData }>('/api/public/menus/footer')
    footerMenu.value = data.data
  } catch {}
  try {
    const data = await apiFetch<{ data: MenuData }>('/api/public/menus/footer-resources')
    resourcesMenu.value = data.data
  } catch {}
})

const siteInitials = computed(() => {
  const name = siteSettings.value?.general?.siteName || 'W'
  return name.trim().split(/\s+/).map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()
})

const footerBgStyle = computed(() => {
  const theme = siteSettings.value?.theme
  if (theme?.headerStyle === 'dark' && theme?.headerBgColor) {
    return { backgroundColor: theme.headerBgColor }
  }
  return { backgroundColor: '#111827' }
})

const socialLinks = computed(() => {
  if (!siteSettings.value?.social) return []
  const s = siteSettings.value.social
  return [
    s.facebook && { label: 'Facebook', url: s.facebook, icon: Facebook },
    s.twitter && { label: 'X / Twitter', url: s.twitter, icon: Twitter },
    s.instagram && { label: 'Instagram', url: s.instagram, icon: Instagram },
    s.linkedin && { label: 'LinkedIn', url: s.linkedin, icon: Linkedin },
    s.youtube && { label: 'YouTube', url: s.youtube, icon: Youtube },
  ].filter(Boolean) as { label: string; url: string; icon: unknown }[]
})
</script>
