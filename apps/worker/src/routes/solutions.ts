import { Hono } from 'hono'
import { v4 as uuid } from 'uuid'
import type { Env } from '../index'
import { requireRole } from '../middleware/auth'
import { now } from '../lib/utils'

const router = new Hono<{ Bindings: Env }>()

router.get('/', async (c) => {
  const { active, limit = '200' } = c.req.query()
  let q = `
    SELECT
      s.*,
      COUNT(se.id) AS entry_count
    FROM solutions s
    LEFT JOIN solution_entries se ON se.solution_id = s.id
    WHERE 1=1
  `
  const params: unknown[] = []
  if (active !== undefined) {
    q += ' AND s.is_active = ?'
    params.push(active === 'true' ? 1 : 0)
  }
  q += ' GROUP BY s.id ORDER BY s.sort_order ASC, s.created_at ASC LIMIT ?'
  params.push(parseInt(limit))
  const rows = await c.env.DB.prepare(q).bind(...params).all()
  return c.json({ data: (rows.results || []).map(mapSolution) })
})

router.get('/:id', async (c) => {
  const id = c.req.param('id')
  const row = await c.env.DB.prepare('SELECT * FROM solutions WHERE id = ?').bind(id).first()
  if (!row) return c.json({ error: 'Not found' }, 404)

  const entryRows = await c.env.DB.prepare(
    'SELECT * FROM solution_entries WHERE solution_id = ? ORDER BY sort_order ASC, created_at ASC'
  ).bind(id).all()

  return c.json({
    data: {
      ...mapSolution(row as Record<string, unknown>),
      entries: (entryRows.results || []).map(mapSolutionEntry),
    }
  })
})

router.post('/', requireRole('super_admin', 'admin', 'editor'), async (c) => {
  const body = await c.req.json<Record<string, unknown>>()
  if (!body.name) return c.json({ error: 'name required' }, 400)

  const id = uuid()
  await c.env.DB.prepare(
    `INSERT INTO solutions (id, name, is_active, sort_order, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).bind(
    id,
    body.name,
    body.is_active ?? 1,
    body.sort_order ?? 0,
    now(),
    now()
  ).run()

  const row = await c.env.DB.prepare('SELECT * FROM solutions WHERE id = ?').bind(id).first()
  return c.json({ data: { ...mapSolution(row as Record<string, unknown>), entries: [] } }, 201)
})

router.put('/:id', requireRole('super_admin', 'admin', 'editor'), async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json<Record<string, unknown>>()
  const existing = await c.env.DB.prepare('SELECT * FROM solutions WHERE id = ?').bind(id).first() as any
  if (!existing) return c.json({ error: 'Not found' }, 404)

  await c.env.DB.prepare(
    `UPDATE solutions SET name=?, is_active=?, sort_order=?, updated_at=? WHERE id=?`
  ).bind(
    body.name ?? existing.name,
    body.is_active ?? existing.is_active,
    body.sort_order ?? existing.sort_order,
    now(),
    id
  ).run()

  const entries = Array.isArray(body.entries) ? body.entries as Record<string, unknown>[] : []
  const entryIds = entries
    .map((entry) => entry.id)
    .filter((entryId): entryId is string => typeof entryId === 'string' && entryId.length > 0)

  if (entryIds.length) {
    const placeholders = entryIds.map(() => '?').join(',')
    await c.env.DB.prepare(
      `DELETE FROM solution_entries WHERE solution_id = ? AND id NOT IN (${placeholders})`
    ).bind(id, ...entryIds).run()
  } else {
    await c.env.DB.prepare('DELETE FROM solution_entries WHERE solution_id = ?').bind(id).run()
  }

  for (let index = 0; index < entries.length; index++) {
    const entry = entries[index]
    const entryId = typeof entry.id === 'string' && entry.id ? entry.id : uuid()
    const title = typeof entry.title === 'string' ? entry.title : ''
    const imageUrl = typeof entry.image_url === 'string' && entry.image_url ? entry.image_url : null
    const description = typeof entry.description === 'string' ? entry.description : ''
    const sortOrder = typeof entry.sort_order === 'number' ? entry.sort_order : index

    const alreadyExists = typeof entry.id === 'string' && entry.id

    if (alreadyExists) {
      await c.env.DB.prepare(
        `UPDATE solution_entries SET title=?, image_url=?, description=?, sort_order=? WHERE id=? AND solution_id=?`
      ).bind(title, imageUrl, description, sortOrder, entryId, id).run()
    } else {
      await c.env.DB.prepare(
        `INSERT INTO solution_entries (id, solution_id, title, image_url, description, sort_order, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      ).bind(entryId, id, title, imageUrl, description, sortOrder, now()).run()
    }
  }

  const row = await c.env.DB.prepare('SELECT * FROM solutions WHERE id = ?').bind(id).first()
  const entryRows = await c.env.DB.prepare(
    'SELECT * FROM solution_entries WHERE solution_id = ? ORDER BY sort_order ASC, created_at ASC'
  ).bind(id).all()

  return c.json({
    data: {
      ...mapSolution(row as Record<string, unknown>),
      entries: (entryRows.results || []).map(mapSolutionEntry),
    }
  })
})

router.delete('/:id', requireRole('super_admin', 'admin'), async (c) => {
  const id = c.req.param('id')
  const existing = await c.env.DB.prepare('SELECT id FROM solutions WHERE id = ?').bind(id).first()
  if (!existing) return c.json({ error: 'Not found' }, 404)
  await c.env.DB.prepare('DELETE FROM solutions WHERE id = ?').bind(id).run()
  return c.json({ success: true })
})

export function mapSolution(r: Record<string, unknown>) {
  return {
    id: r.id,
    name: r.name,
    isActive: r.is_active === 1,
    sortOrder: r.sort_order,
    entryCount: Number(r.entry_count ?? 0),
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }
}

export function mapSolutionEntry(r: Record<string, unknown>) {
  return {
    id: r.id,
    solutionId: r.solution_id,
    title: r.title,
    imageUrl: r.image_url,
    description: r.description,
    sortOrder: r.sort_order,
    createdAt: r.created_at,
  }
}

export default router
