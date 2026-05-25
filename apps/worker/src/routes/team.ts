import { Hono } from 'hono'
import { v4 as uuid } from 'uuid'
import type { Env } from '../index'
import { requireRole } from '../middleware/auth'
import { now } from '../lib/utils'

const router = new Hono<{ Bindings: Env }>()

router.get('/', async (c) => {
  const { active, limit = '100' } = c.req.query()
  let q = 'SELECT * FROM team_members WHERE 1=1'
  const params: unknown[] = []
  if (active !== undefined) { q += ' AND is_active = ?'; params.push(active === 'true' ? 1 : 0) }
  q += ' ORDER BY sort_order ASC, created_at ASC LIMIT ?'
  params.push(parseInt(limit))
  const rows = await c.env.DB.prepare(q).bind(...params).all()
  return c.json({ data: (rows.results || []).map(mapMember) })
})

router.get('/:id', async (c) => {
  const row = await c.env.DB.prepare('SELECT * FROM team_members WHERE id = ?').bind(c.req.param('id')).first()
  if (!row) return c.json({ error: 'Not found' }, 404)
  return c.json({ data: mapMember(row as Record<string, unknown>) })
})

router.post('/', requireRole('super_admin', 'admin', 'editor'), async (c) => {
  const body = await c.req.json<Record<string, unknown>>()
  if (!body.name) return c.json({ error: 'name required' }, 400)
  const id = uuid()
  await c.env.DB.prepare(
    `INSERT INTO team_members (id, name, role, bio, image_url, image_alt, email, linkedin, twitter, is_active, sort_order, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(id, body.name, body.role ?? '', body.bio ?? null, body.image_url ?? null,
    body.image_alt ?? null, body.email ?? null, body.linkedin ?? null,
    body.twitter ?? null, body.is_active ?? 1, body.sort_order ?? 0, now()).run()
  const row = await c.env.DB.prepare('SELECT * FROM team_members WHERE id = ?').bind(id).first()
  return c.json({ data: mapMember(row as Record<string, unknown>) }, 201)
})

router.put('/:id', requireRole('super_admin', 'admin', 'editor'), async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json<Record<string, unknown>>()
  const e = await c.env.DB.prepare('SELECT * FROM team_members WHERE id = ?').bind(id).first() as any
  if (!e) return c.json({ error: 'Not found' }, 404)
  await c.env.DB.prepare(
    `UPDATE team_members SET name=?, role=?, bio=?, image_url=?, image_alt=?, email=?, linkedin=?, twitter=?, is_active=?, sort_order=? WHERE id=?`
  ).bind(body.name ?? e.name, body.role ?? e.role, body.bio ?? e.bio,
    body.image_url ?? e.image_url, body.image_alt ?? e.image_alt,
    body.email ?? e.email, body.linkedin ?? e.linkedin, body.twitter ?? e.twitter,
    body.is_active ?? e.is_active, body.sort_order ?? e.sort_order, id).run()
  const row = await c.env.DB.prepare('SELECT * FROM team_members WHERE id = ?').bind(id).first()
  return c.json({ data: mapMember(row as Record<string, unknown>) })
})

router.delete('/:id', requireRole('super_admin', 'admin'), async (c) => {
  const e = await c.env.DB.prepare('SELECT id FROM team_members WHERE id = ?').bind(c.req.param('id')).first()
  if (!e) return c.json({ error: 'Not found' }, 404)
  await c.env.DB.prepare('DELETE FROM team_members WHERE id = ?').bind(c.req.param('id')).run()
  return c.json({ success: true })
})

export function mapMember(r: Record<string, unknown>) {
  return {
    id: r.id, name: r.name, role: r.role, bio: r.bio,
    imageUrl: r.image_url, imageAlt: r.image_alt,
    email: r.email, linkedin: r.linkedin, twitter: r.twitter,
    isActive: r.is_active === 1, sortOrder: r.sort_order, createdAt: r.created_at,
  }
}

export default router
