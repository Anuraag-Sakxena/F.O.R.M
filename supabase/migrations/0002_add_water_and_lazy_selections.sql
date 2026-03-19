-- Add water intake and lazy day selections to daily records.
-- These are JSONB columns with safe defaults for backward compatibility.

ALTER TABLE daily_records
  ADD COLUMN IF NOT EXISTS water_intake jsonb NOT NULL DEFAULT '{"amount":0,"target":3000}',
  ADD COLUMN IF NOT EXISTS lazy_selections jsonb NOT NULL DEFAULT '{}';
