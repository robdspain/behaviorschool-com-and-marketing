# ACE Platform - 2026 Implementation Plan

**Target Launch:** January 1, 2026  
**Implementation Start:** October 23, 2024  
**Days Remaining:** 70 days  
**Status:** 🟡 Sprint 1 - Critical Compliance Features

---

## 📅 Sprint Schedule (8 weeks = 2 sprints per feature set)

### Sprint 1: Critical Compliance (Weeks 1-2) - Nov 1-14, 2024
**Goal:** Implement features that block provider operations if non-compliant

#### Week 1 Tasks:
- [ ] **Day 1-2:** Apply database migration (ace-2026-requirements-migration.sql)
  - [ ] Test on staging database
  - [ ] Verify all constraints and triggers
  - [ ] Run data integrity checks
  - [ ] Document any migration warnings

- [ ] **Day 3-4:** Coordinator Certification Tracking
  - [ ] Add cert date/expiry fields to provider admin UI
  - [ ] Build auto-validation checks (5 years certified)
  - [ ] Create expiration alerts (90, 60, 30, 7 days)
  - [ ] Block operations if coordinator cert expires

- [ ] **Day 5-7:** CEU/PDU Calculation Update
  - [ ] Update `calculate_ceus_2026()` function integration
  - [ ] Add validation to event creation form (25 min minimum)
  - [ ] Show CEU preview calculator on event form
  - [ ] Add warning if event duration doesn't align with CEU goals

#### Week 2 Tasks:
- [ ] **Day 1-3:** Legal Entity Verification (Organizations)
  - [ ] Add EIN field to provider registration
  - [ ] Build incorporation document upload UI
  - [ ] Create leadership attestation form
  - [ ] Digital signature capture component
  - [ ] Verification approval workflow for admin

- [ ] **Day 4-5:** Renewal Grace Period & Late Fees
  - [ ] Implement 30-day grace period logic
  - [ ] Add $50 late fee calculation
  - [ ] Block event publishing during lapse
  - [ ] Block certificate issuance during lapse
  - [ ] Create renewal reminders (45, 15, 5 days before)

- [ ] **Day 6-7:** Testing & Bug Fixes
  - [ ] Test all Sprint 1 features end-to-end
  - [ ] Fix any critical bugs
  - [ ] Deploy to staging for UAT

**Sprint 1 Deliverables:**
- ✅ Database schema updated and tested
- ✅ Coordinator certification tracking live
- ✅ Legal entity verification for orgs
- ✅ Grace period + late fee system operational
- ✅ CEU calculation using strict 25-min rule

---

### Sprint 2: Event & Attendance (Weeks 3-4) - Nov 15-28, 2024
**Goal:** Implement CE/PD separation and attendance verification

#### Week 3 Tasks:
- [ ] **Day 1-3:** CE vs PD Event Separation
  - [ ] Add event_type field to event creation form
  - [ ] Implement event_type filtering (CE for BCBAs, PD for RBTs)
  - [ ] Block RBTs from registering for CE events
  - [ ] Block BCBAs from registering for PD events
  - [ ] Create separate certificate templates for CE vs PD

- [ ] **Day 4-5:** RBT Alignment Checklist
  - [ ] Build RBT 2026 Training Outline checklist component
  - [ ] Ethics Code 2.0 alignment checkbox
  - [ ] Link to official BACB documents
  - [ ] Require alignment for PD events before approval

- [ ] **Day 6-7:** Event Subtype Limits (Journal Club / Podcast)
  - [ ] Add event_subtype field to creation form
  - [ ] Implement 1 CEU/PDU per item limit
  - [ ] Add content_item_count field (# of articles/episodes)
  - [ ] Auto-validate max CEU based on subtype

#### Week 4 Tasks:
- [ ] **Day 1-3:** Timestamped Attendance Tracking
  - [ ] Build sign-in/sign-out UI for synchronous events
  - [ ] Capture IP address and user agent
  - [ ] Store timestamps in ace_attendance_records
  - [ ] Generate attendance report with timestamps

- [ ] **Day 4-5:** Async Question Requirement (3 per CEU)
  - [ ] Auto-calculate minimum questions based on CEUs
  - [ ] Display "X questions required" on event dashboard
  - [ ] Block certificate if questions not met
  - [ ] Add question count validation to quiz builder

- [ ] **Day 6-7:** Testing & Bug Fixes
  - [ ] Test CE/PD separation end-to-end
  - [ ] Test attendance verification systems
  - [ ] Deploy to staging for UAT

**Sprint 2 Deliverables:**
- ✅ CE and PD events fully separated
- ✅ RBT alignment checklist operational
- ✅ Timestamped attendance for synchronous events
- ✅ 3-question-per-CEU enforcement for async CE

---

### Sprint 3: Instructor & Certificates (Weeks 5-6) - Dec 1-14, 2024
**Goal:** Expand instructor qualifications and certificate features

#### Week 5 Tasks:
- [ ] **Day 1-3:** Expanded Instructor Qualification Paths
  - [ ] Add qualification_path dropdown (6 options)
  - [ ] Doctorate information fields (type, field, institution, year)
  - [ ] Upload fields for:
    - [ ] Qualifying coursework documentation
    - [ ] Mentorship records
    - [ ] Publications
    - [ ] Postdoc hour logs
  - [ ] Expertise basis selection (5yr practice / 3yr teaching / research)

- [ ] **Day 4-5:** Instructor Verification Workflow
  - [ ] Admin review interface for new qualification paths
  - [ ] Checklist for coordinator to verify:
    - [ ] Doctorate credentials
    - [ ] Subject matter expertise
    - [ ] Documentation completeness
  - [ ] Approval/rejection with notes

- [ ] **Day 6-7:** Marketing & Transparency Fields
  - [ ] Learning objectives array field (required)
  - [ ] Instructor qualifications summary (auto-populated)
  - [ ] Instructor affiliations field
  - [ ] Conflicts of interest disclosure
  - [ ] Publication date for online events
  - [ ] Display on public event page

#### Week 6 Tasks:
- [ ] **Day 1-3:** Certificate Subcategory Display
  - [ ] Update certificate generator to include instructor per subcategory
  - [ ] Format: "Ethics: 2.0 CEUs (Dr. Jane Smith)"
  - [ ] JSON field: instructor_subcategories
  - [ ] Display on certificate PDF

- [ ] **Day 4-5:** 45-Day Certificate Issuance Rule
  - [ ] Auto-set must_be_issued_by date (event date + 45 days)
  - [ ] Dashboard alert for coordinators when approaching deadline
  - [ ] Flag overdue certificates
  - [ ] Send reminder emails (30, 15, 7 days before due)

- [ ] **Day 6-7:** Testing & Bug Fixes
  - [ ] Test new instructor qualification paths
  - [ ] Test certificate generation with subcategories
  - [ ] Deploy to staging for UAT

**Sprint 3 Deliverables:**
- ✅ 6 instructor qualification paths supported
- ✅ Documentation upload and verification system
- ✅ Certificate subcategory display
- ✅ 45-day certificate issuance enforcement

---

### Sprint 4: Compliance & Audit (Weeks 7-8) - Dec 15-28, 2024
**Goal:** Build compliance dashboard and audit tools

#### Week 7 Tasks:
- [ ] **Day 1-3:** Feedback Timeline Tracking
  - [ ] Auto-set coordinator_review_due_date (submission + 45 days)
  - [ ] Dashboard for pending feedback reviews
  - [ ] Flag overdue reviews
  - [ ] Reminder emails (30, 15, 7 days before due)
  - [ ] Block certificate until feedback submitted

- [ ] **Day 4-5:** Complaint NAV Notification
  - [ ] Add NAV notification to complaint workflow
  - [ ] Auto-notify when complaint submitted
  - [ ] Include NAV escalation language in emails
  - [ ] Track nav_escalation_notified field
  - [ ] Link to BACB NAV filing process

- [ ] **Day 6-7:** Compliance Score Calculator
  - [ ] Build compliance_score logic (0-100)
  - [ ] Deduct points for:
    - [ ] Expired coordinator certification (-25)
    - [ ] Unverified legal entity for orgs (-25)
    - [ ] Overdue certificates (-15)
    - [ ] Overdue complaint responses (-15)
    - [ ] Overdue feedback reviews (-10)
    - [ ] Missing event documentation (-10)
  - [ ] Display score on provider dashboard

#### Week 8 Tasks:
- [ ] **Day 1-3:** Compliance Dashboard UI
  - [ ] Provider status widget (Active/Grace/Lapsed)
  - [ ] Coordinator cert expiration countdown
  - [ ] Overdue items list:
    - [ ] Certificates
    - [ ] Feedback reviews
    - [ ] Complaint responses
  - [ ] Compliance score gauge
  - [ ] Action items checklist

- [ ] **Day 4-5:** Audit Report Generator
  - [ ] One-click export of:
    - [ ] Attendance logs (timestamped)
    - [ ] Instructor qualifications
    - [ ] Feedback records
    - [ ] Certificates issued
    - [ ] Complaint resolution history
  - [ ] PDF and CSV formats
  - [ ] Date range selection
  - [ ] Include compliance score

- [ ] **Day 6-7:** Final Testing & Documentation
  - [ ] End-to-end UAT of all 2026 features
  - [ ] Create user training videos
  - [ ] Write admin guide
  - [ ] Update provider handbook
  - [ ] Prepare launch announcement

**Sprint 4 Deliverables:**
- ✅ Feedback timeline enforcement (45 days)
- ✅ Complaint NAV notification system
- ✅ Compliance dashboard with score
- ✅ Audit-ready report generator

---

## 🧪 Testing Checklist (Before Jan 1, 2026 Launch)

### Provider Registration & Verification
- [ ] Individual provider registration → approved within 24hrs
- [ ] Organization registration → EIN + incorporation docs required
- [ ] Leadership attestation → digital signature captured
- [ ] Coordinator cert tracking → expiration alerts trigger
- [ ] Lapsed provider → cannot publish events or issue certificates

### Instructor Qualification
- [ ] Active BCBA → auto-approved
- [ ] Doctorate holder → uploads credentials → reviewed → approved
- [ ] Missing expertise documentation → rejected with feedback
- [ ] All 6 qualification paths tested

### Event Creation & Validation
- [ ] CE event → RBTs cannot register
- [ ] PD event → BCBAs cannot register, RBT alignment required
- [ ] Async CE event → minimum 3 questions per CEU enforced
- [ ] Journal club → limited to 1 CEU per article
- [ ] Podcast → limited to 1 CEU per episode
- [ ] Event < 25 minutes → CEU = 0, warning shown
- [ ] Event = 50 minutes → CEU = 1.0 (not 1.5)
- [ ] Learning objectives missing → event cannot be approved

### Attendance & Verification
- [ ] Synchronous event → timestamped sign-in/out captured
- [ ] Async event → quiz completion tracked
- [ ] Engagement checks → periodic prompts displayed
- [ ] Insufficient engagement → certificate blocked

### Certificates
- [ ] Certificate includes instructor per subcategory
- [ ] Certificate due date = event date + 45 days
- [ ] Overdue certificate → flagged on dashboard
- [ ] Feedback not submitted → certificate blocked
- [ ] Lapsed provider → certificate issuance blocked

### Feedback & Complaints
- [ ] Feedback submitted → coordinator has 45 days to review
- [ ] Coordinator review overdue → flagged on dashboard
- [ ] Complaint submitted → NAV notification sent automatically
- [ ] Complaint > 45 days old → flagged as overdue
- [ ] Complaint resolved → participant notified

### Renewal & Grace Period
- [ ] Renewal window opens 45 days before expiration
- [ ] Provider expires → 30-day grace period starts
- [ ] Grace period → late fee = $50
- [ ] Past grace period → lapse, events unpublished
- [ ] Reinstatement → late fee paid, events republished

### Compliance Dashboard
- [ ] Compliance score displayed (0-100)
- [ ] Provider status shown (Active/Grace/Lapsed)
- [ ] Overdue items listed with action buttons
- [ ] Audit report generated → all data included

---

## 📊 Success Metrics (Post-Launch)

### Compliance Targets (January-March 2026)
- **Provider Compliance Score:** 95%+ average
- **Certificate Issuance:** 100% within 45 days
- **Feedback Review:** 100% within 45 days
- **Complaint Response:** 100% within 45 days
- **Coordinator Cert Valid:** 100% of active providers
- **Legal Entity Verified:** 100% of organization providers

### User Satisfaction Targets
- **Provider NPS:** 50+ (promoters > detractors)
- **Support Tickets:** < 5 per week related to 2026 features
- **User Training Completion:** 90%+ of providers
- **Feature Adoption:** 100% using new event types by March 2026

### Technical Targets
- **System Uptime:** 99.9%
- **Page Load Time:** < 2 seconds
- **API Response Time:** < 500ms
- **Zero Critical Bugs:** in production by Jan 15, 2026

---

## 🚨 Risk Mitigation Strategies

### Risk 1: Providers Don't Update Coordinator Certifications
**Impact:** High (blocks operations)  
**Probability:** Medium  
**Mitigation:**
- Email campaign starting Nov 15, 2024
- In-app banner reminders
- Phone calls to non-compliant providers week of Dec 20
- Grace period until Jan 15, 2026 for initial compliance

### Risk 2: Organizations Missing Incorporation Documents
**Impact:** High (blocks approval)  
**Probability:** Medium  
**Mitigation:**
- Early notification (Nov 1, 2024)
- Provide template attestation forms
- Offer assistance in obtaining documents
- Allow temporary approval with 30-day document deadline

### Risk 3: Existing Events Don't Meet 3-Question-Per-CEU Rule
**Impact:** Medium (affects async CE events)  
**Probability:** High  
**Mitigation:**
- Batch analysis tool to identify affected events
- Grandfather existing events through Mar 31, 2026
- Provide AI-assisted question generation tool
- Offer coordinator training on writing knowledge checks

### Risk 4: Instructors Resist New Qualification Documentation
**Impact:** Medium (limits instructor pool)  
**Probability:** Medium  
**Mitigation:**
- Simplify upload process with drag-and-drop
- Accept multiple file formats (PDF, JPG, DOC)
- Provide clear examples of acceptable documentation
- Fast-track review (48-hour turnaround)

### Risk 5: Holiday Season Deployment Issues
**Impact:** High (launch during low-support period)  
**Probability:** Low  
**Mitigation:**
- Complete all development by Dec 20, 2024
- Final UAT: Dec 21-27, 2024
- Production deploy: Dec 28, 2024
- On-call support Dec 28 - Jan 5, 2026
- Rollback plan documented and tested

### Risk 6: Data Migration Errors
**Impact:** Critical (data loss or corruption)  
**Probability:** Low  
**Mitigation:**
- Full database backup before migration
- Test migration on staging 3 times
- Run migration during low-traffic window (Sun 2am EST)
- Verify data integrity with automated checks
- Rollback script tested and ready

---

## 📢 Communication Plan

### November 1, 2024: Initial Announcement
**Audience:** All ACE providers  
**Channel:** Email + in-app notification  
**Message:**
- "2026 BACB requirements are coming"
- Key changes overview
- Timeline for compliance
- Link to detailed FAQ

### November 15, 2024: Feature Preview
**Audience:** Early adopters (5-10 providers)  
**Channel:** Beta program invitation  
**Message:**
- Preview new features on staging
- Provide feedback
- Early access benefits

### December 1, 2024: Training Materials Released
**Audience:** All ACE providers  
**Channel:** Email + documentation site  
**Resources:**
- Video tutorials (15 mins total)
- Updated user guide
- Step-by-step checklists
- Live Q&A webinar (Dec 5, 2pm EST)

### December 15, 2024: Final Reminder
**Audience:** Non-compliant providers  
**Channel:** Email + phone calls  
**Message:**
- Urgent: Update required by Jan 1
- Specific action items per provider
- Support resources
- Escalation to director if needed

### January 1, 2026: Launch Announcement
**Audience:** All ACE providers + public  
**Channel:** Email + blog post + social media  
**Message:**
- Platform is now fully 2026-compliant
- Benefits of new features
- Thank you for participation
- Support contact info

---

## 📝 Documentation Deliverables

### For Providers
- [ ] "What's New in 2026" one-pager
- [ ] Updated provider handbook (PDF)
- [ ] Video tutorial series (5 videos, 3 mins each)
- [ ] Quick reference guide (cheat sheet)
- [ ] FAQ document (20+ questions)

### For Coordinators
- [ ] Coordinator compliance checklist
- [ ] Event approval workflow guide
- [ ] Instructor qualification review process
- [ ] Complaint handling procedures
- [ ] Audit report generation guide

### For Instructors
- [ ] New qualification paths explained
- [ ] Documentation requirements guide
- [ ] How to update your profile
- [ ] Ethics & supervision event guidelines

### For Admins/Developers
- [ ] Database schema documentation
- [ ] API endpoint reference
- [ ] Compliance score calculation logic
- [ ] Trigger and function documentation
- [ ] Rollback procedures

---

## 🎯 Definition of Done

**Sprint 1:**
- ✅ All database schema changes deployed to production
- ✅ Coordinator certification tracking functional
- ✅ Legal entity verification for orgs operational
- ✅ Grace period + late fee system working
- ✅ CEU calculation using 25-min rule
- ✅ Zero P1/P2 bugs in production
- ✅ User acceptance testing complete

**Sprint 2:**
- ✅ CE/PD event separation enforced
- ✅ RBT alignment checklist required for PD
- ✅ Timestamped attendance for synchronous events
- ✅ 3-question-per-CEU enforced for async CE
- ✅ Event subtype limits functional
- ✅ Zero P1/P2 bugs in production
- ✅ User acceptance testing complete

**Sprint 3:**
- ✅ 6 instructor qualification paths supported
- ✅ Documentation upload system working
- ✅ Certificate subcategory display implemented
- ✅ 45-day certificate issuance tracked
- ✅ Marketing transparency fields on event pages
- ✅ Zero P1/P2 bugs in production
- ✅ User acceptance testing complete

**Sprint 4:**
- ✅ Feedback timeline enforcement (45 days)
- ✅ Complaint NAV notification automatic
- ✅ Compliance dashboard operational
- ✅ Audit report generator functional
- ✅ All user documentation published
- ✅ Zero P1/P2 bugs in production
- ✅ Final UAT and production deploy

**January 1, 2026:**
- ✅ Platform 100% compliant with 2026 BACB requirements
- ✅ All providers notified and trained
- ✅ Support team ready for launch
- ✅ Monitoring and alerts configured
- ✅ Rollback plan tested and documented

---

## 🔄 Post-Launch Monitoring (Jan 1-31, 2026)

### Daily Checks (First 7 Days)
- [ ] System uptime and performance
- [ ] Error logs reviewed
- [ ] Support ticket queue
- [ ] Provider compliance scores
- [ ] Certificate issuance volume

### Weekly Checks (Weeks 2-4)
- [ ] User feedback survey results
- [ ] Feature adoption rates
- [ ] Compliance metric trends
- [ ] Outstanding bug count
- [ ] Support ticket resolution time

### Monthly Reports (February Onward)
- [ ] Compliance scorecard
- [ ] User satisfaction survey
- [ ] Feature usage analytics
- [ ] Technical performance metrics
- [ ] Recommendations for improvements

---

**Status:** 📋 Ready for Implementation  
**Next Review:** November 1, 2024  
**Owner:** Development Team  
**Stakeholders:** ACE Providers, BACB, Platform Admin

