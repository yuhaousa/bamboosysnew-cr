-- ─── Clients ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS clients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT,
  icon TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_clients_active ON clients(is_active);

-- ─── Partners ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS partners (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT,
  partner_type TEXT NOT NULL CHECK(partner_type IN ('strategic', 'industry')),
  is_active INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_partners_active ON partners(is_active);
CREATE INDEX IF NOT EXISTS idx_partners_type ON partners(partner_type);
