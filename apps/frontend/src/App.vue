<template>
  <RouterView />
</template>
<script setup lang="ts">
import { watch } from 'vue'
import { useSiteSettings } from '@/composables/useSiteSettings'

const { settings, load } = useSiteSettings()
load()

// Compute readable text color (dark or light) for a given hex background
function primaryFg(hex: string): string {
  if (!hex || !hex.startsWith('#') || hex.length < 7) return '#ffffff'
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.55 ? '#111827' : '#ffffff'
}

// Apply theme colors as CSS custom properties
watch(settings, (s) => {
  if (!s?.theme) return
  const root = document.documentElement
  if (s.theme.primaryColor) {
    root.style.setProperty('--color-primary', s.theme.primaryColor)
    root.style.setProperty('--color-primary-fg', primaryFg(s.theme.primaryColor))
  }
  if (s.theme.secondaryColor) root.style.setProperty('--color-secondary', s.theme.secondaryColor)
  if (s.theme.fontHeading) root.style.setProperty('--font-heading', s.theme.fontHeading)
  if (s.theme.fontBody) root.style.setProperty('--font-body', s.theme.fontBody)
}, { immediate: true })
</script>
