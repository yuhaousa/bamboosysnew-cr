import { Hono } from 'hono'
import { v4 as uuid } from 'uuid'
import type { Env } from '../index'
import { requireRole } from '../middleware/auth'
import { now } from '../lib/utils'

const router = new Hono<{ Bindings: Env }>()

router.get('/', async (c) => {
  const { active, type, limit = '200' } = c.req.query()
  let q = 'SELECT * FROM partners WHERE 1=1'
  const params: unknown[] = []
  if (active !== undefined) { q += ' AND is_active = ?'; params.push(active === 'true' ? 1 : 0) }
  if (type) { q += ' AND partner_type = ?'; params.push(type) }
  q += ' ORDER BY sort_order ASC, created_at ASC LIMIT ?'
  params.push(parseInt(limit))
  const rows = await c.env.DB.prepare(q).bind(...params).all()
  return c.json({ data: (rows.results || []).map(mapPartner) })
})

router.get('/:id', async (c) => {
  const row = await c.env.DB.prepare('SELECT * FROM partners WHERE id = ?').bind(c.req.param('id')).first()
  if (!row) return c.json({ error: 'Not found' }, 404)
  return c.json({ data: mapPartner(row as Record<string, unknown>) })
})

router.post('/', requireRole('super_admin', 'admin', 'editor'), async (c) => {
  const body = await c.req.json<Record<string, unknown>>()
  if (!body.name || !body.partner_type) return c.json({ error: 'name and partner_type required' }, 400)
  const id = uuid()
  await c.env.DB.prepare(
    `INSERT INTO partners (id, name, image_url, partner_type, is_active, sort_order, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).bind(id, body.name, body.image_url ?? null, body.partner_type,
    body.is_active ?? 1, body.sort_order ?? 0, now()).run()
  const row = await c.env.DB.prepare('SELECT * FROM partners WHERE id = ?').bind(id).first()
  return c.json({ data: mapPartner(row as Record<string, unknown>) }, 201)
})

router.put('/:id', requireRole('super_admin', 'admin', 'editor'), async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json<Record<string, unknown>>()
  const e = await c.env.DB.prepare('SELECT * FROM partners WHERE id = ?').bind(id).first() as any
  if (!e) return c.json({ error: 'Not found' }, 404)
  await c.env.DB.prepare(
    `UPDATE partners SET name=?, image_url=?, partner_type=?, is_active=?, sort_order=? WHERE id=?`
  ).bind(body.name ?? e.name, body.image_url ?? e.image_url, body.partner_type ?? e.partner_type,
    body.is_active ?? e.is_active, body.sort_order ?? e.sort_order, id).run()
  const row = await c.env.DB.prepare('SELECT * FROM partners WHERE id = ?').bind(id).first()
  return c.json({ data: mapPartner(row as Record<string, unknown>) })
})

router.delete('/:id', requireRole('super_admin', 'admin'), async (c) => {
  const e = await c.env.DB.prepare('SELECT id FROM partners WHERE id = ?').bind(c.req.param('id')).first()
  if (!e) return c.json({ error: 'Not found' }, 404)
  await c.env.DB.prepare('DELETE FROM partners WHERE id = ?').bind(c.req.param('id')).run()
  return c.json({ success: true })
})

export function mapPartner(r: Record<string, unknown>) {
  return {
    id: r.id,
    name: r.name,
    imageUrl: r.image_url,
    partnerType: r.partner_type,
    isActive: r.is_active === 1,
    sortOrder: r.sort_order,
    createdAt: r.created_at,
  }
}

export default router
