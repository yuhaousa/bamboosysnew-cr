import { Hono } from 'hono'
import type { Env } from '../index'
import { requireRole } from '../middleware/auth'

const router = new Hono<{ Bindings: Env }>()

// GET /api/audit
router.get('/', requireRole('super_admin', 'admin'), async (c) => {
  const { page = '1', limit = '50', resourceType } = c.req.query()
  const offset = (parseInt(page) - 1) * parseInt(limit)

  let query = 'SELECT * FROM audit_logs WHERE 1=1'
  const params: unknown[] = []

  if (resourceType) {
    query += ' AND resource_type = ?'
    params.push(resourceType)
  }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
  params.push(parseInt(limit), offset)

  const rows = await c.env.DB.prepare(query).bind(...params).all()

  return c.json({
    data: (rows.results || []).map(r => {
      const row = r as Record<string, unknown>
      return {
        ...row,
        metadata: (() => { try { return JSON.parse(row.metadata as string) } catch { return {} } })(),
      }
    })
  })
})

export default router
