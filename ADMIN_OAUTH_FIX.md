# Admin OAuth Redirect Loop Fix Guide

## Current Issue
`ERR_TOO_MANY_REDIRECTS` when accessing `/admin/login`

The page redirects to itself: `/admin/login` → `/admin/login?error=unauthorized` → repeat

## Root Cause Analysis

### 1. Middleware Configuration ✅ (Fixed in code)
The middleware now properly excludes `/admin/login` from auth checks:
```typescript
const isLoginPage = pathname.includes('/login');
const needsAuth = pathname.startsWith('/admin') && !isLoginPage;
```

### 2. Supabase OAuth Redirect URLs ⚠️ (Needs Verification)
**Required Configuration in Supabase Dashboard:**

Go to: https://supabase.com/dashboard/project/dugolglucuzolzvuqxmi/auth/url-configuration

**Site URL:**
```
https://behaviorschool.com
```

**Redirect URLs (add ALL of these):**
```
https://behaviorschool.com/admin
https://behaviorschool.com/admin/login
https://behaviorschool.com/auth/callback
http://localhost:3000/admin
http://localhost:3000/admin/login
```

### 3. Google OAuth Configuration ⚠️ (Needs Verification)
**Google Cloud Console** → API & Services → Credentials

**Authorized redirect URIs:**
```
https://dugolglucuzolzvuqxmi.supabase.co/auth/v1/callback
https://behaviorschool.com/auth/callback
http://localhost:3000/auth/callback
```

## Step-by-Step Fix

### Step 1: Verify Supabase Settings
1. Go to: https://supabase.com/dashboard/project/dugolglucuzolzvuqxmi
2. Navigate to: **Authentication** → **URL Configuration**
3. Set **Site URL** to: `https://behaviorschool.com`
4. Add **Redirect URLs**:
   - `https://behaviorschool.com/admin`
   - `https://behaviorschool.com/admin/login`
   - `https://behaviorschool.com/auth/callback`

### Step 2: Verify Google OAuth Settings
1. Go to: https://console.cloud.google.com/apis/credentials
2. Find your OAuth 2.0 Client ID
3. Add **Authorized redirect URIs**:
   - `https://dugolglucuzolzvuqxmi.supabase.co/auth/v1/callback`

### Step 3: Clear Browser State
After configuration changes:
1. Clear cookies for `behaviorschool.com`
2. Clear cookies for `supabase.co`
3. Hard refresh (Cmd+Shift+R / Ctrl+Shift+R)

### Step 4: Test OAuth Flow
1. Visit: https://behaviorschool.com/admin/login
2. Click "Continue with Google"
3. Should redirect to Google OAuth
4. After consent, should redirect to `/admin` with session

## Netlify Build Status

Check current deployment:
```bash
netlify status
```

The latest code changes should be deployed automatically via GitHub integration.

## Expected OAuth Flow

1. **User visits** `/admin`
2. **Middleware detects** no auth cookies
3. **Redirects to** `/admin/login?error=unauthorized`
4. **Login page loads** (middleware allows through - path includes 'login')
5. **User clicks** "Continue with Google"
6. **Redirects to** Google OAuth consent screen
7. **Google redirects to** `https://dugolglucuzolzvuqxmi.supabase.co/auth/v1/callback?code=xxx`
8. **Supabase processes** OAuth code, sets cookies
9. **Supabase redirects to** `/admin?code=xxx` (our redirect target)
10. **Middleware detects** `?code=` parameter, allows through
11. **Page loads**, checks session, renders admin dashboard

## Current Code Status

### Middleware (src/middleware.ts)
```typescript
const isAuthRoute = pathname.startsWith('/api/auth');
const isLoginPage = pathname.includes('/login'); // ✅ Permissive check
const hasAuthCallback = request.nextUrl.searchParams.has('code'); // ✅ OAuth callback

const needsAuth = pathname.startsWith('/admin') && !isLoginPage && !isAuthRoute && !hasAuthCallback;
```

### Login Page (src/app/admin/login/page.tsx)
```typescript
const { error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/admin`, // ✅ Correct redirect
    queryParams: {
      access_type: 'offline',
      prompt: 'consent',
    }
  }
})
```

## Debugging Commands

### Check Supabase Configuration
```bash
supabase projects list
supabase projects api-keys --project-ref dugolglucuzolzvuqxmi
```

### Test Production Endpoints
```bash
# Should NOT redirect (login page)
curl -I https://behaviorschool.com/admin/login

# Should redirect to login (protected route)
curl -I https://behaviorschool.com/admin

# Should allow through (OAuth callback)
curl -I "https://behaviorschool.com/admin?code=test123"
```

### Check Deployed Code
```bash
# Check if latest commit is deployed
git log -1 --oneline
netlify status
```

## Quick Fix Checklist

- [ ] Verify Supabase Site URL is `https://behaviorschool.com`
- [ ] Add all redirect URLs to Supabase dashboard
- [ ] Verify Google OAuth has Supabase callback URL
- [ ] Confirm Netlify build succeeded and deployed
- [ ] Clear browser cookies completely
- [ ] Test OAuth flow from incognito window

## Environment Variables to Verify

In Netlify dashboard (Settings → Environment Variables):

```
NEXT_PUBLIC_SUPABASE_URL=https://dugolglucuzolzvuqxmi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon key from supabase]
GOOGLE_CLIENT_ID=[from Google Cloud Console]
GOOGLE_CLIENT_SECRET=[from Google Cloud Console]
```

## If Still Not Working

1. **Check Netlify build logs** for deployment errors
2. **Check browser console** for JavaScript errors
3. **Check Network tab** to see actual redirect chain
4. **Enable Supabase logging** in dashboard for OAuth debugging

---

**Last Updated:** October 2025
**Project ID:** dugolglucuzolzvuqxmi
**Domain:** behaviorschool.com
