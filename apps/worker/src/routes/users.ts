import { Hono } from 'hono'
import type { Env } from '../index'
import { requireRole } from '../middleware/auth'
import { now } from '../lib/utils'

const router = new Hono<{ Bindings: Env }>()

// GET /api/users
router.get('/', requireRole('super_admin', 'admin'), async (c) => {
  const rows = await c.env.DB.prepare('SELECT * FROM user_profiles ORDER BY created_at DESC').all()
  return c.json({ data: rows.results || [] })
})

// PATCH /api/users/:id/role
router.patch('/:id/role', requireRole('super_admin'), async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json<{ role: string }>()

  const validRoles = ['super_admin', 'admin', 'editor']
  if (!validRoles.includes(body.role)) {
    return c.json({ error: 'Invalid role' }, 400)
  }

  await c.env.DB.prepare('UPDATE user_profiles SET role = ? WHERE id = ?').bind(body.role, id).run()

  return c.json({ data: { message: 'Role updated' } })
})

// PUT /api/users/:id/profile
router.put('/:id/profile', async (c) => {
  const id = c.req.param('id')
  const userId = c.get('userId')

  // Users can only update their own profile, or admin can update any
  const role = c.get('userRole')
  if (id !== userId && !['super_admin', 'admin'].includes(role)) {
    return c.json({ error: 'Forbidden' }, 403)
  }

  const body = await c.req.json<{ displayName?: string; email?: string }>()

  await c.env.DB.prepare(
    'UPDATE user_profiles SET display_name = COALESCE(?, display_name), email = COALESCE(?, email) WHERE id = ?'
  ).bind(body.displayName ?? null, body.email ?? null, id).run()

  // Upsert if not exists
  await c.env.DB.prepare(
    'INSERT OR IGNORE INTO user_profiles (id, display_name, email, role) VALUES (?, ?, ?, ?)'
  ).bind(id, body.displayName ?? '', body.email ?? '', 'editor').run()

  const row = await c.env.DB.prepare('SELECT * FROM user_profiles WHERE id = ?').bind(id).first()
  return c.json({ data: row })
})

export default router
