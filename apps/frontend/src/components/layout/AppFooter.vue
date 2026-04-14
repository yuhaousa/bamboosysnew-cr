<template>
  <footer v-if="siteSettings" class="bg-gray-900 dark:bg-gray-950 text-gray-400">
    <div class="container-content py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Brand column -->
        <div class="md:col-span-2">
          <div class="flex items-center gap-2 mb-4">
            <img v-if="siteSettings.theme?.logoUrl" :src="siteSettings.theme.logoUrl" class="h-7 w-auto brightness-0 invert" alt="" />
            <span v-else class="text-white font-bold text-lg">{{ siteSettings.general?.siteName }}</span>
          </div>
          <p class="text-sm leading-relaxed mb-4">{{ siteSettings.general?.tagline }}</p>
          <!-- Social links -->
          <div class="flex gap-3">
            <a v-for="s in socialLinks" :key="s.url" :href="s.url" target="_blank" rel="noopener noreferrer"
              class="text-gray-500 hover:text-white transition-colors">
              {{ s.label }}
            </a>
          </div>
        </div>
        <!-- Footer menu -->
        <div v-if="footerMenu">
          <h4 class="text-white font-semibold mb-4 text-sm">Links</h4>
          <ul class="space-y-2">
            <li v-for="item in footerMenu.items" :key="item.id">
              <a :href="item.url" :target="item.openInNewTab ? '_blank' : '_self'" class="text-sm hover:text-white transition-colors">{{ item.label }}</a>
            </li>
          </ul>
        </div>
        <!-- Contact -->
        <div v-if="siteSettings.general?.contactEmail">
          <h4 class="text-white font-semibold mb-4 text-sm">Contact</h4>
          <div class="space-y-2 text-sm">
            <p v-if="siteSettings.general?.contactEmail">
              <a :href="`mailto:${siteSettings.general.contactEmail}`" class="hover:text-white transition-colors">{{ siteSettings.general.contactEmail }}</a>
            </p>
            <p v-if="siteSettings.general?.contactPhone">{{ siteSettings.general.contactPhone }}</p>
            <p v-if="siteSettings.general?.address" class="whitespace-pre-line">{{ siteSettings.general.address }}</p>
          </div>
        </div>
      </div>
      <div class="border-t border-gray-800 mt-10 pt-6 text-center text-xs text-gray-600">
        {{ siteSettings.theme?.footerText ?? `© ${new Date().getFullYear()} ${siteSettings.general?.siteName}. All rights reserved.` }}
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { apiFetch } from '@/lib/api'
import { useSiteSettings } from '@/composables/useSiteSettings'
import type { MenuData } from '@shared/types'

const { settings: siteSettings } = useSiteSettings()
const footerMenu = ref<MenuData | null>(null)

onMounted(async () => {
  try {
    const data = await apiFetch<{ menu: MenuData }>('/api/public/menus/footer')
    footerMenu.value = data.menu
  } catch {}
})

const socialLinks = computed(() => {
  if (!siteSettings.value?.social) return []
  const s = siteSettings.value.social
  return [
    s.facebook && { label: 'Facebook', url: s.facebook },
    s.twitter && { label: 'X', url: s.twitter },
    s.instagram && { label: 'Instagram', url: s.instagram },
    s.linkedin && { label: 'LinkedIn', url: s.linkedin },
    s.youtube && { label: 'YouTube', url: s.youtube },
  ].filter(Boolean) as { label: string; url: string }[]
})
</script>
