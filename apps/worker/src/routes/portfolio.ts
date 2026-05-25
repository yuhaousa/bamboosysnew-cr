import { Hono } from 'hono'
import { v4 as uuid } from 'uuid'
import type { Env } from '../index'
import { requireRole } from '../middleware/auth'
import { now } from '../lib/utils'

const router = new Hono<{ Bindings: Env }>()

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

// GET /api/portfolio
router.get('/', async (c) => {
  const { search, category, featured, page = '1', limit = '50' } = c.req.query()
  const offset = (parseInt(page) - 1) * parseInt(limit)
  let q = 'SELECT * FROM portfolio_items WHERE 1=1'
  const params: unknown[] = []
  if (category) { q += ' AND category = ?'; params.push(category) }
  if (featured !== undefined) { q += ' AND is_featured = ?'; params.push(featured === 'true' ? 1 : 0) }
  if (search) { q += ' AND (title LIKE ? OR client_name LIKE ? OR short_description LIKE ?)'; params.push(`%${search}%`, `%${search}%`, `%${search}%`) }
  q += ' ORDER BY sort_order ASC, created_at DESC LIMIT ? OFFSET ?'
  params.push(parseInt(limit), offset)
  const rows = await c.env.DB.prepare(q).bind(...params).all()
  return c.json({ data: (rows.results || []).map(mapPortfolioItem) })
})

// GET /api/portfolio/:id
router.get('/:id', async (c) => {
  const row = await c.env.DB.prepare('SELECT * FROM portfolio_items WHERE id = ?').bind(c.req.param('id')).first()
  if (!row) return c.json({ error: 'Not found' }, 404)
  return c.json({ data: mapPortfolioItem(row as Record<string, unknown>) })
})

// POST /api/portfolio
router.post('/', requireRole('super_admin', 'admin', 'editor'), async (c) => {
  const body = await c.req.json<Record<string, unknown>>()
  if (!body.title) return c.json({ error: 'title required' }, 400)
  const id = uuid()
  const slug = (body.slug as string) || slugify(body.title as string)
  await c.env.DB.prepare(
    `INSERT INTO portfolio_items (id, title, slug, client_name, category, short_description, description, image_url, image_alt, logo_url, project_url, tags, is_active, is_featured, sort_order, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    id, body.title, slug,
    body.client_name ?? null, body.category ?? null,
    body.short_description ?? '', body.description ?? '',
    body.image_url ?? null, body.image_alt ?? null,
    body.logo_url ?? null, body.project_url ?? null,
    body.tags ?? '',
    body.is_active !== undefined ? (body.is_active ? 1 : 0) : 1,
    body.is_featured ? 1 : 0,
    body.sort_order ?? 0,
    now(), now()
  ).run()
  const row = await c.env.DB.prepare('SELECT * FROM portfolio_items WHERE id = ?').bind(id).first()
  return c.json({ data: mapPortfolioItem(row as Record<string, unknown>) }, 201)
})

// PUT /api/portfolio/:id
router.put('/:id', requireRole('super_admin', 'admin', 'editor'), async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json<Record<string, unknown>>()
  const e = await c.env.DB.prepare('SELECT * FROM portfolio_items WHERE id = ?').bind(id).first() as any
  if (!e) return c.json({ error: 'Not found' }, 404)
  await c.env.DB.prepare(
    `UPDATE portfolio_items SET title=?, slug=?, client_name=?, category=?, short_description=?, description=?,
     image_url=?, image_alt=?, logo_url=?, project_url=?, tags=?, is_active=?, is_featured=?, sort_order=?, updated_at=? WHERE id=?`
  ).bind(
    body.title ?? e.title,
    body.slug ?? e.slug,
    body.client_name !== undefined ? body.client_name : e.client_name,
    body.category !== undefined ? body.category : e.category,
    body.short_description ?? e.short_description,
    body.description ?? e.description,
    body.image_url !== undefined ? body.image_url : e.image_url,
    body.image_alt !== undefined ? body.image_alt : e.image_alt,
    body.logo_url !== undefined ? body.logo_url : e.logo_url,
    body.project_url !== undefined ? body.project_url : e.project_url,
    body.tags !== undefined ? body.tags : e.tags,
    body.is_active !== undefined ? (body.is_active ? 1 : 0) : e.is_active,
    body.is_featured !== undefined ? (body.is_featured ? 1 : 0) : e.is_featured,
    body.sort_order !== undefined ? body.sort_order : e.sort_order,
    now(), id
  ).run()
  const row = await c.env.DB.prepare('SELECT * FROM portfolio_items WHERE id = ?').bind(id).first()
  return c.json({ data: mapPortfolioItem(row as Record<string, unknown>) })
})

// DELETE /api/portfolio/:id
router.delete('/:id', requireRole('super_admin', 'admin'), async (c) => {
  const id = c.req.param('id')
  const e = await c.env.DB.prepare('SELECT id FROM portfolio_items WHERE id = ?').bind(id).first()
  if (!e) return c.json({ error: 'Not found' }, 404)
  await c.env.DB.prepare('DELETE FROM portfolio_items WHERE id = ?').bind(id).run()
  return c.json({ success: true })
})

export function mapPortfolioItem(r: Record<string, unknown>) {
  return {
    id: r.id,
    title: r.title,
    slug: r.slug,
    clientName: r.client_name,
    category: r.category,
    shortDescription: r.short_description,
    description: r.description,
    imageUrl: r.image_url,
    imageAlt: r.image_alt,
    logoUrl: r.logo_url,
    projectUrl: r.project_url,
    tags: r.tags ? String(r.tags).split(',').map(t => t.trim()).filter(Boolean) : [],
    isActive: r.is_active === 1,
    isFeatured: r.is_featured === 1,
    sortOrder: r.sort_order,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }
}

export default router
