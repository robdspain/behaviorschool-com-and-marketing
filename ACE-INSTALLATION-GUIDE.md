# ACE Platform - Installation Guide

## 🎯 Overview

This guide walks you through setting up the **full BACB ACE Provider Platform** with 2026 compliance features.

**Important:** You must apply the schemas **in the correct order**:
1. First: `ace-ceu-platform-schema.sql` (base schema)
2. Then: `ace-2026-requirements-migration.sql` (2026 enhancements)

---

## 📋 Prerequisites

- Supabase project created
- Database access (psql or Supabase SQL Editor)
- PostgreSQL 14+ (Supabase default)

---

## 🚀 Installation Steps

### Step 1: Apply Base Schema

This creates all the core ACE platform tables.

```bash
# Option A: Using psql
psql -h your-project.supabase.co -U postgres -d postgres -f sql/ace-ceu-platform-schema.sql

# Option B: Using Supabase SQL Editor
# 1. Copy contents of sql/ace-ceu-platform-schema.sql
# 2. Paste into Supabase SQL Editor
# 3. Click "Run"
```

**Verify:**
```sql
-- Should see 20+ tables
\dt ace_*

-- Check for these key tables:
-- ace_users
-- ace_providers
-- ace_events
-- ace_certificates
-- ace_instructor_qualifications
-- ace_attendance_records
-- etc.
```

### Step 2: Apply 2026 Requirements Migration

This adds all the new 2026 BACB compliance features.

```bash
# Option A: Using psql
psql -h your-project.supabase.co -U postgres -d postgres -f sql/ace-2026-requirements-migration.sql

# Option B: Using Supabase SQL Editor
# 1. Copy contents of sql/ace-2026-requirements-migration.sql
# 2. Paste into Supabase SQL Editor
# 3. Click "Run"
```

**Verify:**
```sql
-- Check for new tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name LIKE 'ace_%'
ORDER BY table_name;

-- Should include new 2026 tables:
-- ace_leadership_attestations
-- ace_compliance_reports
-- ace_renewal_history
-- ace_engagement_checks
-- ace_rbt_alignment_criteria

-- Check for new enums
\dT ace_*

-- Should include:
-- ace_event_type
-- ace_event_subtype
-- ace_instructor_qualification_path
-- ace_expertise_basis

-- Check for new functions
\df *2026*
\df can_provider*
\df calculate_*

-- Check for compliance view
\dv ace_compliance_dashboard
```

### Step 3: Verify Installation

```sql
-- Test 1: Check all tables exist
SELECT COUNT(*) FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name LIKE 'ace_%';
-- Expected: 25+ tables

-- Test 2: Check views
SELECT COUNT(*) FROM information_schema.views 
WHERE table_schema = 'public' AND table_name LIKE 'ace_%';
-- Expected: 2 views (ace_compliance_dashboard, ace_events_requiring_attention)

-- Test 3: Test a function
SELECT calculate_ceus_2026(120);
-- Expected: 2.0 (120 minutes = 2.0 CEUs)

-- Test 4: Check compliance dashboard view
SELECT * FROM ace_compliance_dashboard LIMIT 1;
-- Expected: No error (may be empty if no providers yet)
```

---

## 🗄️ What Was Installed

### Base Schema (`ace-ceu-platform-schema.sql`)

#### Tables (20+):
1. `ace_users` - User accounts
2. `ace_providers` - ACE Provider organizations/individuals
3. `ace_instructor_qualifications` - Instructor credentials
4. `ace_events` - CE events
5. `ace_event_sessions` - Event sessions
6. `ace_registrations` - Event registrations
7. `ace_attendance_records` - Attendance tracking
8. `ace_quizzes` - Event quizzes
9. `ace_quiz_questions` - Quiz questions
10. `ace_quiz_submissions` - Quiz submissions
11. `ace_quiz_answers` - Quiz answers
12. `ace_certificates` - Issued certificates
13. `ace_feedback_responses` - Participant feedback
14. `ace_complaints` - Complaint tracking
15. And more...

### 2026 Migration (`ace-2026-requirements-migration.sql`)

#### New Tables (5):
1. `ace_leadership_attestations` - Digital signatures from org leadership
2. `ace_compliance_reports` - Audit-ready compliance exports
3. `ace_renewal_history` - Renewal tracking with fees
4. `ace_engagement_checks` - Timestamped engagement verification
5. `ace_rbt_alignment_criteria` - PD event RBT 2026 alignment

#### New Columns (60+):
- `ace_providers`: 18 new columns (coordinator cert, legal entity, grace period)
- `ace_instructor_qualifications`: 14 new columns (6 qualification paths)
- `ace_events`: 13 new columns (CE/PD type, RBT alignment)
- `ace_certificates`: 4 new columns (subcategories, due dates)
- `ace_feedback_responses`: 4 new columns (coordinator review timeline)
- `ace_complaints`: 7 new columns (NAV notification, response deadlines)
- `ace_attendance_records`: 8 new columns (timestamps, engagement)

#### New Enums (4):
1. `ace_event_type` - 'ce' or 'pd'
2. `ace_event_subtype` - 'standard', 'journal_club', 'podcast'
3. `ace_instructor_qualification_path` - 6 options
4. `ace_expertise_basis` - 3 options

#### New Functions (4):
1. `calculate_minimum_questions_async_ce()` - Auto-calc 3 per CEU
2. `can_provider_publish_events()` - Check if provider lapsed
3. `calculate_ceus_2026()` - Strict 25-minute rule
4. `can_issue_certificate_2026()` - Verify all requirements met

#### New Views (2):
1. `ace_compliance_dashboard` - Real-time compliance scores
2. `ace_events_requiring_attention` - Events with validation issues

---

## 🧪 Post-Installation Testing

### Test 1: Create a Test Provider

```sql
-- Create test user
INSERT INTO ace_users (
  first_name, last_name, email, bacb_id, role
) VALUES (
  'Test', 'Coordinator', 'coordinator@test.com', 'BCBA-123456', 'ace_coordinator'
) RETURNING id;

-- Create test provider (save user id from above)
INSERT INTO ace_providers (
  provider_name,
  provider_type,
  coordinator_id,
  coordinator_years_certified,
  primary_email,
  coordinator_certification_date,
  coordinator_certification_expires,
  application_date,
  is_active
) VALUES (
  'Test ACE Provider LLC',
  'organization',
  '<user_id_from_above>',
  10,
  'info@testprovider.com',
  '2015-01-01',
  '2026-12-31',
  CURRENT_DATE,
  TRUE
) RETURNING id;
```

### Test 2: Check Compliance Dashboard

```sql
-- View provider compliance
SELECT 
  provider_name,
  provider_status,
  compliance_score,
  coordinator_cert_expiring_soon,
  legal_entity_compliant
FROM ace_compliance_dashboard;

-- Expected: See your test provider with compliance score
```

### Test 3: Test CEU Calculation

```sql
-- Test 2026 CEU calculation
SELECT 
  calculate_ceus_2026(25) as twentyfive_min,  -- Should be 0.5
  calculate_ceus_2026(50) as fifty_min,       -- Should be 1.0
  calculate_ceus_2026(120) as onehundredtwenty_min, -- Should be 2.0
  calculate_ceus_2026(45) as fortyfive_min;   -- Should be 0.5 (rounds down)
```

### Test 4: Test Provider Permissions

```sql
-- Test if provider can publish events
SELECT 
  provider_name,
  can_provider_publish_events(id) as can_publish
FROM ace_providers;

-- Expected: TRUE for active, non-lapsed providers
```

---

## ⚠️ Common Issues & Fixes

### Issue: "relation ace_providers does not exist"

**Cause:** You tried to run the 2026 migration before the base schema.

**Fix:**
```sql
-- Drop any partial migrations
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

-- Re-run in correct order:
-- 1. ace-ceu-platform-schema.sql
-- 2. ace-2026-requirements-migration.sql
```

### Issue: "type ace_event_type already exists"

**Cause:** You tried to run the migration twice.

**Fix:**
```sql
-- Check what exists
\dT ace_*

-- If you need to re-run, drop the migration first
-- (see rollback instructions in ace-2026-requirements-migration.sql)
```

### Issue: "function calculate_ceus_2026 does not exist"

**Cause:** Migration didn't complete successfully.

**Fix:**
```bash
# Check migration log for errors
tail -100 /path/to/migration.log

# Re-run just the functions section from the migration file
```

---

## 🔄 Rollback Instructions

If you need to rollback the 2026 migration:

```sql
-- Rollback 2026 enhancements (keeps base schema)
DROP VIEW IF EXISTS ace_compliance_dashboard CASCADE;
DROP VIEW IF EXISTS ace_events_requiring_attention CASCADE;
DROP TABLE IF EXISTS ace_rbt_alignment_criteria CASCADE;
DROP TABLE IF EXISTS ace_engagement_checks CASCADE;
DROP TABLE IF EXISTS ace_renewal_history CASCADE;
DROP TABLE IF EXISTS ace_compliance_reports CASCADE;
DROP TABLE IF EXISTS ace_leadership_attestations CASCADE;
DROP FUNCTION IF EXISTS can_issue_certificate_2026(UUID, UUID) CASCADE;
DROP FUNCTION IF EXISTS calculate_ceus_2026(INTEGER) CASCADE;
DROP FUNCTION IF EXISTS can_provider_publish_events(UUID) CASCADE;
DROP FUNCTION IF EXISTS calculate_minimum_questions_async_ce(UUID) CASCADE;
DROP TYPE IF EXISTS ace_expertise_basis CASCADE;
DROP TYPE IF EXISTS ace_instructor_qualification_path CASCADE;
DROP TYPE IF EXISTS ace_event_subtype CASCADE;
DROP TYPE IF EXISTS ace_event_type CASCADE;

-- Then manually ALTER TABLE to remove new columns
-- (See full list in ace-2026-requirements-migration.sql)
```

To rollback everything:

```sql
-- WARNING: This deletes ALL data
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
```

---

## 📁 File Locations

```
sql/
├── ace-ceu-platform-schema.sql          ← Apply FIRST (base schema)
├── ace-2026-requirements-migration.sql  ← Apply SECOND (2026 features)
└── simple-ce-tracking-schema.sql        ← Alternative (simple version)

Docs/
├── ace-ceu-platform-prd.md              ← Full requirements
├── ace-2026-requirements-summary.md     ← 2026 overview
├── ace-2026-implementation-plan.md      ← Sprint plan
└── ace-ceu-platform-erd.md              ← Entity relationship diagram

ACE-2026-QUICK-START.md                  ← Quick reference guide
ACE-INSTALLATION-GUIDE.md                ← This file
```

---

## ✅ Installation Complete Checklist

- [ ] Applied `ace-ceu-platform-schema.sql` successfully
- [ ] Applied `ace-2026-requirements-migration.sql` successfully
- [ ] Verified all 25+ tables exist
- [ ] Verified 2 views exist
- [ ] Verified 4 new functions exist
- [ ] Tested CEU calculation function
- [ ] Tested compliance dashboard view
- [ ] Created test provider
- [ ] Checked test provider compliance score
- [ ] No errors in database logs

---

## 🎯 Next Steps

After installation is complete:

1. **Mark TODO as complete:** "Apply ace-ceu-platform-schema.sql THEN ace-2026-requirements-migration.sql to database"

2. **Start Sprint 1 UI Development:**
   - Build coordinator certification tracking UI
   - Build legal entity verification workflow
   - Build renewal grace period system

3. **See Implementation Plan:**
   - Open `Docs/ace-2026-implementation-plan.md`
   - Follow Sprint 1, Week 1 tasks

---

## 📞 Support

If you encounter issues:

1. Check database logs for specific errors
2. Review `ACE-2026-QUICK-START.md` for common questions
3. Check migration file comments for detailed explanations
4. Verify you ran schemas in correct order

---

**Installation successful?** You're ready to start building the UI! 🚀

**Next file to open:** `Docs/ace-2026-implementation-plan.md`

