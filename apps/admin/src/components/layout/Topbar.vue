<template>
  <header
    class="fixed top-0 right-0 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 z-20 transition-all duration-200"
    :style="{ left: sidebarCollapsed ? '64px' : '256px' }"
  >
    <div class="flex items-center gap-3">
      <button
        @click="$emit('toggle-sidebar')"
        class="btn-ghost p-2 rounded-lg lg:hidden"
      >
        <Menu class="w-5 h-5" />
      </button>

      <!-- Breadcrumb -->
      <nav class="hidden sm:flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
        <RouterLink to="/dashboard" class="hover:text-gray-900 dark:hover:text-gray-100">Home</RouterLink>
        <template v-if="breadcrumb.length">
          <span v-for="(crumb, i) in breadcrumb" :key="i" class="flex items-center gap-1">
            <ChevronRight class="w-4 h-4" />
            <span :class="i === breadcrumb.length - 1 ? 'text-gray-900 dark:text-gray-100 font-medium' : ''">
              {{ crumb }}
            </span>
          </span>
        </template>
      </nav>
    </div>

    <div class="flex items-center gap-2">
      <!-- View site button -->
      <a
        :href="frontendUrl"
        target="_blank"
        class="btn-outline hidden sm:flex gap-2 items-center text-xs"
      >
        <ExternalLink class="w-3.5 h-3.5" />
        View Site
      </a>

      <!-- Dark mode toggle -->
      <button @click="themeStore.toggle()" class="btn-ghost p-2 rounded-lg" title="Toggle theme">
        <Sun v-if="themeStore.isDark" class="w-5 h-5" />
        <Moon v-else class="w-5 h-5" />
      </button>

      <!-- User menu -->
      <div class="flex items-center gap-2">
        <span class="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">{{ authStore.user?.email }}</span>
        <button @click="handleLogout" class="btn-ghost p-2 rounded-lg" title="Sign out">
          <LogOut class="w-4 h-4" />
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Menu, ChevronRight, Sun, Moon, ExternalLink, LogOut } from 'lucide-vue-next'
import { useThemeStore } from '@/stores/theme'
import { useAuthStore } from '@/stores/auth'

defineProps<{ sidebarCollapsed: boolean }>()
defineEmits<{ 'toggle-sidebar': [] }>()

const route = useRoute()
const router = useRouter()
const themeStore = useThemeStore()
const authStore = useAuthStore()
const frontendUrl = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173'

function handleLogout() {
  authStore.logout()
  router.push('/login')
}

const routeLabels: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/pages': 'Pages',
  '/media': 'Media Library',
  '/settings': 'Site Settings',
  '/settings/menus': 'Menu Builder',
  '/users': 'Users',
  '/audit': 'Audit Logs',
}

const breadcrumb = computed(() => {
  const label = routeLabels[route.path]
  if (label && label !== 'Dashboard') return [label]
  if (route.path.startsWith('/pages/') && route.path.endsWith('/edit')) return ['Pages', 'Editor']
  return []
})
</script>
