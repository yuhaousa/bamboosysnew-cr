<template>
    <header
    class="sticky top-0 z-50 border-b shadow-sm transition-colors duration-300"
    :style="headerBgStyle"
    :class="isDark ? 'border-white/10' : 'border-gray-200 dark:border-gray-800'"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">

        <!-- Logo -->
        <RouterLink to="/" class="flex items-center gap-2.5 shrink-0">
          <img v-if="siteSettings?.theme?.logoUrl" :src="siteSettings.theme.logoUrl" :alt="siteSettings.general?.siteName" class="h-9 w-auto" />
          <span v-else class="text-xl font-bold tracking-tight" :class="isDark ? 'text-white' : 'text-gray-900 dark:text-white'">
            {{ siteSettings?.general?.siteName ?? 'Website' }}
          </span>
        </RouterLink>

        <!-- Desktop nav -->
        <nav v-if="menu" class="hidden md:flex items-center gap-0.5">
          <div
            v-for="item in menu.items" :key="item.id"
            class="relative group"
          >
            <a
              :href="item.link || '#'"
              :target="item.target || '_self'"
              class="relative flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              :class="isDark
                ? (isActivePath(item.link, item.children) ? 'text-white bg-white/10' : 'text-gray-300 hover:text-white hover:bg-white/10')
                : (isActivePath(item.link, item.children) ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800')"
            >
              {{ item.label }}
              <ChevronDown v-if="item.children?.length" class="w-4 h-4" />
              <span
                v-if="isActivePath(item.link, item.children)"
                class="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                :class="isDark ? 'bg-primary' : 'bg-brand-600 dark:bg-brand-400'"
              />
            </a>

            <div
              v-if="item.children?.length"
              class="absolute left-0 top-full mt-2 min-w-56 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111827] shadow-xl p-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all"
            >
              <a
                v-for="child in item.children"
                :key="child.id"
                :href="child.link || '#'"
                :target="child.target || '_self'"
                class="block px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10"
              >
                {{ child.label }}
              </a>
            </div>
          </div>

          <!-- CTA Button -->
          <a
            v-if="navCtaText"
            :href="navCtaLink || '/'"
            class="ml-3 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            :style="{ backgroundColor: siteSettings?.theme?.primaryColor || '#f59e0b', color: ctaTextColor }"
          >
            {{ navCtaText }}
          </a>
        </nav>

        <!-- Mobile toggle -->
        <button
          @click="mobileOpen = !mobileOpen"
          class="md:hidden p-2 rounded-lg transition-colors"
          :class="isDark ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'"
          aria-label="Toggle menu"
        >
          <X v-if="mobileOpen" class="w-5 h-5" />
          <MenuIcon v-else class="w-5 h-5" />
        </button>

      </div>
    </div>

    <!-- Mobile drawer -->
    <Transition name="slide-down">
      <div
        v-if="mobileOpen && menu"
        class="md:hidden border-t"
        :class="isDark ? 'border-white/10' : 'border-gray-200 dark:border-gray-700'"
        :style="isDark ? { backgroundColor: headerBgStyle.backgroundColor } : {}"
      >
        <nav class="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
          <div
            v-for="item in menu.items" :key="item.id"
            class="rounded-xl"
          >
            <a
              :href="item.link || '#'"
              :target="item.target || '_self'"
              @click="mobileOpen = false"
              class="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors"
              :class="isDark
                ? (isActivePath(item.link, item.children) ? 'text-white bg-white/10' : 'text-gray-300 hover:bg-white/10')
                : (isActivePath(item.link, item.children) ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800')"
            >
              {{ item.label }}
            </a>
            <div v-if="item.children?.length" class="pl-4 pr-2 pb-2 space-y-1">
              <a
                v-for="child in item.children"
                :key="child.id"
                :href="child.link || '#'"
                :target="child.target || '_self'"
                @click="mobileOpen = false"
                class="block px-4 py-2 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10"
              >
                {{ child.label }}
              </a>
            </div>
          </div>
          <a
            v-if="navCtaText"
            :href="navCtaLink || '/'"
            @click="mobileOpen = false"
            class="mt-2 px-4 py-3 rounded-xl text-sm font-semibold text-center transition-colors"
            :style="{ backgroundColor: siteSettings?.theme?.primaryColor || '#f59e0b', color: ctaTextColor }"
          >
            {{ navCtaText }}
          </a>
        </nav>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { Menu as MenuIcon, X, ChevronDown } from 'lucide-vue-next'
import { apiFetch } from '@/lib/api'
import { useSiteSettings } from '@/composables/useSiteSettings'
import type { Menu } from '@shared/types'

const { settings: siteSettings, load } = useSiteSettings()
const menu = ref<Menu | null>(null)
const mobileOpen = ref(false)
const route = useRoute()

const isDark = computed(() => siteSettings.value?.theme?.headerStyle === 'dark')

const headerBgStyle = computed(() => {
  if (isDark.value) {
    const bg = siteSettings.value?.theme?.headerBgColor || '#0d1117'
    return { backgroundColor: bg }
  }
  return {}
})

const navCtaText = computed(() => siteSettings.value?.theme?.navCtaText || '')
const navCtaLink = computed(() => siteSettings.value?.theme?.navCtaLink || '/')

// Decide whether CTA button text should be dark or light based on primary color brightness
const ctaTextColor = computed(() => {
  const hex = siteSettings.value?.theme?.primaryColor || '#f59e0b'
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#111827' : '#ffffff'
})

function isActivePath(url: string | undefined, children?: Array<{ link: string }>): boolean {
  if (!url) return false
  try {
    const path = new URL(url, window.location.origin).pathname
    if (path === '/' ? route.path === '/' : route.path.startsWith(path)) return true
  } catch {
    if (url === route.path) return true
  }
  return (children || []).some((child) => isActivePath(child.link))
}

onMounted(async () => {
  await load()
  try {
    const data = await apiFetch<{ data: Menu }>('/api/public/menus/header')
    menu.value = data.data
  } catch {}
})
</script>

<style scoped>
.slide-down-enter-active, .slide-down-leave-active { transition: all 0.25s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
