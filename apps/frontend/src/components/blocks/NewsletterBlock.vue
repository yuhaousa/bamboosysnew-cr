<template>
  <section :style="sectionStyle" class="section-padding">
    <div class="container-content max-w-2xl mx-auto text-center space-y-6">
      <span v-if="content.badge" class="badge-section">{{ content.badge }}</span>
      <h2 class="heading-lg text-gray-900 dark:text-white">{{ content.title }}</h2>
      <p v-if="content.description" class="text-gray-600 dark:text-gray-400">{{ content.description }}</p>
      <form @submit.prevent="submit" class="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <input v-model="email" type="email" required :placeholder="content.placeholder ?? 'Enter your email'" class="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm" :disabled="submitted" />
        <button type="submit" class="btn-hero-primary flex-shrink-0" :disabled="submitted">
          {{ submitted ? 'Subscribed!' : (content.buttonText ?? 'Subscribe') }}
        </button>
      </form>
      <p v-if="content.privacyNote" class="text-xs text-gray-400">{{ content.privacyNote }}</p>
    </div>
  </section>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import type { NewsletterSectionContent, BlockStyles } from '@shared/types'
const props = defineProps<{ content: NewsletterSectionContent; styles?: BlockStyles }>()
const sectionStyle = computed(() => ({ backgroundColor: props.styles?.backgroundColor ?? undefined }))
const email = ref('')
const submitted = ref(false)
function submit() { submitted.value = true; setTimeout(() => { submitted.value = false; email.value = '' }, 5000) }
</script>
