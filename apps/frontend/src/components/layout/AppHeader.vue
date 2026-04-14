<template>
  <header v-if="menu" class="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50">
    <div class="container-content flex items-center justify-between h-16">
      <!-- Logo -->
      <RouterLink to="/" class="flex items-center gap-2">
        <img v-if="siteSettings?.theme?.logoUrl" :src="siteSettings.theme.logoUrl" :alt="siteSettings.general?.siteName" class="h-8 w-auto" />
        <span v-else class="text-xl font-bold text-gray-900 dark:text-white">
          {{ siteSettings?.general?.siteName ?? 'Website' }}
        </span>
      </RouterLink>

      <!-- Desktop nav -->
      <nav class="hidden md:flex items-center gap-1">
        <a v-for="item in menu.items" :key="item.id"
          :href="item.url"
          :target="item.openInNewTab ? '_blank' : '_self'"
          class="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {{ item.label }}
        </a>
      </nav>

      <!-- Mobile menu toggle -->
      <button @click="mobileOpen = !mobileOpen" class="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
        <X v-if="mobileOpen" class="w-5 h-5" />
        <Menu v-else class="w-5 h-5" />
      </button>
    </div>

    <!-- Mobile nav -->
    <Transition name="slide-down">
      <div v-if="mobileOpen" class="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <nav class="container-content py-3 flex flex-col gap-1">
          <a v-for="item in menu.items" :key="item.id"
            :href="item.url"
            :target="item.openInNewTab ? '_blank' : '_self'"
            @click="mobileOpen = false"
            class="px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {{ item.label }}
          </a>
        </nav>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { Menu, X } from 'lucide-vue-next'
import { apiFetch } from '@/lib/api'
import { useSiteSettings } from '@/composables/useSiteSettings'
import type { MenuData } from '@shared/types'

const { settings: siteSettings, load } = useSiteSettings()
const menu = ref<MenuData | null>(null)
const mobileOpen = ref(false)

onMounted(async () => {
  await load()
  try {
    const data = await apiFetch<{ menu: MenuData }>('/api/public/menus/header')
    menu.value = data.menu
  } catch {}
})
</script>

<style scoped>
.slide-down-enter-active, .slide-down-leave-active { transition: all 0.2s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
