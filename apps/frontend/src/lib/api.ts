import type { DbCourse, DbTestimonial, DbTeamMember, DbService, DbFAQ, DbPortfolioItem } from '@shared/types'

const API_URL = import.meta.env.VITE_API_URL ?? ''

export async function apiFetch<T = unknown>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  const json = await res.json()
  return json
}

export async function fetchCourses(ids?: string[]): Promise<DbCourse[]> {
  const qs = ids?.length ? `?ids=${ids.join(',')}` : ''
  const res = await apiFetch<{ data: DbCourse[] }>(`/api/public/courses${qs}`)
  return res.data
}

export async function fetchCourse(slug: string): Promise<DbCourse> {
  const res = await apiFetch<{ data: DbCourse }>(`/api/public/courses/${slug}`)
  return res.data
}

export async function fetchTestimonials(ids?: string[]): Promise<DbTestimonial[]> {
  const qs = ids?.length ? `?ids=${ids.join(',')}` : ''
  const res = await apiFetch<{ data: DbTestimonial[] }>(`/api/public/testimonials${qs}`)
  return res.data
}

export async function fetchTeam(ids?: string[]): Promise<DbTeamMember[]> {
  const qs = ids?.length ? `?ids=${ids.join(',')}` : ''
  const res = await apiFetch<{ data: DbTeamMember[] }>(`/api/public/team${qs}`)
  return res.data
}

export async function fetchServices(ids?: string[]): Promise<DbService[]> {
  const qs = ids?.length ? `?ids=${ids.join(',')}` : ''
  const res = await apiFetch<{ data: DbService[] }>(`/api/public/services${qs}`)
  return res.data
}

export async function fetchFAQs(ids?: string[]): Promise<DbFAQ[]> {
  const qs = ids?.length ? `?ids=${ids.join(',')}` : ''
  const res = await apiFetch<{ data: DbFAQ[] }>(`/api/public/faqs${qs}`)
  return res.data
}

export async function fetchPortfolio(ids?: string[], category?: string): Promise<DbPortfolioItem[]> {
  const params = new URLSearchParams()
  if (ids?.length) params.set('ids', ids.join(','))
  if (category) params.set('category', category)
  const qs = params.toString() ? `?${params}` : ''
  const res = await apiFetch<{ data: DbPortfolioItem[] }>(`/api/public/portfolio${qs}`)
  return res.data
}

export async function fetchPortfolioItem(slug: string): Promise<DbPortfolioItem> {
  const res = await apiFetch<{ data: DbPortfolioItem }>(`/api/public/portfolio/${slug}`)
  return res.data
}
