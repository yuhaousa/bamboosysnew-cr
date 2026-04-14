import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/lib/api'
import type { MediaItem, ApiResponse } from '@shared/types'

export const useMediaStore = defineStore('media', () => {
  const items = ref<MediaItem[]>([])
  const total = ref(0)
  const loading = ref(false)
  const uploading = ref(false)

  async function fetchMedia(params: { search?: string; page?: number } = {}) {
    loading.value = true
    try {
      const query = new URLSearchParams()
      if (params.search) query.set('search', params.search)
      if (params.page) query.set('page', String(params.page))
      const res = await api.get<{ data: MediaItem[]; total: number }>(`/media?${query}`)
      items.value = res.data
      total.value = res.total
    } finally {
      loading.value = false
    }
  }

  async function uploadMedia(file: File, alt?: string): Promise<MediaItem> {
    uploading.value = true
    try {
      const fd = new FormData()
      fd.append('file', file)
      if (alt) fd.append('alt', alt)
      const res = await api.upload('/media/upload', fd) as ApiResponse<MediaItem>
      items.value.unshift(res.data)
      total.value++
      return res.data
    } finally {
      uploading.value = false
    }
  }

  async function updateAlt(id: string, alt: string) {
    await api.patch(`/media/${id}`, { alt })
    const item = items.value.find(i => i.id === id)
    if (item) item.alt = alt
  }

  async function deleteMedia(id: string) {
    await api.delete(`/media/${id}`)
    items.value = items.value.filter(i => i.id !== id)
    total.value--
  }

  return { items, total, loading, uploading, fetchMedia, uploadMedia, updateAlt, deleteMedia }
})
