<template>
  <section :style="sectionStyle" class="section-padding">
    <div class="container-content">
      <div v-if="content.badge || content.title || content.description" class="text-center max-w-2xl mx-auto mb-10">
        <span v-if="content.badge" class="badge-section">{{ content.badge }}</span>
        <h2 v-if="content.title" class="heading-lg" :class="isDark ? 'text-white' : 'text-gray-900 dark:text-white'">
          {{ content.title }}
        </h2>
        <p v-if="content.description" class="mt-4 text-base" :class="isDark ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'">
          {{ content.description }}
        </p>
      </div>

      <div v-if="loading" :style="gridStyle" class="grid gap-4 md:gap-6">
        <div
          v-for="i in (content.columns ?? 5)"
          :key="i"
          class="h-24 rounded-2xl animate-pulse"
          :class="isDark ? 'bg-white/5' : 'bg-gray-100 dark:bg-gray-800'"
        />
      </div>

      <div v-else :style="gridStyle" class="grid gap-4 md:gap-6">
        <div
          v-for="client in clients"
          :key="client.id"
          class="group rounded-2xl border p-5 md:p-6 flex items-center justify-center min-h-24 transition-all duration-300"
          :class="isDark ? 'border-white/10 bg-white/5 hover:bg-white/[0.08]' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:shadow-md'"
        >
          <img
            v-if="client.imageUrl"
            :src="client.imageUrl"
            :alt="client.name"
            class="max-h-12 md:max-h-14 w-auto object-contain opacity-80 group-hover:opacity-100 transition-opacity"
          />
          <div
            v-else
            class="text-sm md:text-base font-semibold text-center"
            :class="isDark ? 'text-white' : 'text-gray-900 dark:text-white'"
          >
            {{ client.name }}
          </div>
        </div>
      </div>

      <p v-if="!loading && clients.length === 0" class="text-center text-gray-400 py-12">No clients selected.</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useBlockVariant } from '@/composables/useBlockVariant'
import { fetchClients } from '@/lib/api'
import type { BlockStyles, ClientsGridContent, DbClient } from '@shared/types'

const props = defineProps<{ content: ClientsGridContent; styles?: BlockStyles }>()
const { sectionStyle, isDark } = useBlockVariant(() => props.styles)

const clients = ref<DbClient[]>([])
const loading = ref(false)

async function load() {
  loading.value = true
  try {
    clients.value = await fetchClients(props.content.selectedIds?.length ? props.content.selectedIds : undefined)
  } finally {
    loading.value = false
  }
}

onMounted(load)
watch(() => props.content.selectedIds, load, { deep: true })

const gridStyle = computed(() => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${props.content.columns ?? 5}, minmax(0, 1fr))`,
}))
</script>
