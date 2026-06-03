-- ─── About Us ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS about_us (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_about_us_active ON about_us(is_active);

-- ─── About Us Entries ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS about_us_entries (
  id TEXT PRIMARY KEY,
  about_us_id TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  description TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (about_us_id) REFERENCES about_us(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_about_us_entries_parent ON about_us_entries(about_us_id);
