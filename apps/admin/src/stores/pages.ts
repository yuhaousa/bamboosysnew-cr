import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/lib/api'
import type { Page, PaginatedResponse, ApiResponse } from '@shared/types'

export const usePagesStore = defineStore('pages', () => {
  const pages = ref<Page[]>([])
  const total = ref(0)
  const loading = ref(false)
  const currentPage = ref<Page | null>(null)

  async function fetchPages(params: { search?: string; status?: string; page?: number; limit?: number } = {}) {
    loading.value = true
    try {
      const query = new URLSearchParams()
      if (params.search) query.set('search', params.search)
      if (params.status) query.set('status', params.status)
      if (params.page) query.set('page', String(params.page))
      if (params.limit) query.set('limit', String(params.limit))

      const res = await api.get<PaginatedResponse<Page>>(`/pages?${query}`)
      pages.value = res.data
      total.value = res.total
    } finally {
      loading.value = false
    }
  }

  async function fetchPage(id: string) {
    loading.value = true
    try {
      const res = await api.get<ApiResponse<Page>>(`/pages/${id}`)
      currentPage.value = res.data
      return res.data
    } finally {
      loading.value = false
    }
  }

  async function createPage(data: { title: string; slug: string }) {
    const res = await api.post<ApiResponse<Page>>('/pages', data)
    pages.value.unshift(res.data)
    total.value++
    return res.data
  }

  async function updatePage(id: string, data: Partial<Page>) {
    const res = await api.put<ApiResponse<Page>>(`/pages/${id}`, data)
    const idx = pages.value.findIndex(p => p.id === id)
    if (idx !== -1) pages.value[idx] = res.data
    if (currentPage.value?.id === id) currentPage.value = res.data
    return res.data
  }

  async function publishPage(id: string) {
    await api.post(`/pages/${id}/publish`)
    const idx = pages.value.findIndex(p => p.id === id)
    if (idx !== -1) pages.value[idx].status = 'published'
    if (currentPage.value?.id === id) currentPage.value.status = 'published'
  }

  async function unpublishPage(id: string) {
    await api.post(`/pages/${id}/unpublish`)
    const idx = pages.value.findIndex(p => p.id === id)
    if (idx !== -1) pages.value[idx].status = 'draft'
    if (currentPage.value?.id === id) currentPage.value.status = 'draft'
  }

  async function duplicatePage(id: string) {
    const res = await api.post<ApiResponse<Page>>(`/pages/${id}/duplicate`)
    pages.value.unshift(res.data)
    total.value++
    return res.data
  }

  async function deletePage(id: string) {
    await api.delete(`/pages/${id}`)
    pages.value = pages.value.filter(p => p.id !== id)
    total.value--
  }

  return {
    pages,
    total,
    loading,
    currentPage,
    fetchPages,
    fetchPage,
    createPage,
    updatePage,
    publishPage,
    unpublishPage,
    duplicatePage,
    deletePage,
  }
})
