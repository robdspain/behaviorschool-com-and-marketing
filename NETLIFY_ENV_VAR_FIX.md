# Netlify Environment Variable Not Being Picked Up

## 🚨 Issue

You added `MAILGUN_FROM_EMAIL=support@robspain.com` in Netlify, but it's still showing as `missing` after deploy.

---

## ✅ Step-by-Step Fix

### Step 1: Verify Variable is Actually Saved in Netlify

1. Go to **Netlify Dashboard**: https://app.netlify.com/
2. Select your **behaviorschool.com** site
3. Go to **Site settings** → **Environment variables**
4. **Look for:** `MAILGUN_FROM_EMAIL`

**Check these things:**

✅ Variable name is **exactly**: `MAILGUN_FROM_EMAIL` (case-sensitive, no spaces)  
✅ Variable value is: `support@robspain.com` (no extra spaces, quotes, or characters)  
✅ Variable shows under **"Build & deploy"** context (not just "Deploy previews")  
✅ There's a green checkmark next to it

**If it's not there or looks wrong:** Re-add it correctly

---

### Step 2: Common Netlify Environment Variable Issues

#### Issue A: Wrong Context
Environment variables can be scoped to different contexts:
- ✅ **All** (default) - Works everywhere
- ⚠️ **Deploy previews only** - Only for PR previews
- ⚠️ **Production only** - Only for main branch

**Fix:** Make sure it's set for **"All"** or **"Production"**

#### Issue B: Typo in Variable Name
Common typos:
- ❌ `MAILGUN_FROM_EMAIL ` (extra space at end)
- ❌ `MAILGUN_FROM_MAIL` (EMAIL vs MAIL)
- ❌ `mailgun_from_email` (wrong case)

**Fix:** Delete and re-add with exact name: `MAILGUN_FROM_EMAIL`

#### Issue C: Special Characters in Value
- ❌ `"support@robspain.com"` (don't include quotes!)
- ❌ `support@robspain.com ` (extra space)
- ❌ `<support@robspain.com>` (angle brackets)

**Fix:** Just use: `support@robspain.com` (plain text, no quotes)

---

### Step 3: Force Clear Cache & Redeploy

Sometimes Netlify caches environment variables. Force a clean deploy:

1. In Netlify Dashboard → **Deploys** tab
2. Click **"Trigger deploy"**
3. Select **"Clear cache and deploy site"** (NOT just "Deploy site")
4. Wait for deploy to complete (~2-3 minutes)

---

### Step 4: Verify It's Working

After deploy completes, check:

**Test Endpoint:**
```
https://behaviorschool.com/api/admin/test-mailgun
```

Should show:
```json
{
  "config": {
    "hasFromEmail": true,  // ← Should be TRUE now
    "fromEmail": "robspain.com"  // ← Should show your domain
  }
}
```

**If still showing `false`:**
→ The environment variable is NOT being picked up by Netlify

---

### Step 5: Alternative - Try Setting via Netlify CLI

If the UI isn't working, use CLI:

```bash
# Install Netlify CLI (if not installed)
npm install -g netlify-cli

# Login
netlify login

# Link to your site
netlify link

# Set environment variable
netlify env:set MAILGUN_FROM_EMAIL "support@robspain.com"

# Trigger deploy
netlify deploy --prod
```

---

### Step 6: Check Build Logs

Sometimes build logs show environment variable issues:

1. Netlify Dashboard → **Deploys**
2. Click on the latest deploy
3. Scroll through **Deploy log**
4. Look for any warnings about environment variables

---

## 🔍 Debug: Check What Netlify Sees

### Option A: Add Debug Endpoint (Temporary)

Create a temporary test file to see what Netlify has:

```typescript
// src/app/api/debug-env/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    hasMailgunApiKey: !!process.env.MAILGUN_API_KEY,
    hasMailgunDomain: !!process.env.MAILGUN_DOMAIN,
    hasMailgunFromEmail: !!process.env.MAILGUN_FROM_EMAIL,
    mailgunDomain: process.env.MAILGUN_DOMAIN?.substring(0, 5) + '...',
    mailgunFromEmail: process.env.MAILGUN_FROM_EMAIL?.split('@')[1] || 'missing',
    // Show first 5 chars of each to verify without exposing full values
  });
}
```

Then visit: `https://behaviorschool.com/api/debug-env`

**Delete this file** after debugging (security risk to expose env vars)

---

## 🎯 Manual Override (If Nothing Works)

If Netlify just won't pick up the variable, you can hardcode it temporarily:

```typescript
// src/app/api/admin/checkout-access/send-invitation/route.ts
const fromEmail = process.env.MAILGUN_FROM_EMAIL || 'support@robspain.com';

const messageData = {
  from: `Behavior School <${fromEmail}>`,
  // ...
};
```

**⚠️ Warning:** This is a temporary workaround. Fix the environment variable properly.

---

## 📋 Checklist: Environment Variable Setup

- [ ] Variable name is exactly: `MAILGUN_FROM_EMAIL`
- [ ] Variable value is: `support@robspain.com` (no quotes/spaces)
- [ ] Variable is scoped to "All" or "Production"
- [ ] Variable shows in Site settings → Environment variables
- [ ] Triggered "Clear cache and deploy site" (not just "Deploy site")
- [ ] Waited for deploy to fully complete (~3 minutes)
- [ ] Checked test endpoint shows `hasFromEmail: true`
- [ ] No typos or extra characters

---

## 🆘 Still Not Working?

### Double-Check These URLs:

1. **Netlify Environment Variables Page:**
   - Should be: `https://app.netlify.com/sites/YOUR-SITE/settings/deploys#environment-variables`
   
2. **Look for these exact variables:**
   ```
   MAILGUN_API_KEY = key-xxxxxxxxxxxxxxxxxx
   MAILGUN_DOMAIN = email.robspain.com
   MAILGUN_FROM_EMAIL = support@robspain.com
   ```

3. **All three should have:**
   - ✅ Green checkmark
   - ✅ "All" or "Production" scope
   - ✅ No warning icons

---

## 🎯 Next Steps

Once the variable is properly set and deployed:

1. **Verify:** https://behaviorschool.com/api/admin/test-mailgun
2. **Try sending:** Go to `/admin/checkout-access` → Click "Send Invitation"
3. **Should see:** "Invitation email sent successfully" ✅
4. **Check inbox:** lmoreno1@srcs.org should receive email

---

## 💡 Pro Tip

After adding/changing environment variables in Netlify:
1. ✅ **Always** use "Clear cache and deploy"
2. ✅ **Wait** for deploy to complete 100%
3. ✅ **Verify** with test endpoint before trying to send

**Screenshot your Netlify environment variables page and share it with me if still having issues!**

