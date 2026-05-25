import { Hono } from 'hono'
import { v4 as uuid } from 'uuid'
import type { Env } from '../index'
import { requireRole } from '../middleware/auth'
import { now } from '../lib/utils'

const router = new Hono<{ Bindings: Env }>()

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

router.get('/', async (c) => {
  const { active, limit = '100' } = c.req.query()
  let q = 'SELECT * FROM services WHERE 1=1'
  const params: unknown[] = []
  if (active !== undefined) { q += ' AND is_active = ?'; params.push(active === 'true' ? 1 : 0) }
  q += ' ORDER BY sort_order ASC, created_at ASC LIMIT ?'
  params.push(parseInt(limit))
  const rows = await c.env.DB.prepare(q).bind(...params).all()
  return c.json({ data: (rows.results || []).map(mapService) })
})

router.get('/:id', async (c) => {
  const row = await c.env.DB.prepare('SELECT * FROM services WHERE id = ?').bind(c.req.param('id')).first()
  if (!row) return c.json({ error: 'Not found' }, 404)
  return c.json({ data: mapService(row as Record<string, unknown>) })
})

router.post('/', requireRole('super_admin', 'admin', 'editor'), async (c) => {
  const body = await c.req.json<Record<string, unknown>>()
  if (!body.title) return c.json({ error: 'title required' }, 400)
  const id = uuid()
  const slug = (body.slug as string) || slugify(body.title as string)
  await c.env.DB.prepare(
    `INSERT INTO services (id, title, slug, icon, short_description, description, image_url, image_alt, is_active, sort_order, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(id, body.title, slug, body.icon ?? null, body.short_description ?? '',
    body.description ?? '', body.image_url ?? null, body.image_alt ?? null,
    body.is_active ?? 1, body.sort_order ?? 0, now(), now()).run()
  const row = await c.env.DB.prepare('SELECT * FROM services WHERE id = ?').bind(id).first()
  return c.json({ data: mapService(row as Record<string, unknown>) }, 201)
})

router.put('/:id', requireRole('super_admin', 'admin', 'editor'), async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json<Record<string, unknown>>()
  const e = await c.env.DB.prepare('SELECT * FROM services WHERE id = ?').bind(id).first() as any
  if (!e) return c.json({ error: 'Not found' }, 404)
  await c.env.DB.prepare(
    `UPDATE services SET title=?, slug=?, icon=?, short_description=?, description=?, image_url=?, image_alt=?, is_active=?, sort_order=?, updated_at=? WHERE id=?`
  ).bind(body.title ?? e.title, body.slug ?? e.slug, body.icon ?? e.icon,
    body.short_description ?? e.short_description, body.description ?? e.description,
    body.image_url ?? e.image_url, body.image_alt ?? e.image_alt,
    body.is_active ?? e.is_active, body.sort_order ?? e.sort_order, now(), id).run()
  const row = await c.env.DB.prepare('SELECT * FROM services WHERE id = ?').bind(id).first()
  return c.json({ data: mapService(row as Record<string, unknown>) })
})

router.delete('/:id', requireRole('super_admin', 'admin'), async (c) => {
  const e = await c.env.DB.prepare('SELECT id FROM services WHERE id = ?').bind(c.req.param('id')).first()
  if (!e) return c.json({ error: 'Not found' }, 404)
  await c.env.DB.prepare('DELETE FROM services WHERE id = ?').bind(c.req.param('id')).run()
  return c.json({ success: true })
})

export function mapService(r: Record<string, unknown>) {
  return {
    id: r.id, title: r.title, slug: r.slug, icon: r.icon,
    shortDescription: r.short_description, description: r.description,
    imageUrl: r.image_url, imageAlt: r.image_alt,
    isActive: r.is_active === 1, sortOrder: r.sort_order,
    createdAt: r.created_at, updatedAt: r.updated_at,
  }
}

export default router
