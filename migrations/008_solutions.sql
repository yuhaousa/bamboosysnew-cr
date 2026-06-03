-- ─── Solutions ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS solutions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_solutions_active ON solutions(is_active);

-- ─── Solution Entries ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS solution_entries (
  id TEXT PRIMARY KEY,
  solution_id TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  description TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (solution_id) REFERENCES solutions(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_solution_entries_solution ON solution_entries(solution_id);
