import { Hono } from 'hono'
import { v4 as uuid } from 'uuid'
import type { Env } from '../index'
import { logAudit, now, parseJSON } from '../lib/utils'

const router = new Hono<{ Bindings: Env }>()

// GET /api/blocks/:pageId — get all blocks for a page
router.get('/:pageId', async (c) => {
  const rows = await c.env.DB.prepare(
    'SELECT * FROM page_blocks WHERE page_id = ? ORDER BY sort_order'
  ).bind(c.req.param('pageId')).all()

  const blocks = (rows.results || []).map(mapBlock)
  return c.json({ data: blocks })
})

// POST /api/blocks/:pageId — add block to page
router.post('/:pageId', async (c) => {
  const pageId = c.req.param('pageId')
  const body = await c.req.json<{
    type: string
    content: Record<string, unknown>
    styles: Record<string, unknown>
    sortOrder?: number
  }>()

  const id = uuid()
  const userId = c.get('userId')
  const userName = c.get('userName')

  // Get max sort_order
  const maxOrder = await c.env.DB.prepare(
    'SELECT MAX(sort_order) as max_order FROM page_blocks WHERE page_id = ?'
  ).bind(pageId).first<{ max_order: number | null }>()

  const sortOrder = body.sortOrder ?? (maxOrder?.max_order != null ? maxOrder.max_order + 1 : 0)

  await c.env.DB.prepare(
    `INSERT INTO page_blocks (id, page_id, type, content, styles, visibility, sort_order)
     VALUES (?, ?, ?, ?, ?, 1, ?)`
  ).bind(id, pageId, body.type, JSON.stringify(body.content), JSON.stringify(body.styles), sortOrder).run()

  // Update page updated_at
  await c.env.DB.prepare('UPDATE pages SET updated_at = ? WHERE id = ?').bind(now(), pageId).run()

  await logAudit(c.env.DB, userId, userName, 'block.create', 'block', id, { pageId, type: body.type })

  const row = await c.env.DB.prepare('SELECT * FROM page_blocks WHERE id = ?').bind(id).first()
  return c.json({ data: mapBlock(row) }, 201)
})

// PUT /api/blocks/:pageId/:blockId — update block
router.put('/:pageId/:blockId', async (c) => {
  const { pageId, blockId } = c.req.param()
  const body = await c.req.json<{
    content?: Record<string, unknown>
    styles?: Record<string, unknown>
    isVisible?: boolean
    sortOrder?: number
  }>()

  const userId = c.get('userId')
  const userName = c.get('userName')

  await c.env.DB.prepare(
    `UPDATE page_blocks SET
      content = COALESCE(?, content),
      styles = COALESCE(?, styles),
      visibility = COALESCE(?, visibility),
      sort_order = COALESCE(?, sort_order)
     WHERE id = ? AND page_id = ?`
  ).bind(
    body.content ? JSON.stringify(body.content) : null,
    body.styles ? JSON.stringify(body.styles) : null,
    body.isVisible !== undefined ? (body.isVisible ? 1 : 0) : null,
    body.sortOrder ?? null,
    blockId,
    pageId
  ).run()

  await c.env.DB.prepare('UPDATE pages SET updated_at = ? WHERE id = ?').bind(now(), pageId).run()
  await logAudit(c.env.DB, userId, userName, 'block.update', 'block', blockId, { pageId })

  const row = await c.env.DB.prepare('SELECT * FROM page_blocks WHERE id = ?').bind(blockId).first()
  return c.json({ data: mapBlock(row) })
})

// PUT /api/blocks/:pageId/reorder — bulk reorder blocks
router.put('/:pageId/reorder', async (c) => {
  const pageId = c.req.param('pageId')
  const body = await c.req.json<{ order: { id: string; sortOrder: number }[] }>()
  const userId = c.get('userId')
  const userName = c.get('userName')

  const stmts = body.order.map(({ id, sortOrder }) =>
    c.env.DB.prepare('UPDATE page_blocks SET sort_order = ? WHERE id = ? AND page_id = ?')
      .bind(sortOrder, id, pageId)
  )

  await c.env.DB.batch(stmts)
  await c.env.DB.prepare('UPDATE pages SET updated_at = ? WHERE id = ?').bind(now(), pageId).run()
  await logAudit(c.env.DB, userId, userName, 'block.reorder', 'page', pageId)

  return c.json({ data: { message: 'Blocks reordered' } })
})

// POST /api/blocks/:pageId/:blockId/duplicate — duplicate block
router.post('/:pageId/:blockId/duplicate', async (c) => {
  const { pageId, blockId } = c.req.param()
  const userId = c.get('userId')
  const userName = c.get('userName')

  const source = await c.env.DB.prepare(
    'SELECT * FROM page_blocks WHERE id = ? AND page_id = ?'
  ).bind(blockId, pageId).first<Record<string, unknown>>()

  if (!source) return c.json({ error: 'Block not found' }, 404)

  const newId = uuid()
  const newOrder = (source.sort_order as number) + 1

  // Shift subsequent blocks
  await c.env.DB.prepare(
    'UPDATE page_blocks SET sort_order = sort_order + 1 WHERE page_id = ? AND sort_order >= ?'
  ).bind(pageId, newOrder).run()

  await c.env.DB.prepare(
    'INSERT INTO page_blocks (id, page_id, type, content, styles, visibility, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).bind(newId, pageId, source.type, source.content, source.styles, source.visibility, newOrder).run()

  await c.env.DB.prepare('UPDATE pages SET updated_at = ? WHERE id = ?').bind(now(), pageId).run()
  await logAudit(c.env.DB, userId, userName, 'block.create', 'block', newId, { duplicatedFrom: blockId, pageId })

  const row = await c.env.DB.prepare('SELECT * FROM page_blocks WHERE id = ?').bind(newId).first()
  return c.json({ data: mapBlock(row) }, 201)
})

// DELETE /api/blocks/:pageId/:blockId
router.delete('/:pageId/:blockId', async (c) => {
  const { pageId, blockId } = c.req.param()
  const userId = c.get('userId')
  const userName = c.get('userName')

  await c.env.DB.prepare('DELETE FROM page_blocks WHERE id = ? AND page_id = ?').bind(blockId, pageId).run()
  await c.env.DB.prepare('UPDATE pages SET updated_at = ? WHERE id = ?').bind(now(), pageId).run()
  await logAudit(c.env.DB, userId, userName, 'block.delete', 'block', blockId, { pageId })

  return c.json({ data: { message: 'Block deleted' } })
})

function mapBlock(row: unknown) {
  const r = row as Record<string, unknown>
  return {
    id: r.id,
    pageId: r.page_id,
    type: r.type,
    content: parseJSON(r.content as string, {}),
    styles: parseJSON(r.styles as string, {}),
    isVisible: r.visibility === 1 || r.visibility === true,
    sortOrder: r.sort_order,
  }
}

export default router
