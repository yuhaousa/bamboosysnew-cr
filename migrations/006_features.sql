-- ─── Features ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS features (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  is_active INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_features_active ON features(is_active);

-- ─── Feature Items ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS feature_items (
  id TEXT PRIMARY KEY,
  feature_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  stack TEXT DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (feature_id) REFERENCES features(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_feature_items_feature ON feature_items(feature_id);
