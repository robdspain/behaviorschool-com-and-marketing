# Mighty Networks → Supabase → Certifier Certificate Automation

**Native Certifier Integration - No Zapier Required**

## How It Works

```
Student Completes Course (Mighty Networks)
         ↓
    Webhook triggers
         ↓
Netlify Function receives webhook
         ↓
Inserts row to Supabase table
         ↓
Certifier polls Supabase every 15 minutes
         ↓
Auto-generates & emails certificate
         ↓
Updates Supabase with certificate ID & URL
```

**Benefits:**
- ✅ Native Certifier integration (official support)
- ✅ No Zapier costs ($0 vs $20-50/month)
- ✅ Minimal code to maintain
- ✅ Visual setup in Certifier dashboard
- ✅ Automatic retry on failure
- ✅ All certificates tracked in your database

**Trade-off:**
- ⏱️ 15-minute processing delay (Certifier polls every 15 min)
- If you need instant certificates, use the previous Netlify → Certifier API approach

---

## Prerequisites

### 1. Mighty Networks
- **Plan:** Business ($129/month) for webhook access
- **Access:** Admin → Integrations → Webhooks

### 2. Certifier.io
- **Plan:** Free (250 certificates/year) or paid
- **Signup:** https://certifier.io/create
- **Features needed:** Supabase automation

### 3. Existing Infrastructure
- ✅ Netlify (already set up)
- ✅ Supabase (already configured)
- ✅ Domain (behaviorschool.com)

---

## Step 1: Run Supabase Migration

### 1.1 Copy the Updated SQL

The migration has been updated for Certifier compatibility:
- Changed `id` from UUID to BIGSERIAL (required by Certifier)
- Added proper indexes
- Kept all tracking fields

### 1.2 Run in Supabase Dashboard

1. Go to: https://supabase.com/dashboard/project/dugolglucuzolzvuqxmi/sql/new
2. Copy the SQL from: `supabase/migrations/20251019_create_certificates_issued_table.sql`
3. Paste and click **Run**

### 1.3 Verify Table Created

Run this query to verify:

```sql
SELECT * FROM certificates_issued LIMIT 1;
```

Should return empty results with no errors.

### 1.4 Add Sample Row (Required by Certifier)

Certifier requires at least one row in the table initially:

```sql
INSERT INTO certificates_issued (recipient_email, recipient_name, course_name)
VALUES ('test@example.com', 'Test User', 'Sample Course');
```

---

## Step 2: Configure Netlify Environment Variables

Go to: **Netlify Dashboard → Site Settings → Environment Variables**

### Required Variables

| Variable | Value | Where to Get |
|----------|-------|--------------|
| `MIGHTY_WEBHOOK_SECRET` | Generate with `openssl rand -hex 32` | Your terminal |
| `SUPABASE_URL` | Already configured ✅ | Should exist |
| `SUPABASE_SERVICE_ROLE_KEY` | Already configured ✅ | Should exist |

### Optional Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `COURSE_NAME_FILTER` | (empty) | Only process specific course (e.g., "Transformation") |
| `LOG_LEVEL` | `info` | Logging: `error\|warn\|info\|debug` |

### Generate Webhook Secret

```bash
openssl rand -hex 32
# Example output: a7f3e9c2b8d4f6e1a3c5b7d9f2e4a6c8b0d2f4e6a8c0b2d4f6e8a0c2b4d6f8e0
```

Save this - you'll use it in both Netlify and Mighty Networks.

---

## Step 3: Deploy Updated Function

```bash
# Commit changes
git add netlify/functions/mighty-certifier.js
git add supabase/migrations/20251019_create_certificates_issued_table.sql
git add docs/MIGHTY_NETWORKS_CERTIFIER_SETUP.md

git commit -m "Add Mighty Networks → Certifier via Supabase integration"
git push origin main
```

### Verify Deployment

Test the function health endpoint:

```bash
curl https://behaviorschool.com/.netlify/functions/mighty-certifier

# Expected response:
{"ok":true,"message":"mighty-certifier alive"}
```

---

## Step 4: Configure Mighty Networks Webhook

### 4.1 Access Webhooks

1. Log into Mighty Networks as admin
2. Go to **Admin → Integrations**
3. Find **Webhooks** or **API** section
   - If not visible, verify you're on Business Plan ($129/mo)

### 4.2 Create Webhook

**Configuration:**

| Field | Value |
|-------|-------|
| **Webhook URL** | `https://behaviorschool.com/.netlify/functions/mighty-certifier` |
| **Event Type** | `Course Progress Update` or `Course Completed` |
| **Secret** | Your generated webhook secret (from Step 2) |
| **Method** | POST |
| **Content-Type** | application/json |

### 4.3 Save Webhook

Mighty Networks will now send a POST request to your function whenever a student completes a course.

---

## Step 5: Set Up Certifier Automation

### 5.1 Get Supabase Credentials

You'll need:

1. **Supabase Project ID (subdomain)**
   - Go to: https://supabase.com/dashboard/project/dugolglucuzolzvuqxmi/settings/api
   - Copy the subdomain: `dugolglucuzolzvuqxmi`

2. **Supabase Service Role Key**
   - Same page, copy the `service_role` secret key
   - Already in your `.env.local` as `SUPABASE_SERVICE_ROLE`

### 5.2 Create Certificate Template in Certifier

1. Log into https://certifier.io
2. Go to **Templates → Create New Template**
3. Design your certificate:

```
Recommended Design:
┌─────────────────────────────────────┐
│   [Behavior School Logo - Gold]     │
│                                     │
│     Certificate of Completion      │
│                                     │
│   This certifies that              │
│   {{recipient_name}}               │
│                                     │
│   has successfully completed       │
│   {{course_name}}                  │
│                                     │
│   Completion Date: {{issued_at}}   │
│                                     │
│   [Signature]                      │
│   Rob Spain, BCBA                  │
│   Founder, Behavior School         │
│                                     │
│   [QR Code for verification]       │
└─────────────────────────────────────┘

Colors:
- Primary: Emerald-700 (#047857)
- Accent: Gold (#D4AF37)
- Background: Cream/Off-white
- Text: Slate-900
```

4. **Map dynamic fields:**
   - `{{recipient_name}}` → column: `recipient_name`
   - `{{recipient_email}}` → column: `recipient_email`
   - `{{course_name}}` → column: `course_name`
   - `{{issued_at}}` → column: `issued_at` (optional)

5. Save template

### 5.3 Create Supabase Automation in Certifier

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
   - **Recipient Name:** Map to `recipient_name` column
   - **Recipient Email:** Map to `recipient_email` column
   - **Course Name:** Map to `course_name` column (optional field)

5. **Name & Activate:**
   - Name: "BCBA Course Certificates"
   - Click **Activate Automation**

6. **Important:** Certifier will ask if you want to process existing records
   - **Choose:** Skip existing records (or it will email the test row)

### 5.4 How It Works

- Certifier polls your Supabase table every **15 minutes**
- When it finds new rows (by `id`), it:
  1. Generates certificate from template
  2. Sends email to `recipient_email`
  3. Updates the row with `certificate_id` and `certificate_url`

---

## Step 6: Testing

### 6.1 Test End-to-End Flow

**Option A: Enroll in Mighty Networks Course**
1. Enroll yourself in a course
2. Complete all lessons
3. Mark as complete
4. Wait up to 15 minutes
5. Check your email for certificate

**Option B: Manual Supabase Insert**
1. Go to Supabase Table Editor
2. Insert a row:
   ```sql
   INSERT INTO certificates_issued (recipient_email, recipient_name, course_name)
   VALUES ('rob@behaviorschool.com', 'Rob Spain', 'BCBA Transformation Program');
   ```
3. Wait 15 minutes
4. Check email and Supabase row for updates

### 6.2 Verify in Supabase

After certificate is issued:

```sql
SELECT
  id,
  recipient_name,
  recipient_email,
  course_name,
  certificate_id,    -- Should be populated by Certifier
  certificate_url,   -- Should be populated by Certifier
  created_at
FROM certificates_issued
ORDER BY id DESC
LIMIT 10;
```

### 6.3 Check Certifier Dashboard

1. Log into Certifier.io
2. Go to **Credentials → Issued**
3. Verify your certificate appears

### 6.4 Troubleshooting

**Issue: No certificate after 15 minutes**

Check:
1. Certifier automation is **Active** (green toggle)
2. Supabase row exists with valid email/name
3. Certifier has remaining credits (check dashboard)
4. Check Certifier automation logs for errors

**Issue: Netlify function fails**

Check:
1. Netlify function logs: `Functions → mighty-certifier → Logs`
2. Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set
3. Test health endpoint: `curl https://behaviorschool.com/.netlify/functions/mighty-certifier`

**Issue: Mighty Networks webhook not firing**

Check:
1. Webhook is configured and enabled in Mighty Networks
2. URL is correct: `https://behaviorschool.com/.netlify/functions/mighty-certifier`
3. Secret matches between Mighty Networks and Netlify env vars
4. Course completion actually triggered (check Mighty Networks dashboard)

---

## Step 7: Monitor & Maintain

### View Certificates in Admin Dashboard

Create `/src/app/admin/certificates/page.tsx`:

```typescript
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCertificates = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('certificates_issued')
        .select('*')
        .order('id', { ascending: false })
        .limit(100)

      setCertificates(data || [])
      setLoading(false)
    }

    fetchCertificates()
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Certificates Issued</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Course</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Certificate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {certificates.map((cert) => (
              <tr key={cert.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-sm text-slate-900">{cert.id}</td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {new Date(cert.issued_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-slate-900">
                  {cert.recipient_name}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{cert.recipient_email}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{cert.course_name}</td>
                <td className="px-6 py-4 text-sm">
                  {cert.certificate_url ? (
                    <a
                      href={cert.certificate_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      View Certificate
                    </a>
                  ) : (
                    <span className="text-slate-400">Pending...</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-sm text-slate-600">
        <p>Total certificates: {certificates.length}</p>
        <p>Certifier polls every 15 minutes for new requests</p>
      </div>
    </div>
  )
}
```

Add to sitemap (`/src/app/admin/sitemap/page.tsx`):

```typescript
{
  name: 'Certificates',
  path: '/admin/certificates',
  description: 'View all certificates issued via Certifier.io'
}
```

### Analytics Queries

```sql
-- Certificates issued per course
SELECT
  course_name,
  COUNT(*) as total_issued,
  MAX(issued_at) as last_issued,
  MIN(issued_at) as first_issued
FROM certificates_issued
WHERE certificate_url IS NOT NULL  -- Only count processed certificates
GROUP BY course_name
ORDER BY total_issued DESC;

-- Certificates by month
SELECT
  DATE_TRUNC('month', issued_at) as month,
  COUNT(*) as certificates_issued
FROM certificates_issued
WHERE certificate_url IS NOT NULL
GROUP BY month
ORDER BY month DESC;

-- Pending certificates (not yet processed by Certifier)
SELECT
  id,
  recipient_name,
  recipient_email,
  course_name,
  created_at,
  NOW() - created_at as age
FROM certificates_issued
WHERE certificate_url IS NULL
ORDER BY created_at DESC;
```

---

## Cost Breakdown

| Service | Plan | Monthly Cost |
|---------|------|--------------|
| **Mighty Networks** | Business | $129 |
| **Certifier.io** | Free | $0 (250 certs/year) |
| **Netlify** | Existing | $0 |
| **Supabase** | Existing | $0 |
| **Total** | | **$129/month** |

### Scaling

| Students/Year | Certifier Plan | Additional Cost |
|---------------|----------------|-----------------|
| 0-250 | Free | $0/mo |
| 251-500 | Standard | $39/mo |
| 501-1000 | Pro | $79/mo |
| 1000+ | Enterprise | Contact |

**Savings vs Zapier:** $240-600/year 💰

---

## Important Notes

### Certifier Requirements

❗ **Do not:**
- Rename the Supabase table after Certifier is configured
- Reorder columns
- Change column names that Certifier is watching
- Delete the `id` column or change its type

✅ **You can:**
- Add new columns
- Add indexes
- Query the table normally
- Manually insert rows for testing

### Processing Time

- **Webhook → Supabase:** Instant (< 1 second)
- **Certifier polling:** Every 15 minutes
- **Certificate generation:** 1-2 minutes
- **Total time:** 15-20 minutes maximum

If you need instant certificates, use the direct Certifier API approach instead.

---

## Next Steps

1. ✅ Run Supabase migration
2. ✅ Set Netlify environment variables
3. ✅ Deploy updated function
4. ✅ Configure Mighty Networks webhook
5. ✅ Create Certifier template
6. ✅ Set up Certifier automation
7. ✅ Test with sample completion
8. ⏭️ Add admin dashboard page
9. ⏭️ Monitor first real certificate

---

## Support Resources

- **Certifier Supabase Guide:** https://support.certifier.io/en/articles/11992931
- **Mighty Networks Webhooks:** Admin → Integrations
- **Supabase Dashboard:** https://supabase.com/dashboard/project/dugolglucuzolzvuqxmi
- **Netlify Functions:** https://app.netlify.com

**Questions?** Check Netlify function logs and Certifier automation logs first.
