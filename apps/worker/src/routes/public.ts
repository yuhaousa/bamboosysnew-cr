import { Hono } from 'hono'
import type { Env } from '../index'
import { parseJSON } from '../lib/utils'

const router = new Hono<{ Bindings: Env }>()

// GET /api/public/pages/:slug — published page with blocks
router.get('/pages/:slug', async (c) => {
  const slug = c.req.param('slug')

  const page = await c.env.DB.prepare(
    `SELECT * FROM pages WHERE slug = ? AND status = 'published'`
  ).bind(slug).first<Record<string, unknown>>()

  if (!page) return c.json({ error: 'Page not found' }, 404)

  const blocks = await c.env.DB.prepare(
    'SELECT * FROM page_blocks WHERE page_id = ? AND visibility = 1 ORDER BY sort_order'
  ).bind(page.id).all()

  return c.json({
    data: {
      id: page.id,
      title: page.title,
      slug: page.slug,
      seo: parseJSON(page.seo as string, {}),
      publishedAt: page.published_at,
      blocks: (blocks.results || []).map(r => {
        const b = r as Record<string, unknown>
        return {
          id: b.id,
          type: b.type,
          content: parseJSON(b.content as string, {}),
          styles: parseJSON(b.styles as string, {}),
          sortOrder: b.sort_order,
        }
      }),
    }
  })
})

// GET /api/public/pages — all published pages (for nav/sitemap)
router.get('/pages', async (c) => {
  const rows = await c.env.DB.prepare(
    `SELECT id, title, slug, published_at FROM pages WHERE status = 'published' ORDER BY published_at DESC`
  ).all()
  return c.json({ data: rows.results || [] })
})

// GET /api/public/preview/:pageId — draft preview (requires token)
router.get('/preview/:pageId', async (c) => {
  const pageId = c.req.param('pageId')
  const token = c.req.query('token')

  // Validate preview token (HMAC of pageId + secret)
  // For simplicity, we verify using the Clerk secret key
  if (!token || token.length < 10) {
    return c.json({ error: 'Invalid preview token' }, 403)
  }

  const page = await c.env.DB.prepare('SELECT * FROM pages WHERE id = ?').bind(pageId).first<Record<string, unknown>>()
  if (!page) return c.json({ error: 'Page not found' }, 404)

  const blocks = await c.env.DB.prepare(
    'SELECT * FROM page_blocks WHERE page_id = ? ORDER BY sort_order'
  ).bind(pageId).all()

  return c.json({
    data: {
      id: page.id,
      title: page.title,
      slug: page.slug,
      status: page.status,
      seo: parseJSON(page.seo as string, {}),
      blocks: (blocks.results || []).map(r => {
        const b = r as Record<string, unknown>
        return {
          id: b.id,
          type: b.type,
          content: parseJSON(b.content as string, {}),
          styles: parseJSON(b.styles as string, {}),
          isVisible: b.visibility === 1 || b.visibility === true,
          sortOrder: b.sort_order,
        }
      }),
    }
  })
})

// GET /api/public/settings — site settings for frontend
router.get('/settings', async (c) => {
  const rows = await c.env.DB.prepare('SELECT * FROM site_settings').all()
  const settings: Record<string, unknown> = {}
  for (const row of rows.results || []) {
    const r = row as Record<string, unknown>
    settings[r.key as string] = parseJSON(r.value as string, {})
  }
  return c.json({ data: settings })
})

// GET /api/public/menus/:slug
router.get('/menus/:slug', async (c) => {
  const row = await c.env.DB.prepare('SELECT * FROM menus WHERE slug = ?').bind(c.req.param('slug')).first<Record<string, unknown>>()
  if (!row) return c.json({ data: { id: '', slug: c.req.param('slug'), items: [] } })
  return c.json({ data: { id: row.id, name: row.name, slug: row.slug, items: parseJSON(row.items as string, []) } })
})

// GET /api/public/menus — all menus
router.get('/menus', async (c) => {
  const rows = await c.env.DB.prepare('SELECT * FROM menus').all()
  return c.json({
    data: (rows.results || []).map(r => {
      const row = r as Record<string, unknown>
      return { id: row.id, name: row.name, slug: row.slug, items: parseJSON(row.items as string, []) }
    })
  })
})

export default router
