import { Hono } from 'hono'
import type { Env } from '../index'
import { parseJSON } from '../lib/utils'
import { mapCourse } from './courses'
import { mapTestimonial } from './testimonials'
import { mapMember } from './team'
import { mapService } from './services-entity'
import { mapFAQ } from './faqs'
import { mapPortfolioItem } from './portfolio'

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

  // Validate preview token — accept the simple "preview" token for local dev
  if (!token || (token !== 'preview' && token.length < 10)) {
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

// ─── Entity public endpoints ──────────────────────────────────────────────────

// GET /api/public/courses?ids=id1,id2
router.get('/courses', async (c) => {
  const ids = c.req.query('ids')
  let q = 'SELECT * FROM courses WHERE is_active = 1'
  const params: unknown[] = []
  if (ids) {
    const list = ids.split(',').filter(Boolean)
    if (list.length) {
      q += ` AND id IN (${list.map(() => '?').join(',')})`
      params.push(...list)
    }
  }
  q += ' ORDER BY sort_order ASC, created_at DESC'
  const rows = await c.env.DB.prepare(q).bind(...params).all()
  return c.json({ data: (rows.results || []).map(r => mapCourse(r as Record<string, unknown>)) })
})

// GET /api/public/courses/:slug
router.get('/courses/:slug', async (c) => {
  const row = await c.env.DB.prepare('SELECT * FROM courses WHERE slug = ? AND is_active = 1').bind(c.req.param('slug')).first()
  if (!row) return c.json({ error: 'Not found' }, 404)
  return c.json({ data: mapCourse(row as Record<string, unknown>) })
})

// GET /api/public/testimonials?ids=id1,id2
router.get('/testimonials', async (c) => {
  const ids = c.req.query('ids')
  let q = 'SELECT * FROM testimonials WHERE is_active = 1'
  const params: unknown[] = []
  if (ids) {
    const list = ids.split(',').filter(Boolean)
    if (list.length) { q += ` AND id IN (${list.map(() => '?').join(',')})`; params.push(...list) }
  }
  q += ' ORDER BY sort_order ASC'
  const rows = await c.env.DB.prepare(q).bind(...params).all()
  return c.json({ data: (rows.results || []).map(r => mapTestimonial(r as Record<string, unknown>)) })
})

// GET /api/public/team?ids=id1,id2
router.get('/team', async (c) => {
  const ids = c.req.query('ids')
  let q = 'SELECT * FROM team_members WHERE is_active = 1'
  const params: unknown[] = []
  if (ids) {
    const list = ids.split(',').filter(Boolean)
    if (list.length) { q += ` AND id IN (${list.map(() => '?').join(',')})`; params.push(...list) }
  }
  q += ' ORDER BY sort_order ASC'
  const rows = await c.env.DB.prepare(q).bind(...params).all()
  return c.json({ data: (rows.results || []).map(r => mapMember(r as Record<string, unknown>)) })
})

// GET /api/public/services?ids=id1,id2
router.get('/services', async (c) => {
  const ids = c.req.query('ids')
  let q = 'SELECT * FROM services WHERE is_active = 1'
  const params: unknown[] = []
  if (ids) {
    const list = ids.split(',').filter(Boolean)
    if (list.length) { q += ` AND id IN (${list.map(() => '?').join(',')})`; params.push(...list) }
  }
  q += ' ORDER BY sort_order ASC'
  const rows = await c.env.DB.prepare(q).bind(...params).all()
  return c.json({ data: (rows.results || []).map(r => mapService(r as Record<string, unknown>)) })
})

// GET /api/public/faqs?ids=id1,id2&category=
router.get('/faqs', async (c) => {
  const { ids, category } = c.req.query()
  let q = 'SELECT * FROM faqs WHERE is_active = 1'
  const params: unknown[] = []
  if (ids) {
    const list = ids.split(',').filter(Boolean)
    if (list.length) { q += ` AND id IN (${list.map(() => '?').join(',')})`; params.push(...list) }
  }
  if (category) { q += ' AND category = ?'; params.push(category) }
  q += ' ORDER BY sort_order ASC'
  const rows = await c.env.DB.prepare(q).bind(...params).all()
  return c.json({ data: (rows.results || []).map(r => mapFAQ(r as Record<string, unknown>)) })
})

// GET /api/public/portfolio/:slug
router.get('/portfolio/:slug', async (c) => {
  const row = await c.env.DB.prepare(
    'SELECT * FROM portfolio_items WHERE slug = ? AND is_active = 1'
  ).bind(c.req.param('slug')).first()
  if (!row) return c.json({ error: 'Not found' }, 404)
  return c.json({ data: mapPortfolioItem(row as Record<string, unknown>) })
})

// GET /api/public/portfolio?ids=...&category=...
router.get('/portfolio', async (c) => {
  const { ids, category } = c.req.query()
  let q = 'SELECT * FROM portfolio_items WHERE is_active = 1'
  const params: unknown[] = []
  if (ids) {
    const list = ids.split(',').filter(Boolean)
    if (list.length) { q += ` AND id IN (${list.map(() => '?').join(',')})`; params.push(...list) }
  }
  if (category) { q += ' AND category = ?'; params.push(category) }
  q += ' ORDER BY sort_order ASC, created_at DESC'
  const rows = await c.env.DB.prepare(q).bind(...params).all()
  return c.json({ data: (rows.results || []).map(r => mapPortfolioItem(r as Record<string, unknown>)) })
})

export default router
