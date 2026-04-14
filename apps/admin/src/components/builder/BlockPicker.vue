<template>
  <AppModal v-model="open" title="Add Block" size="2xl" body-class="p-6">
    <!-- Category filter -->
    <div class="flex gap-2 flex-wrap mb-4">
      <button
        v-for="cat in allCategories"
        :key="cat.id"
        @click="activeCategory = activeCategory === cat.id ? null : cat.id"
        class="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
        :class="activeCategory === cat.id
          ? 'bg-brand-600 text-white'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'"
      >
        {{ cat.label }}
      </button>
    </div>

    <!-- Search -->
    <div class="relative mb-5">
      <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        v-model="search"
        type="text"
        placeholder="Search blocks..."
        class="form-input pl-9"
      />
    </div>

    <!-- Block grid -->
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
      <button
        v-for="block in filteredBlocks"
        :key="block.type"
        @click="select(block.type)"
        class="flex flex-col items-start gap-2 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-brand-400 dark:hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-all text-left group"
      >
        <div class="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 group-hover:bg-brand-100 dark:group-hover:bg-brand-900/40 flex items-center justify-center transition-colors">
          <component :is="getIcon(block.icon)" class="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-brand-600 dark:group-hover:text-brand-400" />
        </div>
        <div>
          <p class="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-tight">{{ block.label }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-tight">{{ block.description }}</p>
        </div>
      </button>
    </div>

    <p v-if="filteredBlocks.length === 0" class="text-center text-gray-400 py-8">No blocks match your search.</p>
  </AppModal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, LayoutTemplate, PanelLeft, PanelRight, AlignCenter, LayoutGrid, Briefcase, GraduationCap, Info, Images, PlayCircle, Quote, HelpCircle, Megaphone, BarChart2, Users, CreditCard, Mail, MapPin, Send, Type, Code } from 'lucide-vue-next'
import AppModal from '@/components/common/AppModal.vue'
import { BLOCK_TYPES, BLOCK_CATEGORIES } from '@shared/constants/blockTypes'
import type { BlockType } from '@shared/types'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{
  'update:modelValue': [boolean]
  select: [BlockType]
}>()

const open = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const search = ref('')
const activeCategory = ref<string | null>(null)

const allCategories = [{ id: 'all', label: 'All' }, ...BLOCK_CATEGORIES]

const iconMap: Record<string, unknown> = {
  'layout-template': LayoutTemplate,
  'panel-left': PanelLeft,
  'panel-right': PanelRight,
  'align-center': AlignCenter,
  'layout-grid': LayoutGrid,
  'briefcase': Briefcase,
  'graduation-cap': GraduationCap,
  'info': Info,
  'images': Images,
  'play-circle': PlayCircle,
  'quote': Quote,
  'help-circle': HelpCircle,
  'megaphone': Megaphone,
  'bar-chart-2': BarChart2,
  'users': Users,
  'credit-card': CreditCard,
  'mail': Mail,
  'map-pin': MapPin,
  'send': Send,
  'type': Type,
  'code': Code,
}

function getIcon(name: string) {
  return iconMap[name] ?? LayoutTemplate
}

const filteredBlocks = computed(() => {
  return BLOCK_TYPES.filter(b => {
    const matchSearch = !search.value || b.label.toLowerCase().includes(search.value.toLowerCase()) || b.description.toLowerCase().includes(search.value.toLowerCase())
    const matchCat = !activeCategory.value || activeCategory.value === 'all' || b.category === activeCategory.value
    return matchSearch && matchCat
  })
})

function select(type: BlockType) {
  emit('select', type)
  emit('update:modelValue', false)
  search.value = ''
  activeCategory.value = null
}
</script>
