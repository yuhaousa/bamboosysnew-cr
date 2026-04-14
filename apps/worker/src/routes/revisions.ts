import { Hono } from 'hono'
import type { Env } from '../index'
import { parseJSON } from '../lib/utils'

const router = new Hono<{ Bindings: Env }>()

// GET /api/revisions/:pageId
router.get('/:pageId', async (c) => {
  const rows = await c.env.DB.prepare(
    'SELECT id, page_id, created_by, created_at FROM page_revisions WHERE page_id = ? ORDER BY created_at DESC LIMIT 20'
  ).bind(c.req.param('pageId')).all()
  return c.json({ data: rows.results || [] })
})

// GET /api/revisions/:pageId/:id — get single revision with snapshot
router.get('/:pageId/:id', async (c) => {
  const row = await c.env.DB.prepare(
    'SELECT * FROM page_revisions WHERE id = ? AND page_id = ?'
  ).bind(c.req.param('id'), c.req.param('pageId')).first<Record<string, unknown>>()

  if (!row) return c.json({ error: 'Revision not found' }, 404)

  return c.json({
    data: {
      id: row.id,
      pageId: row.page_id,
      blocksSnapshot: parseJSON(row.blocks_snapshot as string, []),
      pageSnapshot: parseJSON(row.page_snapshot as string, {}),
      createdBy: row.created_by,
      createdAt: row.created_at,
    }
  })
})

// POST /api/revisions/:pageId/restore/:revisionId
router.post('/:pageId/restore/:revisionId', async (c) => {
  const { pageId, revisionId } = c.req.param()
  const userId = c.get('userId')

  const revision = await c.env.DB.prepare(
    'SELECT * FROM page_revisions WHERE id = ? AND page_id = ?'
  ).bind(revisionId, pageId).first<Record<string, unknown>>()

  if (!revision) return c.json({ error: 'Revision not found' }, 404)

  const blocks = parseJSON(revision.blocks_snapshot as string, []) as Record<string, unknown>[]

  // Delete current blocks and restore from snapshot
  await c.env.DB.prepare('DELETE FROM page_blocks WHERE page_id = ?').bind(pageId).run()

  for (const block of blocks) {
    await c.env.DB.prepare(
      'INSERT INTO page_blocks (id, page_id, type, content, styles, visibility, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).bind(block.id, pageId, block.type, block.content, block.styles, block.visibility, block.sort_order).run()
  }

  return c.json({ data: { message: 'Revision restored' } })
})

export default router
