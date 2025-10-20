# Thinkific → Certifier Certificate Automation

**Complete automated certificate generation with BCBA certification numbers**

## How It Works

```
Student Completes Course (Thinkific)
         ↓
    Webhook fires (enrollment.completed)
         ↓
Netlify Function receives webhook
         ↓
Looks up BCBA cert # from signup form
         ↓
Inserts to Supabase table
         ↓
Certifier polls every 15 minutes
         ↓
Auto-generates certificate with:
  - Student Name
  - Completion Date
  - BCBA Certification Number ✅
  - Course Name
         ↓
Emails certificate to student
```

**Benefits:**
- ✅ Fully automated (no manual work)
- ✅ Includes BCBA certification number
- ✅ Native Thinkific webhooks (no Zapier)
- ✅ All certificates tracked in Supabase
- ✅ Professional, verifiable certificates

**Cost:**
- Thinkific Pro: $99/month (webhooks included)
- Certifier Free: $0 (250 certs/year)
- **Total: $99/month**

---

## Prerequisites

### 1. Thinkific Account
- **Plan:** Pro ($99/mo) or Advanced ($199/mo)
- **Why:** Webhooks only available on Pro+
- **Check:** Settings → Apps & Plugins → Webhooks

### 2. Certifier.io Account
- **Plan:** Free (250 certificates/year)
- **Signup:** https://certifier.io/create

### 3. Existing Infrastructure
- ✅ Netlify hosting
- ✅ Supabase database
- ✅ Signup form with BCBA cert # field

---

## Step 1: Update Signup Form

### 1.1 Add BCBA Certification Number Field

Your signup form needs to collect the BCBA certification number.

**Field requirements:**
- **Label:** "BCBA Certification Number"
- **Format:** 1-11-9398 (example)
- **Required:** Yes
- **Validation:** Optional (format: X-XX-XXXX)

**Example HTML:**
```html
<div class="form-field">
  <label for="bcba_cert_number">BCBA Certification Number</label>
  <input
    type="text"
    id="bcba_cert_number"
    name="bcba_cert_number"
    placeholder="1-11-9398"
    required
    pattern="\d{1,2}-\d{2}-\d{4}"
    title="Format: 1-11-9398"
  />
  <small>Format: X-XX-XXXX (e.g., 1-11-9398)</small>
</div>
```

### 1.2 Update Form Submission Handler

Ensure your form saves this field to Supabase `signup_submissions` table.

---

## Step 2: Run Database Migrations

### 2.1 Add BCBA Cert Number Column

Go to: https://supabase.com/dashboard/project/dugolglucuzolzvuqxmi/sql/new

**Run this SQL:**
```sql
-- From: supabase/migrations/20251019_add_bcba_cert_number.sql

-- Add BCBA cert number to signup_submissions table
ALTER TABLE public.signup_submissions
ADD COLUMN IF NOT EXISTS bcba_cert_number TEXT;

-- Add index for lookups
CREATE INDEX IF NOT EXISTS idx_signup_submissions_bcba_cert
  ON public.signup_submissions(bcba_cert_number);

-- Add BCBA cert number to certificates_issued table
ALTER TABLE public.certificates_issued
ADD COLUMN IF NOT EXISTS bcba_cert_number TEXT;

-- Add index for certificate lookups
CREATE INDEX IF NOT EXISTS idx_certificates_bcba_cert
  ON public.certificates_issued(bcba_cert_number);

-- Add helpful comments
COMMENT ON COLUMN public.signup_submissions.bcba_cert_number IS 'BCBA certification number (format: 1-11-9398)';
COMMENT ON COLUMN public.certificates_issued.bcba_cert_number IS 'BCBA certification number included on certificate';
```

### 2.2 Run Certificates Table Migration (if not done)

```sql
-- From: supabase/migrations/20251019_create_certificates_issued_table.sql
-- (Copy the full SQL from the migration file)
```

### 2.3 Verify Tables

```sql
-- Check signup_submissions has bcba_cert_number
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'signup_submissions';

-- Check certificates_issued has bcba_cert_number
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'certificates_issued';
```

---

## Step 3: Configure Netlify Environment Variables

Go to: **Netlify Dashboard → Site Settings → Environment Variables**

### Required Variables

| Variable | Value | Where to Get |
|----------|-------|--------------|
| `THINKIFIC_WEBHOOK_SECRET` | Your Thinkific API key | Thinkific → Settings → Code & Analytics → API |
| `SUPABASE_URL` | Already configured ✅ | Should exist |
| `SUPABASE_SERVICE_ROLE_KEY` | Already configured ✅ | Should exist |

### Optional Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `LOG_LEVEL` | `info` | Logging: `error\|warn\|info\|debug` |

### How to Get Thinkific API Key

1. Log into Thinkific as admin
2. Go to **Settings → Code & Analytics**
3. Scroll to **API**
4. Copy your **API key**
5. Add to Netlify as `THINKIFIC_WEBHOOK_SECRET`

**Note:** This is used as both the API key AND webhook secret in Thinkific.

---

## Step 4: Deploy Netlify Function

### 4.1 Commit and Push

```bash
# Add new files
git add netlify/functions/thinkific-webhook.js
git add supabase/migrations/20251019_add_bcba_cert_number.sql
git add docs/THINKIFIC_CERTIFICATE_SETUP.md

# Commit
git commit -m "Add Thinkific certificate automation with BCBA cert #"

# Push
git push origin main
```

### 4.2 Verify Deployment

**Function URL:** `https://behaviorschool.com/.netlify/functions/thinkific-webhook`

Test health endpoint:
```bash
curl https://behaviorschool.com/.netlify/functions/thinkific-webhook

# Expected response:
{
  "ok": true,
  "message": "thinkific-webhook alive",
  "service": "Thinkific course completion → Certifier via Supabase"
}
```

---

## Step 5: Configure Thinkific Webhook

### 5.1 Access Webhooks in Thinkific

1. Log into Thinkific as admin
2. Go to **Settings → Apps & Plugins**
3. Find **Webhooks** section
4. Click **Add Webhook**

### 5.2 Create Webhook

**Configuration:**

| Field | Value |
|-------|-------|
| **Topic** | `enrollment.completed` |
| **Webhook URL** | `https://behaviorschool.com/.netlify/functions/thinkific-webhook` |
| **Description** | "Certificate automation via Certifier" |

**Important:**
- Select **ONLY** `enrollment.completed` event
- Do NOT select other events (user.created, etc.)
- The webhook will use your API key for HMAC signature

### 5.3 Save Webhook

Click **Create Webhook**

Thinkific will now send a POST request to your function whenever a student completes a course.

---

## Step 6: Set Up Certifier Automation

### 6.1 Get Supabase Credentials

You'll need:

1. **Supabase Project ID:** `dugolglucuzolzvuqxmi`
2. **Supabase Service Role Key:** From `.env.local` → `SUPABASE_SERVICE_ROLE`

### 6.2 Create Certificate Template in Certifier

1. Log into https://certifier.io
2. Go to **Templates → Create New Template**
3. Design your certificate with these fields:

```
Certificate Template Fields:
┌─────────────────────────────────────┐
│   [Behavior School Logo]            │
│                                     │
│   Certificate of Completion        │
│                                     │
│   This certifies that              │
│   {{recipient_name}}               │
│                                     │
│   BCBA Certification Number:        │
│   {{bcba_cert_number}}             │  ← Custom field
│                                     │
│   has successfully completed       │
│   {{course_name}}                  │
│                                     │
│   Date: {{issued_at}}              │
│                                     │
│   [Signature]                      │
│   Rob Spain, BCBA                  │
│   Founder, Behavior School         │
│                                     │
│   [QR Code - verification]         │
└─────────────────────────────────────┘
```

4. **Map fields to Supabase columns:**
   - `{{recipient_name}}` → `recipient_name`
   - `{{recipient_email}}` → `recipient_email`
   - `{{course_name}}` → `course_name`
   - `{{bcba_cert_number}}` → `bcba_cert_number` ✅
   - `{{issued_at}}` → `issued_at`

5. Save template and note the **Template ID**

### 6.3 Create Supabase Automation in Certifier

1. In Certifier, go to **Automations → + Create Automation**
2. Select **Supabase** template
3. **Configure Trigger:**
   - **Subdomain ID:** `dugolglucuzolzvuqxmi`
   - **Service Key:** Your `SUPABASE_SERVICE_ROLE` key
   - **Table:** `certificates_issued`
   - **Order By:** `id` (ascending)
   - **Watch for:** New rows

4. **Configure Action:**
   - **Template:** Select your certificate template
   - **Recipient Name:** Map to `recipient_name`
   - **Recipient Email:** Map to `recipient_email`
   - **Map Custom Fields:**
     - `course_name` → `course_name`
     - `bcba_cert_number` → `bcba_cert_number` ✅
     - `issued_at` → `issued_at`

5. **Name & Activate:**
   - Name: "BCBA Course Certificates"
   - Click **Activate Automation**

6. **Skip Existing Records:** Choose to skip any test records

---

## Step 7: Testing

### 7.1 Test Signup Form with BCBA Number

1. Fill out signup form
2. Enter BCBA cert #: `1-11-9398` (test format)
3. Submit form
4. Verify in Supabase:

```sql
SELECT email, bcba_cert_number
FROM signup_submissions
ORDER BY created_at DESC
LIMIT 5;
```

### 7.2 Test End-to-End Flow

**Option A: Complete Real Course**
1. Enroll test user in Thinkific course
2. Complete all lessons
3. Thinkific marks as complete
4. Wait up to 15 minutes
5. Check email for certificate

**Option B: Manual Test (Faster)**
1. Insert test row into Supabase:

```sql
INSERT INTO certificates_issued (
  recipient_email,
  recipient_name,
  course_name,
  bcba_cert_number
)
VALUES (
  'rob@behaviorschool.com',
  'Rob Spain',
  'BCBA Transformation Program',
  '1-11-9398'
);
```

2. Wait 15 minutes (Certifier polling interval)
3. Check email for certificate
4. Verify BCBA # appears on certificate ✅

### 7.3 Check Netlify Function Logs

1. Go to **Netlify → Functions → thinkific-webhook**
2. View logs for recent activity
3. Look for:
   - ✅ "Certificate request queued"
   - ✅ "bcba_cert: 1-11-9398"

### 7.4 Verify in Supabase

```sql
-- Check recent certificates
SELECT
  id,
  recipient_name,
  recipient_email,
  course_name,
  bcba_cert_number,
  certificate_url,
  created_at
FROM certificates_issued
ORDER BY created_at DESC
LIMIT 10;
```

---

## Step 8: Admin Dashboard

### 8.1 View Certificates in Admin Panel

Add to admin sitemap (`/src/app/admin/sitemap/page.tsx`):

```typescript
{
  title: 'Certificates',
  icon: <Award className="w-6 h-6" />,
  pages: [
    {
      name: 'Certificates Issued',
      path: '/admin/certificates',
      description: 'View all certificates issued via Thinkific/Certifier'
    }
  ]
}
```

### 8.2 Create Certificates Admin Page

Create `/src/app/admin/certificates/page.tsx`:

```typescript
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { Award, Download, ExternalLink } from 'lucide-react'

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = 'Certificates Issued | Behavior School Admin'
    fetchCertificates()
  }, [])

  const fetchCertificates = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('certificates_issued')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)

    setCertificates(data || [])
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading certificates...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b-2 border-slate-200">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                <Award className="w-8 h-8 text-emerald-600" />
                Certificates Issued
              </h1>
              <p className="text-base text-slate-600 mt-1">
                All certificates generated via Thinkific course completions
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    BCBA Cert #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Certificate
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {certificates.map((cert) => (
                  <tr key={cert.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                      {cert.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {new Date(cert.issued_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                      {cert.recipient_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {cert.recipient_email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-emerald-700 font-semibold">
                      {cert.bcba_cert_number || '—'}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {cert.course_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {cert.certificate_url ? (
                        <a
                          href={cert.certificate_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium"
                        >
                          <ExternalLink className="w-4 h-4" />
                          View
                        </a>
                      ) : (
                        <span className="text-slate-400 flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-slate-300 border-t-transparent rounded-full animate-spin"></div>
                          Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border-2 border-slate-200 rounded-lg p-4">
              <div className="text-sm text-slate-600">Total Certificates</div>
              <div className="text-2xl font-bold text-slate-900">{certificates.length}</div>
            </div>
            <div className="bg-white border-2 border-slate-200 rounded-lg p-4">
              <div className="text-sm text-slate-600">With BCBA Cert #</div>
              <div className="text-2xl font-bold text-emerald-600">
                {certificates.filter(c => c.bcba_cert_number).length}
              </div>
            </div>
            <div className="bg-white border-2 border-slate-200 rounded-lg p-4">
              <div className="text-sm text-slate-600">Pending</div>
              <div className="text-2xl font-bold text-amber-600">
                {certificates.filter(c => !c.certificate_url).length}
              </div>
            </div>
          </div>

          <div className="mt-4 text-sm text-slate-600">
            <p>💡 Certifier polls Supabase every 15 minutes for new certificate requests</p>
          </div>
        </div>
      </main>
    </div>
  )
}
```

---

## Troubleshooting

### Issue: Webhook not receiving events

**Check:**
1. Webhook is configured in Thinkific (Settings → Apps → Webhooks)
2. Topic is `enrollment.completed`
3. URL is correct: `https://behaviorschool.com/.netlify/functions/thinkific-webhook`
4. Test endpoint: `curl https://behaviorschool.com/.netlify/functions/thinkific-webhook`

### Issue: Signature verification fails

**Check:**
1. `THINKIFIC_WEBHOOK_SECRET` in Netlify matches your Thinkific API key
2. No extra whitespace in API key
3. Check Netlify function logs for signature details

### Issue: BCBA cert # not showing

**Check:**
1. Signup form has `bcba_cert_number` field
2. Field is saving to Supabase `signup_submissions` table
3. Email in Thinkific matches email in signup form
4. Run query: `SELECT bcba_cert_number FROM signup_submissions WHERE email = 'test@example.com'`

### Issue: Certificate not generated

**Check:**
1. Row exists in `certificates_issued` table
2. Certifier automation is active (green toggle)
3. Certifier has remaining credits
4. Wait full 15 minutes (Certifier polling interval)
5. Check Certifier automation logs

---

## Analytics Queries

```sql
-- Certificates issued per course
SELECT
  course_name,
  COUNT(*) as total,
  COUNT(certificate_url) as completed,
  COUNT(bcba_cert_number) as with_bcba
FROM certificates_issued
GROUP BY course_name
ORDER BY total DESC;

-- Certificates by month
SELECT
  DATE_TRUNC('month', issued_at) as month,
  COUNT(*) as total
FROM certificates_issued
GROUP BY month
ORDER BY month DESC;

-- Missing BCBA numbers
SELECT
  recipient_email,
  recipient_name,
  course_name,
  issued_at
FROM certificates_issued
WHERE bcba_cert_number IS NULL
ORDER BY issued_at DESC;
```

---

## Cost Summary

| Service | Plan | Monthly Cost |
|---------|------|--------------|
| **Thinkific** | Pro | $99 |
| **Certifier** | Free (250/yr) | $0 |
| **Netlify** | Existing | $0 |
| **Supabase** | Existing | $0 |
| **Total** | | **$99/month** |

**vs Mighty Networks + Zapier:** Saves $30-80/month

---

## Next Steps

1. ✅ Run Supabase migrations
2. ✅ Add BCBA field to signup form
3. ✅ Set Netlify environment variables
4. ✅ Deploy function
5. ✅ Configure Thinkific webhook
6. ✅ Set up Certifier automation
7. ✅ Test with sample course completion
8. ⏭️ Add admin certificates page
9. ⏭️ Monitor first real certificate

---

## Support

- **Thinkific Webhooks:** https://developers.thinkific.com/api/webhook-payloads/
- **Certifier Supabase:** https://support.certifier.io/en/articles/11992931
- **Netlify Functions:** https://docs.netlify.com/functions/overview/

**Questions?** Check Netlify function logs and Certifier automation logs first.
