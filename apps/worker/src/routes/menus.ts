import { Hono } from 'hono'
import { v4 as uuid } from 'uuid'
import type { Env } from '../index'
import { logAudit, now, parseJSON } from '../lib/utils'

const router = new Hono<{ Bindings: Env }>()

// GET /api/menus
router.get('/', async (c) => {
  const rows = await c.env.DB.prepare('SELECT * FROM menus ORDER BY created_at').all()
  const menus = (rows.results || []).map(mapMenu)
  return c.json({ data: menus })
})

// GET /api/menus/:slug
router.get('/:slug', async (c) => {
  const row = await c.env.DB.prepare('SELECT * FROM menus WHERE slug = ? OR id = ?')
    .bind(c.req.param('slug'), c.req.param('slug')).first()
  if (!row) return c.json({ error: 'Menu not found' }, 404)
  return c.json({ data: mapMenu(row) })
})

// POST /api/menus
router.post('/', async (c) => {
  const body = await c.req.json<{ name: string; slug: string; items?: unknown[] }>()
  const id = uuid()
  const ts = now()
  await c.env.DB.prepare(
    'INSERT INTO menus (id, name, slug, items, created_at) VALUES (?, ?, ?, ?, ?)'
  ).bind(id, body.name, body.slug, JSON.stringify(body.items ?? []), ts).run()
  const row = await c.env.DB.prepare('SELECT * FROM menus WHERE id = ?').bind(id).first()
  return c.json({ data: mapMenu(row) }, 201)
})

// PUT /api/menus/:id
router.put('/:id', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json<{ name?: string; items?: unknown[] }>()
  const userId = c.get('userId')
  const userName = c.get('userName')

  await c.env.DB.prepare(
    'UPDATE menus SET name = COALESCE(?, name), items = COALESCE(?, items) WHERE id = ?'
  ).bind(body.name ?? null, body.items ? JSON.stringify(body.items) : null, id).run()

  await logAudit(c.env.DB, userId, userName, 'menu.update', 'menu', id)

  const row = await c.env.DB.prepare('SELECT * FROM menus WHERE id = ?').bind(id).first()
  return c.json({ data: mapMenu(row) })
})

// DELETE /api/menus/:id
router.delete('/:id', async (c) => {
  const id = c.req.param('id')
  await c.env.DB.prepare('DELETE FROM menus WHERE id = ?').bind(id).run()
  return c.json({ data: { message: 'Menu deleted' } })
})

function mapMenu(row: unknown) {
  const r = row as Record<string, unknown>
  return {
    id: r.id,
    name: r.name,
    slug: r.slug,
    items: parseJSON(r.items as string, []),
    createdAt: r.created_at,
  }
}

export default router
