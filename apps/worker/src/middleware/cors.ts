import { createMiddleware } from 'hono/factory'
import type { Env } from '../index'

export const corsMiddleware = createMiddleware<{ Bindings: Env }>(async (c, next) => {
  const origin = c.req.header('Origin') || ''
  const allowedOrigins = [
    c.env.ADMIN_ORIGIN,
    c.env.FRONTEND_ORIGIN,
    'http://localhost:5173',
    'http://localhost:5174',
  ].filter(Boolean)

  const isAllowed = allowedOrigins.includes(origin)
  const allowOrigin = isAllowed ? origin : allowedOrigins[0] || '*'

  if (c.req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': allowOrigin,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    })
  }

  await next()

  c.res.headers.set('Access-Control-Allow-Origin', allowOrigin)
  c.res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
  c.res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
})
