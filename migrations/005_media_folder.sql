-- Add folder support to media table
ALTER TABLE media ADD COLUMN folder TEXT NOT NULL DEFAULT 'general';
CREATE INDEX IF NOT EXISTS idx_media_folder ON media(folder);
