# Mailgun Email Sending Fix - "Failed to send email"

## 🚨 Current Issue

**Error:** "Failed to send email" when clicking "Send Invitation" button  
**Location:** `/admin/checkout-access` page  
**User:** Luis Moreno Garin (lmoreno1@srcs.org)  
**Cause:** Mailgun configuration issue

---

## ✅ Quick Diagnosis (After Next Deploy)

Once the new code deploys to Netlify (~2-3 minutes), test Mailgun:

### Step 1: Open Test Endpoint

Visit: **https://behaviorschool.com/api/admin/test-mailgun**

This will show you exactly what's wrong with your Mailgun setup.

### Expected Results:

**✅ If Working:**
```json
{
  "success": true,
  "config": {
    "hasApiKey": true,
    "hasDomain": true,
    "hasFromEmail": true,
    "domain": "mg....",
    "fromEmail": "behaviorschool.com"
  },
  "mailgunConnected": true,
  "domainInfo": {
    "name": "mg.behaviorschool.com",
    "state": "active",
    "type": "sandbox" or "custom"
  }
}
```
→ **Mailgun is configured correctly!** If you still can't send, continue to Step 2.

**❌ If API Key Missing/Invalid:**
```json
{
  "success": false,
  "config": {
    "hasApiKey": false,  // ← Problem here
    ...
  },
  "error": "Forbidden",
  "message": "Mailgun credentials are invalid or domain not found"
}
```
→ **Fix:** Add/update `MAILGUN_API_KEY` in Netlify (see below)

**❌ If Domain Missing:**
```json
{
  "success": false,
  "config": {
    ...
    "hasDomain": false,  // ← Problem here
  }
}
```
→ **Fix:** Add `MAILGUN_DOMAIN` in Netlify

---

## 🔧 Fix: Update Netlify Environment Variables

### Step 1: Get Your Mailgun Credentials

1. Go to **Mailgun Dashboard**: https://app.mailgun.com/
2. Click **Sending** → **Domain settings**
3. Select your domain (e.g., `mg.behaviorschool.com`)

### Step 2: Find Your API Key

1. In Mailgun, go to **Settings** → **API Keys**
2. Copy your **Private API key** (starts with `key-...`)

### Step 3: Find Your Domain

In **Domain settings**, you'll see your domain name (e.g., `mg.behaviorschool.com`)

### Step 4: Set in Netlify

1. Go to **Netlify Dashboard**: https://app.netlify.com/
2. Select your site → **Site settings** → **Environment variables**
3. Add/Update these variables:

```bash
MAILGUN_API_KEY=key-xxxxxxxxxxxxxxxxxxxxxxxxxx
MAILGUN_DOMAIN=mg.behaviorschool.com
MAILGUN_FROM_EMAIL=noreply@behaviorschool.com
```

4. **Important:** Click **"Redeploy site"** after adding variables!

---

## 📧 Alternative: Set Up Mailgun Domain (If Missing)

If you don't have a Mailgun domain configured:

### Option 1: Use Mailgun Sandbox (Quick - For Testing)

1. In Mailgun Dashboard → **Sending** → **Domains**
2. You should see a sandbox domain: `sandboxXXXXXX.mailgun.org`
3. Use this for testing:
   ```bash
   MAILGUN_DOMAIN=sandboxXXXXXXXXXXXXXXXXX.mailgun.org
   ```
4. **Note:** Sandbox only sends to authorized recipients. Add `lmoreno1@srcs.org` to authorized recipients.

### Option 2: Add Custom Domain (Production)

1. In Mailgun → **Sending** → **Domains** → **Add New Domain**
2. Enter: `mg.behaviorschool.com`
3. Follow DNS setup instructions:
   - Add TXT records for SPF and DKIM
   - Add MX records for receiving
   - Add CNAME for tracking
4. Wait for DNS propagation (~5-30 minutes)
5. Verify domain is "Active" in Mailgun

---

## 🧪 Test Email Sending (After Fix)

### Step 1: Wait for Deploy

After updating Netlify environment variables, wait ~2-3 minutes for deploy.

### Step 2: Test Configuration

Visit: **https://behaviorschool.com/api/admin/test-mailgun**

Should show `"success": true`

### Step 3: Send Test Email

1. Go to `/admin/checkout-access`
2. Find Luis Moreno Garin
3. Click **"Send Invitation"** button
4. You should see: ✅ "Invitation email sent successfully"

### Step 4: Check Email

- Check `lmoreno1@srcs.org` inbox
- Email should arrive within 1-2 minutes
- Subject: "🎉 Your Transformation Program Checkout Access is Ready!"

---

## 🐛 Troubleshooting

### Error: "Mailgun authentication failed"

**Cause:** `MAILGUN_API_KEY` is wrong or missing

**Fix:**
1. Go to Mailgun → **Settings** → **API Keys**
2. Copy **Private API key** (NOT public key!)
3. Update in Netlify
4. Redeploy

### Error: "Mailgun domain not found"

**Cause:** `MAILGUN_DOMAIN` doesn't exist in your Mailgun account

**Fix:**
1. Check Mailgun → **Sending** → **Domains**
2. Verify domain name exactly matches
3. If using sandbox, use full sandbox domain name
4. Update in Netlify
5. Redeploy

### Error: "Free account sending limit exceeded"

**Cause:** Mailgun free tier has a monthly limit (usually 5,000 emails/month)

**Fix:**
1. Check Mailgun → **Account** → **Billing**
2. See current usage
3. Either:
   - Wait for monthly reset, OR
   - Upgrade Mailgun plan, OR
   - Use a different email service

### Email Sent But Not Received

**Possible causes:**

1. **Spam Folder** - Check spam/junk
2. **Domain Not Verified** - Must verify domain in Mailgun
3. **SPF/DKIM Not Set** - Add DNS records
4. **Sandbox Mode** - Only sends to authorized recipients

**Fix:**
1. Verify domain is "Active" in Mailgun
2. Check DNS records are properly set
3. If sandbox, add recipient email to authorized list
4. Check Mailgun logs: **Sending** → **Logs**

---

## 📊 Check Mailgun Logs

To see if email was actually sent:

1. Go to Mailgun Dashboard
2. Click **Sending** → **Logs**
3. Look for recent activity
4. Check status:
   - ✅ **Delivered** - Email sent successfully
   - ⚠️ **Failed** - See error reason
   - 🔄 **Queued** - Still processing

---

## 🎯 Expected Flow (When Working)

```
Admin clicks "Send Invitation"
   ↓
API receives request with email, first_name, last_name
   ↓
Mailgun client initialized with API key ✅
   ↓
Email content generated (HTML + Text) ✅
   ↓
Message sent to Mailgun domain ✅
   ↓
Mailgun processes and delivers ✅
   ↓
Recipient receives email within 1-2 minutes ✅
   ↓
Success message shown to admin ✅
```

---

## 📝 Quick Reference

### Required Environment Variables (Netlify)

```bash
# Required for email sending
MAILGUN_API_KEY=key-xxxxxxxxxxxxxxxxxxxxxxxxxx
MAILGUN_DOMAIN=mg.behaviorschool.com  # or sandbox domain
MAILGUN_FROM_EMAIL=noreply@behaviorschool.com

# Already configured (for database, etc.)
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE=...
```

### Mailgun Dashboard URLs

- **Login**: https://app.mailgun.com/
- **API Keys**: https://app.mailgun.com/settings/api_security
- **Domains**: https://app.mailgun.com/sending/domains
- **Logs**: https://app.mailgun.com/sending/logs
- **Billing**: https://app.mailgun.com/settings/billing

---

## ✅ Success Checklist

Once everything is working:

- [ ] Test endpoint shows `"success": true`
- [ ] Can click "Send Invitation" without error
- [ ] Email arrives in recipient's inbox
- [ ] Email contains correct checkout link
- [ ] Email has professional formatting
- [ ] Links in email work correctly
- [ ] User can access checkout page

---

## 🆘 Still Not Working?

If you've tried everything and it's still failing:

### Gather Debug Info:

1. **Test endpoint response:**
   - Visit `/api/admin/test-mailgun`
   - Copy entire JSON response

2. **Browser console error:**
   - Open DevTools (F12)
   - Click "Send Invitation"
   - Copy error from Network tab

3. **Mailgun logs:**
   - Go to Mailgun → Sending → Logs
   - Screenshot recent activity

4. **Netlify function logs:**
   - Netlify Dashboard → Functions
   - Find `send-invitation` function
   - Copy recent logs

**Share these with me and I'll help debug!**

---

## 💡 Pro Tips

1. **Use sandbox for testing** - Free and immediate
2. **Set up custom domain for production** - Better deliverability
3. **Configure SPF/DKIM records** - Prevents spam flagging
4. **Monitor Mailgun logs** - Catch delivery issues early
5. **Keep API keys secret** - Never commit to git

---

**Next Step:** Wait for deploy, then test `/api/admin/test-mailgun` to see what's wrong! 🔍

