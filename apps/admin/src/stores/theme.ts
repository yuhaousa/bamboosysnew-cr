import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(localStorage.getItem('admin-theme') === 'dark')

  function toggle() {
    isDark.value = !isDark.value
  }

  function applyTheme() {
    document.documentElement.classList.toggle('dark', isDark.value)
  }

  watch(isDark, (val) => {
    localStorage.setItem('admin-theme', val ? 'dark' : 'light')
    applyTheme()
  }, { immediate: true })

  return { isDark, toggle }
})
