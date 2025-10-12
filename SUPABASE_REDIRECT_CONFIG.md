# Supabase Redirect URL Configuration - CRITICAL

## The 404 Error Explained

When you click "Continue with Google", here's what happens:

1. Your browser redirects to Google OAuth
2. You authenticate with Google
3. Google redirects to: `https://dugolglucuzolzvuqxmi.supabase.co/auth/v1/callback?code=xxx`
4. Supabase processes the OAuth code
5. **Supabase tries to redirect to: `https://behaviorschool.com/auth/callback?next=/admin`**
6. ❌ **404 ERROR** - Because this URL is not in Supabase's allowed redirect URLs list

## Fix: Configure Supabase Redirect URLs

### Step 1: Go to Supabase Dashboard
https://app.supabase.com/project/dugolglucuzolzvuqxmi/auth/url-configuration

### Step 2: Set Site URL
```
https://behaviorschool.com
```

### Step 3: Add ALL These Redirect URLs

**Click "Add URL" for each one:**

```
https://behaviorschool.com/auth/callback
https://behaviorschool.com/auth/callback?next=/admin
https://behaviorschool.com/admin
https://behaviorschool.com/admin/login
http://localhost:3000/auth/callback
http://localhost:3000/auth/callback?next=/admin
http://localhost:3000/admin
```

**Why each URL is needed:**

| URL | Purpose |
|-----|---------|
| `/auth/callback` | Main OAuth callback endpoint |
| `/auth/callback?next=/admin` | Callback with redirect parameter |
| `/admin` | Direct admin access after auth |
| `/admin/login` | Login page (for errors) |
| `localhost` URLs | For local development |

### Step 4: Verify Google OAuth

Go to: https://console.cloud.google.com/apis/credentials

Find your OAuth 2.0 Client ID and make sure it has:

```
Authorized redirect URIs:
https://dugolglucuzolzvuqxmi.supabase.co/auth/v1/callback
```

### Step 5: Save and Test

1. Save changes in Supabase
2. Wait 1-2 minutes for changes to propagate
3. Clear browser cache/cookies
4. Try logging in again

## Testing the Fix

### Test 1: Check Supabase Config
```bash
# In browser console on /admin/login:
console.log(window.location.origin + '/auth/callback?next=/admin')
# Should output: https://behaviorschool.com/auth/callback?next=/admin
```

### Test 2: Try OAuth Flow
1. Visit: https://behaviorschool.com/admin/login
2. Click "Continue with Google"
3. Should redirect to Google
4. After signing in, should return to `/admin`

### Test 3: Check for Errors
Open browser DevTools → Network tab → Click login button

**Look for:**
- Request to `https://accounts.google.com/...` ✅ Should succeed
- Request to `dugolglucuzolzvuqxmi.supabase.co/auth/v1/callback` ✅ Should succeed
- Request to `behaviorschool.com/auth/callback` ✅ Should succeed (not 404)

## Common Issues

### Issue 1: Still getting 404 after configuration
**Cause:** Supabase changes not yet propagated  
**Fix:** Wait 2-3 minutes, clear browser cache, try again

### Issue 2: "Redirect URL not whitelisted"
**Cause:** Exact URL format not in allowed list  
**Fix:** Make sure you added the EXACT URLs including query parameters

### Issue 3: Works on localhost but not production
**Cause:** Production URL not in allowed list  
**Fix:** Add `https://behaviorschool.com/auth/callback` to Supabase

### Issue 4: "Invalid OAuth state"
**Cause:** Cookie/session mismatch  
**Fix:** Clear all cookies for both behaviorschool.com and supabase.co

## Verification Checklist

After configuring Supabase, verify:

- [ ] Site URL is `https://behaviorschool.com`
- [ ] At least 7 redirect URLs are added
- [ ] `/auth/callback` URLs include query parameters
- [ ] Google OAuth has Supabase callback URL
- [ ] Saved changes in Supabase dashboard
- [ ] Waited 2 minutes for propagation
- [ ] Cleared browser cache/cookies
- [ ] Tested in incognito/private window

## Screenshot Guide

### Where to Find Settings in Supabase:

1. **Project Dashboard** → Select `dugolglucuzolzvuqxmi`
2. **Authentication** (left sidebar)
3. **URL Configuration**
4. **Site URL** field at top
5. **Redirect URLs** section below
6. Click **"Add URL"** button for each URL
7. Click **"Save"** at bottom

## Current Status

- ✅ Code is correct and deployed
- ✅ Callback route exists (`/auth/callback`)
- ✅ Login page working
- ❌ Supabase redirect URLs not configured
- ❌ Getting 404 on OAuth callback

## After Configuration

Once you've added the redirect URLs:

1. Login flow should work completely
2. No more 404 errors
3. Successful redirect to `/admin` after Google login
4. Admin dashboard accessible

## Need Help?

If you're still having issues after configuration:

1. Check browser DevTools → Console for errors
2. Check Network tab to see exact redirect URLs
3. Verify Supabase configuration was saved
4. Try in incognito mode (to avoid cache issues)

---

**Project ID:** dugolglucuzolzvuqxmi  
**Domain:** behaviorschool.com  
**Auth Provider:** Google OAuth  
**Status:** Awaiting Supabase configuration

