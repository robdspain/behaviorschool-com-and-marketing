# CE vs PD Event Separation - Implementation Guide

## Overview

This document describes the implementation of 2026 BACB Requirement #7: **Separate CE and PD events with registration restrictions**.

## Business Rules

### Event Types
- **CE (Continuing Education)**: For BCBAs and BCaBAs only
- **PD (Professional Development)**: For RBTs only

### Registration Restrictions
| Credential Type | Can Register For |
|----------------|------------------|
| BCBA           | CE events only   |
| BCaBA          | CE events only   |
| RBT            | PD events only   |
| Other/Pending  | Must verify first|

## Database Schema

### Migration File
Apply: `sql/add-participant-credential-type.sql`

### New Fields

#### `ace_users` table
- `credential_type` - enum: 'bcba', 'bcaba', 'rbt', 'other', 'pending'
- `credential_number` - text (BACB ID)
- `credential_verified` - boolean
- `credential_verified_at` - timestamp
- `credential_expires_at` - date

#### `ace_events` table (already exists from 2026 migration)
- `event_type` - enum: 'ce', 'pd'
- `event_subtype` - enum: 'standard', 'journal_club', 'podcast'

### Database Function
```sql
can_user_register_for_event_type(user_id, event_id) RETURNS BOOLEAN
```

## API Endpoints

### 1. Participant Management
**GET** `/api/admin/ace/participants`
- Fetches all participants with their credential info

**PATCH** `/api/admin/ace/participants`
- Updates credential type and verification status
- Body: `{ user_id, credential_type, credential_number, credential_verified }`

**POST** `/api/admin/ace/participants`
- Creates new participant with credential type
- Body: `{ first_name, last_name, email, credential_type, credential_number }`

### 2. Registration with Validation
**POST** `/api/admin/ace/registrations`
- Validates credential eligibility before registration
- Returns 403 if credential doesn't match event type
- Body: `{ event_id, user_id }`

**Response Errors:**
```json
{
  "error": "CE events are only available for BCBAs and BCaBAs",
  "requiresCredentialVerification": false
}
```

```json
{
  "error": "Please verify your credential before registering",
  "requiresCredentialVerification": true
}
```

## UI Components

### 1. Event Management (`/admin/ace/events`)
Features:
- Event type selector (CE vs PD) in create modal
- Visual badges showing event type in event list
- Helper text explaining eligibility

### 2. Participant Management (`/admin/ace/participants`)
Features:
- List all participants with credential status
- Edit modal for setting credential type
- Verification checkbox
- Search by name, email, or BACB ID
- Stats dashboard (total BCBAs, RBTs, pending)

### 3. Validation Logic (`src/lib/ace/registration-validation.ts`)
Functions:
- `validateRegistrationEligibility()` - Core validation logic
- `getCredentialTypeLabel()` - User-friendly labels
- `getEventTypeLabel()` - Event type descriptions
- `getEligibleEventTypes()` - Which events a credential can access

## User Workflow

### Admin Setup
1. Navigate to `/admin/ace/participants`
2. Find participant in list (or add new)
3. Click "Edit" button
4. Set credential type (BCBA, BCaBA, RBT, etc.)
5. Enter credential number (BACB ID)
6. Check "Credential is verified" after validation
7. Save changes

### Event Creation
1. Navigate to `/admin/ace/events`
2. Click "Create New Event"
3. Select "Event Type":
   - CE (for BCBAs, BCaBAs)
   - PD (for RBTs)
4. Fill in remaining details
5. Create event

### Registration Validation (Automatic)
1. User attempts to register for event
2. System checks:
   - Is credential set? (not 'pending' or 'other')
   - Is credential verified?
   - Does credential match event type?
3. If all checks pass → Registration created
4. If any check fails → Error message with reason

## Error Messages

| Scenario | Message |
|----------|---------|
| Pending credential | "Please verify your credential before registering for events." |
| BCBA trying for PD | "PD events are only available for RBTs. Please register for CE events instead." |
| RBT trying for CE | "CE events are only available for BCBAs and BCaBAs. This is a PD restriction per 2026 BACB requirements." |
| Unverified credential | "Your credential must be verified before registering for events. Please contact support." |
| Already registered | "You are already registered for this event" |

## Testing Checklist

- [ ] Create CE event (should say "for BCBAs, BCaBAs")
- [ ] Create PD event (should say "for RBTs only")
- [ ] Set participant credential to BCBA
- [ ] Verify BCBA can register for CE event
- [ ] Verify BCBA cannot register for PD event (403 error)
- [ ] Set participant credential to RBT
- [ ] Verify RBT can register for PD event
- [ ] Verify RBT cannot register for CE event (403 error)
- [ ] Verify unverified credential blocks registration
- [ ] Verify 'pending' credential shows verification message
- [ ] Check event list shows event type badge
- [ ] Check participant list shows credential badges
- [ ] Test search functionality in participant list
- [ ] Verify stats dashboard counts correctly

## Next Steps

After implementing CE vs PD separation, proceed to:
1. **Sprint 2**: Enforce 3-question-per-CEU requirement for asynchronous CE events
2. **Sprint 1**: Build coordinator certification tracking UI
3. **Sprint 4**: Compliance dashboard and audit reports

## Support

For questions or issues with this implementation, refer to:
- Main PRD: `docs/ace-ceu-platform-prd.md`
- Implementation Plan: `docs/ace-2026-implementation-plan.md`
- 2026 Requirements: `docs/ace-2026-requirements-summary.md`

