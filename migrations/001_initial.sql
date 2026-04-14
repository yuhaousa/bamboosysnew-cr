-- ─── Users ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_profiles (
  id TEXT PRIMARY KEY,
  role TEXT NOT NULL DEFAULT 'editor' CHECK(role IN ('super_admin', 'admin', 'editor')),
  display_name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ─── Pages ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pages (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'published', 'scheduled')),
  seo TEXT NOT NULL DEFAULT '{}',
  author_id TEXT NOT NULL,
  author_name TEXT,
  published_at TEXT,
  scheduled_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
CREATE INDEX IF NOT EXISTS idx_pages_status ON pages(status);

-- ─── Page Blocks ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS page_blocks (
  id TEXT PRIMARY KEY,
  page_id TEXT NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '{}',
  styles TEXT NOT NULL DEFAULT '{}',
  visibility INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_blocks_page_id ON page_blocks(page_id);
CREATE INDEX IF NOT EXISTS idx_blocks_sort ON page_blocks(page_id, sort_order);

-- ─── Media ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS media (
  id TEXT PRIMARY KEY,
  filename TEXT NOT NULL,
  r2_key TEXT NOT NULL,
  url TEXT NOT NULL,
  size INTEGER NOT NULL DEFAULT 0,
  mime_type TEXT NOT NULL DEFAULT '',
  alt TEXT,
  uploaded_by TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ─── Site Settings ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '{}',
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Default site settings
INSERT OR IGNORE INTO site_settings (key, value) VALUES
  ('general', '{"siteName":"My Website","tagline":"","logo":"","favicon":"","maintenanceMode":false,"maintenanceMessage":"We are currently down for maintenance. Please check back soon."}'),
  ('seo', '{"defaultMetaTitle":"My Website","defaultMetaDescription":"","contactEmail":"","contactPhone":"","address":""}'),
  ('social', '{"facebook":"","twitter":"","instagram":"","linkedin":"","youtube":"","tiktok":""}'),
  ('theme', '{"primaryColor":"#3B82F6","secondaryColor":"#1E40AF","accentColor":"#F59E0B","fontHeading":"Inter","fontBody":"Inter"}');

-- ─── Menus ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS menus (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  items TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Default menus
INSERT OR IGNORE INTO menus (id, name, slug, items) VALUES
  ('menu-header', 'Header Navigation', 'header', '[{"id":"1","label":"Home","link":"/"},{"id":"2","label":"About","link":"/about"},{"id":"3","label":"Services","link":"/services"},{"id":"4","label":"Contact","link":"/contact"}]'),
  ('menu-footer', 'Footer Navigation', 'footer', '[{"id":"1","label":"Home","link":"/"},{"id":"2","label":"Privacy Policy","link":"/privacy"},{"id":"3","label":"Terms","link":"/terms"}]');

-- ─── Page Revisions ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS page_revisions (
  id TEXT PRIMARY KEY,
  page_id TEXT NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  blocks_snapshot TEXT NOT NULL DEFAULT '[]',
  page_snapshot TEXT NOT NULL DEFAULT '{}',
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_revisions_page ON page_revisions(page_id);

-- ─── Audit Logs ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  user_name TEXT,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT NOT NULL DEFAULT '',
  metadata TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at DESC);
