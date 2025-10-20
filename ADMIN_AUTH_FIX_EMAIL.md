# Admin Authentication & Email Sending Fix

## 🚨 Current Issues

### Issue 1: "Unauthorized" Error on Admin Pages
**Symptom:** Getting "Unauthorized" popup when accessing `/admin/submissions`  
**Cause:** Admin session is not persisting or not being read correctly  
**Impact:** Can't access admin pages or send emails

### Issue 2: Can't Send Transformation Program Payment Link
**Symptom:** Unable to send email to users from submissions page  
**Cause:** Authentication required to send emails (dependent on Issue 1)  
**Impact:** Can't communicate with potential clients

---

## 🔍 Quick Diagnosis

### Step 1: Check if You're Logged In

Open your browser console (F12) and run:
```javascript
// Check localStorage
console.log('Supabase auth:', localStorage.getItem('sb-' + window.location.host.replace(':', '-') + '-auth-token'))

// Check cookies
document.cookie.split(';').filter(c => c.includes('supabase')).forEach(c => console.log(c))
```

**If you see data:** Session exists but isn't being read correctly  
**If empty:** You need to log in again

---

## ✅ Solution 1: Re-Login to Admin

The quickest fix is to log in again:

### Step 1: Clear Auth State
1. Open browser console (F12)
2. Go to **Application** tab → **Storage**
3. **Clear Site Data** for behaviorschool.com

### Step 2: Login Again
1. Go to https://behaviorschool.com/admin/login
2. Log in with your admin Google account
3. You should be redirected to `/admin`

### Step 3: Test Submissions Page
1. Navigate to https://behaviorschool.com/admin/submissions
2. **If you still get "Unauthorized":**
   - Check browser console for errors
   - Check Network tab for failed requests
   - Share the error messages with me

---

## 🔧 Solution 2: Fix Session Persistence (Long-term)

If re-logging doesn't work, there might be a deeper issue with session management.

### Check Current Auth Configuration

Let me verify your auth setup is configured correctly:

1. **Supabase Project Settings**
   - Go to Supabase Dashboard → Authentication → URL Configuration
   - **Site URL:** `https://behaviorschool.com`
   - **Redirect URLs:** 
     - `https://behaviorschool.com/auth/callback`
     - `http://localhost:3000/auth/callback` (for local dev)

2. **Check Environment Variables in Netlify**
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
   - `SUPABASE_SERVICE_ROLE` - Your service role key (secret!)

3. **Supabase Auth Settings**
   - Go to Supabase Dashboard → Authentication → Providers
   - Ensure **Google** provider is enabled
   - OAuth client ID and secret are configured

---

## 📧 Solution 3: Email Sending Setup

Once authentication is fixed, here's how email sending works:

### Prerequisites

1. ✅ **Admin Authenticated** (Solution 1 or 2 above)
2. ✅ **Email Template Exists** in database
3. ✅ **Mailgun Configured** with valid credentials
4. ✅ **Email Logs Table** exists

### How to Send Payment Link

From `/admin/submissions`:

1. **Find the submission** you want to send to
2. Click the **"Send Payment Link"** button (📧 icon)
3. System will:
   - Fetch email template: `transformation_payment_link`
   - Replace variables: `${firstName}`, `${lastName}`, `${email}`, `${password}`
   - Send via Mailgun
   - Log the send in `email_logs` table
   - Show success/error message

### Check Email Template Exists

Run this query in Supabase SQL Editor:

```sql
SELECT * FROM email_templates 
WHERE name = 'transformation_payment_link';
```

**Expected:** Should return 1 row with the template  
**If empty:** Template needs to be created

### Create Missing Template (if needed)

If the template doesn't exist, run:

```sql
INSERT INTO email_templates (
  name,
  description,
  subject,
  body_html,
  body_text,
  variables,
  is_active
) VALUES (
  'transformation_payment_link',
  'Payment link email for Transformation Program participants',
  '🎉 Your Payment Link for the Transformation Program',
  '<html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #10b981;">Welcome to the Transformation Program!</h1>
      <p>Hi ${firstName},</p>
      <p>Thank you for your interest in the School-Based BCBA Transformation Program!</p>
      <p>Here''s your secure access to complete your enrollment:</p>
      <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Checkout URL:</strong> <a href="https://behaviorschool.com/transformation-program/checkout" style="color: #10b981;">https://behaviorschool.com/transformation-program/checkout</a></p>
        <p><strong>Password:</strong> <code style="background: #dcfce7; padding: 4px 8px; border-radius: 4px;">${password}</code></p>
      </div>
      <p><strong>Next Steps:</strong></p>
      <ol>
        <li>Click the checkout link above</li>
        <li>Enter the password: <strong>${password}</strong></li>
        <li>Complete your enrollment</li>
      </ol>
      <p>Questions? Reply to this email anytime!</p>
      <p>Best regards,<br>The Behavior School Team</p>
    </body>
  </html>',
  'Hi ${firstName},

Thank you for your interest in the School-Based BCBA Transformation Program!

Here''s your secure access to complete your enrollment:

Checkout URL: https://behaviorschool.com/transformation-program/checkout
Password: ${password}

Next Steps:
1. Visit the checkout link above
2. Enter the password
3. Complete your enrollment

Questions? Reply to this email anytime!

Best regards,
The Behavior School Team',
  '["firstName", "lastName", "email", "password"]'::jsonb,
  true
);
```

### Check Email Logs Table Exists

```sql
SELECT * FROM email_logs LIMIT 1;
```

**If error:** Table doesn't exist - needs migration  
**If empty:** Table exists, no emails sent yet  
**If data:** You can see past email attempts

### Create Email Logs Table (if needed)

```sql
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES email_templates(id),
  template_name TEXT,
  recipient_email TEXT NOT NULL,
  recipient_name TEXT,
  subject TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  error_message TEXT,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  sent_by UUID,
  mailgun_id TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_email_logs_recipient ON email_logs(recipient_email);
CREATE INDEX idx_email_logs_status ON email_logs(status);
CREATE INDEX idx_email_logs_sent_at ON email_logs(sent_at DESC);
```

---

## 🔑 Check Mailgun Configuration

### Verify Environment Variables

In **Netlify** → **Environment variables**, check:

```bash
MAILGUN_API_KEY=key-xxxxxxxxxxxxx
MAILGUN_DOMAIN=mg.behaviorschool.com
MAILGUN_FROM_EMAIL=noreply@behaviorschool.com
```

### Test Mailgun Credentials

```bash
curl -s --user 'api:YOUR-API-KEY' \
  https://api.mailgun.net/v3/YOUR-DOMAIN/messages \
  -F from='Behavior School <noreply@behaviorschool.com>' \
  -F to='your@email.com' \
  -F subject='Test Email' \
  -F text='Testing Mailgun configuration'
```

**Success:** Returns message ID  
**Failure:** Check API key and domain

---

## 🐛 Debug Email Sending

### Check API Logs

When you click "Send Payment Link", check browser console:

1. **Network Tab**
   - Look for `/api/admin/send-payment-link`
   - Check Status Code
   - Check Response

2. **Common Errors:**

**401 Unauthorized:**
```json
{"error": "Unauthorized"}
```
**Fix:** Re-login (Solution 1)

**500 Template Not Found:**
```json
{"error": "Email template not found. Please run the database migration."}
```
**Fix:** Create template (see above)

**500 Mailgun Error:**
```json
{"error": "Failed to send payment link email"}
```
**Fix:** Check Mailgun credentials and logs

### Check Server Logs

In Netlify **Functions** tab:

1. Find `send-payment-link` function
2. Check recent logs for errors
3. Look for Mailgun API errors

---

## 📋 Testing Checklist

Once everything is set up, test the full flow:

### 1. Authentication Test
- [ ] Can access `/admin` without redirect
- [ ] Can access `/admin/submissions` without "Unauthorized" error
- [ ] Session persists after page refresh
- [ ] Can see list of submissions

### 2. Email Template Test
- [ ] Template exists in database
- [ ] Template has correct variables
- [ ] Template preview looks good

### 3. Email Sending Test
- [ ] Click "Send Payment Link" button
- [ ] See success message
- [ ] Check email inbox (arrives within 1-2 minutes)
- [ ] Email contains correct password
- [ ] Links in email work
- [ ] Email is logged in `email_logs` table

### 4. Password Access Test
- [ ] Visit checkout URL
- [ ] Enter password from email
- [ ] Can access payment page
- [ ] Password is correct

---

## 🚀 Quick Recovery Steps

If you're blocked and need to send an email urgently:

### Manual Email Alternative

Use Mailgun dashboard:

1. Go to https://app.mailgun.com/
2. **Sending** → **Overview**
3. **Send a Test Message**
4. Fill in:
   - **To:** User's email
   - **Subject:** 🎉 Your Payment Link for the Transformation Program
   - **Text:**
   ```
   Hi [First Name],
   
   Thank you for your interest in the School-Based BCBA Transformation Program!
   
   Checkout URL: https://behaviorschool.com/transformation-program/checkout
   Password: SchoolBCBA2025
   
   Visit the link and use the password to complete your enrollment.
   
   Best regards,
   The Behavior School Team
   ```

---

## 🔄 Expected Flow (When Working)

```
User Submits Form
   ↓
Stored in signup_submissions table
   ↓
Admin sees in /admin/submissions
   ↓
Admin clicks "Send Payment Link"
   ↓
API checks authentication ✅
   ↓
Fetches email template from DB ✅
   ↓
Fetches checkout password ✅
   ↓
Replaces variables (firstName, password, etc.) ✅
   ↓
Sends via Mailgun ✅
   ↓
Logs in email_logs table ✅
   ↓
Shows success message ✅
   ↓
User receives email within 1-2 minutes ✅
   ↓
User clicks link and enters password ✅
   ↓
User completes payment ✅
```

---

## 🆘 Need More Help?

If you're still having issues, gather this info:

1. **Browser Console Errors** (screenshot)
2. **Network Tab** showing failed request
3. **Supabase SQL Editor** results:
   ```sql
   SELECT * FROM email_templates WHERE name = 'transformation_payment_link';
   SELECT * FROM email_logs ORDER BY created_at DESC LIMIT 5;
   ```
4. **Netlify Function Logs** for `send-payment-link`

Share these with me and I'll help debug!

---

## 📝 Summary

**Problem:** "Unauthorized" error preventing email sending  
**Root Cause:** Admin session not persisting correctly  
**Quick Fix:** Re-login at `/admin/login`  
**Long-term Fix:** Verify Supabase auth configuration  
**Email Prerequisites:** Template + Mailgun + Logs table  

**Once auth is fixed, email sending should work automatically!** 📧

