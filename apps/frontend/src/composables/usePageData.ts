import { ref } from 'vue'
import { apiFetch } from '@/lib/api'
import type { Page, Block } from '@shared/types'

interface PublicPageResponse {
  data: { id: string; title: string; slug: string; seo: Page['seo']; publishedAt?: string; blocks: Block[] }
}

export function usePageData() {
  const page = ref<Page | null>(null)
  const blocks = ref<Block[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function loadBySlug(slug: string) {
    isLoading.value = true; error.value = null
    try {
      const res = await apiFetch<PublicPageResponse>(`/api/public/pages/${slug}`)
      const d = res.data
      page.value = d as unknown as Page
      blocks.value = d.blocks ?? []
      if (d.seo?.metaTitle) document.title = d.seo.metaTitle
      if (d.seo?.metaDescription) setMeta('description', d.seo.metaDescription)
    } catch (e: any) {
      error.value = e.message ?? 'Page not found'
    } finally {
      isLoading.value = false
    }
  }

  async function loadPreview(pageId: string) {
    isLoading.value = true; error.value = null
    try {
      const res = await apiFetch<PublicPageResponse>(`/api/public/preview/${pageId}?token=preview`)
      const d = res.data
      page.value = d as unknown as Page
      blocks.value = d.blocks ?? []
    } catch (e: any) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  function setMeta(name: string, content: string) {
    let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)
    if (!el) { el = document.createElement('meta'); el.name = name; document.head.appendChild(el) }
    el.content = content
  }

  return { page, blocks, isLoading, error, loadBySlug, loadPreview }
}
