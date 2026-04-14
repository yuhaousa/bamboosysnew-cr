<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <AdminSidebar :collapsed="sidebarCollapsed" @toggle="sidebarCollapsed = !sidebarCollapsed" />
    <AdminTopbar :sidebar-collapsed="sidebarCollapsed" @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed" />
    <main
      class="transition-all duration-200 pt-16 min-h-screen"
      :style="{ marginLeft: sidebarCollapsed ? '64px' : '256px' }"
    >
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AdminSidebar from './Sidebar.vue'
import AdminTopbar from './Topbar.vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
const sidebarCollapsed = ref(false)
</script>
