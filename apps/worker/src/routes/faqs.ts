import { Hono } from 'hono'
import { v4 as uuid } from 'uuid'
import type { Env } from '../index'
import { requireRole } from '../middleware/auth'
import { now } from '../lib/utils'

const router = new Hono<{ Bindings: Env }>()

router.get('/', async (c) => {
  const { active, category, limit = '200' } = c.req.query()
  let q = 'SELECT * FROM faqs WHERE 1=1'
  const params: unknown[] = []
  if (active !== undefined) { q += ' AND is_active = ?'; params.push(active === 'true' ? 1 : 0) }
  if (category) { q += ' AND category = ?'; params.push(category) }
  q += ' ORDER BY sort_order ASC, created_at ASC LIMIT ?'
  params.push(parseInt(limit))
  const rows = await c.env.DB.prepare(q).bind(...params).all()
  return c.json({ data: (rows.results || []).map(mapFAQ) })
})

router.get('/:id', async (c) => {
  const row = await c.env.DB.prepare('SELECT * FROM faqs WHERE id = ?').bind(c.req.param('id')).first()
  if (!row) return c.json({ error: 'Not found' }, 404)
  return c.json({ data: mapFAQ(row as Record<string, unknown>) })
})

router.post('/', requireRole('super_admin', 'admin', 'editor'), async (c) => {
  const body = await c.req.json<Record<string, unknown>>()
  if (!body.question || !body.answer) return c.json({ error: 'question and answer required' }, 400)
  const id = uuid()
  await c.env.DB.prepare(
    `INSERT INTO faqs (id, question, answer, category, is_active, sort_order, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).bind(id, body.question, body.answer, body.category ?? null,
    body.is_active ?? 1, body.sort_order ?? 0, now()).run()
  const row = await c.env.DB.prepare('SELECT * FROM faqs WHERE id = ?').bind(id).first()
  return c.json({ data: mapFAQ(row as Record<string, unknown>) }, 201)
})

router.put('/:id', requireRole('super_admin', 'admin', 'editor'), async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json<Record<string, unknown>>()
  const e = await c.env.DB.prepare('SELECT * FROM faqs WHERE id = ?').bind(id).first() as any
  if (!e) return c.json({ error: 'Not found' }, 404)
  await c.env.DB.prepare(
    `UPDATE faqs SET question=?, answer=?, category=?, is_active=?, sort_order=? WHERE id=?`
  ).bind(body.question ?? e.question, body.answer ?? e.answer,
    body.category ?? e.category, body.is_active ?? e.is_active,
    body.sort_order ?? e.sort_order, id).run()
  const row = await c.env.DB.prepare('SELECT * FROM faqs WHERE id = ?').bind(id).first()
  return c.json({ data: mapFAQ(row as Record<string, unknown>) })
})

router.delete('/:id', requireRole('super_admin', 'admin'), async (c) => {
  const e = await c.env.DB.prepare('SELECT id FROM faqs WHERE id = ?').bind(c.req.param('id')).first()
  if (!e) return c.json({ error: 'Not found' }, 404)
  await c.env.DB.prepare('DELETE FROM faqs WHERE id = ?').bind(c.req.param('id')).run()
  return c.json({ success: true })
})

export function mapFAQ(r: Record<string, unknown>) {
  return {
    id: r.id, question: r.question, answer: r.answer,
    category: r.category, isActive: r.is_active === 1,
    sortOrder: r.sort_order, createdAt: r.created_at,
  }
}

export default router
