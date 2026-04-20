import { Hono } from 'hono'
import { v4 as uuid } from 'uuid'
import type { Env } from '../index'
import { logAudit, now } from '../lib/utils'
import { requireRole } from '../middleware/auth'

const router = new Hono<{ Bindings: Env }>()

// GET /api/media/file/:r2Key+ — serve R2 file directly (local dev fallback)
router.get('/file/:key{.+}', async (c) => {
  const key = c.req.param('key')
  const obj = await c.env.BUCKET.get(key)
  if (!obj) return c.json({ error: 'Not found' }, 404)
  const headers = new Headers()
  obj.writeHttpMetadata(headers)
  headers.set('cache-control', 'public, max-age=31536000')
  return new Response(obj.body, { headers })
})

// GET /api/media — list media
router.get('/', async (c) => {
  const { page = '1', limit = '50', search } = c.req.query()
  const offset = (parseInt(page) - 1) * parseInt(limit)

  let query = 'SELECT * FROM media WHERE 1=1'
  const params: unknown[] = []

  if (search) {
    query += ' AND (filename LIKE ? OR alt LIKE ?)'
    params.push(`%${search}%`, `%${search}%`)
  }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
  params.push(parseInt(limit), offset)

  const [rows, countRow] = await Promise.all([
    c.env.DB.prepare(query).bind(...params).all(),
    c.env.DB.prepare(`SELECT COUNT(*) as total FROM media${search ? ' WHERE filename LIKE ? OR alt LIKE ?' : ''}`).bind(...(search ? [`%${search}%`, `%${search}%`] : [])).first<{ total: number }>(),
  ])

  return c.json({ data: rows.results || [], total: countRow?.total ?? 0 })
})

// POST /api/media/upload — upload to R2
router.post('/upload', async (c) => {
  const formData = await c.req.formData()
  const file = formData.get('file') as File | null
  const alt = formData.get('alt') as string | null

  if (!file) return c.json({ error: 'No file provided' }, 400)

  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/avif']
  if (!allowedTypes.includes(file.type)) {
    return c.json({ error: 'File type not allowed' }, 400)
  }

  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    return c.json({ error: 'File too large (max 10MB)' }, 400)
  }

  const userId = c.get('userId')
  const userName = c.get('userName')
  const id = uuid()
  const ext = file.name.split('.').pop()
  const r2Key = `media/${id}.${ext}`

  await c.env.BUCKET.put(r2Key, file.stream(), {
    httpMetadata: { contentType: file.type },
    customMetadata: { uploadedBy: userId },
  })

  const url = `${c.env.MEDIA_BASE_URL}/${r2Key}`
  const ts = now()

  await c.env.DB.prepare(
    `INSERT INTO media (id, filename, r2_key, url, size, mime_type, alt, uploaded_by, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(id, file.name, r2Key, url, file.size, file.type, alt ?? '', userId, ts).run()

  await logAudit(c.env.DB, userId, userName, 'media.upload', 'media', id, { filename: file.name })

  const row = await c.env.DB.prepare('SELECT * FROM media WHERE id = ?').bind(id).first()
  return c.json({ data: row }, 201)
})

// PATCH /api/media/:id — update alt text
router.patch('/:id', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json<{ alt?: string }>()

  await c.env.DB.prepare('UPDATE media SET alt = ? WHERE id = ?').bind(body.alt ?? '', id).run()

  const row = await c.env.DB.prepare('SELECT * FROM media WHERE id = ?').bind(id).first()
  return c.json({ data: row })
})

// DELETE /api/media/:id
router.delete('/:id', requireRole('super_admin', 'admin'), async (c) => {
  const id = c.req.param('id')
  const userId = c.get('userId')
  const userName = c.get('userName')

  const row = await c.env.DB.prepare('SELECT r2_key, filename FROM media WHERE id = ?').bind(id).first<{ r2_key: string; filename: string }>()
  if (!row) return c.json({ error: 'Media not found' }, 404)

  await c.env.BUCKET.delete(row.r2_key)
  await c.env.DB.prepare('DELETE FROM media WHERE id = ?').bind(id).run()
  await logAudit(c.env.DB, userId, userName, 'media.delete', 'media', id, { filename: row.filename })

  return c.json({ data: { message: 'Media deleted' } })
})

export default router
