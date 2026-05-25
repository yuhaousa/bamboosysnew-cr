<template>
  <section :style="sectionStyle" class="section-padding">
    <div class="container-content">
      <div class="text-center max-w-2xl mx-auto mb-12">
        <span v-if="content.badge" class="badge-section">{{ content.badge }}</span>
        <h2 v-if="content.title" class="heading-lg text-gray-900 dark:text-white">{{ content.title }}</h2>
        <p v-if="content.description" class="mt-4 text-gray-600 dark:text-gray-400">{{ content.description }}</p>
      </div>
      <div class="max-w-3xl mx-auto space-y-3">
        <div v-for="(faq, i) in displayItems" :key="faq.id" class="border rounded-2xl overflow-hidden"
          :class="isDark ? 'border-white/10' : 'border-gray-200 dark:border-gray-700'"
        >
          <button @click="open === i ? open = -1 : open = i"
            class="w-full flex items-center justify-between p-5 text-left transition-colors"
            :class="isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'"
          >
            <span class="font-medium pr-4" :class="isDark ? 'text-white' : 'text-gray-900 dark:text-white'">{{ faq.question }}</span>
            <svg :class="open === i ? 'rotate-180' : ''" class="w-5 h-5 text-gray-400 flex-shrink-0 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <Transition name="accordion">
            <div v-if="open === i" class="px-5 pb-5 text-sm leading-relaxed"
              :class="isDark ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'">{{ faq.answer }}</div>
          </Transition>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useBlockVariant } from '@/composables/useBlockVariant'
import { fetchFAQs } from '@/lib/api'
import type { FAQContent, BlockStyles, DbFAQ } from '@shared/types'
const props = defineProps<{ content: FAQContent; styles?: BlockStyles }>()
const open = ref(-1)
const { sectionStyle, isDark } = useBlockVariant(() => props.styles)
const dbItems = ref<DbFAQ[]>([])
async function load() {
  if (!props.content.selectedIds?.length) return
  dbItems.value = await fetchFAQs(props.content.selectedIds)
}
onMounted(load)
watch(() => props.content.selectedIds, load, { deep: true })
const displayItems = computed(() => {
  if (props.content.selectedIds?.length) return dbItems.value
  const list = (props.content as any).faqs ?? props.content.items ?? []
  return list.map((f: any) => ({
    id: f.id, question: f.question, answer: f.answer,
    category: null, isActive: true, sortOrder: 0, createdAt: '',
  } as DbFAQ))
})
</script>
<style scoped>
.accordion-enter-active, .accordion-leave-active { transition: all 0.25s ease; overflow: hidden; }
.accordion-enter-from, .accordion-leave-to { max-height: 0; opacity: 0; }
.accordion-enter-to, .accordion-leave-from { max-height: 300px; opacity: 1; }
</style>
