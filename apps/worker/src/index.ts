import { Hono } from 'hono'
import { corsMiddleware } from './middleware/cors'
import { authMiddleware } from './middleware/auth'
import authRouter from './routes/auth'
import pagesRouter from './routes/pages'
import blocksRouter from './routes/blocks'
import mediaRouter from './routes/media'
import settingsRouter from './routes/settings'
import menusRouter from './routes/menus'
import revisionsRouter from './routes/revisions'
import usersRouter from './routes/users'
import auditRouter from './routes/audit'
import publicRouter from './routes/public'

export interface Env {
  DB: D1Database
  BUCKET: R2Bucket
  JWT_SECRET: string
  ADMIN_EMAIL: string
  ADMIN_PASSWORD: string
  MEDIA_BASE_URL: string
  ADMIN_ORIGIN: string
  FRONTEND_ORIGIN: string
}

const app = new Hono<{ Bindings: Env }>()

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use('*', corsMiddleware)

// ─── Public routes (no auth) ─────────────────────────────────────────────────
app.route('/api/public', publicRouter)
app.route('/api/auth', authRouter)

// ─── Protected routes ────────────────────────────────────────────────────────
app.use('/api/*', authMiddleware)

app.route('/api/pages', pagesRouter)
app.route('/api/blocks', blocksRouter)
app.route('/api/media', mediaRouter)
app.route('/api/settings', settingsRouter)
app.route('/api/menus', menusRouter)
app.route('/api/revisions', revisionsRouter)
app.route('/api/users', usersRouter)
app.route('/api/audit', auditRouter)

// ─── 404 ──────────────────────────────────────────────────────────────────────
app.notFound((c) => c.json({ error: 'Not found' }, 404))

app.onError((err, c) => {
  console.error('Worker error:', err)
  return c.json({ error: 'Internal server error' }, 500)
})

export default app
