# ACE Platform - 2026 Requirements Summary

**Effective Date:** January 1, 2026
**Implementation Deadline:** December 31, 2025
**Status:** Implementation in Progress

---

## 📅 Timeline

- **Now → Dec 31, 2025:** Build and test new features
- **Jan 1, 2026:** New BACB requirements take effect
- **Platform must be fully compliant by:** January 1, 2026

---

## 🆕 New Requirements Overview

### 1. ⭐ Coordinator Certification Tracking
**What Changed:**
- Must track coordinator BCBA certification dates
- Auto-validate "5 years certified" requirement
- Alert when certification expiring
- Block provider operations if coordinator lapses

**Implementation Priority:** 🔴 HIGH
**Estimated Effort:** 2-3 days

### 2. ⭐ Legal Entity Verification (Organizations)
**What Changed:**
- Organizations must be legally incorporated
- Must upload EIN and incorporation documents
- Leadership must digitally attest to compliance
- Appoint ACE Coordinator via attestation

**Implementation Priority:** 🔴 HIGH
**Estimated Effort:** 3-4 days

### 3. ⭐ Expanded Instructor Qualifications
**What Changed:**
- New qualification paths beyond BCBA
- Doctorate holders with specific experience can instruct
- Must document expertise (5yr practice / 3yr teaching / publications)
- Upload mentorship, publications, hour logs

**Implementation Priority:** 🟡 MEDIUM
**Estimated Effort:** 5-6 days

### 4. ⭐ Strict CEU/PDU Calculation
**What Changed:**
- **25 minutes = 0.5 CEU/PDU (minimum)**
- Round DOWN, not up
- Journal clubs limited to 1 CEU/PDU
- Podcasts limited to 1 CEU/PDU

**Implementation Priority:** 🔴 HIGH
**Estimated Effort:** 1 day (formula change + validation)

### 5. ⭐ Enhanced Attendance Verification
**What Changed:**
- **Synchronous:** Must have timestamped sign-in/out (not Zoom logs)
- **Asynchronous:** Must have 3 knowledge questions per CEU/PDU minimum
- Embedded engagement checks required
- Platform-based tracking (not third-party only)

**Implementation Priority:** 🔴 HIGH
**Estimated Effort:** 4-5 days

### 6. ⭐ Certificate Subcategories
**What Changed:**
- Must list instructor name per subcategory
- Ethics CEUs: "Ethics: 2.0 CEUs (Dr. Jane Smith)"
- Supervision CEUs: "Supervision: 1.5 CEUs (Dr. John Doe)"

**Implementation Priority:** 🟡 MEDIUM
**Estimated Effort:** 2 days

### 7. ⭐ RBT Professional Development (PD) Separation
**What Changed:**
- **CE events ≠ PD events (cannot mix)**
- RBTs can only attend PD events
- PD must align with RBT 2026 Training Outline or Ethics Code 2.0
- Separate certificates, separate tracking

**Implementation Priority:** 🔴 HIGH
**Estimated Effort:** 3-4 days

### 8. ⭐ Feedback Timeline Requirements
**What Changed:**
- Participants must be offered feedback within 2 weeks
- Coordinator must review feedback within 45 days
- Track review timelines for audit
- Feedback REQUIRED before certificate

**Implementation Priority:** 🟡 MEDIUM
**Estimated Effort:** 2-3 days

### 9. ⭐ Complaint Resolution with NAV Notification
**What Changed:**
- Must respond to complaints within 45 days
- **Must inform participants about Notice of Alleged Violation (NAV)**
- Participants can escalate to BACB if unresolved
- NAV notification in all complaint communications

**Implementation Priority:** 🟡 MEDIUM
**Estimated Effort:** 2 days

### 10. ⭐ Compliance Dashboard & Audit Reports
**What Changed:**
- Must generate audit-ready reports on demand
- Track compliance score
- 3-year data retention (was 5 years)
- One-click export of attendance, qualifications, feedback, certificates

**Implementation Priority:** 🟠 MEDIUM-HIGH
**Estimated Effort:** 5-7 days

### 11. ⭐ Renewal Process Changes
**What Changed:**
- Renewal opens 45 days before expiration
- 30-day grace period with $50 late fee
- **Block event publishing during lapse**
- **Cannot issue CEUs/PDUs during lapse**

**Implementation Priority:** 🔴 HIGH
**Estimated Effort:** 2-3 days

### 12. ⭐ Marketing & Transparency
**What Changed:**
- Must display provider name/number on all event pages
- Must show instructor qualifications summary
- Must list all learning objectives
- Must disclose affiliations, conflicts of interest
- Must show publication date for online events

**Implementation Priority:** 🟡 MEDIUM
**Estimated Effort:** 2-3 days

---

## 📊 Implementation Roadmap

### Sprint 1 (Weeks 1-2): Critical Compliance Features
**Priority: 🔴 HIGH**
1. ✅ CEU/PDU calculation formula update (25 min = 0.5)
2. ⏳ Coordinator certification tracking
3. ⏳ Legal entity verification for organizations
4. ⏳ Renewal grace period + late fees
5. ⏳ Block publishing during lapse

### Sprint 2 (Weeks 3-4): Event & Attendance
**Priority: 🔴 HIGH**
1. ⏳ CE vs PD event separation
2. ⏳ 3-question-per-CEU enforcement
3. ⏳ Timestamped attendance tracking
4. ⏳ Event subtype (journal club/podcast) limits
5. ⏳ RBT alignment checklist

### Sprint 3 (Weeks 5-6): Instructor & Certificates
**Priority:** 🟡 MEDIUM
1. ⏳ Expanded instructor qualification paths
2. ⏳ Expertise documentation uploads
3. ⏳ Certificate subcategory display
4. ⏳ Feedback timeline tracking
5. ⏳ Marketing transparency fields

### Sprint 4 (Weeks 7-8): Compliance & Audit
**Priority:** 🟠 MEDIUM-HIGH
1. ⏳ Compliance score calculator
2. ⏳ Audit report generator
3. ⏳ Complaint NAV notification
4. ⏳ 3-year retention automation
5. ⏳ Leadership attestation workflow

---

## 🗄️ Database Schema Changes Summary

### New Tables:
- `ace_compliance_reports` - Audit report generation tracking
- `ace_leadership_attestations` - Digital attestation records

### Updated Tables:

**ace_providers:**
- `ein`, `incorporation_doc_url`, `legal_entity_verified`
- `leadership_attestation_url`, `leadership_attestation_date`
- `coordinator_certification_date`, `coordinator_certification_expires`
- `grace_period_end_date`, `reinstatement_date`, `late_fee_paid`

**ace_instructor_qualifications:**
- `qualification_path`, `doctorate_type`, `institution_name`, `graduation_year`
- `qualifying_experience_type`, `experience_documentation_urls`
- `expertise_basis`, `years_experience`, `expertise_documentation_urls`

**ace_events:**
- `event_type` (ce/pd), `event_subtype` (standard/journal_club/podcast)
- `instructor_affiliations`, `publication_date`, `rbt_alignment_checklist`

**ace_certificates:**
- `instructor_subcategories` (JSON mapping instructors to subcategories)

**ace_feedback_responses:**
- `coordinator_reviewed_at`, `coordinator_notes`

**ace_complaints:**
- `submitter_bacb_id`, `nav_escalation_notified`, `response_due_date`

**ace_attendance_records:**
- Enhanced fields for engagement tracking

---

## 🧪 Testing Requirements

### Must Test Before Jan 1, 2026:
- [ ] Coordinator certification expires → provider auto-suspended
- [ ] Organization uploads EIN → gets verified
- [ ] Leadership e-signs attestation → provider approved
- [ ] Instructor submits doctorate + publications → gets approved
- [ ] Event < 25 minutes → blocked from submission
- [ ] Async event with < 3 questions/CEU → blocked from certificate
- [ ] CE event → RBT cannot register
- [ ] PD event → BCBA cannot register
- [ ] Provider lapses → events unpublished, certificates blocked
- [ ] Late renewal → $50 fee charged
- [ ] Certificate generated → shows subcategories
- [ ] Feedback not submitted → certificate blocked
- [ ] Complaint > 45 days old → flagged as overdue
- [ ] NAV notification sent in all complaint emails
- [ ] Audit report → exports all required data

---

## 📈 Success Criteria

**By December 31, 2025:**
- ✅ All database schema updates deployed
- ✅ All UI components built and tested
- ✅ All API endpoints functional
- ✅ Compliance dashboard showing 100% score
- ✅ Test provider fully compliant with 2026 rules
- ✅ Documentation updated
- ✅ User training materials created

**After January 1, 2026:**
- Provider maintains 95%+ compliance score
- Zero audit findings related to new requirements
- Certificate issuance within 45 days: 100%
- Feedback review within 45 days: 100%
- Complaint response within 45 days: 100%

---

## 🚨 Risk Mitigation

### Risk: Instructors don't submit new qualification docs
**Mitigation:** Email campaign starting Nov 2025, deadline Dec 15, 2025

### Risk: Organizations don't have incorporation docs
**Mitigation:** Early notification, assistance with obtaining documents

### Risk: Existing events don't meet 3-question-per-CEU rule
**Mitigation:** Batch update tool to add questions to existing events

### Risk: Late renewals during holiday season
**Mitigation:** Send extra reminders Dec 1-31, 2025

---

**Status:** Ready for Sprint 1 Implementation
**Next Review:** November 1, 2025
