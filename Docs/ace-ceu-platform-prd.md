# ACE CEU Platform - Product Requirements Document (PRD)
## BACB ACE Provider Compliance Platform

**Version:** 2.0 (Updated with 2024 BACB Requirements)
**Last Updated:** October 23, 2024
**Status:** In Development

---

## 🎯 Executive Summary

This platform enables Behavior School to become a BACB-approved ACE (Approved Continuing Education) Provider, offering compliant continuing education (CE) and professional development (PD) events for behavior analysts and RBTs.

The system manages the complete lifecycle from provider application through event delivery, attendance tracking, assessment, feedback collection, certificate issuance, and audit compliance.

**NEW in 2024:** Enhanced coordinator verification, organizational legal entity requirements, expanded instructor qualifications, strict CEU/PDU calculations, RBT PD event separation, and comprehensive audit readiness features.

---

## 📋 Table of Contents

1. [User Roles & Permissions](#user-roles--permissions)
2. [Provider Management](#provider-management)
3. [Coordinator Requirements](#coordinator-requirements) ⭐ NEW
4. [Instructor Management](#instructor-management) ⭐ UPDATED
5. [Event Management](#event-management) ⭐ UPDATED
6. [Event Types & CEU/PD Tracking](#event-types--ceupd-tracking) ⭐ NEW
7. [Registration System](#registration-system)
8. [Attendance Tracking](#attendance-tracking) ⭐ UPDATED
9. [Quiz Engine](#quiz-engine) ⭐ UPDATED
10. [Feedback System](#feedback-system) ⭐ UPDATED
11. [Certificate Generation](#certificate-generation) ⭐ UPDATED
12. [Complaint Resolution](#complaint-resolution) ⭐ UPDATED
13. [Audit & Compliance](#audit--compliance) ⭐ NEW
14. [Renewal Management](#renewal-management) ⭐ UPDATED
15. [Marketing & Transparency](#marketing--transparency) ⭐ NEW

---

## 1. User Roles & Permissions

### Participant
- Browse approved CE/PD events
- Register for events (paid/free)
- Attend events and complete requirements
- Submit feedback
- Download certificates
- View personal transcript

### Instructor / Co-Presenter
- Create draft events
- Manage event content and materials
- View participant rosters
- Track attendance
- Download completion reports

### ACE Coordinator
- **Oversee all provider activities**
- Approve/reject event submissions
- Verify instructor qualifications ⭐ UPDATED
- Monitor compliance deadlines
- Review complaints
- Generate audit packets
- **NEW:** Attest to organizational compliance ⭐
- **NEW:** Maintain active BCBA certification with duration tracking ⭐

### Admin (Behavior School)
- Full system access
- Provider management
- User role management
- System configuration
- Analytics and reporting

---

## 2. Provider Management

### ⭐ NEW: Legal Entity Requirements

**Individual Providers:**
- Must be active BCBA
- Personal information and BACB ID
- W-9 for tax purposes

**Organization Providers:** ⭐ UPDATED
- **Must be legally incorporated or registered** ⭐ NEW
- **Required Documentation:**
  - EIN (Employer Identification Number) ⭐ NEW
  - Articles of Incorporation or business registration documents ⭐ NEW
  - Proof of legal entity status ⭐ NEW
- **Leadership Attestation:** ⭐ NEW
  - Digital signature from authorized officer
  - Attestation that they have appointed the ACE Coordinator
  - Commitment to ensure compliance with BACB standards

### Provider Application Fields

**Basic Information:**
- Provider name
- Provider type (Individual/Organization)
- Primary contact email and phone
- Website URL
- Mailing address

**⭐ NEW: Legal Entity Verification:**
- EIN upload (PDF/image)
- Incorporation documents upload
- Business license (if applicable)
- Digital attestation form with e-signature

**Coordinator Information:**
- Coordinator name and BACB ID
- Years certified as BCBA (minimum 5 years required)
- **NEW:** Certification date and duration tracking ⭐
- **NEW:** Expiration date monitoring with alerts ⭐
- **NEW:** Auto-validation against BACB registry ⭐
- Contact information
- Digital signature URL

**Financial:**
- Application fee: $400 (one-time)
- Annual renewal fee: $400
- Payment tracking (Stripe integration)

**Renewal Tracking:** ⭐ UPDATED
- **Annual renewal up to 45 days before expiration** ⭐ NEW
- **30-day reinstatement window with $50 late fee** ⭐ NEW
- Automated reminders at 45, 15, and 5 days before expiration
- **NEW:** Block event publishing during lapse period ⭐
- **NEW:** Visual status indicator (Active/Expiring Soon/Lapsed) ⭐

---

## 3. ⭐ NEW: Coordinator Requirements

### Qualification Tracking

**Minimum Requirements:**
- Active BCBA certification
- Minimum 5 years certified
- **NEW:** Must maintain active status throughout provider term ⭐

### Platform Features:

**Credential Verification:**
- BACB ID validation
- Certification date tracking
- **Auto-calculate years certified** ⭐
- **Expiration date monitoring** ⭐
- **Alert system for expiring certifications** ⭐

**Coordinator Dashboard:**
- Days until certification expiration
- Provider renewal status
- Pending event approvals
- Complaint resolution queue
- Audit readiness score

**Validation Rules:**
- Block provider application if coordinator < 5 years certified
- Alert if coordinator certification expires within 90 days
- Auto-suspend provider if coordinator certification lapses
- Require coordinator replacement workflow

---

## 4. Instructor Management ⭐ UPDATED

### ⭐ NEW: Expanded Qualification Requirements

**Instructors must meet ONE of the following qualification paths:**

#### Path 1: Active BCBA
- Current BACB certification
- BACB ID verification

#### Path 2: Doctorate in Behavior Analysis
- PhD or PsyD in Behavior Analysis
- Degree verification (transcript upload)
- Institution accreditation

#### Path 3: Doctorate + Qualifying Experience ⭐ NEW
Must have doctorate AND one of:
- **Qualifying Coursework:**
  - Behavior analysis graduate coursework documentation
  - Course syllabi showing ABA content
- **Mentorship:**
  - Supervised by BCBA-D for 2+ years
  - Mentorship verification letter
- **Publications:**
  - Peer-reviewed publications in behavior analysis
  - Publication list with DOI links
- **Postdoctoral Hours:**
  - 1,800+ hours of postdoctoral ABA practice
  - Hour log verification

### ⭐ NEW: Subject-Matter Expertise Requirement

**Instructors must ALSO demonstrate expertise via ONE of:**

#### Option A: Practice Experience
- **5+ years practicing behavior analysis** ⭐ NEW
- Employment verification letters
- Practice setting documentation

#### Option B: Teaching Experience
- **3+ years teaching behavior analysis at university** ⭐ NEW
- Institution verification letter
- Course syllabi

#### Option C: Publications
- **Published research in subject area** ⭐ NEW
- Publication list with citations
- Impact factor documentation (optional)

### Instructor Profile Fields ⭐ UPDATED

**Basic Information:**
- Name, email, phone
- BACB ID (if applicable)
- Professional bio (500 words max)
- Headshot photo

**⭐ NEW: Qualification Documentation:**
- Qualification type selector (BCBA/Doctorate/Doctorate+Experience)
- Doctorate information:
  - Degree type (PhD/PsyD/EdD)
  - Institution name
  - Graduation year
  - Major/concentration
  - Transcript upload
- Experience documentation:
  - Qualifying coursework uploads
  - Mentorship verification letters
  - Publication list with DOIs
  - Postdoctoral hour logs

**⭐ NEW: Expertise Documentation:**
- Expertise basis (Practice/Teaching/Publications)
- Years of experience in subject area
- Institution/employer verification letters
- Publication records
- Course syllabi

**Document Uploads:**
- CV/Resume
- Transcripts (official)
- Certification proof
- Verification letters
- **NEW:** Mentorship documentation
- **NEW:** Hour logs
- **NEW:** Publication PDFs

**Approval Workflow:**
- Submitted by instructor
- Reviewed by ACE Coordinator
- Approved/rejected with feedback
- Re-submission if rejected
- **NEW:** Automated checklist for qualification verification ⭐

---

## 5. Event Management ⭐ UPDATED

### Event Categories
- **Learning** (general content)
- **Ethics** (ethics-specific)
- **Supervision** (supervision training)
- **Teaching** (for BCBAs training others)

### ⭐ NEW: Event Type Tags

**CE (Continuing Education) Events:**
- For BCBAs, BCaBAs
- Earns CEUs
- Must meet all BACB CE requirements

**PD (Professional Development) Events:** ⭐ NEW
- **Separate track for RBTs only** ⭐
- **Cannot issue CEUs** ⭐
- **Must align with RBT 2026 40-hour Training Outline OR Ethics Code 2.0** ⭐
- **Cannot combine CE + PD in single event** ⭐
- Earns PDUs instead of CEUs

**Filtering:**
- Participants only see events for their credential type
- RBTs see PD events only
- BCBAs see CE events only
- Automatic eligibility enforcement

### Event Modalities
- **In-Person** (physical location)
- **Synchronous** (live online - Zoom, Teams, etc.)
- **Asynchronous** (self-paced online)

### ⭐ UPDATED: CEU/PDU Calculation Rules

**Strict Rounding Requirements:** ⭐ NEW
- **Minimum: 25 minutes = 0.5 CEU/PDU** ⭐
- Round DOWN, not up
- Examples:
  - 24 minutes = 0 CEUs ⛔
  - 25 minutes = 0.5 CEUs ✅
  - 49 minutes = 0.5 CEUs ✅
  - 50 minutes = 1.0 CEU ✅
  - 74 minutes = 1.0 CEU ✅
  - 75 minutes = 1.5 CEUs ✅

**Platform Enforcement:**
- Auto-calculate CEUs from duration: `FLOOR(duration / 25) * 0.5`
- Display warning if duration < 25 minutes
- Block event submission if CEU claim exceeds calculated amount

**⭐ NEW: Content-Specific Limits:**
- **Journal Clubs:** Maximum 1 CEU/PDU per article ⭐
- **Podcasts:** Maximum 1 CEU/PDU per episode ⭐
- Event subtype field to enforce limits

### Event Form Fields

**Basic Information:**
- Title
- Description (500+ words)
- Category (Learning/Ethics/Supervision/Teaching)
- **NEW:** Event type (CE/PD) ⭐
- **NEW:** Event subtype (Standard/Journal Club/Podcast) ⭐
- Modality (In-Person/Synchronous/Asynchronous)
- Duration in minutes
- **Auto-calculated CEUs/PDUs** (duration ÷ 50, rounded down to nearest 0.5)

**Schedule:**
- Start date/time
- End date/time
- Timezone
- Registration deadline

**⭐ UPDATED: Learning Objectives (Required for transparency):**
- Minimum 3 learning objectives
- **Must be specific and measurable** ⭐
- **Displayed on event page and marketing materials** ⭐
- Format: "Participants will be able to..."

**⭐ NEW: Disclosures & Transparency:**
- **Instructor affiliations** (universities, organizations) ⭐
- **Conflicts of interest disclosure** ⭐
- **Commercial support acknowledgment** ⭐
- **Publication date** (for online/async events) ⭐
- **Provider name and number** (auto-populated) ⭐
- **All displayed on event listing page** ⭐

**Instructor Assignment:**
- Primary instructor (required)
- Co-presenters (optional)
- **Instructor qualification summary auto-displayed** ⭐

**Capacity:**
- Max participants (optional)
- Current enrollment count (live)

**Pricing:**
- Fee amount
- Free checkbox

**Content:**
- Content URL (videos, slides)
- Live meeting URL (Zoom, Teams)

**Verification Method:**
- Attendance log
- **Quiz completion** (required for async)
- Verification code
- **Time on task** (for async)
- **Check-in prompts** (for live events)

**Assessment:**
- Passing score percentage (default 80%)

### ⭐ UPDATED: Event Status Workflow

**Draft** → **Pending Approval** → **Approved** → **In Progress** → **Completed** → **Archived**

- **Draft:** Instructor creating content
- **Pending Approval:** Submitted to coordinator
- **Approved:** Coordinator approved, open for registration
- **In Progress:** Event is currently happening
- **Completed:** Event finished, certificates being issued
- **Archived:** 3 years after completion ⭐ UPDATED (was 5 years)

### ⭐ NEW: Event Documentation Requirements

**Required for All Events:**
- Instructor CV/qualifications
- Learning objectives
- Event syllabus
- Presentation materials (slides, handouts)
- **Recording (if applicable)** ⭐
- **Attendance records** ⭐
- **Assessment results** ⭐
- **Feedback responses** ⭐
- **Certificates issued** ⭐

**Retention Period:**
- **3 years from event completion** ⭐ UPDATED
- Auto-archive with download option
- Audit-ready export format

---

## 6. ⭐ NEW: Event Types & CEU/PD Tracking

### CE Event Requirements

**For BCBA/BCaBA Participants:**
- Must use event category: Learning/Ethics/Supervision/Teaching
- Duration-based CEU calculation
- Assessment required (quiz or equivalent)
- Certificate issued with CEU breakdown

### PD Event Requirements ⭐ NEW

**For RBT Participants Only:**
- **Separate event type from CE** ⭐
- **Must align with:**
  - RBT 2026 40-Hour Training Outline, OR
  - Ethics Code for Behavior Analysts 2.0
- **Cannot earn CEUs** (PDUs only) ⭐
- **Cannot combine CE + PD** ⭐
- Must include RBT-specific content verification

**Platform Features:**
- Event type selector (CE vs PD) mandatory
- Participant eligibility checks
- Separate certificate templates
- Distinct tracking in transcripts
- RBT alignment checklist during event creation

### Mixed Event Restrictions

**NOT ALLOWED:** ⭐ NEW
- Single event offering both CE and PD
- BCBAs and RBTs in same event (if counting toward credentials)
- Converting CE event to PD or vice versa

**Platform Enforcement:**
- Block cross-registration (RBTs can't register for CE)
- Separate event listings by type
- Certificate validation prevents mixed credits

---

## 7. Registration System

### Registration Process
1. User browses approved events
2. Selects event matching their credential type ⭐ UPDATED
3. Reviews learning objectives, disclosures, instructor qualifications ⭐ NEW
4. Completes registration form
5. Pays fee (if applicable) via Stripe
6. Receives confirmation email with:
   - Confirmation code
   - Event details
   - Access instructions
   - **Disclosures and transparency information** ⭐ NEW

### Registration Fields
- Event ID
- User ID
- Registration date
- Confirmation code (auto-generated: `ACE-{timestamp}-{random}`)
- Fee paid status
- Payment amount
- Stripe payment intent ID
- Confirmation status

### Registration Limits
- Max participants per event (if set)
- Registration deadline enforcement
- Waitlist functionality (future)

---

## 8. Attendance Tracking ⭐ UPDATED

### ⭐ NEW: Enhanced Verification Requirements

### For Synchronous (Live) Events:

**REQUIRED: Timestamped Sign-In/Sign-Out** ⭐ NEW
- Cannot rely solely on Zoom attendance reports
- Must use platform-embedded attendance tracking
- **Capture:**
  - Check-in timestamp
  - Check-out timestamp
  - Duration calculation
  - IP address
  - User agent

**Option: Embedded Active Responding** ⭐ NEW
- Knowledge checks during event (not just at end)
- Poll questions every 20-30 minutes
- Engagement verification
- Real-time participation tracking

**Implementation:**
- Attendance widget on event page
- Check-in button at start
- Check-out button at end
- **Minimum duration requirement: Must attend 100% for full CEU** ⭐
- Late join or early leave = proportional CEU reduction

### For Asynchronous (Self-Paced) Events:

**⭐ NEW: Minimum 3 Knowledge Questions per CEU/PDU** ⭐
- 0.5 CEU = 3 questions minimum
- 1.0 CEU = 6 questions minimum
- 1.5 CEUs = 9 questions minimum
- Questions must be distributed throughout content
- Cannot cluster all questions at end

**Time on Task Tracking:**
- Video watch time
- Content interaction logging
- Minimum time requirement (e.g., 90% of content duration)
- Anti-cheat measures (detect rapid clicking)

**Platform Features:**
- **Quiz question counter per CEU** ⭐
- Warning if question count insufficient
- Block certificate issuance if < 3 questions/CEU
- Spaced quiz intervals (every ~8-10 minutes of content)

### Attendance Record Fields
- Registration ID
- Event ID
- User ID
- Check-in time
- Check-out time
- Duration (minutes)
- **Verification codes entered** (if applicable)
- Verification timestamp
- IP address
- User agent
- **Time on task** (seconds)
- Last activity timestamp
- **Content progress percentage**
- **Engagement responses** ⭐ NEW

### ⭐ NEW: Journal Club & Podcast Limits

**Journal Clubs:**
- Maximum 1 CEU/PDU per article
- Must include article analysis and discussion
- Evidence of reading/comprehension

**Podcasts:**
- Maximum 1 CEU/PDU per episode
- Must include supplementary materials
- Knowledge check required

---

## 9. Quiz Engine ⭐ UPDATED

### Quiz Configuration
- Title
- Description
- Passing score percentage (typically 80%)
- Max attempts (optional)
- Time limit (optional)
- Randomize questions (yes/no)
- Randomize options (yes/no)
- Show correct answers after submission

### ⭐ UPDATED: Question Requirements

**Minimum Question Count:** ⭐ NEW
- **3 questions per CEU/PDU** ⭐
- Platform enforces minimum
- Warning if below threshold
- Block certificate if not met

**Question Types:**
- Multiple choice (single answer)
- True/False
- Multiple select

**Question Fields:**
- Question text
- Question type
- Options (JSON array: `[{id, text}]`)
- Correct answers (JSON array: `["a", "b"]`)
- Explanation (optional, shown after submission)
- Points (for scoring)
- Order index (for sequencing)

### ⭐ NEW: Quiz Distribution Requirements (Async Events)

**Spacing Rules:** ⭐ NEW
- Questions must be distributed throughout content
- Cannot place all questions at end
- Recommended: 1 question every 8-10 minutes of content
- Platform suggests question placement based on duration

**Implementation:**
- Quiz checkpoint feature
- Lock later content until quiz passed
- Progress tracker showing quiz completion

### Quiz Attempts
- Attempt number (incrementing)
- Started timestamp
- Completed timestamp
- Time spent (seconds)
- Score (correct answers)
- Total questions
- Score percentage
- Passed (boolean)
- Answers (JSON: `{question_id: selected_option(s)}`)
- IP address
- User agent

### Scoring Logic
- Calculate correct answers
- Compute percentage score
- Compare to passing threshold
- Allow retries if failed (up to max attempts)
- Update registration quiz_completed flag when passed

---

## 10. Feedback System ⭐ UPDATED

### ⭐ NEW: Timing Requirements

**Feedback Window:** ⭐ NEW
- **Must be provided within 2 weeks of event completion** ⭐
- Automated email request sent within 24 hours of completion
- Reminder emails at 7 days and 13 days
- Survey link expires after 14 days

**Review Timeline:** ⭐ NEW
- **Coordinator must review within 45 days** ⭐
- Dashboard shows review deadline countdown
- Overdue feedback flagged for audit
- Response documentation required

### Feedback Form Configuration
- Event ID
- Required (yes/no) - **DEFAULT: YES** ⭐ NEW
- Questions (JSON array)

### Question Types
- **Rating** (1-5 stars) with labels:
  - 1 = Poor
  - 2 = Fair
  - 3 = Good
  - 4 = Very Good
  - 5 = Excellent
- **Text** (open-ended)
- **Multiple choice**

### Standard Feedback Questions (Auto-included)
1. "Rate the overall quality of this event" (Rating, 1-5)
2. "Did the event meet the stated learning objectives?" (Rating, 1-5)
3. "Rate the instructor's knowledge and presentation" (Rating, 1-5)
4. "What was most valuable about this event?" (Text)
5. "What could be improved?" (Text)
6. **NEW:** "Were all disclosures clearly communicated?" (Multiple choice: Yes/No/Unsure) ⭐

### Feedback Response
- Feedback form ID
- Registration ID
- User ID
- Event ID
- Responses (JSON: `{question_id: answer}`)
- Submitted timestamp
- IP address

### ⭐ NEW: Feedback Requirements for Certificate Issuance

**Blocking Rule:** ⭐ NEW
- **Certificate CANNOT be issued until feedback submitted** ⭐
- User sees "Complete Feedback to Get Certificate" message
- Email reminder if certificate requested before feedback
- Feedback completion = instant certificate generation

---

## 11. Certificate Generation ⭐ UPDATED

### ⭐ UPDATED: Certificate Fields (BACB Required)

**Participant Information:**
- Full name
- **BACB ID** (if applicable)

**Provider Information:**
- Provider name
- **Provider BACB number**
- **Coordinator name** ⭐
- **Coordinator signature** (digital)

**Event Information:**
- Event title
- Event date (start and end)
- **Event modality** (In-Person/Synchronous/Asynchronous) ⭐

**CEU/PDU Breakdown:** ⭐ UPDATED
- **Instructor name(s)** ⭐ NEW
- **Subcategory for each instructor** (Ethics/Supervision) ⭐ NEW
- CEUs for Learning (if applicable)
- CEUs for Ethics (if applicable)
- CEUs for Supervision (if applicable)
- **Total CEUs/PDUs**
- **Format example:**
  - "Ethics: 2.0 CEUs (Dr. Jane Smith)"
  - "Supervision: 1.5 CEUs (Dr. John Doe)"

**Certificate Metadata:**
- Certificate number (auto-generated: `BS-YYYYMMDD-XXXX`)
- Issued date
- **Issue timestamp** (for 45-day tracking)
- **Days to issue** (event end → certificate issued)
- PDF URL
- PDF generated timestamp
- Verification URL
- Status (Pending/Issued/Revoked)

### ⭐ UPDATED: Issuance Timeline

**45-Day Compliance:** ⭐ UPDATED
- **Must issue certificate within 45 days of event completion** ⭐
- Dashboard shows:
  - Days since event ended
  - Days remaining until 45-day deadline
  - Overdue certificates flagged in red
- Auto-trigger for certificate generation:
  - Attendance verified ✓
  - Quiz passed ✓
  - **Feedback submitted ✓** ⭐ NEW

### Certificate Trigger (Auto-Issue)
When ALL conditions met:
1. `has_attended = true`
2. `quiz_completed = true`
3. **`feedback_completed = true`** ⭐ NEW
4. Event status = `completed`

Auto-generate PDF and send email with:
- Certificate PDF attachment
- Verification URL
- CEU/PDU breakdown
- Instructions for BACB transcript submission

### PDF Template Features
- Behavior School branding
- BACB-compliant layout
- QR code for verification
- Digital signature from coordinator
- **Subcategory indicators** ⭐ NEW
- **Instructor names per category** ⭐ NEW
- Security features (watermark, unique ID)

### Verification System
- Public verification page at `/verify/{certificate_number}`
- Shows:
  - Participant name (redacted BACB ID)
  - Event title
  - CEUs earned
  - Issue date
  - Provider name
  - Status (Valid/Revoked)

---

## 12. Complaint Resolution ⭐ UPDATED

### ⭐ NEW: Enhanced Complaint Workflow

### Submission Process
- Public complaint form (no login required)
- Fields:
  - Submitter name and email
  - **Submitter BACB ID** (optional)
  - Event ID (if applicable)
  - Provider ID
  - Instructor ID (if applicable)
  - Complaint type
  - Detailed description
  - Supporting documents upload

### ⭐ NEW: Resolution Timeline

**Review Requirements:** ⭐ NEW
- **Coordinator must review within 45 days** ⭐
- **Provide written response within 45 days** ⭐
- Document resolution steps taken

**Status Workflow:**
1. **Submitted** → Auto-email to coordinator
2. **Under Review** → Coordinator investigating
3. **Resolved** → Response provided to participant
4. **⭐ NEW: Escalated to BACB** → If unresolved

### ⭐ NEW: BACB Escalation Features

**Participant Rights Notification:** ⭐ NEW
- **Inform participants they can file Notice of Alleged Violation (NAV)** ⭐
- Link to BACB complaint process
- Included in:
  - Complaint confirmation email
  - Unresolved complaint response
  - Platform footer/help section

**Escalation Tracking:**
- Escalation checkbox
- Escalation date
- BACB case number (if provided)
- Follow-up documentation

### Complaint Dashboard (Coordinator)
- All complaints listed
- **Days since submission** (countdown to 45-day deadline) ⭐ NEW
- Status filters
- **Overdue complaints highlighted** ⭐ NEW
- Quick actions (respond, resolve, escalate)
- **NAV escalation option with BACB link** ⭐ NEW

### ⭐ NEW: Audit Requirements

**Required Documentation:**
- All complaints received
- Response letters/emails
- Resolution documentation
- Timeline adherence proof
- **Must be retrievable during audit** ⭐

---

## 13. ⭐ NEW: Audit & Compliance Dashboard

### Audit-Ready Reports

**One-Click Export:**
- **Attendance logs** (all events, searchable by date range)
- **Instructor qualifications** (with uploaded documents)
- **Feedback records** (responses + coordinator reviews)
- **Certificates issued** (per event, with issuance dates)
- **Complaint resolutions** (with timelines)

**Report Formats:**
- PDF (formatted for BACB submission)
- Excel (for data analysis)
- ZIP with supporting documents

### Compliance Dashboard Features

**Real-Time Monitoring:**
- Certificate issuance delays (> 45 days)
- Feedback review overdue (> 45 days)
- Complaint response overdue (> 45 days)
- Coordinator certification expiring (< 90 days)
- Provider renewal due (< 45 days)
- **Instructor qualification expirations**
- **Event documentation missing**

**Compliance Score:**
- 100% = All requirements met
- Deductions for:
  - Late certificate issuance (-5 points each)
  - Overdue feedback reviews (-3 points each)
  - Overdue complaint responses (-10 points each)
  - Missing documentation (-5 points each)
  - Expired credentials (-20 points each)

**Visual Indicators:**
- 🟢 Green (95-100%): Excellent
- 🟡 Yellow (85-94%): Good
- 🟠 Orange (70-84%): Needs Attention
- 🔴 Red (<70%): Critical

### 3-Year Data Retention ⭐ UPDATED

**Automatic Archival:**
- Event materials archived 3 years after completion
- `retention_delete_after` field auto-set
- Archived data moved to cold storage
- **Download option before deletion**
- Audit log of all deletions

**Retention Checklist (Per Event):**
- ✅ Event syllabus
- ✅ Presentation materials
- ✅ Recording (if applicable)
- ✅ Attendance records
- ✅ Quiz results
- ✅ Feedback responses
- ✅ Certificates issued
- ✅ Instructor qualifications

---

## 14. Renewal Management ⭐ UPDATED

### ⭐ NEW: 2024 Renewal Process Changes

### Renewal Timeline:
- **Annual renewal required**
- **Renewal opens 45 days before expiration** ⭐ NEW
- **30-day grace period with $50 late fee** ⭐ NEW
- Provider ineligible to issue CEUs/PDUs during lapse

### Renewal Reminders:
- **45 days before:** "Renewal now available"
- **15 days before:** "Renewal due soon"
- **5 days before:** "Urgent: Renewal expires in 5 days"
- **On expiration date:** "Provider status: LAPSED"
- **Daily during grace period:** "Reinstate now - $50 fee applies"

### ⭐ NEW: Lapse Period Restrictions

**During Lapse:**
- ❌ Cannot publish new events
- ❌ Cannot issue certificates
- ❌ Cannot approve instructor qualifications
- ⚠️ Existing event registrations frozen
- ⚠️ Participants notified of provider lapse

**Platform Enforcement:**
- Gray out "Create Event" button
- Display "Provider Status: LAPSED" banner
- Block certificate generation
- Email coordinator daily

### Reinstatement Process:
1. Pay renewal fee ($400) + late fee ($50)
2. **Confirm coordinator still meets 5-year requirement**
3. **Revalidate organizational legal status** ⭐ NEW
4. Update any changed information
5. **Digital attestation from leadership** ⭐ NEW
6. Status changes to ACTIVE
7. Unlock all features

### Renewal Tracking Fields:
- Last renewal date
- Next renewal date
- Renewal fee paid (boolean)
- **Late fee paid** (boolean) ⭐ NEW
- Renewal reminders sent (45/15/5 days)
- **Grace period end date** ⭐ NEW
- **Reinstatement date** (if applicable) ⭐ NEW

---

## 15. ⭐ NEW: Marketing & Transparency Requirements

### Event Listing Display (Public-Facing)

**Required Information:** ⭐ NEW
- **Provider name and BACB provider number**
- **Instructor name(s) and qualification summary**
- **Learning objectives** (all listed)
- **Disclosures:**
  - Instructor affiliations
  - Conflicts of interest
  - Commercial support acknowledgments
- **Publication date** (for online/async events)
- Event modality, duration, CEUs/PDUs
- Fee (or "Free")

### Event Page Template

```
[Event Title]

Provider: Behavior School (BACB Provider #XXXX)

Instructor: Dr. Jane Smith, PhD, BCBA-D
Qualification: BCBA with 10+ years clinical experience

📅 Date: [Start Date] - [End Date]
📍 Modality: [Synchronous/Asynchronous/In-Person]
⏱️ Duration: [X] minutes
🎓 CEUs: [X.X] (Category: [Learning/Ethics/Supervision])
💰 Fee: $[XX] or FREE

📖 Learning Objectives:
• Participants will be able to...
• Participants will be able to...
• Participants will be able to...

🔍 Disclosures:
Affiliations: [University/Organization]
Conflicts of Interest: [None or Description]
Commercial Support: [None or Acknowledgment]

📅 Published: [Date] (for online events)
```

### Marketing Material Export

**Auto-Generate:**
- Event flyer PDF (with all required fields)
- Email announcement template
- Social media post template
- Website embed code

**Include in All Materials:**
- Provider name and number
- Instructor qualifications
- Learning objectives
- Disclosures

---

## 🛠️ Technical Implementation Requirements

### Database Schema Updates Needed:

1. **ace_providers table:**
   - `ein` (text) ⭐
   - `incorporation_doc_url` (text) ⭐
   - `legal_entity_verified` (boolean) ⭐
   - `leadership_attestation_url` (text) ⭐
   - `leadership_attestation_date` (timestamptz) ⭐
   - `coordinator_certification_date` (date) ⭐
   - `coordinator_certification_expires` (date) ⭐
   - `grace_period_end_date` (date) ⭐
   - `reinstatement_date` (date) ⭐
   - `late_fee_paid` (boolean) ⭐

2. **ace_instructor_qualifications table:**
   - `qualification_path` (enum: bcba/doctorate/doctorate_plus) ⭐
   - `doctorate_type` (text) ⭐
   - `institution_name` (text) ⭐
   - `graduation_year` (integer) ⭐
   - `transcript_url` (text)
   - `qualifying_experience_type` (enum: coursework/mentorship/publications/hours) ⭐
   - `experience_documentation_urls` (text[]) ⭐
   - `expertise_basis` (enum: practice/teaching/publications) ⭐
   - `years_experience` (integer) ⭐
   - `expertise_documentation_urls` (text[]) ⭐

3. **ace_events table:**
   - `event_type` (enum: ce/pd) ⭐
   - `event_subtype` (enum: standard/journal_club/podcast) ⭐
   - `instructor_affiliations` (text[]) ⭐
   - `publication_date` (date) ⭐
   - `rbt_alignment_checklist` (jsonb) ⭐

4. **ace_certificates table:**
   - `instructor_subcategories` (jsonb: `{instructor_id: subcategory}`) ⭐

5. **ace_feedback_responses table:**
   - `coordinator_reviewed_at` (timestamptz) ⭐
   - `coordinator_notes` (text) ⭐

6. **ace_complaints table:**
   - `submitter_bacb_id` (text) ⭐
   - `nav_escalation_notified` (boolean) ⭐
   - `response_due_date` (date) ⭐

7. **New table: ace_compliance_reports:**
   - `id` (uuid)
   - `provider_id` (uuid)
   - `report_type` (enum: attendance/qualifications/feedback/certificates/complaints/full_audit)
   - `generated_at` (timestamptz)
   - `date_range_start` (date)
   - `date_range_end` (date)
   - `pdf_url` (text)
   - `excel_url` (text)
   - `zip_url` (text)
   - `compliance_score` (integer)

### API Endpoints to Add:

- `POST /api/ace/providers/verify-entity` - Upload EIN/incorporation docs
- `POST /api/ace/providers/leadership-attestation` - Digital signature
- `POST /api/ace/providers/renew` - Handle renewal + late fees
- `POST /api/ace/instructors/verify-qualifications` - Enhanced verification
- `GET /api/ace/compliance/score` - Calculate compliance score
- `POST /api/ace/compliance/export` - Generate audit reports
- `POST /api/ace/events/distribute-quizzes` - Auto-place quiz checkpoints
- `GET /api/ace/feedback/overdue` - List overdue feedback reviews
- `POST /api/ace/complaints/escalate` - Mark NAV escalation

### UI Components to Build:

1. **Provider Setup Wizard:**
   - Legal entity verification step
   - Document upload interface
   - Digital attestation form with e-signature

2. **Coordinator Dashboard:**
   - Certification expiration countdown
   - Compliance score widget
   - Overdue items list

3. **Instructor Qualification Form:**
   - Multi-step wizard (qualification path → experience → expertise)
   - Document upload manager
   - Auto-validation checklist

4. **Event Creation Wizard:**
   - CE vs PD selector with eligibility logic
   - Quiz distribution preview
   - Disclosure editor
   - Marketing material generator

5. **Compliance Dashboard:**
   - Real-time compliance score
   - Audit report generator
   - Overdue items tracker
   - Document retention calendar

6. **Feedback Review Interface:**
   - Response timeline tracker
   - Bulk review tools
   - Coordinator notes

7. **Complaint Management:**
   - Response editor
   - NAV escalation workflow
   - Timeline compliance indicators

---

## 📊 Success Metrics

### Provider Performance:
- Certificate issuance within 45 days: **100% target**
- Feedback review within 45 days: **100% target**
- Complaint response within 45 days: **100% target**
- Compliance score: **95%+ target**
- Instructor qualification approval rate: **>90% target**

### Participant Satisfaction:
- Event quality rating: **4.0/5.0+ target**
- Feedback completion rate: **95%+ target** (enforced for certificate)
- Complaint resolution satisfaction: **80%+ target**

### System Performance:
- Certificate generation time: **<5 minutes**
- Audit report generation: **<2 minutes**
- Document upload success: **99%+ target**
- Payment processing success: **99%+ target**

---

## 🚀 Implementation Phases

### Phase 1: Core Platform (Q4 2024) ✅ IN PROGRESS
- Database schema
- User roles
- Event management
- Registration
- Quiz engine
- Certificate generation

### Phase 2: Enhanced Compliance (Q4 2024) 🎯 PRIORITY
- **Legal entity verification** ⭐
- **Enhanced instructor qualifications** ⭐
- **3-question-per-CEU enforcement** ⭐
- **CE/PD event separation** ⭐
- **45-day renewal with grace period** ⭐
- **Compliance dashboard** ⭐

### Phase 3: Audit & Marketing (Q1 2025)
- Audit report generator
- Marketing material automation
- Advanced analytics
- Bulk operations

### Phase 4: Integrations (Q1 2025)
- Zoom API for attendance
- Stripe for payments
- Email automation (Mailgun/Resend)
- BACB API (if available)

---

## 📝 Appendix: BACB Compliance Checklist

### Provider Requirements:
- ✅ Legal entity verification (organizations)
- ✅ EIN and incorporation docs
- ✅ Leadership attestation
- ✅ Coordinator BCBA ≥5 years
- ✅ Coordinator certification tracking
- ✅ Annual renewal + 45-day grace
- ✅ $50 late fee enforcement

### Instructor Requirements:
- ✅ Qualification path verification (BCBA/Doctorate/Doctorate+)
- ✅ Expertise documentation (5yr practice/3yr teaching/publications)
- ✅ Document uploads and approval workflow

### Event Requirements:
- ✅ CE vs PD separation
- ✅ 25 minutes = 0.5 CEU/PDU (strict rounding)
- ✅ 3 questions per CEU/PDU for async events
- ✅ Journal club/podcast 1 CEU/PDU limit
- ✅ Learning objectives (3+ required)
- ✅ Disclosures and transparency
- ✅ Publication date for online events

### Attendance Requirements:
- ✅ Timestamped sign-in/out (not Zoom logs)
- ✅ Active responding or engagement checks
- ✅ Time on task for async events

### Certificate Requirements:
- ✅ 45-day issuance deadline
- ✅ Instructor names + subcategories
- ✅ All BACB-required fields

### Feedback Requirements:
- ✅ 2-week submission window
- ✅ 45-day coordinator review
- ✅ Required for certificate issuance

### Complaint Requirements:
- ✅ 45-day response timeline
- ✅ NAV escalation notification
- ✅ Resolution documentation

### Audit Requirements:
- ✅ 3-year data retention
- ✅ One-click audit reports
- ✅ Document archival system
- ✅ Compliance score tracking

---

**Document Owner:** Behavior School Product Team
**BACB Standards Reference:** ACE Provider Handbook (2024 Edition)
**Next Review Date:** December 31, 2024
