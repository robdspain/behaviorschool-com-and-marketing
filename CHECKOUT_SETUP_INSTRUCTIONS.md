# Checkout Access Setup Instructions

## Step 1: Create Database Tables

You need to run the SQL in `supabase-checkout-setup.sql` to create the necessary tables in your Supabase database.

### Option A: Using Supabase Dashboard (Recommended)

1. Go to https://supabase.com/dashboard/project/dugolglucuzolzvuqxmi/editor
2. Open the SQL Editor
3. Copy the entire contents of `supabase-checkout-setup.sql`
4. Paste into the SQL Editor
5. Click "Run" to execute

### Option B: Using psql Command Line

```bash
psql "postgresql://postgres:[YOUR-PASSWORD]@db.dugolglucuzolzvuqxmi.supabase.co:5432/postgres" -f supabase-checkout-setup.sql
```

## Step 2: Verify Tables Were Created

Run this query in the SQL Editor to verify:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('checkout_settings', 'checkout_access', 'checkout_access_logs');
```

You should see all three tables listed.

## Step 3: Access the Admin Panel

1. Log into your admin panel at: https://behaviorschool.com/admin
2. Navigate to: https://behaviorschool.com/admin/checkout-access
3. You'll see the Checkout Access Management page

## Features

### 1. Master Password
- Set/change the master password that all users can use to access checkout
- Default password is "Transform2025"
- Change it from the admin panel

### 2. Approved Users
- Add specific users by email who can access checkout without the password
- Set expiration dates for time-limited access
- Activate/deactivate users as needed
- Add notes for each user

### 3. Access Logs
- View all checkout access attempts
- See successful and failed attempts
- Track IP addresses and timestamps
- Monitor both password and email-based access

## How Users Access Checkout

Users can access the checkout page at: `https://behaviorschool.com/transformation-program/checkout`

They can authenticate in two ways:

1. **Email (if pre-approved)**: Enter their email if you've added them to the approved users list
2. **Password**: Enter the master password you share with them after onboarding calls

All access attempts are logged in the admin panel.

## Workflow

1. User completes signup form at `/signup`
2. You review their application in the admin panel
3. You schedule an onboarding call with them
4. After the call, either:
   - Add their email to approved users list, OR
   - Share the master password with them
5. Send them the checkout link: `/transformation-program/checkout`
6. They authenticate and proceed to Stripe payment
7. Track all access attempts in the admin panel

## Security Notes

- All tables use Row Level Security (RLS)
- Only the service role can access these tables
- Passwords are stored in plain text in the database (consider hashing if needed)
- Access logs include IP addresses for security monitoring
