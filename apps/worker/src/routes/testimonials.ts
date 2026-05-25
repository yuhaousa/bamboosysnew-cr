import { Hono } from 'hono'
import { v4 as uuid } from 'uuid'
import type { Env } from '../index'
import { requireRole } from '../middleware/auth'
import { now } from '../lib/utils'

const router = new Hono<{ Bindings: Env }>()

router.get('/', async (c) => {
  const { active, page = '1', limit = '100' } = c.req.query()
  const offset = (parseInt(page) - 1) * parseInt(limit)
  let q = 'SELECT * FROM testimonials WHERE 1=1'
  const params: unknown[] = []
  if (active !== undefined) { q += ' AND is_active = ?'; params.push(active === 'true' ? 1 : 0) }
  q += ' ORDER BY sort_order ASC, created_at DESC LIMIT ? OFFSET ?'
  params.push(parseInt(limit), offset)
  const rows = await c.env.DB.prepare(q).bind(...params).all()
  return c.json({ data: (rows.results || []).map(mapTestimonial) })
})

router.get('/:id', async (c) => {
  const row = await c.env.DB.prepare('SELECT * FROM testimonials WHERE id = ?').bind(c.req.param('id')).first()
  if (!row) return c.json({ error: 'Not found' }, 404)
  return c.json({ data: mapTestimonial(row as Record<string, unknown>) })
})

router.post('/', requireRole('super_admin', 'admin', 'editor'), async (c) => {
  const body = await c.req.json<Record<string, unknown>>()
  if (!body.author_name || !body.quote) return c.json({ error: 'author_name and quote required' }, 400)
  const id = uuid()
  await c.env.DB.prepare(
    `INSERT INTO testimonials (id, author_name, author_role, author_company, avatar_url, quote, rating, is_active, sort_order, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(id, body.author_name, body.author_role ?? null, body.author_company ?? null,
    body.avatar_url ?? null, body.quote, body.rating ?? 5, body.is_active ?? 1,
    body.sort_order ?? 0, now()).run()
  const row = await c.env.DB.prepare('SELECT * FROM testimonials WHERE id = ?').bind(id).first()
  return c.json({ data: mapTestimonial(row as Record<string, unknown>) }, 201)
})

router.put('/:id', requireRole('super_admin', 'admin', 'editor'), async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json<Record<string, unknown>>()
  const e = await c.env.DB.prepare('SELECT * FROM testimonials WHERE id = ?').bind(id).first() as any
  if (!e) return c.json({ error: 'Not found' }, 404)
  await c.env.DB.prepare(
    `UPDATE testimonials SET author_name=?, author_role=?, author_company=?, avatar_url=?, quote=?, rating=?, is_active=?, sort_order=? WHERE id=?`
  ).bind(body.author_name ?? e.author_name, body.author_role ?? e.author_role,
    body.author_company ?? e.author_company, body.avatar_url ?? e.avatar_url,
    body.quote ?? e.quote, body.rating ?? e.rating,
    body.is_active ?? e.is_active, body.sort_order ?? e.sort_order, id).run()
  const row = await c.env.DB.prepare('SELECT * FROM testimonials WHERE id = ?').bind(id).first()
  return c.json({ data: mapTestimonial(row as Record<string, unknown>) })
})

router.delete('/:id', requireRole('super_admin', 'admin'), async (c) => {
  const e = await c.env.DB.prepare('SELECT id FROM testimonials WHERE id = ?').bind(c.req.param('id')).first()
  if (!e) return c.json({ error: 'Not found' }, 404)
  await c.env.DB.prepare('DELETE FROM testimonials WHERE id = ?').bind(c.req.param('id')).run()
  return c.json({ success: true })
})

export function mapTestimonial(r: Record<string, unknown>) {
  return {
    id: r.id, authorName: r.author_name, authorRole: r.author_role,
    authorCompany: r.author_company, avatarUrl: r.avatar_url,
    quote: r.quote, rating: r.rating, isActive: r.is_active === 1,
    sortOrder: r.sort_order, createdAt: r.created_at,
  }
}

export default router
