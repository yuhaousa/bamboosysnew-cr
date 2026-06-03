import { Hono } from 'hono'
import { v4 as uuid } from 'uuid'
import type { Env } from '../index'
import { requireRole } from '../middleware/auth'
import { now } from '../lib/utils'

const router = new Hono<{ Bindings: Env }>()

// GET /api/features
router.get('/', async (c) => {
  const { page = '1', limit = '50' } = c.req.query()
  const offset = (parseInt(page) - 1) * parseInt(limit)
  const rows = await c.env.DB.prepare(
    'SELECT * FROM features WHERE 1=1 ORDER BY sort_order ASC, created_at DESC LIMIT ? OFFSET ?'
  ).bind(parseInt(limit), offset).all()
  return c.json({ data: (rows.results || []).map(mapFeature) })
})

// GET /api/features/:id
router.get('/:id', async (c) => {
  const featureId = c.req.param('id')
  const feature = await c.env.DB.prepare('SELECT * FROM features WHERE id = ?').bind(featureId).first()
  if (!feature) return c.json({ error: 'Not found' }, 404)
  
  const items = await c.env.DB.prepare(
    'SELECT * FROM feature_items WHERE feature_id = ? ORDER BY sort_order ASC'
  ).bind(featureId).all()
  
  return c.json({ 
    data: {
      ...mapFeature(feature as Record<string, unknown>),
      items: (items.results || []).map(mapFeatureItem)
    }
  })
})

// POST /api/features
router.post('/', requireRole('super_admin', 'admin', 'editor'), async (c) => {
  const body = await c.req.json<Record<string, unknown>>()
  if (!body.title) return c.json({ error: 'title required' }, 400)
  
  const id = uuid()
  await c.env.DB.prepare(
    `INSERT INTO features (id, title, summary, is_active, sort_order, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    id, body.title, body.summary ?? '',
    body.is_active !== undefined ? (body.is_active ? 1 : 0) : 1,
    body.sort_order ?? 0,
    now(), now()
  ).run()
  
  // Add feature items if provided
  const items = (body.items as Record<string, unknown>[]) || []
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    const itemId = uuid()
    await c.env.DB.prepare(
      `INSERT INTO feature_items (id, feature_id, title, description, image_url, stack, sort_order, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      itemId, id, item.title ?? '', item.description ?? '',
      item.image_url ?? null, item.stack ?? '',
      item.sort_order ?? i,
      now()
    ).run()
  }
  
  const row = await c.env.DB.prepare('SELECT * FROM features WHERE id = ?').bind(id).first()
  const itemRows = await c.env.DB.prepare('SELECT * FROM feature_items WHERE feature_id = ? ORDER BY sort_order ASC').bind(id).all()
  
  return c.json({ 
    data: {
      ...mapFeature(row as Record<string, unknown>),
      items: (itemRows.results || []).map(mapFeatureItem)
    }
  }, 201)
})

// PUT /api/features/:id
router.put('/:id', requireRole('super_admin', 'admin', 'editor'), async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json<Record<string, unknown>>()
  const feature = await c.env.DB.prepare('SELECT * FROM features WHERE id = ?').bind(id).first() as any
  if (!feature) return c.json({ error: 'Not found' }, 404)
  
  await c.env.DB.prepare(
    `UPDATE features SET title=?, summary=?, is_active=?, sort_order=?, updated_at=? WHERE id=?`
  ).bind(
    body.title ?? feature.title,
    body.summary ?? feature.summary,
    body.is_active !== undefined ? (body.is_active ? 1 : 0) : feature.is_active,
    body.sort_order !== undefined ? body.sort_order : feature.sort_order,
    now(), id
  ).run()
  
  // Handle feature items updates
  const items = (body.items as Record<string, unknown>[]) || []
  
  // Delete items not in the new list
  const itemIds = items.filter((i: any) => i.id && !i.id.startsWith('temp')).map((i: any) => i.id)
  if (itemIds.length === 0) {
    await c.env.DB.prepare('DELETE FROM feature_items WHERE feature_id = ?').bind(id).run()
  } else {
    const placeholders = itemIds.map(() => '?').join(',')
    await c.env.DB.prepare(`DELETE FROM feature_items WHERE feature_id = ? AND id NOT IN (${placeholders})`).bind(id, ...itemIds).run()
  }
  
  // Upsert items
  for (let i = 0; i < items.length; i++) {
    const item = items[i] as any
    if (item.id && !item.id.startsWith('temp')) {
      // Update existing
      await c.env.DB.prepare(
        `UPDATE feature_items SET title=?, description=?, image_url=?, stack=?, sort_order=? WHERE id=?`
      ).bind(item.title ?? '', item.description ?? '', item.image_url ?? null, item.stack ?? '', item.sort_order ?? i, item.id).run()
    } else {
      // Create new
      const itemId = uuid()
      await c.env.DB.prepare(
        `INSERT INTO feature_items (id, feature_id, title, description, image_url, stack, sort_order, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(itemId, id, item.title ?? '', item.description ?? '', item.image_url ?? null, item.stack ?? '', item.sort_order ?? i, now()).run()
    }
  }
  
  const row = await c.env.DB.prepare('SELECT * FROM features WHERE id = ?').bind(id).first()
  const itemRows = await c.env.DB.prepare('SELECT * FROM feature_items WHERE feature_id = ? ORDER BY sort_order ASC').bind(id).all()
  
  return c.json({ 
    data: {
      ...mapFeature(row as Record<string, unknown>),
      items: (itemRows.results || []).map(mapFeatureItem)
    }
  })
})

// DELETE /api/features/:id
router.delete('/:id', requireRole('super_admin', 'admin'), async (c) => {
  const id = c.req.param('id')
  const feature = await c.env.DB.prepare('SELECT id FROM features WHERE id = ?').bind(id).first()
  if (!feature) return c.json({ error: 'Not found' }, 404)
  
  await c.env.DB.prepare('DELETE FROM features WHERE id = ?').bind(id).run()
  return c.json({ success: true })
})

function mapFeature(r: Record<string, unknown>) {
  return {
    id: r.id,
    title: r.title,
    summary: r.summary,
    isActive: r.is_active === 1,
    sortOrder: r.sort_order,
    createdAt: r.created_at,
    updatedAt: r.updated_at
  }
}

function mapFeatureItem(r: Record<string, unknown>) {
  return {
    id: r.id,
    featureId: r.feature_id,
    title: r.title,
    description: r.description,
    imageUrl: r.image_url,
    stack: r.stack || '',
    sortOrder: r.sort_order,
    createdAt: r.created_at
  }
}

export default router
