-- ========================================
-- CRM TABLES FOR behaviorschool.com
-- Run this in Supabase SQL editor
-- ========================================

-- Drop policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "crm_contacts_service_role" ON crm_contacts;
DROP POLICY IF EXISTS "crm_contact_tags_service_role" ON crm_contact_tags;
DROP POLICY IF EXISTS "crm_interactions_service_role" ON crm_interactions;

-- ========================================
-- 1. CRM CONTACTS
-- ========================================
CREATE TABLE IF NOT EXISTS crm_contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  organization TEXT,
  role TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_crm_contacts_email ON crm_contacts(email);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_role ON crm_contacts(role);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_updated_at ON crm_contacts(updated_at DESC);

CREATE OR REPLACE FUNCTION update_crm_contacts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_crm_contacts_updated_at ON crm_contacts;
CREATE TRIGGER trigger_update_crm_contacts_updated_at
  BEFORE UPDATE ON crm_contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_crm_contacts_updated_at();

ALTER TABLE crm_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "crm_contacts_service_role" ON crm_contacts
  FOR ALL USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ========================================
-- 2. CRM CONTACT TAGS
-- ========================================
CREATE TABLE IF NOT EXISTS crm_contact_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contact_id UUID NOT NULL REFERENCES crm_contacts(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_crm_contact_tags_unique
  ON crm_contact_tags(contact_id, tag);

CREATE INDEX IF NOT EXISTS idx_crm_contact_tags_tag ON crm_contact_tags(tag);

ALTER TABLE crm_contact_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "crm_contact_tags_service_role" ON crm_contact_tags
  FOR ALL USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ========================================
-- 3. CRM INTERACTIONS
-- ========================================
CREATE TABLE IF NOT EXISTS crm_interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contact_id UUID NOT NULL REFERENCES crm_contacts(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  interaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_crm_interactions_contact ON crm_interactions(contact_id);
CREATE INDEX IF NOT EXISTS idx_crm_interactions_date ON crm_interactions(interaction_date DESC);

ALTER TABLE crm_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "crm_interactions_service_role" ON crm_interactions
  FOR ALL USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ========================================
-- 4. GRANTS
-- ========================================
GRANT ALL ON crm_contacts TO service_role;
GRANT ALL ON crm_contact_tags TO service_role;
GRANT ALL ON crm_interactions TO service_role;

-- ========================================
-- SETUP COMPLETE
-- ========================================
