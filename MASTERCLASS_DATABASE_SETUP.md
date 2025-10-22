# Masterclass Database Setup Guide

## Overview

This guide will help you set up the database for the Behavior School free CEU masterclass system.

## Database Schema

The masterclass system uses 5 main tables:

1. **masterclass_enrollments** - User enrollment information
2. **masterclass_progress** - Video and quiz completion tracking
3. **masterclass_quiz_responses** - Individual quiz answer analytics
4. **masterclass_certificates** - Certificate generation and verification
5. **masterclass_analytics_events** - User interaction tracking

## Quick Start

### Method 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy the contents of `sql/masterclass-schema.sql`
5. Paste into the editor
6. Click **Run** or press `Cmd/Ctrl + Enter`

### Method 2: Using the Migration Script

```bash
# Make sure your .env.local file has these variables:
# SUPABASE_URL=your_supabase_url
# SUPABASE_SERVICE_KEY=your_service_role_key

node apply-masterclass-migration.js
```

### Method 3: Using psql Command Line

```bash
# Get your Supabase database connection string from the dashboard
# Settings > Database > Connection String

psql "postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].supabase.co:5432/postgres" < sql/masterclass-schema.sql
```

## Verifying the Setup

After running the migration, verify the tables were created:

```sql
-- Run this query in the Supabase SQL Editor
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name LIKE 'masterclass_%'
ORDER BY table_name;
```

You should see:
- masterclass_analytics_events
- masterclass_certificates
- masterclass_enrollments
- masterclass_progress
- masterclass_quiz_responses

## Database Functions

The schema includes several helper functions:

### `is_masterclass_complete(enrollment_uuid UUID)`
Returns `true` if all 4 sections are complete (video + quiz passed)

```sql
SELECT is_masterclass_complete('your-enrollment-id');
```

### `calculate_masterclass_progress(enrollment_uuid UUID)`
Returns progress percentage (0-100)

```sql
SELECT calculate_masterclass_progress('your-enrollment-id');
```

### `generate_certificate_id()`
Generates a unique certificate ID in format: `BS-MC-YYYYMMDD-XXXXXX`

```sql
SELECT generate_certificate_id();
-- Example output: BS-MC-20250121-A7F3K9
```

## Database Views

### `masterclass_enrollment_overview`
Comprehensive view of enrollments with progress stats

```sql
SELECT * FROM masterclass_enrollment_overview LIMIT 10;
```

### `masterclass_quiz_performance`
Quiz statistics by section

```sql
SELECT * FROM masterclass_quiz_performance;
```

## Row Level Security (RLS)

RLS is enabled on all tables with policies that allow:
- Public enrollment (INSERT)
- Users can view their own data (SELECT)
- Users can update their own progress (UPDATE)

## Indexes

The schema includes indexes on frequently queried columns:
- Email lookups
- Certificate ID verification
- Progress tracking
- Analytics queries

## Sample Queries

### Get enrollment with progress
```sql
SELECT
  e.*,
  calculate_masterclass_progress(e.id) as progress_pct,
  is_masterclass_complete(e.id) as is_complete
FROM masterclass_enrollments e
WHERE e.email = 'user@example.com';
```

### Get section progress for an enrollment
```sql
SELECT
  section_number,
  video_completed,
  video_watched_percentage,
  quiz_passed,
  quiz_score,
  quiz_total,
  quiz_attempts
FROM masterclass_progress
WHERE enrollment_id = 'your-enrollment-id'
ORDER BY section_number;
```

### Verify a certificate
```sql
SELECT
  c.certificate_id,
  c.recipient_name,
  c.bacb_cert_number,
  c.ceu_credits,
  c.completion_date,
  c.verification_count
FROM masterclass_certificates c
WHERE c.certificate_id = 'BS-MC-20250121-XXXXXX';
```

### Analytics: Enrollment funnel
```sql
SELECT
  COUNT(*) as total_enrollments,
  COUNT(completed_at) as completed,
  COUNT(certificate_id) as certificates_issued,
  ROUND(COUNT(completed_at)::NUMERIC / COUNT(*)::NUMERIC * 100, 2) as completion_rate
FROM masterclass_enrollments;
```

### Analytics: Drop-off by section
```sql
SELECT
  section_number,
  COUNT(*) as started,
  SUM(CASE WHEN video_completed THEN 1 ELSE 0 END) as video_complete,
  SUM(CASE WHEN quiz_passed THEN 1 ELSE 0 END) as quiz_passed,
  ROUND(
    SUM(CASE WHEN video_completed THEN 1 ELSE 0 END)::NUMERIC /
    COUNT(*)::NUMERIC * 100,
    2
  ) as video_completion_rate,
  ROUND(
    SUM(CASE WHEN quiz_passed THEN 1 ELSE 0 END)::NUMERIC /
    COUNT(*)::NUMERIC * 100,
    2
  ) as quiz_pass_rate
FROM masterclass_progress
GROUP BY section_number
ORDER BY section_number;
```

## TypeScript Integration

The database types are defined in `src/lib/masterclass/types.ts` and query helpers in `src/lib/masterclass/queries.ts`.

### Example Usage

```typescript
import {
  createEnrollment,
  getEnrollmentByEmail,
  markVideoComplete,
  saveQuizResults
} from '@/lib/masterclass/queries';

// Create enrollment
const enrollment = await createEnrollment({
  email: 'user@example.com',
  name: 'John Doe',
  bacbCertNumber: '1-12-12345'
});

// Mark video complete
await markVideoComplete(enrollment.id, 1);

// Save quiz results
await saveQuizResults(
  enrollment.id,
  1, // section number
  5, // score
  5, // total questions
  true, // passed
  1 // attempt number
);
```

## Troubleshooting

### Error: Permission denied for table

Make sure you're using the service role key (not anon key) when running migrations.

### Error: Relation already exists

The migration is idempotent (uses `CREATE TABLE IF NOT EXISTS`), so you can run it multiple times safely.

### Error: Function does not exist

Some Supabase projects may not have the required PostgreSQL extensions. Run:

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

## Backup and Restore

### Backup
```bash
pg_dump "your-connection-string" \
  -t masterclass_enrollments \
  -t masterclass_progress \
  -t masterclass_quiz_responses \
  -t masterclass_certificates \
  -t masterclass_analytics_events \
  > masterclass_backup.sql
```

### Restore
```bash
psql "your-connection-string" < masterclass_backup.sql
```

## Performance Optimization

The schema includes indexes on frequently queried columns. For large datasets, consider:

1. **Partitioning** - Partition `masterclass_analytics_events` by date
2. **Archiving** - Move old completed enrollments to archive table
3. **Caching** - Cache enrollment progress in Redis/localStorage

## Security Considerations

✅ Email validation with regex constraint
✅ BACB cert number stored (consider encryption for production)
✅ Row Level Security enabled
✅ Certificate IDs are unique and verifiable
✅ Quiz responses tracked for audit trail

⚠️ **For production**: Consider encrypting sensitive PII fields

## Next Steps

1. ✅ Run the migration
2. 📝 Create course content configuration
3. 🎨 Build the frontend components
4. 🎬 Upload videos to Vimeo/YouTube
5. 📧 Set up certificate email templates
6. 🧪 Test the complete user flow

## Support

If you encounter issues:
1. Check Supabase logs in the dashboard
2. Verify environment variables are set correctly
3. Ensure Supabase project is on a paid plan (if using large datasets)
4. Review the SQL error messages carefully

---

**Database Schema Version**: 1.0
**Created**: 2025-01-21
**Last Updated**: 2025-01-21
