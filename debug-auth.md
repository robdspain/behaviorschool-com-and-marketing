# Debug Admin Authentication Issue

## Current Situation
- Site deployed: https://behaviorschool.com
- Redirecting to: https://behaviorschool.com/admin/login?error=unauthorized
- Authorized emails in code:
  - robspain@gmail.com
  - behaviorschoolcommunity@gmail.com
  - rob@behaviorschool.com

## Possible Issues

### 1. Google OAuth Not Configured
Check if `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is set in Netlify environment variables.

**How to check:**
1. Go to: https://app.netlify.com/sites/[your-site]/configuration/env
2. Look for `NEXT_PUBLIC_GOOGLE_CLIENT_ID`

**If missing:**
- You need to set up Google OAuth credentials
- Get Client ID from: https://console.cloud.google.com/apis/credentials

### 2. Session Cookie Issue
The middleware might be seeing an old session with a different email.

**Test with browser console:**
```javascript
// On https://behaviorschool.com/admin/login
// Open DevTools > Console and run:
document.cookie.split(';').filter(c => c.includes('supabase'))
```

### 3. Supabase Session Not Clearing
**Clear everything:**
```javascript
// In browser console:
localStorage.clear();
sessionStorage.clear();
document.cookie.split(";").forEach(c => {
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
});
location.reload();
```

### 4. Case Sensitivity Issue
The admin-config uses `.toLowerCase().trim()` but middleware might not.

**Quick fix to test:**
What email shows up in the Google Sign-In? Make sure it exactly matches one of:
- robspain@gmail.com (all lowercase)
- behaviorschoolcommunity@gmail.com (all lowercase)
- rob@behaviorschool.com (all lowercase)

### 5. Middleware Not Deployed
Check if the latest middleware is actually deployed:

**View deployed file:**
```bash
curl -s https://behaviorschool.com/_next/static/chunks/middleware.js | grep -i "robspain"
```

## Quick Diagnostic Steps

1. **Open Incognito Window**
2. **Go to:** https://behaviorschool.com/admin/login
3. **Open DevTools Console** (F12)
4. **Before clicking login, run:**
   ```javascript
   // Check if Google is loading
   console.log('Google loaded:', !!window.google);

   // Check cookies
   console.log('Cookies:', document.cookie);
   ```

5. **Click "Sign in with Google"**
6. **Sign in with:** robspain@gmail.com
7. **After redirect, in console run:**
   ```javascript
   // Check what happened
   console.log('Current URL:', window.location.href);
   console.log('Cookies after login:', document.cookie);
   ```

## Alternative: Add Console Logging

Add this to middleware.ts temporarily to see what's happening:

```typescript
// After line 58 (after getSession)
console.log('Session check:', {
  hasSession: !!session,
  email: session?.user?.email,
  path: request.nextUrl.pathname
});

// After line 72 (in authorization check)
console.log('Auth check:', {
  email: session.user.email,
  isAuthorized: AUTHORIZED_ADMIN_EMAILS.includes(session.user.email),
  authorizedEmails: AUTHORIZED_ADMIN_EMAILS
});
```

Then check Netlify Function logs to see the output.

## What Email Are You Using?

**IMPORTANT:** Please confirm which exact email you're trying to sign in with.
If it's not one of the three listed above, that's why it's failing.
