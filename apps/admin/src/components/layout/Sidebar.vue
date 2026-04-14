<template>
  <aside
    class="fixed left-0 top-0 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col z-30 transition-all duration-200 overflow-hidden"
    :class="collapsed ? 'w-16' : 'w-64'"
  >
    <!-- Logo -->
    <div class="h-16 flex items-center px-4 border-b border-gray-200 dark:border-gray-800 shrink-0">
      <div class="flex items-center gap-3 overflow-hidden">
        <div class="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center shrink-0">
          <span class="text-white font-bold text-sm">B</span>
        </div>
        <span v-if="!collapsed" class="font-semibold text-gray-900 dark:text-white whitespace-nowrap">BambooSys</span>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 py-4 overflow-y-auto overflow-x-hidden">
      <div v-for="group in navGroups" :key="group.label" class="mb-6">
        <p v-if="!collapsed" class="px-4 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
          {{ group.label }}
        </p>
        <div v-if="collapsed" class="px-2 mb-2">
          <div class="h-px bg-gray-200 dark:bg-gray-700" />
        </div>
        <RouterLink
          v-for="item in group.items"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium group"
          :class="[
            isActive(item.to)
              ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
          ]"
          :title="collapsed ? item.label : ''"
        >
          <component :is="item.icon" class="w-5 h-5 shrink-0" />
          <span v-if="!collapsed" class="whitespace-nowrap">{{ item.label }}</span>
        </RouterLink>
      </div>
    </nav>

    <!-- User / Collapse button -->
    <div class="border-t border-gray-200 dark:border-gray-800 p-3 shrink-0">
      <button
        @click="$emit('toggle')"
        class="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400"
      >
        <component :is="collapsed ? ChevronRight : ChevronLeft" class="w-5 h-5 shrink-0" />
        <span v-if="!collapsed" class="text-sm">Collapse</span>
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

defineProps<{ collapsed: boolean }>()
defineEmits<{ toggle: [] }>()

const route = useRoute()

const navGroups = [
  {
    label: 'Main',
    items: [
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/pages', label: 'Pages', icon: FileText },
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

function isActive(to: string) {
  if (to === '/dashboard') return route.path === '/dashboard'
  return route.path.startsWith(to)
}
</script>
