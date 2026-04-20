<template>
  <section :style="sectionStyle" class="overflow-hidden">
    <div class="container-content py-16 md:py-24">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Info side -->
        <div class="space-y-6">
          <span v-if="content.badge"
            class="inline-block px-3 py-1 text-xs font-semibold rounded-full tracking-wider uppercase"
            :style="{ color: 'var(--color-primary)', border: '1px solid var(--color-primary)', backgroundColor: 'color-mix(in srgb, var(--color-primary) 12%, transparent)' }"
          >{{ content.badge }}</span>
          <h2 class="heading-lg" :class="isDark ? 'text-white' : 'text-gray-900 dark:text-white'">{{ content.title }}</h2>
          <p v-if="content.description" class="leading-relaxed" :class="isDark ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'">{{ content.description }}</p>
          <div class="space-y-4">
            <a v-if="content.email" :href="`mailto:${content.email}`"
              class="flex items-center gap-3 transition-colors"
              :class="isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 dark:text-gray-400 hover:text-brand-600'"
            >
              <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                :style="{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 15%, transparent)' }">
                <svg class="w-5 h-5" :style="{ color: 'var(--color-primary)' }" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <span>{{ content.email }}</span>
            </a>
            <div v-if="content.phone" class="flex items-center gap-3"
              :class="isDark ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'"
            >
              <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                :style="{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 15%, transparent)' }">
                <svg class="w-5 h-5" :style="{ color: 'var(--color-primary)' }" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              </div>
              <span>{{ content.phone }}</span>
            </div>
            <div v-if="content.address" class="flex items-start gap-3"
              :class="isDark ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'"
            >
              <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                :style="{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 15%, transparent)' }">
                <svg class="w-5 h-5" :style="{ color: 'var(--color-primary)' }" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <span class="whitespace-pre-line">{{ content.address }}</span>
            </div>
          </div>
        </div>
        <!-- Form side -->
        <div v-if="content.showForm !== false"
          class="rounded-2xl border p-6"
          :class="isDark ? 'border-white/10 bg-white/5' : 'bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'"
        >
          <h3 class="font-semibold mb-5" :class="isDark ? 'text-white' : 'text-gray-900 dark:text-white'">{{ content.formTitle ?? 'Send us a message' }}</h3>
          <form @submit.prevent="submitForm" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-sm font-medium mb-1 block" :class="isDark ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'">First Name</label>
                <input v-model="form.name" class="w-full px-4 py-2.5 rounded-xl border text-sm"
                  :class="isDark ? 'border-white/20 bg-white/10 text-white placeholder-gray-500' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900'" required />
              </div>
              <div>
                <label class="text-sm font-medium mb-1 block" :class="isDark ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'">Last Name</label>
                <input v-model="form.lastName" class="w-full px-4 py-2.5 rounded-xl border text-sm"
                  :class="isDark ? 'border-white/20 bg-white/10 text-white placeholder-gray-500' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900'" />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-sm font-medium mb-1 block" :class="isDark ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'">Organization</label>
                <input v-model="form.org" class="w-full px-4 py-2.5 rounded-xl border text-sm"
                  :class="isDark ? 'border-white/20 bg-white/10 text-white placeholder-gray-500' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900'" placeholder="Company / Institution" />
              </div>
              <div>
                <label class="text-sm font-medium mb-1 block" :class="isDark ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'">Role</label>
                <input v-model="form.role" class="w-full px-4 py-2.5 rounded-xl border text-sm"
                  :class="isDark ? 'border-white/20 bg-white/10 text-white placeholder-gray-500' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900'" placeholder="Your Role" />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-sm font-medium mb-1 block" :class="isDark ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'">Email</label>
                <input v-model="form.email" type="email" class="w-full px-4 py-2.5 rounded-xl border text-sm"
                  :class="isDark ? 'border-white/20 bg-white/10 text-white placeholder-gray-500' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900'" required />
              </div>
              <div>
                <label class="text-sm font-medium mb-1 block" :class="isDark ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'">Phone</label>
                <input v-model="form.phone" class="w-full px-4 py-2.5 rounded-xl border text-sm"
                  :class="isDark ? 'border-white/20 bg-white/10 text-white placeholder-gray-500' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900'" placeholder="+1 234 567 8900" />
              </div>
            </div>
            <div>
              <label class="text-sm font-medium mb-1 block" :class="isDark ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'">Message</label>
              <textarea v-model="form.message" rows="4" class="w-full px-4 py-2.5 rounded-xl border text-sm resize-none"
                :class="isDark ? 'border-white/20 bg-white/10 text-white placeholder-gray-500' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900'"
                placeholder="Tell us about your requirements..." required />
            </div>
            <button type="submit" class="w-full py-3 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2" :disabled="submitted"
              :style="{ backgroundColor: 'var(--color-primary)', color: '#000' }"
            >
              {{ submitted ? 'Message Sent! ✓' : (content.formButtonText ?? 'Submit Inquiry →') }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ContactSectionContent, BlockStyles } from '@shared/types'
const props = defineProps<{ content: ContactSectionContent; styles?: BlockStyles }>()
const isDark = computed(() => {
  const bg = props.styles?.backgroundColor
  if (!bg || !bg.startsWith('#') || bg.length < 7) return false
  const r = parseInt(bg.slice(1, 3), 16); const g = parseInt(bg.slice(3, 5), 16); const b = parseInt(bg.slice(5, 7), 16)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5
})
const sectionStyle = computed(() => ({
  backgroundColor: props.styles?.backgroundColor || undefined,
  paddingTop: props.styles?.paddingTop || undefined,
  paddingBottom: props.styles?.paddingBottom || undefined,
}))
const submitted = ref(false)
const form = ref({ name: '', lastName: '', email: '', org: '', role: '', phone: '', message: '' })
function submitForm() { submitted.value = true; setTimeout(() => submitted.value = false, 5000) }
</script>
