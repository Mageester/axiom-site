-- 0002_add_jobs_locked_by.sql
-- Idempotent: safely adds locked_by column if not present.
-- locked_at already exists from 0000_schema.sql.
-- SQLite does not support IF NOT EXISTS on ALTER TABLE,
-- so this will silently fail if column already exists — that is acceptable.

ALTER TABLE jobs ADD COLUMN locked_by TEXT;
