import { createMiddleware } from 'hono/factory'
import { verifyJWT } from '../lib/jwt'
import type { Env } from '../index'

declare module 'hono' {
  interface ContextVariableMap {
    userId: string
    userRole: string
    userName: string
  }
}

export const authMiddleware = createMiddleware<{ Bindings: Env }>(async (c, next) => {
  const authHeader = c.req.header('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const payload = await verifyJWT(authHeader.slice(7), c.env.JWT_SECRET)

  if (!payload?.sub) {
    return c.json({ error: 'Invalid or expired token' }, 401)
  }

  c.set('userId', payload.sub as string)
  c.set('userRole', (payload.role as string) ?? 'editor')
  c.set('userName', (payload.name as string) ?? '')

  await next()
})

export function requireRole(...roles: string[]) {
  return createMiddleware<{ Bindings: Env }>(async (c, next) => {
    const role = c.get('userRole')
    if (!roles.includes(role)) {
      return c.json({ error: 'Forbidden' }, 403)
    }
    await next()
  })
}
