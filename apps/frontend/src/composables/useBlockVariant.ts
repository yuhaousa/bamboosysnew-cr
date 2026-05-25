import { computed } from 'vue'
import type { BlockStyles } from '@shared/types'

/** Luminance-based dark detection for hex colors */
function hexIsDark(hex: string): boolean {
  if (!hex?.startsWith('#') || hex.length < 7) return false
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5
}

/**
 * Returns reactive isDark, sectionStyle, sectionClass, cardClass, and variant
 * for a block component based on its BlockStyles.
 *
 * Variants:
 *  light    → white bg, dark text (default look)
 *  dark     → very dark bg (#0d1117), white text, primary-color accents
 *  glass    → dark navy bg, inner cards have frosted-glass look
 *  gradient → soft primary-color gradient bg, dark text
 */
export function useBlockVariant(stylesGetter: () => BlockStyles | undefined) {
  const variant = computed(() => stylesGetter()?.variant ?? null)

  const isDark = computed(() => {
    const v = variant.value
    if (v === 'dark' || v === 'glass') return true
    if (v === 'light' || v === 'gradient') return false
    // No variant — fall back to backgroundColor luminance
    return hexIsDark(stylesGetter()?.backgroundColor ?? '')
  })

  const sectionStyle = computed((): Record<string, string> => {
    const v = variant.value
    const s = stylesGetter()
    const base: Record<string, string> = {}

    if (s?.paddingTop) base.paddingTop = s.paddingTop
    if (s?.paddingBottom) base.paddingBottom = s.paddingBottom
    if (s?.paddingLeft) base.paddingLeft = s.paddingLeft
    if (s?.paddingRight) base.paddingRight = s.paddingRight

    switch (v) {
      case 'dark':
        base.backgroundColor = s?.backgroundColor || '#0d1117'
        break
      case 'light':
        base.backgroundColor = s?.backgroundColor || '#ffffff'
        break
      case 'glass':
        // Dark navy base + radial blue/indigo glows for depth
        base.backgroundColor = s?.backgroundColor || '#060d1e'
        base.backgroundImage =
          'radial-gradient(ellipse 70% 60% at 15% 35%, rgba(37,99,235,0.22) 0%, transparent 70%), ' +
          'radial-gradient(ellipse 55% 45% at 85% 65%, rgba(99,102,241,0.18) 0%, transparent 70%), ' +
          'radial-gradient(ellipse 40% 30% at 50% 10%, rgba(14,165,233,0.1) 0%, transparent 60%)'
        break
      case 'gradient': {
        const from = s?.gradientFrom || '#dbeafe'
        const to = s?.gradientTo || '#f0fdf4'
        const angle = s?.gradientAngle ?? 135
        base.backgroundImage = `linear-gradient(${angle}deg, ${from} 0%, ${to} 100%)`
        break
      }
      default:
        if (s?.backgroundColor) base.backgroundColor = s.backgroundColor
    }
    return base
  })

  /** Extra class on the <section> element */
  const sectionClass = computed(() => {
    if (variant.value === 'glass') return 'relative'
    return ''
  })

  /**
   * Classes for inner card/highlight elements.
   * glass  → frosted card look
   * dark   → subtle white overlay
   * light  → white card with gray border
   */
  const cardClass = computed(() => {
    const v = variant.value
    if (v === 'glass') return 'bg-white/5 backdrop-blur-md border-white/10'
    if (v === 'dark' || isDark.value) return 'bg-white/5 border-white/10'
    if (v === 'gradient') return 'bg-white/80 backdrop-blur-sm border-gray-200 shadow-sm'
    return 'bg-white border-gray-200 dark:border-gray-700'
  })

  return { isDark, sectionStyle, sectionClass, cardClass, variant }
}
