# Admin Login Fix - Complete Guide

## Problem
The `/admin/login` page has:
1. **"Admin Login" link** - Does nothing (no href)
2. **"Login with Google" button** - Returns 404 error

## Root Cause
The Google OAuth callback is not properly configured in Supabase dashboard. When users click "Login with Google", they get redirected but Supabase rejects the callback URL.

## Solution Applied

### 1. ✅ Fixed Admin Login Page
**File:** `src/app/admin/login/page.tsx`

**Changes Made:**
- Added proper error handling for OAuth errors
- Improved UI with better styling and error messages  
- Added loading states and proper button styling
- Added debug information in development mode
- Fixed OAuth configuration with proper queryParams

### 2. ✅ Callback Route Exists
**File:** `src/app/auth/callback/route.ts`

The callback route is already properly configured and handles:
- OAuth code exchange
- Session creation
- Redirects to intended destination (`/admin`)

### 3. ⚠️ Supabase Configuration (NEEDS YOUR ACTION)

**You must configure these redirect URLs in Supabase:**

1. Go to: https://app.supabase.com/project/dugolglucuzolzvuqxmi/auth/url-configuration

2. **Set Site URL:**
   ```
   https://behaviorschool.com
   ```

3. **Add these Redirect URLs** (click "Add URL" for each):
   ```
   https://behaviorschool.com/auth/callback
   https://behaviorschool.com/auth/callback?next=/admin
   https://behaviorschool.com/admin
   http://localhost:3000/auth/callback
   http://localhost:3000/auth/callback?next=/admin
   http://localhost:3000/admin
   ```

### 4. ⚠️ Google OAuth Configuration (NEEDS YOUR ACTION)

**Verify Google Cloud Console settings:**

1. Go to: https://console.cloud.google.com/apis/credentials

2. Find your OAuth 2.0 Client ID for this project

3. **Add Authorized Redirect URIs:**
   ```
   https://dugolglucuzolzvuqxmi.supabase.co/auth/v1/callback
   ```

4. **Save changes**

## Testing Steps

### After Configuration:

1. **Clear Browser State:**
   ```bash
   # In browser DevTools (F12):
   # Application → Storage → Clear site data
   # Or just use Incognito/Private window
   ```

2. **Test the Flow:**
   ```
   1. Visit: https://behaviorschool.com/admin/login
   2. Click "Continue with Google"
   3. Should redirect to Google login
   4. After login, should redirect back to /admin
   ```

3. **Expected Flow:**
   ```
   /admin/login 
   → Click "Continue with Google"
   → Google OAuth consent screen
   → dugolglucuzolzvuqxmi.supabase.co/auth/v1/callback?code=xxx
   → behaviorschool.com/auth/callback?code=xxx&next=/admin
   → behaviorschool.com/admin (logged in)
   ```

## Middleware Configuration

The middleware is already properly configured:

```typescript
const isLogin = pathname === '/admin/login' || pathname.startsWith('/admin/login/')

if (!user && isAdmin && !isLogin) {
  return NextResponse.redirect(new URL('/admin/login', request.url))
}
```

This allows:
- ✅ `/admin/login` - Public access (no auth required)
- ✅ `/auth/callback` - Public access (OAuth callback)
- ❌ `/admin/*` - Requires authentication (redirects to login)

## Environment Variables

Already configured in `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://dugolglucuzolzvuqxmi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

These are also needed in **Netlify environment variables** for production:
```bash
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

## Common Issues & Solutions

### Issue 1: 404 Error on Google Login
**Cause:** Redirect URL not whitelisted in Supabase  
**Fix:** Add all redirect URLs to Supabase dashboard (see step 3 above)

### Issue 2: Infinite Redirect Loop
**Cause:** Middleware redirecting login page  
**Fix:** Already fixed - middleware excludes `/admin/login`

### Issue 3: "Invalid redirect URL" from Google
**Cause:** Google OAuth config doesn't have Supabase callback URL  
**Fix:** Add `https://dugolglucuzolzvuqxmi.supabase.co/auth/v1/callback` to Google Console

### Issue 4: Session not persisting
**Cause:** Cookie settings or domain mismatch  
**Fix:** Ensure Supabase Site URL matches your actual domain

## Verification Commands

### Check Local Environment:
```bash
cd "/Users/robspain/Desktop/marketing suite"
grep NEXT_PUBLIC_SUPABASE .env.local
```

### Check Netlify Environment:
```bash
netlify env:list | grep SUPABASE
```

### Test Production:
```bash
# Should load without redirect
curl -I https://behaviorschool.com/admin/login

# Should redirect to login (no auth)
curl -I https://behaviorschool.com/admin
```

## Next Steps

1. **IMMEDIATE:**
   - [ ] Configure Supabase redirect URLs (5 minutes)
   - [ ] Verify Google OAuth callback URL (2 minutes)
   - [ ] Test login flow in production

2. **DEPLOYMENT:**
   ```bash
   cd "/Users/robspain/Desktop/marketing suite"
   git add .
   git commit -m "Fix admin login page with improved UI and error handling"
   git push origin main
   ```

3. **TESTING:**
   - Test in local: `npm run dev` → http://localhost:3000/admin/login
   - Test in production: https://behaviorschool.com/admin/login
   - Test with different browsers
   - Test in incognito mode

## Debug Mode

The updated login page includes debug information in development mode:
- Shows current origin
- Shows redirect URL
- Displays error messages clearly

## File Changes Summary

### Modified Files:
- ✅ `src/app/admin/login/page.tsx` - Complete UI overhaul with error handling

### Existing Files (No Changes Needed):
- ✅ `src/app/auth/callback/route.ts` - Already correct
- ✅ `src/middleware.ts` - Already correct
- ✅ `src/lib/supabase-client.ts` - Already correct

## Contact Information

- **Supabase Project ID:** `dugolglucuzolzvuqxmi`
- **Supabase URL:** `https://dugolglucuzolzvuqxmi.supabase.co`
- **Production Domain:** `https://behaviorschool.com`
- **Admin Login URL:** `https://behaviorschool.com/admin/login`

---

**Status:** ✅ Code Fixed | ⚠️ Awaiting Supabase Configuration  
**Last Updated:** October 12, 2025

