import { Hono } from 'hono'
import { v4 as uuid } from 'uuid'
import type { Env } from '../index'
import { requireRole } from '../middleware/auth'
import { now } from '../lib/utils'

const router = new Hono<{ Bindings: Env }>()

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function normalizeCourseLevel(level: unknown) {
  const value = typeof level === 'string' ? level.trim().toLowerCase() : ''
  return ['beginner', 'intermediate', 'advanced'].includes(value) ? value : ''
}

// GET /api/courses
router.get('/', async (c) => {
  const { search, active, page = '1', limit = '50' } = c.req.query()
  const offset = (parseInt(page) - 1) * parseInt(limit)
  let q = 'SELECT * FROM courses WHERE 1=1'
  const params: unknown[] = []
  if (active !== undefined) { q += ' AND is_active = ?'; params.push(active === 'true' ? 1 : 0) }
  if (search) { q += ' AND (title LIKE ? OR short_description LIKE ?)'; params.push(`%${search}%`, `%${search}%`) }
  q += ' ORDER BY sort_order ASC, created_at DESC LIMIT ? OFFSET ?'
  params.push(parseInt(limit), offset)
  const rows = await c.env.DB.prepare(q).bind(...params).all()
  return c.json({ data: (rows.results || []).map(mapCourse) })
})

// GET /api/courses/:id
router.get('/:id', async (c) => {
  const row = await c.env.DB.prepare('SELECT * FROM courses WHERE id = ?').bind(c.req.param('id')).first()
  if (!row) return c.json({ error: 'Not found' }, 404)
  return c.json({ data: mapCourse(row as Record<string, unknown>) })
})

// POST /api/courses
router.post('/', requireRole('super_admin', 'admin', 'editor'), async (c) => {
  const body = await c.req.json<Record<string, unknown>>()
  if (!body.title) return c.json({ error: 'title required' }, 400)
  const id = uuid()
  const slug = (body.slug as string) || slugify(body.title as string)
  await c.env.DB.prepare(
    `INSERT INTO courses (id, title, slug, short_description, description, image_url, image_alt, level, duration, price, category, is_active, sort_order, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(id, body.title, slug, body.short_description ?? '', body.description ?? '',
    body.image_url ?? null, body.image_alt ?? null, normalizeCourseLevel(body.level), body.duration ?? null,
    body.price ?? null, body.category ?? null, body.is_active ?? 1, body.sort_order ?? 0,
    now(), now()).run()
  const row = await c.env.DB.prepare('SELECT * FROM courses WHERE id = ?').bind(id).first()
  return c.json({ data: mapCourse(row as Record<string, unknown>) }, 201)
})

// PUT /api/courses/:id
router.put('/:id', requireRole('super_admin', 'admin', 'editor'), async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json<Record<string, unknown>>()
  const existing = await c.env.DB.prepare('SELECT * FROM courses WHERE id = ?').bind(id).first()
  if (!existing) return c.json({ error: 'Not found' }, 404)
  await c.env.DB.prepare(
    `UPDATE courses SET title=?, slug=?, short_description=?, description=?, image_url=?, image_alt=?,
     level=?, duration=?, price=?, category=?, is_active=?, sort_order=?, updated_at=? WHERE id=?`
  ).bind(body.title ?? (existing as any).title, body.slug ?? (existing as any).slug,
    body.short_description ?? (existing as any).short_description,
    body.description ?? (existing as any).description,
    body.image_url ?? (existing as any).image_url,
    body.image_alt ?? (existing as any).image_alt,
    body.level !== undefined ? normalizeCourseLevel(body.level) : (existing as any).level,
    body.duration ?? (existing as any).duration,
    body.price ?? (existing as any).price, body.category ?? (existing as any).category,
    body.is_active ?? (existing as any).is_active, body.sort_order ?? (existing as any).sort_order,
    now(), id).run()
  const row = await c.env.DB.prepare('SELECT * FROM courses WHERE id = ?').bind(id).first()
  return c.json({ data: mapCourse(row as Record<string, unknown>) })
})

// DELETE /api/courses/:id
router.delete('/:id', requireRole('super_admin', 'admin'), async (c) => {
  const id = c.req.param('id')
  const existing = await c.env.DB.prepare('SELECT id FROM courses WHERE id = ?').bind(id).first()
  if (!existing) return c.json({ error: 'Not found' }, 404)
  await c.env.DB.prepare('DELETE FROM courses WHERE id = ?').bind(id).run()
  return c.json({ success: true })
})

function mapCourse(r: Record<string, unknown>) {
  return {
    id: r.id, title: r.title, slug: r.slug,
    shortDescription: r.short_description, description: r.description,
    imageUrl: r.image_url, imageAlt: r.image_alt,
    level: r.level, duration: r.duration, price: r.price, category: r.category,
    isActive: r.is_active === 1, sortOrder: r.sort_order,
    createdAt: r.created_at, updatedAt: r.updated_at,
  }
}

export default router
export { mapCourse }
