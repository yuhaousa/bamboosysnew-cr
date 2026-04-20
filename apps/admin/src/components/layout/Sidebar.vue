<template>
  <aside
    class="fixed left-0 top-0 h-screen flex flex-col z-30 transition-all duration-200 overflow-hidden"
    :class="collapsed ? 'w-16 bg-gray-950' : 'w-64 bg-gray-950'"
  >
    <!-- Logo -->
    <div class="h-16 flex items-center px-4 border-b border-white/10 shrink-0">
      <div class="flex items-center gap-3 overflow-hidden">
        <div class="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center shrink-0 shadow-lg">
          <span class="text-white font-bold text-sm">B</span>
        </div>
        <div v-if="!collapsed" class="overflow-hidden">
          <p class="font-bold text-white text-sm whitespace-nowrap">BambooSys</p>
          <p class="text-xs text-gray-500 whitespace-nowrap">CMS</p>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 py-3 overflow-y-auto overflow-x-hidden">
      <div v-for="group in navGroups" :key="group.label" class="mb-1">
        <p v-if="!collapsed" class="px-4 pt-4 pb-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
          {{ group.label }}
        </p>
        <div v-else class="px-3 pt-3 pb-1">
          <div class="h-px bg-white/10" />
        </div>
        <RouterLink
          v-for="item in group.items"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg transition-all text-sm font-medium group relative"
          :class="[
            isActive(item.to)
              ? 'bg-brand-500/20 text-brand-400 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-5 before:w-0.5 before:bg-brand-400 before:rounded-r'
              : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
          ]"
          :title="collapsed ? item.label : ''"
        >
          <component :is="item.icon" class="w-4.5 h-4.5 shrink-0 w-[18px] h-[18px]" />
          <span v-if="!collapsed" class="whitespace-nowrap">{{ item.label }}</span>
          <!-- Tooltip on collapse -->
          <div v-if="collapsed" class="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
            {{ item.label }}
          </div>
        </RouterLink>
      </div>
    </nav>

    <!-- Bottom: user + collapse -->
    <div class="border-t border-white/10 shrink-0">
      <!-- User info -->
      <div v-if="!collapsed" class="px-4 py-3 flex items-center gap-3">
        <div class="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center flex-shrink-0">
          <span class="text-brand-400 text-xs font-bold uppercase">{{ userInitial }}</span>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs font-medium text-gray-300 truncate">{{ authStore.user?.email }}</p>
          <p class="text-[10px] text-gray-500 capitalize">{{ authStore.user?.role ?? 'admin' }}</p>
        </div>
      </div>
      <!-- Collapse toggle -->
      <button
        @click="$emit('toggle')"
        class="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-gray-500 hover:text-gray-300 border-t border-white/10"
      >
        <component :is="collapsed ? ChevronRight : ChevronLeft" class="w-4 h-4 shrink-0" />
        <span v-if="!collapsed" class="text-xs">Collapse sidebar</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  LayoutDashboard, FileText, Image, Settings, Users, ChevronLeft, ChevronRight,
  Menu, ClipboardList, Globe
} from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'

defineProps<{ collapsed: boolean }>()
defineEmits<{ toggle: [] }>()

const route = useRoute()
const authStore = useAuthStore()

const userInitial = computed(() => {
  const email = authStore.user?.email ?? ''
  return email.charAt(0).toUpperCase()
})

const navGroups = [
  {
    label: 'Main',
    items: [
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/pages', label: 'Pages', icon: FileText },
      { to: '/templates', label: 'Templates', icon: Globe },
      { to: '/media', label: 'Media', icon: Image },
    ],
  },
  {
    label: 'Content',
    items: [
      { to: '/settings', label: 'Site Settings', icon: Settings },
      { to: '/settings/menus', label: 'Menu Builder', icon: Menu },
    ],
  },
  {
    label: 'System',
    items: [
      { to: '/users', label: 'Users', icon: Users },
      { to: '/audit', label: 'Audit Logs', icon: ClipboardList },
    ],
  },
]

const exactRoutes = ['/dashboard', '/settings', '/pages', '/templates', '/media']

function isActive(to: string) {
  if (exactRoutes.includes(to)) return route.path === to
  return route.path.startsWith(to)
}
</script>

