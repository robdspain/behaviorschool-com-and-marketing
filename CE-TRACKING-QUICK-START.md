# Simple CE Tracking System - Quick Start

## 🎯 What This Is

A **simple CE/CEU tracking system** for your mastermind groups and courses where:
- ✅ Participants earn CEUs by attending sessions
- ✅ You track attendance and progress
- ✅ You issue certificates with CEU details
- ✅ Participants report CEUs to BACB on their own

**This is NOT a full BACB ACE Provider platform.** You don't need BACB approval or fees. You're simply tracking CE credits for your own programs.

---

## 📦 What Was Created

### 1. Database Schema (`sql/simple-ce-tracking-schema.sql`)
**625 lines of production-ready SQL** including:

#### Tables (5):
1. **`ce_programs`** - Your mastermind groups and courses
2. **`ce_sessions`** - Individual meetings/modules within programs
3. **`ce_enrollments`** - Participant registrations
4. **`ce_attendance`** - Session attendance tracking
5. **`ce_certificates`** - Issued certificates with CEU details

#### Features:
- ✅ Auto-calculate CEUs (1 hour = 1.0 CEU)
- ✅ Track attendance (live check-in/out or async completion)
- ✅ Auto-update enrollment progress
- ✅ Generate unique certificate numbers
- ✅ Participant dashboard view
- ✅ Program statistics view
- ✅ Row-level security (RLS) policies

---

## 🚀 Quick Start Guide

### Step 1: Apply the Database Schema

```bash
# Connect to your Supabase database
psql -h your-project.supabase.co -U postgres -d postgres

# Or use Supabase SQL Editor in the dashboard
# Paste the contents of sql/simple-ce-tracking-schema.sql
\i sql/simple-ce-tracking-schema.sql
```

### Step 2: Verify Tables Were Created

```sql
-- Check tables
\dt ce_*

-- Should see:
-- ce_programs
-- ce_sessions
-- ce_enrollments
-- ce_attendance
-- ce_certificates

-- Check views
\dv

-- Should see:
-- ce_participant_dashboard
-- ce_program_stats
```

### Step 3: Create Your First Program

```sql
-- Example: Mastermind Group
INSERT INTO ce_programs (
  name, 
  description, 
  program_type, 
  total_ceus, 
  ce_category, 
  instructor_name, 
  instructor_credentials,
  start_date,
  end_date
) VALUES (
  'School BCBA Mastermind Group',
  'Monthly mastermind sessions for school-based BCBAs',
  'mastermind',
  12.0,
  'general',
  'Rob Spain, M.S., BCBA, IBA',
  'BCBA, IBA, President of CalABA Education SIG',
  '2024-11-01',
  '2025-10-31'
);

-- Example: CE Course
INSERT INTO ce_programs (
  name, 
  description, 
  program_type, 
  total_ceus, 
  ce_category, 
  instructor_name, 
  instructor_credentials,
  start_date,
  end_date
) VALUES (
  'School BCBA Transformation Program',
  '8-week transformation program for school-based BCBAs',
  'course',
  16.0,
  'general',
  'Rob Spain, M.S., BCBA, IBA',
  'BCBA, IBA, Adjunct Professor at Fresno Pacific University',
  '2024-11-15',
  '2025-01-15'
);
```

### Step 4: Add Sessions to Your Programs

```sql
-- Get the program ID first
SELECT id, name FROM ce_programs;

-- Add sessions (replace <program_id> with actual UUID)
INSERT INTO ce_sessions (
  program_id,
  title,
  description,
  session_number,
  ceus_awarded,
  duration_minutes,
  delivery_method,
  session_date
) VALUES 
  ('<program_id>', 'Week 1: From Crisis Manager to Systems Leader', 'Introduction to ethical leadership in schools', 1, 2.0, 120, 'zoom_live', '2024-11-15 18:00:00'),
  ('<program_id>', 'Week 2: Building Teacher Buy-In', 'Strategies for engaging teachers in behavior plans', 2, 2.0, 120, 'zoom_live', '2024-11-22 18:00:00'),
  ('<program_id>', 'Week 3: School-Wide Behavior Systems', 'MTSS and PBIS implementation', 3, 2.0, 120, 'zoom_live', '2024-11-29 18:00:00');
```

---

## 📊 How It Works

### User Flow:

1. **Participant Enrolls**
   ```sql
   INSERT INTO ce_enrollments (program_id, user_id, participant_name, participant_email, bacb_number)
   VALUES ('<program_id>', auth.uid(), 'John Doe', 'john@example.com', 'BCBA-123456');
   ```

2. **Participant Attends Session**
   ```sql
   -- Create attendance record
   INSERT INTO ce_attendance (session_id, enrollment_id, user_id, attended, checked_in_at, checked_out_at)
   VALUES ('<session_id>', '<enrollment_id>', auth.uid(), TRUE, NOW(), NOW() + INTERVAL '2 hours');
   
   -- CEUs are auto-awarded via trigger
   ```

3. **Progress Auto-Updates**
   - Trigger: `trg_ce_attendance_update_progress`
   - Auto-calculates: sessions_completed, total_ceus_earned
   - Auto-marks enrollment as 'completed' when all sessions attended

4. **Certificate Issued**
   ```sql
   INSERT INTO ce_certificates (
     program_id,
     enrollment_id,
     user_id,
     participant_name,
     participant_email,
     bacb_number,
     program_name,
     instructor_name,
     total_ceus,
     ce_category,
     completion_date
   )
   SELECT 
     e.program_id,
     e.id,
     e.user_id,
     e.participant_name,
     e.participant_email,
     e.bacb_number,
     p.name,
     p.instructor_name,
     e.total_ceus_earned,
     p.ce_category,
     CURRENT_DATE
   FROM ce_enrollments e
   JOIN ce_programs p ON e.program_id = p.id
   WHERE e.id = '<enrollment_id>'
     AND e.status = 'completed';
   
   -- Certificate number is auto-generated (e.g., CE-2024-123456)
   ```

---

## 🎨 UI Components to Build

### 1. Admin: Program Management
**Page:** `/admin/ce-programs`

**Features:**
- ✅ List all programs (mastermind, course, workshop)
- ✅ Create new program
- ✅ Edit program details
- ✅ View enrollment stats
- ✅ View session list

**API Endpoint:** `/api/admin/ce/programs`

### 2. Admin: Session Management
**Page:** `/admin/ce-programs/[programId]/sessions`

**Features:**
- ✅ List all sessions in program
- ✅ Create new session
- ✅ Edit session details
- ✅ Mark session as completed
- ✅ View attendance list

**API Endpoint:** `/api/admin/ce/sessions`

### 3. Admin: Attendance Tracking
**Page:** `/admin/ce-programs/[programId]/attendance`

**Features:**
- ✅ View all participants
- ✅ Mark attendance (check-in/out)
- ✅ View individual participant progress
- ✅ Export attendance report (CSV)

**API Endpoint:** `/api/admin/ce/attendance`

### 4. Admin: Certificate Generator
**Page:** `/admin/ce-certificates`

**Features:**
- ✅ List all issued certificates
- ✅ Generate certificate for completed enrollment
- ✅ Download certificate PDF
- ✅ Revoke certificate (if needed)

**API Endpoint:** `/api/admin/ce/certificates`

### 5. Participant: Enrollment
**Page:** `/ce-programs/[programId]/enroll`

**Features:**
- ✅ View program details
- ✅ Enroll in program
- ✅ Enter BACB number (optional)
- ✅ Confirmation email

**API Endpoint:** `/api/ce/enroll`

### 6. Participant: Dashboard
**Page:** `/dashboard/ce`

**Features:**
- ✅ View enrolled programs
- ✅ See upcoming sessions
- ✅ Check-in to live sessions
- ✅ View progress (sessions completed, CEUs earned)
- ✅ Download certificates

**Uses View:** `ce_participant_dashboard`

---

## 📁 File Structure (To Create)

```
src/
├── app/
│   ├── admin/
│   │   └── ce/
│   │       ├── programs/
│   │       │   ├── page.tsx              # List programs
│   │       │   ├── new/
│   │       │   │   └── page.tsx          # Create program
│   │       │   └── [programId]/
│   │       │       ├── page.tsx          # Edit program
│   │       │       ├── sessions/
│   │       │       │   └── page.tsx      # Manage sessions
│   │       │       └── attendance/
│   │       │           └── page.tsx      # Track attendance
│   │       └── certificates/
│   │           └── page.tsx              # Manage certificates
│   ├── dashboard/
│   │   └── ce/
│   │       └── page.tsx                  # Participant dashboard
│   ├── ce-programs/
│   │   ├── page.tsx                      # Browse programs
│   │   └── [programId]/
│   │       ├── page.tsx                  # Program details
│   │       └── enroll/
│   │           └── page.tsx              # Enrollment form
│   └── api/
│       ├── admin/
│       │   └── ce/
│       │       ├── programs/
│       │       │   └── route.ts
│       │       ├── sessions/
│       │       │   └── route.ts
│       │       ├── attendance/
│       │       │   └── route.ts
│       │       └── certificates/
│       │           └── route.ts
│       └── ce/
│           ├── enroll/
│           │   └── route.ts
│           └── dashboard/
│               └── route.ts
├── lib/
│   └── ce/
│       ├── queries.ts                    # Database queries
│       ├── types.ts                      # TypeScript types
│       └── certificate-generator.ts      # PDF generation
└── components/
    └── ce/
        ├── ProgramCard.tsx
        ├── SessionList.tsx
        ├── AttendanceTable.tsx
        ├── ProgressBar.tsx
        └── CertificatePreview.tsx
```

---

## 🗄️ Database Schema Overview

### Table: `ce_programs`
Stores your mastermind groups and courses.

**Key Fields:**
- `name` - Program name
- `program_type` - 'mastermind', 'course', 'workshop'
- `total_ceus` - Total CEUs available
- `instructor_name` - Your name
- `start_date` / `end_date` - Program dates

### Table: `ce_sessions`
Individual meetings or modules within a program.

**Key Fields:**
- `program_id` - FK to ce_programs
- `title` - Session name
- `ceus_awarded` - CEUs for this session
- `duration_minutes` - Session length
- `delivery_method` - 'in_person', 'zoom_live', 'asynchronous'
- `session_date` - When it happens

### Table: `ce_enrollments`
Participant registrations.

**Key Fields:**
- `program_id` - FK to ce_programs
- `user_id` - FK to auth.users
- `participant_name` / `participant_email` - Contact info
- `bacb_number` - Optional BACB certification number
- `sessions_completed` - Auto-calculated
- `total_ceus_earned` - Auto-calculated
- `status` - 'active', 'completed', 'dropped'

### Table: `ce_attendance`
Track who attended which sessions.

**Key Fields:**
- `session_id` - FK to ce_sessions
- `enrollment_id` - FK to ce_enrollments
- `attended` - TRUE/FALSE
- `checked_in_at` / `checked_out_at` - Timestamps for live
- `started_at` / `completed_at` - Timestamps for async
- `ceus_earned` - Auto-awarded when attended = TRUE

### Table: `ce_certificates`
Certificates issued to participants.

**Key Fields:**
- `certificate_number` - Auto-generated (CE-2024-123456)
- `program_id` / `enrollment_id` / `user_id` - FKs
- `participant_name` / `bacb_number` - For certificate
- `total_ceus` - CEUs earned
- `completion_date` - When completed
- `sessions_breakdown` - JSON array of sessions attended
- `certificate_url` - PDF download link

---

## 🧪 Testing Checklist

### Database:
- [ ] Apply schema successfully
- [ ] All 5 tables created
- [ ] All triggers fire correctly
- [ ] Views return data
- [ ] RLS policies enforced

### Admin UI:
- [ ] Create program
- [ ] Edit program details
- [ ] Add sessions to program
- [ ] Mark participant attendance
- [ ] Generate certificate

### Participant UI:
- [ ] Browse programs
- [ ] Enroll in program
- [ ] View dashboard with progress
- [ ] Check-in to live session
- [ ] Download certificate

### Automation:
- [ ] Attendance triggers progress update
- [ ] CEUs auto-awarded on attendance
- [ ] Enrollment auto-marks 'completed'
- [ ] Certificate number auto-generated

---

## 📈 Next Steps (In Order)

### 1. Apply Database Schema ✅ (You are here)
```bash
psql -h your-db.supabase.co -U postgres < sql/simple-ce-tracking-schema.sql
```

### 2. Build TypeScript Types
Create `src/lib/ce/types.ts` with types matching the schema.

### 3. Build Database Query Functions
Create `src/lib/ce/queries.ts` with functions like:
- `getPrograms()`
- `createProgram()`
- `getSessions(programId)`
- `markAttendance()`
- etc.

### 4. Build Admin UI (Programs)
Start with `/admin/ce/programs/page.tsx` - list and create programs.

### 5. Build Admin UI (Sessions)
Then `/admin/ce/programs/[id]/sessions` - manage sessions.

### 6. Build Attendance Tracking
Then `/admin/ce/programs/[id]/attendance` - mark attendance.

### 7. Build Certificate Generator
Then `/admin/ce/certificates` - generate and download PDFs.

### 8. Build Participant Dashboard
Finally `/dashboard/ce` - show progress and certificates.

---

## 🔐 Security (RLS Policies)

The schema includes Row-Level Security policies:

- **Programs:** Public can view active programs, admin can create/edit
- **Sessions:** Enrolled participants can view sessions
- **Enrollments:** Users can only see their own enrollments
- **Attendance:** Users can only see/mark their own attendance
- **Certificates:** Users can only see their own certificates

---

## 📞 Common Questions

### Q: Do I need BACB approval for this?
**A:** No! You're just tracking CE credits for your own programs. Participants report CEUs to BACB themselves.

### Q: Can I issue "official" CEUs?
**A:** No, only BACB-approved ACE Providers can issue official CEUs. Your certificates are for participant records only.

### Q: What should participants do with these certificates?
**A:** They keep them for their records and report the CEUs when renewing their BACB certification.

### Q: How do I calculate CEUs?
**A:** Simple rule: 1 hour = 1.0 CEU (included in schema). The function `calculate_ceus_simple()` does this automatically.

### Q: Can I customize the certificate format?
**A:** Yes! You'll build the PDF generator (e.g., using `react-pdf` or `jsPDF`) and can design it however you want.

### Q: Can participants earn partial CEUs?
**A:** Yes! Just set `ceus_awarded` on each session. For example, a 30-min session = 0.5 CEUs.

---

## ✅ What's Ready Now

- ✅ Complete database schema (625 lines)
- ✅ 5 tables with relationships
- ✅ Auto-calculation triggers
- ✅ Progress tracking
- ✅ Certificate number generation
- ✅ RLS security policies
- ✅ Dashboard views
- ✅ 7 TODO items for UI development

---

## ⏭️ What's Next

1. **Apply the schema** to your Supabase database
2. **Mark the first TODO as in-progress:** "Apply simple-ce-tracking-schema.sql to database"
3. **Verify all tables created**
4. **Start building the Admin Programs UI** (next TODO)

---

**You're ready to go!** This is a much simpler system focused on tracking CE for your own programs. No BACB provider requirements, no complex compliance rules. 🚀

**First command to run:**
```bash
# Copy the schema to your clipboard
cat sql/simple-ce-tracking-schema.sql | pbcopy

# Then paste into Supabase SQL Editor
# Or run via psql
psql -h your-project.supabase.co -U postgres -d postgres -f sql/simple-ce-tracking-schema.sql
```

Good luck! 💪

