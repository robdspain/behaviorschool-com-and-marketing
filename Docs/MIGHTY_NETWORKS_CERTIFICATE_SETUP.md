# Mighty Networks → Certifier.io Certificate Automation

Complete setup guide for automatic certificate generation when students complete courses in Mighty Networks.

## Architecture

```
Mighty Networks Course Completion
         ↓
    Webhook (POST)
         ↓
Netlify Function: /netlify/functions/mighty-certifier
         ↓
    Certifier.io API (create certificate)
         ↓
    Supabase (log certificate)
         ↓
    Email to Student
```

**Benefits:**
- ✅ No Zapier costs ($0 vs $20-50/month)
- ✅ Full control over logic
- ✅ Certificate tracking in your database
- ✅ Easy to extend/customize
- ✅ Runs on existing Netlify infrastructure

---

## Prerequisites

### 1. Mighty Networks Account
- **Plan Required:** Business Plan ($129/month)
- **Why:** Only Business plan has webhook/API access
- **Check:** Admin → Integrations → Webhooks

### 2. Certifier.io Account
- **Plan:** Free (250 certificates/year)
- **Signup:** https://certifier.io/create
- **What you need:**
  - API Key
  - Template ID (after creating template)

### 3. Existing Infrastructure
- ✅ Netlify hosting (already set up)
- ✅ Supabase database (already configured)
- ✅ Custom domain (behaviorschool.com)

---

## Step 1: Set Up Certifier.io

### 1.1 Create Account
1. Go to https://certifier.io/create
2. Sign up with your email
3. Choose **Free Plan** (250 certificates/year)

### 1.2 Get API Key
1. Log into Certifier.io
2. Go to **Settings → API Keys**
3. Click **Generate New Key**
4. Copy and save securely (you'll need this for Netlify)

### 1.3 Create Certificate Template
1. Go to **Templates → Create New Template**
2. Design your certificate:
   ```
   Recommended Elements:
   - Behavior School logo (upload from /public/Logos/)
   - Title: "Certificate of Completion"
   - Dynamic fields:
     • {{recipient_name}}
     • {{course_name}}
     • {{completion_date}}
   - Signature: Rob Spain, BCBA
   - Brand colors: Emerald (#047857) + Gold (#D4AF37)
   - QR code for verification (optional)
   ```
3. Save template and copy the **Template ID**
   - Found in template URL or settings
   - Format: `tmpl_xxxxxxxxxx`

---

## Step 2: Configure Netlify Environment Variables

### 2.1 Required Variables

Go to **Netlify Dashboard → Site Settings → Environment Variables**

Add these variables:

| Variable | Value | Where to Get |
|----------|-------|--------------|
| `CERTIFIER_API_KEY` | Your API key | Certifier.io → Settings → API Keys |
| `CERTIFIER_TEMPLATE_ID` | Template ID | Certifier.io → Templates → Your Template |
| `MIGHTY_WEBHOOK_SECRET` | Random secure string | Generate with: `openssl rand -hex 32` |
| `SUPABASE_URL` | Already configured | ✅ Should exist |
| `SUPABASE_SERVICE_ROLE_KEY` | Already configured | ✅ Should exist |

### 2.2 Optional Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `CERTIFIER_BASE_URL` | `https://api.certifier.io` | Override API endpoint |
| `COURSE_NAME_FILTER` | (empty) | Only issue certs for specific course |
| `LOG_LEVEL` | `info` | Logging verbosity: `error\|warn\|info\|debug` |

### 2.3 Generate Webhook Secret

```bash
# On Mac/Linux terminal:
openssl rand -hex 32

# Example output:
# a7f3e9c2b8d4f6e1a3c5b7d9f2e4a6c8b0d2f4e6a8c0b2d4f6e8a0c2b4d6f8e0
```

Save this value - you'll use it in both Netlify and Mighty Networks.

---

## Step 3: Deploy to Netlify

### 3.1 Run Database Migration

```bash
# From project root:
supabase db push

# Or if using remote database:
psql "postgresql://postgres:[password]@[host]/postgres" -f supabase/migrations/20251019_create_certificates_issued_table.sql
```

### 3.2 Deploy Function

```bash
# Commit and push
git add netlify/functions/mighty-certifier.js
git add supabase/migrations/20251019_create_certificates_issued_table.sql
git commit -m "Add Mighty Networks certificate automation"
git push origin main
```

Netlify will automatically deploy the function.

### 3.3 Verify Function Deployment

**Function URL:** `https://behaviorschool.com/.netlify/functions/mighty-certifier`

Test health endpoint:
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
3. Look for **Webhooks** or **API** section
   - If not visible, verify you're on Business Plan

### 4.2 Create Webhook

**Settings:**
- **Webhook URL:** `https://behaviorschool.com/.netlify/functions/mighty-certifier`
- **Event Type:** `Course Progress Update` or `Course Completed`
- **Secret:** Use the value you generated with `openssl rand -hex 32`
- **Method:** POST
- **Content-Type:** application/json

### 4.3 Webhook Payload Example

Mighty Networks will send this when a course is completed:

```json
{
  "event": "course.completed",
  "data": {
    "status": "completed",
    "course": {
      "name": "BCBA Transformation Program"
    },
    "member": {
      "name": "John Doe",
      "email": "john@example.com"
    },
    "completed_at": "2025-10-19T15:30:00Z"
  }
}
```

---

## Step 5: Testing

### 5.1 Test with Sample Payload

Create a test file `test-webhook.json`:

```json
{
  "event": "course.completed",
  "data": {
    "status": "completed",
    "course": {
      "name": "BCBA Transformation Program"
    },
    "member": {
      "name": "Test Student",
      "email": "rob@behaviorschool.com"
    },
    "completed_at": "2025-10-19T15:30:00Z"
  }
}
```

Generate signature:

```bash
# Using Node.js
node -e "
const crypto = require('crypto');
const secret = 'YOUR_MIGHTY_WEBHOOK_SECRET';
const payload = require('./test-webhook.json');
const signature = crypto.createHmac('sha256', secret).update(JSON.stringify(payload)).digest('hex');
console.log(signature);
"
```

Send test request:

```bash
curl -X POST https://behaviorschool.com/.netlify/functions/mighty-certifier \
  -H "Content-Type: application/json" \
  -H "X-Mighty-Signature: YOUR_GENERATED_SIGNATURE" \
  -d @test-webhook.json
```

### 5.2 Check Netlify Logs

1. Go to **Netlify Dashboard → Functions → mighty-certifier**
2. View real-time logs
3. Look for:
   - ✅ "Certificate created"
   - ✅ "Certificate logged to Supabase successfully"

### 5.3 Verify in Supabase

```sql
-- Check certificates table
SELECT * FROM certificates_issued
ORDER BY created_at DESC
LIMIT 10;
```

### 5.4 Test in Production

1. Enroll yourself in a test course in Mighty Networks
2. Complete all lessons
3. Mark course as complete
4. Check your email for certificate
5. Verify entry in Supabase

---

## Step 6: Admin Dashboard (Optional)

### 6.1 View Certificates in Admin Panel

Add to `/src/app/admin/certificates/page.tsx`:

```typescript
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState([])

  useEffect(() => {
    const fetchCertificates = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('certificates_issued')
        .select('*')
        .order('issued_at', { ascending: false })
        .limit(100)

      setCertificates(data || [])
    }

    fetchCertificates()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Certificates Issued</h1>
      <table className="w-full">
        <thead>
          <tr>
            <th>Date</th>
            <th>Student</th>
            <th>Email</th>
            <th>Course</th>
            <th>Certificate</th>
          </tr>
        </thead>
        <tbody>
          {certificates.map((cert) => (
            <tr key={cert.id}>
              <td>{new Date(cert.issued_at).toLocaleDateString()}</td>
              <td>{cert.recipient_name}</td>
              <td>{cert.recipient_email}</td>
              <td>{cert.course_name}</td>
              <td>
                <a href={cert.certificate_url} target="_blank" rel="noopener noreferrer">
                  View
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

---

## Troubleshooting

### Issue: Webhook returns 401 (Invalid signature)

**Cause:** Signature mismatch between Mighty Networks and your function.

**Solutions:**
1. Verify `MIGHTY_WEBHOOK_SECRET` matches exactly in both places
2. Check Mighty Networks sends header as `X-Mighty-Signature`
3. Ensure no extra whitespace in secret
4. Test signature generation manually

### Issue: Certificate not created

**Check:**
1. Netlify function logs: `Functions → mighty-certifier → Logs`
2. Certifier API response in logs
3. Verify `CERTIFIER_API_KEY` and `CERTIFIER_TEMPLATE_ID` are correct
4. Check Certifier.io dashboard for failed attempts

### Issue: Supabase logging fails

**Check:**
1. Migration ran successfully: `SELECT * FROM certificates_issued LIMIT 1;`
2. `SUPABASE_SERVICE_ROLE_KEY` is set (not anon key)
3. RLS policies allow service role access

### Issue: No webhook received

**Check:**
1. Mighty Networks webhook configuration
2. Function deployed: `curl https://behaviorschool.com/.netlify/functions/mighty-certifier`
3. Netlify function logs show incoming requests
4. Course completion actually triggered in Mighty Networks

---

## Cost Breakdown

| Service | Plan | Monthly Cost |
|---------|------|--------------|
| **Mighty Networks** | Business | $129 |
| **Certifier.io** | Free (250/yr) | $0 |
| **Netlify** | Existing | $0 |
| **Supabase** | Existing | $0 |
| **Zapier** | ❌ Not needed | ~~$20-50~~ |
| **Total** | | **$129/month** |

**Savings vs Zapier:** $20-50/month = $240-600/year

---

## Scaling

### If you exceed 250 certificates/year:

| Students/Year | Certifier Plan | Additional Cost |
|---------------|----------------|-----------------|
| 0-250 | Free | $0/mo |
| 251-500 | Standard | $39/mo |
| 501-1000 | Pro | $79/mo |
| 1000+ | Enterprise | Contact sales |

### Function limits (Netlify):

- **Free tier:** 125,000 function invocations/month
- **Each certificate:** 1 invocation
- **Headroom:** Plenty for 125,000 certificates/month

---

## Monitoring

### Netlify Function Analytics
- Dashboard → Functions → mighty-certifier
- Monitor success rate, errors, execution time

### Supabase Query
```sql
-- Certificates issued per course
SELECT
  course_name,
  COUNT(*) as total_issued,
  MAX(issued_at) as last_issued
FROM certificates_issued
GROUP BY course_name
ORDER BY total_issued DESC;

-- Certificates issued per month
SELECT
  DATE_TRUNC('month', issued_at) as month,
  COUNT(*) as certificates_issued
FROM certificates_issued
GROUP BY month
ORDER BY month DESC;
```

---

## Next Steps

1. ✅ Run migration: `supabase db push`
2. ✅ Set Netlify environment variables
3. ✅ Create Certifier template
4. ✅ Deploy to Netlify
5. ✅ Configure Mighty Networks webhook
6. ✅ Test with sample payload
7. ✅ Test with real course completion
8. ⏭️ Add admin dashboard page
9. ⏭️ Set up monitoring/alerts

---

## Support

**Questions?**
- Check Netlify function logs first
- Review Certifier.io API docs: https://docs.certifier.io
- Test webhook payload structure
- Verify environment variables are set correctly

**Common Commands:**
```bash
# View function logs
netlify functions:log mighty-certifier

# Test locally
netlify dev

# Deploy
git push origin main
```
