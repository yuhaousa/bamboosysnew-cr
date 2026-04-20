<template>
  <header
    class="sticky top-0 z-50 border-b transition-colors duration-300 backdrop-blur-sm"
    :class="isDark ? 'border-white/10 shadow-none' : 'border-gray-200 dark:border-gray-800 shadow-sm bg-white/95 dark:bg-gray-900/95'"
    :style="isDark ? headerBgStyle : {}"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 lg:h-20">

        <!-- Logo -->
        <RouterLink to="/" class="flex items-center gap-2.5 shrink-0">
          <img v-if="siteSettings?.theme?.logoUrl" :src="siteSettings.theme.logoUrl" :alt="siteSettings?.general?.siteName" class="h-9 w-auto" />
          <template v-else>
            <!-- Circle icon with initials (unless logoShape is 'none') -->
            <div
              v-if="siteSettings?.theme?.logoShape !== 'none'"
              class="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              :style="{ backgroundColor: 'var(--color-primary, #4f46e5)' }"
            >
              <span class="text-sm font-bold leading-none" :style="{ color: 'var(--color-primary-fg, #ffffff)' }">
                {{ siteInitials }}
              </span>
            </div>
            <span class="text-xl font-bold tracking-tight" :class="isDark ? 'text-white' : 'text-gray-900 dark:text-white'">
              {{ siteSettings?.general?.siteName ?? 'My Website' }}
            </span>
          </template>
        </RouterLink>

        <!-- Desktop nav + right section -->
        <div class="hidden md:flex items-center gap-1">
          <nav v-if="menu" class="flex items-center gap-0.5">
            <a
              v-for="item in menu.items" :key="item.id"
              :href="item.url || '#'"
              :target="item.openInNewTab ? '_blank' : '_self'"
              class="relative px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              :class="isDark
                ? (isActivePath(item.url) ? 'text-white bg-white/10' : 'text-gray-300 hover:text-white hover:bg-white/10')
                : (isActivePath(item.url) ? 'bg-gray-100 dark:bg-gray-800' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800')"
              :style="!isDark && isActivePath(item.url) ? { color: 'var(--color-primary)' } : {}"
            >
              {{ item.label }}
              <span
                v-if="isActivePath(item.url)"
                class="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                :style="{ backgroundColor: 'var(--color-primary)' }"
              />
            </a>
          </nav>

          <!-- Right section: language + CTA -->
          <div class="flex items-center gap-3 ml-3">
            <!-- Language selector -->
            <button
              v-if="siteSettings?.theme?.navShowLanguage"
              class="flex items-center gap-1 text-sm transition-colors"
              :class="isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'"
            >
              <Globe class="w-4 h-4" />
              <span>{{ siteSettings.theme.navLanguageText || 'EN' }}</span>
            </button>
            <!-- CTA Button -->
            <a
              v-if="navCtaText"
              :href="navCtaLink || '/'"
              class="px-4 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90"
              :style="{ backgroundColor: 'var(--color-primary, #4f46e5)', color: 'var(--color-primary-fg, #fff)' }"
            >
              {{ navCtaText }}
            </a>
          </div>
        </div>

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
          <a
            v-for="item in menu.items" :key="item.id"
            :href="item.url || '#'"
            :target="item.openInNewTab ? '_blank' : '_self'"
            @click="mobileOpen = false"
            class="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors"
            :class="isDark
              ? (isActivePath(item.url) ? 'text-white bg-white/10' : 'text-gray-300 hover:bg-white/10')
              : (isActivePath(item.url) ? 'bg-gray-100 dark:bg-gray-800' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800')"
            :style="!isDark && isActivePath(item.url) ? { color: 'var(--color-primary)' } : {}"
          >
            {{ item.label }}
          </a>
          <a
            v-if="navCtaText"
            :href="navCtaLink || '/'"
            @click="mobileOpen = false"
            class="mt-2 px-4 py-3 rounded-xl text-sm font-semibold text-center transition-opacity hover:opacity-90"
            :style="{ backgroundColor: 'var(--color-primary, #4f46e5)', color: 'var(--color-primary-fg, #fff)' }"
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
import { Menu as MenuIcon, X, Globe } from 'lucide-vue-next'
import { apiFetch } from '@/lib/api'
import { useSiteSettings } from '@/composables/useSiteSettings'
import type { MenuData } from '@shared/types'

const { settings: siteSettings, load } = useSiteSettings()
const menu = ref<MenuData | null>(null)
const mobileOpen = ref(false)
const route = useRoute()

const isDark = computed(() => siteSettings.value?.theme?.headerStyle === 'dark')

const headerBgStyle = computed(() => {
  if (isDark.value) {
    const bg = siteSettings.value?.theme?.headerBgColor || '#0d1117'
    return { backgroundColor: bg }
  }
  return {} as Record<string, string>
})

const navCtaText = computed(() => siteSettings.value?.theme?.navCtaText || '')
const navCtaLink = computed(() => siteSettings.value?.theme?.navCtaLink || '/')

// Compute logo initials (up to 2 letters) from site name
const siteInitials = computed(() => {
  const name = siteSettings.value?.general?.siteName || 'W'
  return name.trim().split(/\s+/).map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()
})

function isActivePath(url: string | undefined) {
  if (!url) return false
  try {
    const path = new URL(url, window.location.origin).pathname
    return path === '/' ? route.path === '/' : route.path.startsWith(path)
  } catch {
    return url === route.path
  }
}

onMounted(async () => {
  await load()
  try {
    const data = await apiFetch<{ data: MenuData }>('/api/public/menus/header')
    menu.value = data.data
  } catch {}
})
</script>

<style scoped>
.slide-down-enter-active, .slide-down-leave-active { transition: all 0.25s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
