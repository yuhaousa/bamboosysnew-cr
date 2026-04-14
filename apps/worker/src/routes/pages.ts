import { Hono } from 'hono'
import { v4 as uuid } from 'uuid'
import type { Env } from '../index'
import { requireRole } from '../middleware/auth'
import { logAudit, now, parseJSON } from '../lib/utils'

const router = new Hono<{ Bindings: Env }>()

// GET /api/pages — list all pages
router.get('/', async (c) => {
  const { search, status, page = '1', limit = '20' } = c.req.query()
  const offset = (parseInt(page) - 1) * parseInt(limit)

  let query = `SELECT p.*, COUNT(b.id) as block_count
               FROM pages p
               LEFT JOIN page_blocks b ON b.page_id = p.id
               WHERE 1=1`
  const params: unknown[] = []

  if (status) {
    query += ' AND p.status = ?'
    params.push(status)
  }
  if (search) {
    query += ' AND (p.title LIKE ? OR p.slug LIKE ?)'
    params.push(`%${search}%`, `%${search}%`)
  }

  query += ' GROUP BY p.id ORDER BY p.updated_at DESC LIMIT ? OFFSET ?'
  params.push(parseInt(limit), offset)

  const countQuery = `SELECT COUNT(*) as total FROM pages WHERE 1=1${status ? ' AND status = ?' : ''}${search ? ' AND (title LIKE ? OR slug LIKE ?)' : ''}`
  const countParams: unknown[] = []
  if (status) countParams.push(status)
  if (search) countParams.push(`%${search}%`, `%${search}%`)

  const [rows, countRow] = await Promise.all([
    c.env.DB.prepare(query).bind(...params).all(),
    c.env.DB.prepare(countQuery).bind(...countParams).first<{ total: number }>(),
  ])

  const pages = (rows.results || []).map(mapPage)
  return c.json({ data: pages, total: countRow?.total ?? 0, page: parseInt(page), limit: parseInt(limit) })
})

// GET /api/pages/:id — get single page (without blocks)
router.get('/:id', async (c) => {
  const row = await c.env.DB.prepare('SELECT * FROM pages WHERE id = ?').bind(c.req.param('id')).first()
  if (!row) return c.json({ error: 'Page not found' }, 404)
  return c.json({ data: mapPage(row) })
})

// POST /api/pages — create page
router.post('/', requireRole('super_admin', 'admin'), async (c) => {
  const body = await c.req.json<{ title: string; slug: string }>()
  if (!body.title || !body.slug) return c.json({ error: 'title and slug required' }, 400)

  const id = uuid()
  const userId = c.get('userId')
  const userName = c.get('userName')
  const ts = now()

  await c.env.DB.prepare(
    `INSERT INTO pages (id, title, slug, status, seo, author_id, author_name, created_at, updated_at)
     VALUES (?, ?, ?, 'draft', '{}', ?, ?, ?, ?)`
  ).bind(id, body.title, body.slug, userId, userName, ts, ts).run()

  await logAudit(c.env.DB, userId, userName, 'page.create', 'page', id, { title: body.title })

  const row = await c.env.DB.prepare('SELECT * FROM pages WHERE id = ?').bind(id).first()
  return c.json({ data: mapPage(row) }, 201)
})

// PUT /api/pages/:id — update page metadata
router.put('/:id', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json<{
    title?: string
    slug?: string
    seo?: Record<string, unknown>
    status?: string
    scheduledAt?: string | null
  }>()

  const existing = await c.env.DB.prepare('SELECT * FROM pages WHERE id = ?').bind(id).first()
  if (!existing) return c.json({ error: 'Page not found' }, 404)

  const userId = c.get('userId')
  const userName = c.get('userName')
  const ts = now()

  await c.env.DB.prepare(
    `UPDATE pages SET
      title = COALESCE(?, title),
      slug = COALESCE(?, slug),
      seo = COALESCE(?, seo),
      scheduled_at = ?,
      updated_at = ?
     WHERE id = ?`
  ).bind(
    body.title ?? null,
    body.slug ?? null,
    body.seo ? JSON.stringify(body.seo) : null,
    body.scheduledAt ?? null,
    ts,
    id
  ).run()

  await logAudit(c.env.DB, userId, userName, 'page.update', 'page', id)

  const row = await c.env.DB.prepare('SELECT * FROM pages WHERE id = ?').bind(id).first()
  return c.json({ data: mapPage(row) })
})

// POST /api/pages/:id/publish — publish page
router.post('/:id/publish', requireRole('super_admin', 'admin'), async (c) => {
  const id = c.req.param('id')
  const userId = c.get('userId')
  const userName = c.get('userName')
  const ts = now()

  const existing = await c.env.DB.prepare('SELECT id FROM pages WHERE id = ?').bind(id).first()
  if (!existing) return c.json({ error: 'Page not found' }, 404)

  await c.env.DB.prepare(
    `UPDATE pages SET status = 'published', published_at = ?, updated_at = ? WHERE id = ?`
  ).bind(ts, ts, id).run()

  await logAudit(c.env.DB, userId, userName, 'page.publish', 'page', id)

  await createRevision(c.env.DB, id, userId)

  return c.json({ data: { message: 'Page published' } })
})

// POST /api/pages/:id/unpublish — unpublish page
router.post('/:id/unpublish', requireRole('super_admin', 'admin'), async (c) => {
  const id = c.req.param('id')
  const userId = c.get('userId')
  const userName = c.get('userName')
  const ts = now()

  await c.env.DB.prepare(
    `UPDATE pages SET status = 'draft', updated_at = ? WHERE id = ?`
  ).bind(ts, id).run()

  await logAudit(c.env.DB, userId, userName, 'page.unpublish', 'page', id)

  return c.json({ data: { message: 'Page unpublished' } })
})

// POST /api/pages/:id/duplicate — duplicate page
router.post('/:id/duplicate', requireRole('super_admin', 'admin'), async (c) => {
  const sourceId = c.req.param('id')
  const userId = c.get('userId')
  const userName = c.get('userName')
  const ts = now()

  const source = await c.env.DB.prepare('SELECT * FROM pages WHERE id = ?').bind(sourceId).first<Record<string, unknown>>()
  if (!source) return c.json({ error: 'Page not found' }, 404)

  const newId = uuid()
  const newSlug = `${source.slug}-copy-${Date.now()}`

  await c.env.DB.prepare(
    `INSERT INTO pages (id, title, slug, status, seo, author_id, author_name, created_at, updated_at)
     VALUES (?, ?, ?, 'draft', ?, ?, ?, ?, ?)`
  ).bind(newId, `${source.title} (Copy)`, newSlug, source.seo, userId, userName, ts, ts).run()

  // Copy blocks
  const blocks = await c.env.DB.prepare(
    'SELECT * FROM page_blocks WHERE page_id = ? ORDER BY sort_order'
  ).bind(sourceId).all()

  for (const block of blocks.results || []) {
    const b = block as Record<string, unknown>
    await c.env.DB.prepare(
      'INSERT INTO page_blocks (id, page_id, type, content, styles, visibility, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).bind(uuid(), newId, b.type, b.content, b.styles, b.visibility, b.sort_order).run()
  }

  await logAudit(c.env.DB, userId, userName, 'page.create', 'page', newId, { duplicatedFrom: sourceId })

  const row = await c.env.DB.prepare('SELECT * FROM pages WHERE id = ?').bind(newId).first()
  return c.json({ data: mapPage(row) }, 201)
})

// DELETE /api/pages/:id
router.delete('/:id', requireRole('super_admin', 'admin'), async (c) => {
  const id = c.req.param('id')
  const userId = c.get('userId')
  const userName = c.get('userName')

  const existing = await c.env.DB.prepare('SELECT title FROM pages WHERE id = ?').bind(id).first<{ title: string }>()
  if (!existing) return c.json({ error: 'Page not found' }, 404)

  await c.env.DB.prepare('DELETE FROM pages WHERE id = ?').bind(id).run()
  await logAudit(c.env.DB, userId, userName, 'page.delete', 'page', id, { title: existing.title })

  return c.json({ data: { message: 'Page deleted' } })
})

// ─── Helpers ──────────────────────────────────────────────────────────────────

function mapPage(row: unknown) {
  const r = row as Record<string, unknown>
  return {
    id: r.id,
    title: r.title,
    slug: r.slug,
    status: r.status,
    seo: parseJSON(r.seo as string, {}),
    authorId: r.author_id,
    authorName: r.author_name,
    publishedAt: r.published_at ?? null,
    scheduledAt: r.scheduled_at ?? null,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    blockCount: r.block_count ?? 0,
  }
}

async function createRevision(db: D1Database, pageId: string, userId: string) {
  const blocks = await db.prepare(
    'SELECT * FROM page_blocks WHERE page_id = ? ORDER BY sort_order'
  ).bind(pageId).all()

  const page = await db.prepare('SELECT * FROM pages WHERE id = ?').bind(pageId).first()

  await db.prepare(
    'INSERT INTO page_revisions (id, page_id, blocks_snapshot, page_snapshot, created_by) VALUES (?, ?, ?, ?, ?)'
  ).bind(
    uuid(),
    pageId,
    JSON.stringify(blocks.results || []),
    JSON.stringify(page),
    userId
  ).run()
}

export default router
