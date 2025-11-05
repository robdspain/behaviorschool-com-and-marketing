-- Add optional columns used by Admin → Sitemap controls
-- Safe to run multiple times

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'page_index_settings' AND column_name = 'in_sitemap'
  ) THEN
    ALTER TABLE page_index_settings ADD COLUMN in_sitemap boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'page_index_settings' AND column_name = 'deleted'
  ) THEN
    ALTER TABLE page_index_settings ADD COLUMN deleted boolean DEFAULT false;
  END IF;
END $$;

