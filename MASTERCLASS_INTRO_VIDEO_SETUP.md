# Masterclass Introduction Video Setup

This document explains how to configure the Wistia-hosted introduction video for the masterclass.

## Overview

The masterclass admin panel now includes a field to link a Wistia-hosted introduction video. This video will be displayed at the beginning of the course to introduce students to the content.

## Setup Steps

### 1. Apply Database Migration

First, you need to add the `introduction_video_url` column to the database:

```bash
# Option A: Using the migration script
node apply-introduction-video-migration.js

# Option B: Manual SQL (via Supabase SQL Editor)
# Run the SQL from: supabase/migrations/20251025_add_introduction_video_to_masterclass.sql
```

The migration adds a new column to the `masterclass_certificate_config` table:
```sql
ALTER TABLE masterclass_certificate_config
ADD COLUMN IF NOT EXISTS introduction_video_url TEXT;
```

### 2. Configure in Admin Panel

1. Navigate to `/admin/masterclass/certificate` in your admin panel
2. Click "Edit Settings"
3. Find the "Introduction Video URL" field
4. Enter your Wistia embed URL (e.g., `https://fast.wistia.net/embed/iframe/abc123xyz`)
5. Click "Save Settings"

### 3. Wistia URL Format

The introduction video URL should be a Wistia embed URL in this format:

```
https://fast.wistia.net/embed/iframe/[VIDEO_ID]
```

**How to get your Wistia embed URL:**
1. Log into your Wistia account
2. Navigate to your video
3. Click "Embed & Share"
4. Copy the iframe src URL (it should start with `https://fast.wistia.net/embed/iframe/`)

### 4. Testing

After configuration:
1. Visit the masterclass page as a student
2. The introduction video should appear at the start of the course
3. Verify the video loads and plays correctly

## Database Schema

The `introduction_video_url` field is:
- **Type**: TEXT (nullable)
- **Table**: masterclass_certificate_config
- **Purpose**: Stores the Wistia embed URL for the course introduction video

## Code Changes

The following files were updated to support this feature:

- `supabase/migrations/20251025_add_introduction_video_to_masterclass.sql` - Database migration
- `src/lib/masterclass/admin-types.ts` - TypeScript type definitions
- `src/app/admin/masterclass/certificate/page.tsx` - Admin UI for configuration
- `src/lib/masterclass/admin-queries.ts` - Database query functions
- `src/app/api/admin/masterclass/certificate/route.ts` - API endpoint (auto-updated via types)

## Notes

- The introduction video URL is **optional** - if not set, no introduction video will be shown
- The field is stored in the certificate config table because it's a course-wide setting
- Only one introduction video can be configured per course (stored with the active certificate config)
