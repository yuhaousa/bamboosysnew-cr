import { Hono } from 'hono'
import { signJWT, verifyPassword, hashPassword } from '../lib/jwt'
import type { Env } from '../index'

const router = new Hono<{ Bindings: Env }>()

// POST /api/auth/login
router.post('/login', async (c) => {
  const body = await c.req.json<{ email: string; password: string }>()

  if (!body.email || !body.password) {
    return c.json({ error: 'Email and password required' }, 400)
  }

  // Look up user in D1
  const user = await c.env.DB.prepare(
    'SELECT id, role, display_name, email, password_hash FROM user_profiles WHERE email = ?'
  ).bind(body.email.toLowerCase()).first<{
    id: string; role: string; display_name: string; email: string; password_hash: string | null
  }>()

  // If no users exist yet AND credentials match ADMIN_EMAIL/ADMIN_PASSWORD env vars → bootstrap super admin
  if (!user) {
    if (
      body.email.toLowerCase() === (c.env.ADMIN_EMAIL ?? '').toLowerCase() &&
      body.password === c.env.ADMIN_PASSWORD
    ) {
      const { v4: uuid } = await import('uuid')
      const id = uuid()
      const passwordHash = await hashPassword(body.password)
      await c.env.DB.prepare(
        'INSERT INTO user_profiles (id, role, display_name, email, password_hash) VALUES (?, ?, ?, ?, ?)'
      ).bind(id, 'super_admin', 'Super Admin', body.email.toLowerCase(), passwordHash).run()

      const token = await signJWT(
        { sub: id, email: body.email.toLowerCase(), role: 'super_admin', name: 'Super Admin', exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 },
        c.env.JWT_SECRET
      )
      return c.json({ data: { token, user: { id, email: body.email.toLowerCase(), role: 'super_admin', name: 'Super Admin' } } })
    }
    return c.json({ error: 'Invalid credentials' }, 401)
  }

  if (!user.password_hash) {
    return c.json({ error: 'Password not set for this account' }, 401)
  }

  const valid = await verifyPassword(body.password, user.password_hash)
  if (!valid) {
    return c.json({ error: 'Invalid credentials' }, 401)
  }

  const token = await signJWT(
    { sub: user.id, email: user.email, role: user.role, name: user.display_name, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 },
    c.env.JWT_SECRET
  )

  return c.json({ data: { token, user: { id: user.id, email: user.email, role: user.role, name: user.display_name } } })
})

// GET /api/auth/me — return current user from token
router.get('/me', async (c) => {
  const authHeader = c.req.header('Authorization')
  if (!authHeader?.startsWith('Bearer ')) return c.json({ error: 'Unauthorized' }, 401)

  const payload = await verifyJWT(authHeader.slice(7), c.env.JWT_SECRET)
  if (!payload) return c.json({ error: 'Invalid token' }, 401)

  const user = await c.env.DB.prepare(
    'SELECT id, role, display_name, email FROM user_profiles WHERE id = ?'
  ).bind(payload.sub).first()

  return c.json({ data: user })
})

async function verifyJWT(token: string, secret: string) {
  const { verifyJWT: verify } = await import('../lib/jwt')
  return verify(token, secret)
}

export default router
