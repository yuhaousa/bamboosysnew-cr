<template>
  <header
    class="fixed top-0 right-0 h-14 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 z-20 transition-all duration-200"
    :style="{ left: sidebarCollapsed ? '64px' : '256px' }"
  >
    <!-- Left: breadcrumb -->
    <div class="flex items-center gap-2 min-w-0">
      <button
        @click="$emit('toggle-sidebar')"
        class="btn-ghost p-1.5 rounded-lg lg:hidden"
      >
        <Menu class="w-4 h-4" />
      </button>
      <nav class="flex items-center gap-1 text-sm min-w-0">
        <RouterLink to="/dashboard" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 shrink-0">
          <Home class="w-4 h-4" />
        </RouterLink>
        <template v-if="breadcrumb.length">
          <span v-for="(crumb, i) in breadcrumb" :key="i" class="flex items-center gap-1 min-w-0">
            <ChevronRight class="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span
              :class="i === breadcrumb.length - 1
                ? 'text-gray-800 dark:text-gray-100 font-semibold truncate'
                : 'text-gray-400 hidden sm:block'"
            >{{ crumb }}</span>
          </span>
        </template>
      </nav>
    </div>

    <!-- Right: actions -->
    <div class="flex items-center gap-1">
      <!-- View Site -->
      <a
        :href="frontendUrl"
        target="_blank"
        class="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors"
      >
        <ExternalLink class="w-3.5 h-3.5" />
        View Site
      </a>

      <!-- Dark mode -->
      <button @click="themeStore.toggle()" class="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" :title="themeStore.isDark ? 'Light mode' : 'Dark mode'">
        <Sun v-if="themeStore.isDark" class="w-4 h-4" />
        <Moon v-else class="w-4 h-4" />
      </button>

      <!-- User dropdown -->
      <div class="relative" ref="userMenuRef">
        <button
          @click="userMenuOpen = !userMenuOpen"
          class="flex items-center gap-2 pl-1 pr-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <div class="w-7 h-7 rounded-full bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center">
            <span class="text-brand-600 dark:text-brand-400 text-xs font-bold">{{ userInitial }}</span>
          </div>
          <span class="hidden sm:block text-xs font-medium text-gray-700 dark:text-gray-300 max-w-[120px] truncate">{{ authStore.user?.email }}</span>
          <ChevronDown class="w-3 h-3 text-gray-400" />
        </button>

        <!-- Dropdown -->
        <Transition name="fade-down">
          <div v-if="userMenuOpen" class="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden z-50">
            <div class="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
              <p class="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate">{{ authStore.user?.email }}</p>
              <p class="text-xs text-gray-400 capitalize mt-0.5">{{ authStore.user?.role }}</p>
            </div>
            <div class="p-1">
              <a :href="frontendUrl" target="_blank" class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 sm:hidden">
                <ExternalLink class="w-4 h-4" /> View Site
              </a>
              <button @click="handleLogout" class="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                <LogOut class="w-4 h-4" /> Sign out
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { Menu, ChevronRight, ChevronDown, Sun, Moon, ExternalLink, LogOut, Home } from 'lucide-vue-next'
import { useThemeStore } from '@/stores/theme'
import { useAuthStore } from '@/stores/auth'

defineProps<{ sidebarCollapsed: boolean }>()
defineEmits<{ 'toggle-sidebar': [] }>()

const route = useRoute()
const router = useRouter()
const themeStore = useThemeStore()
const authStore = useAuthStore()
const frontendUrl = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173'

const userMenuOpen = ref(false)
const userMenuRef = ref<HTMLElement | null>(null)

const userInitial = computed(() => (authStore.user?.email ?? 'A').charAt(0).toUpperCase())

function handleLogout() {
  authStore.logout()
  router.push('/login')
}

function onClickOutside(e: MouseEvent) {
  if (userMenuRef.value && !userMenuRef.value.contains(e.target as Node)) {
    userMenuOpen.value = false
  }
}
onMounted(() => document.addEventListener('click', onClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', onClickOutside))

const routeLabels: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/pages': 'Pages',
  '/templates': 'Templates',
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

<style scoped>
.fade-down-enter-active, .fade-down-leave-active { transition: all 0.15s ease; }
.fade-down-enter-from, .fade-down-leave-to { opacity: 0; transform: translateY(-4px); }
</style>

