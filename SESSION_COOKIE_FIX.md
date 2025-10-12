# 🔧 Session Cookie Fix - OAuth Callback

## Issue Identified

After Google authentication, users were being redirected back to `/admin/login` instead of staying logged in.

### Root Cause:
The OAuth callback route (`/auth/callback`) was **creating a session** but **not passing the session cookies back to the browser**.

## The Problem

```typescript
// ❌ BEFORE (broken):
const { error } = await supabase.auth.exchangeCodeForSession(code)
// Cookies were set in cookieStore but NOT in the response object
const redirectUrl = new URL(next, request.url)
return NextResponse.redirect(redirectUrl)
```

**What happened:**
1. Google OAuth → Supabase callback → Session created ✅
2. Cookies set in server-side cookieStore ✅
3. Redirect response sent to browser ❌ **WITHOUT cookies**
4. Browser follows redirect without session
5. Middleware checks for user → No session found
6. Redirect back to login ❌

## The Solution

```typescript
// ✅ AFTER (fixed):
const response = NextResponse.redirect(new URL(next, request.url))

const supabase = createServerClient(url, key, {
  cookies: {
    set(name, value, options) {
      // Set in BOTH places
      cookieStore.set({ name, value, ...options })
      response.cookies.set({ name, value, ...options }) // ← KEY FIX
    }
  }
})

const { data, error } = await supabase.auth.exchangeCodeForSession(code)
return response // Returns with cookies attached ✅
```

**What happens now:**
1. Google OAuth → Supabase callback → Session created ✅
2. Cookies set in cookieStore AND response object ✅
3. Redirect response sent with Set-Cookie headers ✅
4. Browser follows redirect WITH session cookies ✅
5. Middleware checks for user → Session found ✅
6. Access to /admin granted ✅

## Changes Made

### File: `/src/app/auth/callback/route.ts`

1. **Create response object first:**
   ```typescript
   const response = NextResponse.redirect(new URL(next, request.url))
   ```

2. **Modify cookie operations:**
   ```typescript
   set(name, value, options) {
     cookieStore.set({ name, value, ...options })
     response.cookies.set({ name, value, ...options }) // Added
   }
   ```

3. **Add logging for debugging:**
   ```typescript
   console.log('[Auth Callback] Processing OAuth code')
   console.log('[Auth Callback] Session created successfully for user:', data.user?.email)
   ```

4. **Better error handling:**
   ```typescript
   if (!data.session) {
     console.error('[Auth Callback] No session created')
     return NextResponse.redirect(new URL('/admin/login?error=no_session', request.url))
   }
   ```

## Testing After Deploy

### Wait for Netlify Auto-Deploy
The fix has been pushed to GitHub. Netlify will automatically deploy it in ~3 minutes.

**Check deployment:**
```bash
netlify status
```

### Test the Login Flow

1. **Clear browser cookies** (important!)
   - Chrome/Edge: Settings → Privacy → Clear browsing data
   - Or use Incognito/Private mode

2. **Visit:** https://behaviorschool.com/admin/login

3. **Click:** "Continue with Google"

4. **Expected flow:**
   ```
   Login page
   ↓
   Google sign-in
   ↓
   Google callback → Supabase
   ↓
   /auth/callback (creates session + sets cookies)
   ↓
   /admin (WITH session) ✅
   ```

5. **Success indicators:**
   - You stay on `/admin` (not redirected back to login)
   - Can navigate to other admin pages
   - Session persists on page refresh

### Debug if Still Not Working

**Check Netlify Function Logs:**
```bash
netlify functions:log auth-callback
```

**Look for these log messages:**
- `[Auth Callback] Processing OAuth code`
- `[Auth Callback] Session created successfully for user: your@email.com`

**If you see errors:**
- `[Auth Callback] Error exchanging code:` → OAuth configuration issue
- `[Auth Callback] No session created` → Supabase session creation failed

**Check browser DevTools (F12):**
1. Network tab
2. Find the `/auth/callback` request
3. Look at Response Headers
4. Should see `Set-Cookie` headers with Supabase session tokens

## Why This Fix Works

### Supabase SSR Cookie Handling

In Next.js with Supabase SSR, you need to set cookies in:
1. **Server-side cookie store** (for server components)
2. **Response object** (to send to browser)

The `createServerClient` function from `@supabase/ssr` expects you to handle both:

```typescript
{
  cookies: {
    get(name) {
      return cookieStore.get(name)?.value // Read from request
    },
    set(name, value, options) {
      cookieStore.set({ name, value, ...options }) // Server-side
      response.cookies.set({ name, value, ...options }) // Browser
    },
    remove(name, options) {
      cookieStore.set({ name, value: '', ...options }) // Server-side
      response.cookies.set({ name, value: '', ...options }) // Browser
    },
  },
}
```

### What Each Cookie Does

| Cookie Name | Purpose |
|-------------|---------|
| `sb-dugolglucuzolzvuqxmi-auth-token` | JWT access token |
| `sb-dugolglucuzolzvuqxmi-auth-token-code-verifier` | PKCE verifier |
| `sb-dugolglucuzolzvuqxmi-auth-refresh-token` | Refresh token |

All three must be set in the response for the session to work.

## Related Files

- ✅ `/src/app/auth/callback/route.ts` - Fixed
- ✅ `/src/middleware.ts` - Already correct
- ✅ `/src/app/admin/login/page.tsx` - Already correct

## Commits

- `161812e` - Fix OAuth callback to properly set session cookies
- `109147a` - Fix ESLint error in auth callback

## What to Expect

### Before Fix:
```
Login → Google → Create session → Redirect → No cookies → Back to login ❌
```

### After Fix:
```
Login → Google → Create session → Redirect WITH cookies → /admin ✅
```

## Next Steps

1. ⏳ **Wait** for Netlify auto-deploy (~3 minutes)
2. 🧹 **Clear** browser cookies
3. 🧪 **Test** the login flow
4. ✅ **Verify** you stay logged in

---

**Status:** ✅ Fix deployed  
**Auto-deploy:** In progress  
**ETA:** ~3 minutes  
**Test URL:** https://behaviorschool.com/admin/login

