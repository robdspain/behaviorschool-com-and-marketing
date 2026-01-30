-- =====================================================
-- BEHAVIOR SCHOOL CRM SYSTEM
-- Complete customer lifecycle management
-- =====================================================

-- =====================================================
-- 1. CONTACTS TABLE
-- Central repository for all contacts (leads, prospects, customers)
-- =====================================================
CREATE TABLE IF NOT EXISTS crm_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Basic Information
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,

  -- Professional Information
  organization TEXT,
  role TEXT, -- BCBA, BCaBA, Teacher, etc.
  caseload_size INTEGER,

  -- Contact Status
  status TEXT NOT NULL DEFAULT 'lead', -- lead, contacted, qualified, onboarding, customer, churned
  lead_source TEXT, -- signup_form, referral, social_media, etc.

  -- Scoring & Priority
  lead_score INTEGER DEFAULT 0, -- 0-100
  priority TEXT DEFAULT 'medium', -- low, medium, high, urgent

  -- Relationships
  assigned_to TEXT, -- Email of admin/sales rep

  -- Enrichment
  tags TEXT[], -- Array of tags like ['bcba', 'school-based', 'high-intent']
  custom_fields JSONB, -- Flexible field for additional data

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_contacted_at TIMESTAMPTZ,

  -- Soft Delete
  is_archived BOOLEAN DEFAULT false
);

-- =====================================================
-- 2. DEALS/OPPORTUNITIES TABLE
-- Track sales pipeline and revenue
-- =====================================================
CREATE TABLE IF NOT EXISTS crm_deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Deal Information
  contact_id UUID NOT NULL REFERENCES crm_contacts(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  value DECIMAL(10,2), -- Deal value in dollars

  -- Pipeline Stage
  stage TEXT NOT NULL DEFAULT 'new', -- new, contacted, demo_scheduled, proposal_sent, negotiation, closed_won, closed_lost
  probability INTEGER DEFAULT 0, -- 0-100% likelihood of closing

  -- Dates
  expected_close_date DATE,
  closed_date DATE,

  -- Details
  notes TEXT,
  loss_reason TEXT, -- If closed_lost

  -- Assignment
  assigned_to TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 3. ACTIVITIES TABLE
-- Log all interactions (calls, emails, meetings, notes)
-- =====================================================
CREATE TABLE IF NOT EXISTS crm_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relationships
  contact_id UUID NOT NULL REFERENCES crm_contacts(id) ON DELETE CASCADE,
  deal_id UUID REFERENCES crm_deals(id) ON DELETE SET NULL,

  -- Activity Details
  activity_type TEXT NOT NULL, -- call, email, meeting, note, task_completed
  subject TEXT NOT NULL,
  description TEXT,

  -- Outcome (for calls/meetings)
  outcome TEXT, -- successful, no_answer, left_voicemail, rescheduled, etc.

  -- Duration
  duration_minutes INTEGER,

  -- Logged By
  created_by TEXT NOT NULL, -- Email of person who logged it

  -- Metadata
  activity_date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 4. TASKS TABLE
-- Follow-ups and to-do items
-- =====================================================
CREATE TABLE IF NOT EXISTS crm_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relationships
  contact_id UUID REFERENCES crm_contacts(id) ON DELETE CASCADE,
  deal_id UUID REFERENCES crm_deals(id) ON DELETE CASCADE,

  -- Task Details
  title TEXT NOT NULL,
  description TEXT,
  task_type TEXT, -- call, email, follow_up, demo, proposal, etc.

  -- Status & Priority
  status TEXT NOT NULL DEFAULT 'pending', -- pending, completed, cancelled
  priority TEXT DEFAULT 'medium', -- low, medium, high, urgent

  -- Assignment & Dates
  assigned_to TEXT NOT NULL,
  due_date TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ,

  -- Reminder
  reminder_sent BOOLEAN DEFAULT false,

  -- Metadata
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 5. EMAIL SEQUENCES TABLE
-- Automated email campaign tracking
-- =====================================================
CREATE TABLE IF NOT EXISTS crm_email_sequences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Sequence Information
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 6. EMAIL SEQUENCE ENROLLMENTS
-- Track which contacts are in which sequences
-- =====================================================
CREATE TABLE IF NOT EXISTS crm_sequence_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  contact_id UUID NOT NULL REFERENCES crm_contacts(id) ON DELETE CASCADE,
  sequence_id UUID NOT NULL REFERENCES crm_email_sequences(id) ON DELETE CASCADE,

  status TEXT NOT NULL DEFAULT 'active', -- active, paused, completed, unsubscribed
  current_step INTEGER DEFAULT 0,

  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,

  UNIQUE(contact_id, sequence_id)
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_contacts_email ON crm_contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON crm_contacts(status);
CREATE INDEX IF NOT EXISTS idx_contacts_assigned ON crm_contacts(assigned_to);
CREATE INDEX IF NOT EXISTS idx_contacts_archived ON crm_contacts(is_archived) WHERE is_archived = false;

CREATE INDEX IF NOT EXISTS idx_deals_contact ON crm_deals(contact_id);
CREATE INDEX IF NOT EXISTS idx_deals_stage ON crm_deals(stage);
CREATE INDEX IF NOT EXISTS idx_deals_assigned ON crm_deals(assigned_to);

CREATE INDEX IF NOT EXISTS idx_activities_contact ON crm_activities(contact_id);
CREATE INDEX IF NOT EXISTS idx_activities_deal ON crm_activities(deal_id);
CREATE INDEX IF NOT EXISTS idx_activities_date ON crm_activities(activity_date DESC);

CREATE INDEX IF NOT EXISTS idx_tasks_contact ON crm_tasks(contact_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned ON crm_tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_due ON crm_tasks(due_date) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_tasks_status ON crm_tasks(status);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE crm_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_email_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_sequence_enrollments ENABLE ROW LEVEL SECURITY;

-- Service role can do everything
CREATE POLICY "Service role full access on crm_contacts" ON crm_contacts FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access on crm_deals" ON crm_deals FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access on crm_activities" ON crm_activities FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access on crm_tasks" ON crm_tasks FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access on crm_email_sequences" ON crm_email_sequences FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access on crm_sequence_enrollments" ON crm_sequence_enrollments FOR ALL TO service_role USING (true) WITH CHECK (true);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_crm_contacts_updated_at BEFORE UPDATE ON crm_contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crm_deals_updated_at BEFORE UPDATE ON crm_deals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crm_tasks_updated_at BEFORE UPDATE ON crm_tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SYNC EXISTING SIGNUP DATA TO CRM
-- Migrate existing signup_submissions to crm_contacts
-- =====================================================
INSERT INTO crm_contacts (
  first_name,
  last_name,
  email,
  phone,
  organization,
  role,
  caseload_size,
  status,
  lead_source,
  custom_fields,
  created_at
)
SELECT
  first_name,
  last_name,
  email,
  phone,
  organization,
  role,
  CASE
    WHEN caseload_size ~ '^[0-9]+$' THEN caseload_size::INTEGER
    ELSE NULL
  END as caseload_size,
  CASE
    WHEN status = 'new' THEN 'lead'
    ELSE status
  END as status,
  'signup_form' as lead_source,
  jsonb_build_object(
    'current_challenges', current_challenges,
    'original_submission_id', id
  ) as custom_fields,
  submitted_at as created_at
FROM signup_submissions
WHERE email NOT IN (SELECT email FROM crm_contacts)
ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- VIEWS FOR REPORTING
-- =====================================================

-- Pipeline Overview
CREATE OR REPLACE VIEW crm_pipeline_summary AS
SELECT
  stage,
  COUNT(*) as deal_count,
  SUM(value) as total_value,
  AVG(probability) as avg_probability
FROM crm_deals
GROUP BY stage
ORDER BY
  CASE stage
    WHEN 'new' THEN 1
    WHEN 'contacted' THEN 2
    WHEN 'demo_scheduled' THEN 3
    WHEN 'proposal_sent' THEN 4
    WHEN 'negotiation' THEN 5
    WHEN 'closed_won' THEN 6
    WHEN 'closed_lost' THEN 7
  END;

-- Contact Activity Summary
CREATE OR REPLACE VIEW crm_contact_activity_summary AS
SELECT
  c.id,
  c.first_name,
  c.last_name,
  c.email,
  c.status,
  COUNT(DISTINCT a.id) as activity_count,
  MAX(a.activity_date) as last_activity_date,
  COUNT(DISTINCT d.id) as deal_count,
  COUNT(DISTINCT t.id) FILTER (WHERE t.status = 'pending') as pending_tasks
FROM crm_contacts c
LEFT JOIN crm_activities a ON c.id = a.contact_id
LEFT JOIN crm_deals d ON c.id = d.contact_id
LEFT JOIN crm_tasks t ON c.id = t.contact_id
WHERE c.is_archived = false
GROUP BY c.id, c.first_name, c.last_name, c.email, c.status;
