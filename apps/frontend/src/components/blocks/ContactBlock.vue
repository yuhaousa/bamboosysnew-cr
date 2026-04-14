<template>
  <section :style="sectionStyle" class="section-padding">
    <div class="container-content">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Info side -->
        <div class="space-y-6">
          <span v-if="content.badge" class="badge-section">{{ content.badge }}</span>
          <h2 class="heading-lg text-gray-900 dark:text-white">{{ content.title }}</h2>
          <p v-if="content.description" class="text-gray-600 dark:text-gray-400">{{ content.description }}</p>
          <div class="space-y-4">
            <a v-if="content.email" :href="`mailto:${content.email}`" class="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              <div class="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-950/50 flex items-center justify-center">
                <svg class="w-5 h-5 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <span>{{ content.email }}</span>
            </a>
            <div v-if="content.phone" class="flex items-center gap-3 text-gray-600 dark:text-gray-400">
              <div class="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-950/50 flex items-center justify-center">
                <svg class="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              </div>
              <span>{{ content.phone }}</span>
            </div>
            <div v-if="content.address" class="flex items-start gap-3 text-gray-600 dark:text-gray-400">
              <div class="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/50 flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <span class="whitespace-pre-line">{{ content.address }}</span>
            </div>
          </div>
        </div>
        <!-- Form side -->
        <div v-if="content.showForm" class="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-5">{{ content.formTitle ?? 'Send us a message' }}</h3>
          <form @submit.prevent="submitForm" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div><label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Name</label><input v-model="form.name" class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm" required /></div>
              <div><label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Email</label><input v-model="form.email" type="email" class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm" required /></div>
            </div>
            <div><label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Subject</label><input v-model="form.subject" class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm" /></div>
            <div><label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Message</label><textarea v-model="form.message" rows="4" class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm resize-none" required /></div>
            <button type="submit" class="btn-hero-primary w-full justify-center" :disabled="submitted">
              {{ submitted ? 'Message Sent!' : 'Send Message' }}
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
const sectionStyle = computed(() => ({ backgroundColor: props.styles?.backgroundColor ?? undefined }))
const submitted = ref(false)
const form = ref({ name: '', email: '', subject: '', message: '' })
function submitForm() { submitted.value = true; setTimeout(() => submitted.value = false, 5000) }
</script>
