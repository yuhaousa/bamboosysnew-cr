<template>
  <section :style="sectionStyle" class="section-padding">
    <div class="container-content">
      <div class="text-center max-w-2xl mx-auto mb-12">
        <span v-if="content.badge" class="badge-section">{{ content.badge }}</span>
        <h2 class="heading-lg" :class="isDark ? 'text-white' : 'text-gray-900 dark:text-white'">{{ content.title }}</h2>
        <p v-if="content.description" class="mt-4" :class="isDark ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'">{{ content.description }}</p>
      </div>
      <div :style="{ display: 'grid', gridTemplateColumns: `repeat(${content.columns ?? 4}, minmax(0,1fr))`, gap: '1.5rem' }">
        <div v-for="m in displayMembers" :key="m.id" class="text-center group">
          <div class="w-24 h-24 rounded-2xl overflow-hidden mx-auto mb-4 bg-brand-100 dark:bg-brand-950/50">
            <img v-if="m.imageUrl" :src="m.imageUrl" :alt="m.imageAlt || m.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            <div v-else class="w-full h-full flex items-center justify-center text-brand-600 dark:text-brand-400 font-bold text-3xl">{{ m.name?.charAt(0) }}</div>
          </div>
          <h3 class="font-semibold" :class="isDark ? 'text-white' : 'text-gray-900 dark:text-white'">{{ m.name }}</h3>
          <p class="text-sm text-brand-600 dark:text-brand-400 font-medium">{{ m.role }}</p>
          <p v-if="m.bio" class="mt-2 text-xs leading-relaxed" :class="isDark ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'">{{ m.bio }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useBlockVariant } from '@/composables/useBlockVariant'
import { fetchTeam } from '@/lib/api'
import type { TeamSectionContent, BlockStyles, DbTeamMember } from '@shared/types'
const props = defineProps<{ content: TeamSectionContent; styles?: BlockStyles }>()
const { sectionStyle, isDark } = useBlockVariant(() => props.styles)
const dbMembers = ref<DbTeamMember[]>([])
async function load() {
  if (!props.content.selectedIds?.length) return
  dbMembers.value = await fetchTeam(props.content.selectedIds)
}
onMounted(load)
watch(() => props.content.selectedIds, load, { deep: true })
const displayMembers = computed(() => {
  if (props.content.selectedIds?.length) return dbMembers.value
  return props.content.members.map(m => ({
    id: m.id, name: m.name, role: m.role, bio: m.bio,
    imageUrl: m.image?.url ?? null, imageAlt: m.image?.alt ?? null,
    email: null, linkedin: null, twitter: null,
    isActive: true, sortOrder: 0, createdAt: '',
  } as DbTeamMember))
})
</script>
