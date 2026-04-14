import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/lib/api'
import type { Block, ApiResponse } from '@shared/types'

export const useBlocksStore = defineStore('blocks', () => {
  const blocks = ref<Block[]>([])
  const loading = ref(false)
  const saving = ref(false)

  async function fetchBlocks(pageId: string) {
    loading.value = true
    try {
      const res = await api.get<ApiResponse<Block[]>>(`/blocks/${pageId}`)
      blocks.value = res.data
    } finally {
      loading.value = false
    }
  }

  async function addBlock(pageId: string, data: Omit<Block, 'id' | 'pageId'>) {
    saving.value = true
    try {
      const res = await api.post<ApiResponse<Block>>(`/blocks/${pageId}`, data)
      blocks.value.push(res.data)
      return res.data
    } finally {
      saving.value = false
    }
  }

  async function updateBlock(pageId: string, blockId: string, data: Partial<Block>) {
    saving.value = true
    try {
      const res = await api.put<ApiResponse<Block>>(`/blocks/${pageId}/${blockId}`, data)
      const idx = blocks.value.findIndex(b => b.id === blockId)
      if (idx !== -1) blocks.value[idx] = res.data
      return res.data
    } finally {
      saving.value = false
    }
  }

  async function reorderBlocks(pageId: string, order: { id: string; sortOrder: number }[]) {
    // Optimistic update
    order.forEach(({ id, sortOrder }) => {
      const block = blocks.value.find(b => b.id === id)
      if (block) block.sortOrder = sortOrder
    })
    blocks.value.sort((a, b) => a.sortOrder - b.sortOrder)

    await api.put(`/blocks/${pageId}/reorder`, { order })
  }

  async function duplicateBlock(pageId: string, blockId: string) {
    const res = await api.post<ApiResponse<Block>>(`/blocks/${pageId}/${blockId}/duplicate`)
    const sourceIdx = blocks.value.findIndex(b => b.id === blockId)
    if (sourceIdx !== -1) {
      blocks.value.splice(sourceIdx + 1, 0, res.data)
      // Re-sort
      blocks.value.sort((a, b) => a.sortOrder - b.sortOrder)
    }
    return res.data
  }

  async function deleteBlock(pageId: string, blockId: string) {
    await api.delete(`/blocks/${pageId}/${blockId}`)
    blocks.value = blocks.value.filter(b => b.id !== blockId)
  }

  function clearBlocks() {
    blocks.value = []
  }

  return {
    blocks,
    loading,
    saving,
    fetchBlocks,
    addBlock,
    updateBlock,
    reorderBlocks,
    duplicateBlock,
    deleteBlock,
    clearBlocks,
  }
})
