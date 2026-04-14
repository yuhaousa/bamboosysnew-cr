import { Hono } from 'hono'
import type { Env } from '../index'
import { logAudit, now, parseJSON } from '../lib/utils'

const router = new Hono<{ Bindings: Env }>()

// GET /api/settings — get all settings
router.get('/', async (c) => {
  const rows = await c.env.DB.prepare('SELECT * FROM site_settings').all()
  const settings: Record<string, unknown> = {}
  for (const row of rows.results || []) {
    const r = row as Record<string, unknown>
    settings[r.key as string] = parseJSON(r.value as string, {})
  }
  return c.json({ data: settings })
})

// GET /api/settings/:key
router.get('/:key', async (c) => {
  const row = await c.env.DB.prepare('SELECT * FROM site_settings WHERE key = ?').bind(c.req.param('key')).first<Record<string, unknown>>()
  if (!row) return c.json({ error: 'Setting not found' }, 404)
  return c.json({ data: parseJSON(row.value as string, {}) })
})

// PUT /api/settings/:key
router.put('/:key', async (c) => {
  const key = c.req.param('key')
  const body = await c.req.json()
  const userId = c.get('userId')
  const userName = c.get('userName')
  const ts = now()

  await c.env.DB.prepare(
    `INSERT INTO site_settings (key, value, updated_at) VALUES (?, ?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`
  ).bind(key, JSON.stringify(body), ts).run()

  await logAudit(c.env.DB, userId, userName, 'settings.update', 'settings', key)

  return c.json({ data: body })
})

export default router
