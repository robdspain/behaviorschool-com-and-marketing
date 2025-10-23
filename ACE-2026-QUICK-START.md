# ACE Platform - 2026 Requirements Quick Start

## 🎯 What We Just Built

You now have a **complete database schema and implementation plan** for making your ACE CEU Platform compliant with the new 2026 BACB requirements.

### Files Created:
1. **`sql/ace-2026-requirements-migration.sql`** (1,145 lines)
   - Complete database migration for all 2026 requirements
   - Ready to apply to your database

2. **`Docs/ace-2026-requirements-summary.md`** (273 lines)
   - Overview of 12 new requirements
   - Priority levels and estimated effort
   - Sprint breakdown

3. **`Docs/ace-2026-implementation-plan.md`** (582 lines)
   - Detailed 8-week sprint plan
   - Testing checklist
   - Risk mitigation strategies
   - Communication plan

4. **`Docs/ace-ceu-platform-prd.md`** (1,238 lines)
   - Full Product Requirements Document
   - Integrated with 2026 requirements

---

## 🚀 Next Steps (In Order)

### Step 1: Review the Migration File
```bash
# Open and review the migration SQL
open sql/ace-2026-requirements-migration.sql
```

**Look for:**
- ✅ All new tables (5 new tables)
- ✅ All column additions to existing tables
- ✅ New enums (4 new types)
- ✅ Functions and triggers
- ✅ Constraints and indexes

### Step 2: Test on Staging Database
```bash
# Connect to your staging database
psql -h your-staging-db.supabase.co -U postgres -d postgres

# Run the migration
\i sql/ace-2026-requirements-migration.sql

# Verify tables were created
\dt ace_*

# Check views
\dv

# Check functions
\df calculate_*
\df can_*
```

### Step 3: Verify Data Integrity
After running the migration, check:
- [ ] All existing data is intact
- [ ] No foreign key violations
- [ ] All triggers fire correctly
- [ ] Views return expected results

### Step 4: Start Sprint 1 Development
**Target: Nov 1-14, 2024**

**Week 1 Tasks:**
1. ✅ Database migration (just completed!)
2. Build coordinator certification tracking UI
3. Add CEU calculation validation (25-min rule)

**Week 2 Tasks:**
4. Create legal entity verification workflow
5. Implement renewal grace period + late fees
6. Testing and bug fixes

See `Docs/ace-2026-implementation-plan.md` for detailed tasks.

---

## 📊 What Changed (Summary)

### 12 New Requirements for 2026:

| # | Requirement | Database Changes | UI Changes Needed |
|---|-------------|------------------|-------------------|
| 1 | **Coordinator Certification Tracking** | `ace_providers`: Added cert dates | Track cert expiry, show alerts |
| 2 | **Legal Entity Verification** | `ace_providers`: EIN, docs; New table: `ace_leadership_attestations` | Upload EIN/docs, digital signature |
| 3 | **Expanded Instructor Qualifications** | `ace_instructor_qualifications`: 6 paths, expertise basis | Qualification dropdown, doc uploads |
| 4 | **Strict CEU Calculation (25 min = 0.5)** | Function: `calculate_ceus_2026()` | CEU calculator, validation on event form |
| 5 | **Enhanced Attendance Verification** | `ace_attendance_records`: Timestamps, engagement checks | Sign-in/out UI, engagement prompts |
| 6 | **Certificate Subcategories** | `ace_certificates`: instructor_subcategories JSON | Update certificate PDF template |
| 7 | **CE vs PD Separation** | `ace_events`: event_type; New table: `ace_rbt_alignment_criteria` | Event type selector, RBT checklist |
| 8 | **Feedback Timeline (45 days)** | `ace_feedback_responses`: Review due date | Coordinator review dashboard |
| 9 | **Complaint NAV Notification** | `ace_complaints`: NAV notification fields | Auto-send NAV emails |
| 10 | **Compliance Dashboard** | New table: `ace_compliance_reports`; View: `ace_compliance_dashboard` | Build compliance UI with score gauge |
| 11 | **Renewal Grace Period** | `ace_providers`: Grace period, late fees; New table: `ace_renewal_history` | Renewal workflow, late fee payment |
| 12 | **Marketing Transparency** | `ace_events`: Learning objectives, affiliations | Event form updates, public display |

---

## 🗄️ Database Schema Summary

### New Tables (5):
1. **`ace_leadership_attestations`** - Digital signatures from org leadership
2. **`ace_compliance_reports`** - Audit-ready compliance exports
3. **`ace_renewal_history`** - Track all renewals with fees and timing
4. **`ace_engagement_checks`** - Timestamped engagement verification
5. **`ace_rbt_alignment_criteria`** - PD event alignment with RBT 2026

### Updated Tables (8):
1. **`ace_providers`** - 18 new columns (coordinator cert, legal entity, grace period)
2. **`ace_instructor_qualifications`** - 14 new columns (6 qualification paths, expertise)
3. **`ace_events`** - 13 new columns (CE/PD type, RBT alignment, marketing fields)
4. **`ace_certificates`** - 4 new columns (subcategories, due dates, feedback gate)
5. **`ace_feedback_responses`** - 4 new columns (coordinator review timeline)
6. **`ace_complaints`** - 7 new columns (NAV notification, response deadlines)
7. **`ace_attendance_records`** - 8 new columns (timestamps, engagement tracking)
8. **`ace_quizzes`** - (Existing table, updated validation logic)

### New Enums (4):
1. **`ace_event_type`** - 'ce' or 'pd'
2. **`ace_event_subtype`** - 'standard', 'journal_club', 'podcast'
3. **`ace_instructor_qualification_path`** - 6 options (active_bcba, doctorate variants)
4. **`ace_expertise_basis`** - 3 options (practice, teaching, research)

### New Functions (4):
1. **`calculate_minimum_questions_async_ce()`** - Auto-calc 3 per CEU
2. **`can_provider_publish_events()`** - Check if provider lapsed
3. **`calculate_ceus_2026()`** - Strict 25-minute rule
4. **`can_issue_certificate_2026()`** - Verify all requirements met

### New Views (2):
1. **`ace_compliance_dashboard`** - Real-time compliance scores per provider
2. **`ace_events_requiring_attention`** - Events with validation issues

---

## ⏰ Timeline

**Today:** October 23, 2024  
**Requirements Effective:** January 1, 2026  
**Days Until Launch:** 70 days

### Sprint Schedule:
- **Sprint 1:** Nov 1-14 (Critical compliance features)
- **Sprint 2:** Nov 15-28 (Event & attendance)
- **Sprint 3:** Dec 1-14 (Instructor & certificates)
- **Sprint 4:** Dec 15-28 (Compliance dashboard & audit)
- **Production Deploy:** Dec 28, 2024
- **Go-Live:** Jan 1, 2026

---

## 🧪 Testing Priority

### Must Test Before Launch:
1. **Provider Lapse Workflow**
   - Provider expires → 30-day grace period → lapse → events unpublished
   
2. **CE/PD Separation**
   - RBT tries to register for CE event → blocked
   - BCBA tries to register for PD event → blocked
   
3. **Certificate Issuance Gate**
   - Feedback not submitted → certificate blocked
   - Async event with insufficient questions → certificate blocked
   - Provider lapsed → certificate blocked
   
4. **Compliance Score**
   - Expired coordinator cert → score drops 25 points
   - Overdue certificate → flagged on dashboard
   
5. **Audit Report**
   - One-click export → includes all required data

---

## 📁 File Locations

### SQL Files:
- **Main Schema:** `sql/ace-ceu-platform-schema.sql` (original)
- **2026 Migration:** `sql/ace-2026-requirements-migration.sql` (NEW)

### Documentation:
- **Requirements Summary:** `Docs/ace-2026-requirements-summary.md`
- **Implementation Plan:** `Docs/ace-2026-implementation-plan.md`
- **Full PRD:** `Docs/ace-ceu-platform-prd.md`
- **ERD Diagram:** `Docs/ace-ceu-platform-erd.md`

### TODO List:
See your TODO panel in Cursor, or run:
```bash
# View all ACE-related todos
grep -i "ace-2026" .cursor/todos.json
```

---

## 🚨 Common Questions

### Q: Can I run this migration on a production database with existing data?
**A:** Yes, but **ONLY after thorough testing on staging**. The migration:
- Adds new columns (won't affect existing data)
- Adds new tables (separate from existing)
- Adds constraints (may need adjustment if data is invalid)

### Q: What if I don't want to implement all 12 requirements?
**A:** You **must** implement all of them for BACB compliance by Jan 1, 2026. Non-compliance = provider suspension.

### Q: Can I customize the compliance score calculation?
**A:** Yes! Edit the `ace_compliance_dashboard` view to adjust scoring logic. Current scoring:
- Lapsed provider: 0%
- Expired coordinator cert: -25 points
- Unverified legal entity (orgs): -25 points
- Overdue certificates: -15 points
- Overdue complaints: -15 points

### Q: How do I rollback if something goes wrong?
**A:** See the "ROLLBACK INSTRUCTIONS" section at the bottom of `sql/ace-2026-requirements-migration.sql`. We recommend:
1. Take a full database backup before migration
2. Test on staging 3 times
3. Have rollback script ready

### Q: Do I need to notify existing providers?
**A:** YES! See the Communication Plan in `Docs/ace-2026-implementation-plan.md`:
- Nov 1: Initial announcement
- Dec 1: Training materials
- Dec 15: Final reminder
- Jan 1: Launch announcement

---

## ✅ What's Ready Now

- ✅ Complete database schema (1,145 lines of SQL)
- ✅ All 12 requirements documented
- ✅ 8-week implementation plan
- ✅ Testing checklist
- ✅ Risk mitigation strategies
- ✅ Communication templates
- ✅ Rollback procedures
- ✅ TODO list created in Cursor

---

## ⏭️ What's Next

### Immediate (This Week):
1. Review the migration SQL file
2. Apply to staging database
3. Verify all tables/functions/views created
4. Start Sprint 1, Week 1, Day 1: Coordinator Certification UI

### Short-term (Next 2 Weeks):
1. Complete Sprint 1 (critical compliance features)
2. Deploy to staging for UAT
3. Fix any P1/P2 bugs

### Mid-term (4-6 Weeks):
1. Complete Sprints 2-3
2. Build all UI components
3. Integrate with existing platform

### Long-term (8 Weeks):
1. Complete Sprint 4 (compliance dashboard)
2. Final UAT
3. Production deploy
4. Go live Jan 1, 2026

---

## 📞 Support

If you have questions during implementation:
1. Check `Docs/ace-2026-implementation-plan.md` (detailed sprint tasks)
2. Check `Docs/ace-2026-requirements-summary.md` (requirement overview)
3. Check `Docs/ace-ceu-platform-prd.md` (full product spec)
4. Review SQL comments in `sql/ace-2026-requirements-migration.sql`

---

**You're all set!** The foundation is complete. Time to start building. 🚀

**First Command to Run:**
```bash
# Review the migration file
cat sql/ace-2026-requirements-migration.sql | less
```

Good luck with Sprint 1! 💪

