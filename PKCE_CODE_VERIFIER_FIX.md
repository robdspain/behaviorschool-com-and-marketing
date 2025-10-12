# 🔧 PKCE Code Verifier Issue - Final Fix

## Current Problem

After Google authentication, you're being redirected to the homepage with an error:

```
invalid request: both auth code and code verifier should be non-empty
```

**What this means:**
- Google OAuth is working ✅
- OAuth code is being returned ✅  
- BUT: The PKCE code verifier is missing ❌

## What is PKCE?

PKCE (Proof Key for Code Exchange) is a security feature where:
1. Your browser generates a random "code verifier" before OAuth
2. Sends a "code challenge" (hash of verifier) to Google
3. Google returns with an OAuth code
4. Your app must provide both the code AND the original verifier

**The Problem:** The code verifier is being stored in cookies/localStorage but getting lost between the login page and callback.

## Root Causes

### 1. Cookie Storage Issues
Supabase stores the PKCE verifier in cookies named:
- `sb-dugolglucuzolzvuqxmi-auth-token-code-verifier`

These cookies might be:
- Not being set with correct domain
- Being blocked by SameSite policies  
- Getting cleared during redirect

### 2. Redirect Chain
```
behaviorschool.com/admin/login
  → accounts.google.com (OAuth)
  → dugolglucuzolzvuqxmi.supabase.co/auth/v1/callback
  → behaviorschool.com/?code=xxx (verifier lost here!)
```

## Temporary Workaround (While Netlify Deploys)

Since the auto-deploy will take a few minutes, try this immediate workaround:

### Option A: Use Direct Admin Access (Testing Only)

For now, let's bypass OAuth and add you directly as an admin user in Supabase:

1. **Go to Supabase Dashboard:**
   https://app.supabase.com/project/dugolglucuzolzvuqxmi/auth/users

2. **Find your user** (should be listed after your Google login attempts)

3. **Manually create admin session:**
   - You can access admin pages by manually setting the session

### Option B: Alternative OAuth Configuration

The fix I just pushed adds `skipBrowserRedirect: false` which ensures proper cookie handling. This will be live in ~3 minutes.

## Permanent Fix Strategy

### Fix 1: Cookie Configuration (Just Pushed)
Added explicit `skipBrowserRedirect: false` to ensure Supabase handles the full redirect flow.

### Fix 2: Use Implicit Flow (If PKCE Continues to Fail)

If PKCE still has issues, we can switch to implicit flow:

```typescript
// In supabase-client.ts
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        flowType: 'implicit', // Use implicit flow instead of PKCE
        detectSessionInUrl: true,
        persistSession: true,
        storage: window?.localStorage,
      }
    }
  )
}
```

### Fix 3: Server-Side Session Creation

Instead of relying on client-side PKCE, handle everything server-side:

```typescript
// Alternative: Server-side OAuth initiation
// Create a server action that initiates OAuth
// This keeps the verifier on the server
```

## What's Deploying Now

**File:** `src/app/admin/login/page.tsx`

**Change:**
```typescript
options: {
  redirectTo: `${origin}/auth/callback?next=/admin`,
  skipBrowserRedirect: false, // ← Added this
  queryParams: {
    access_type: 'offline',
    prompt: 'consent',
  }
}
```

## Testing After Deploy

1. **Wait 3 minutes** for Netlify auto-deploy
2. **Clear ALL browser data** (cookies, localStorage, cache)
3. **Use Incognito mode** (fresh browser state)
4. **Try login again**

## Debug Commands

### Check if Cookies Are Being Set:

**In browser console (F12) on `/admin/login`:**
```javascript
// Before clicking login:
console.log('Cookies before OAuth:', document.cookie)

// After clicking login (in callback):
console.log('Cookies after OAuth:', document.cookie)

// Check for code verifier:
document.cookie.split(';').filter(c => c.includes('code-verifier'))
```

### Check Supabase Client Configuration:

```javascript
// In browser console:
const client = createClient()
console.log('Auth config:', client.auth.config)
```

## If Still Not Working After Deploy

### Immediate Fix: Use Session from Callback URL

The OAuth code in the URL (`?code=ebeb8e5a...`) can be manually exchanged:

1. Copy the full callback URL with code
2. Paste it directly into `/auth/callback` path
3. See if it creates a session

Example:
```
https://behaviorschool.com/auth/callback?code=ebeb8e5a-6450-4062-9420-9b1243c708a9&next=/admin
```

### Alternative: Implement Token Exchange

If PKCE continues to fail, we can implement a server-side token exchange that doesn't require the verifier.

## Expected Timeline

- **3 minutes:** Netlify deploy completes
- **5 minutes:** Test with fresh browser
- **10 minutes:** If still failing, implement implicit flow fix
- **15 minutes:** If still failing, implement server-side OAuth

## Next Steps

1. ⏳ Wait for deploy (check: `netlify status`)
2. 🧹 Clear browser completely
3. 🧪 Test login in incognito
4. 📝 Report what happens

If it still fails, share:
- Browser console errors
- Network tab showing the callback request
- Any cookie-related warnings

---

**Current Status:** Fix deploying
**ETA:** ~3 minutes  
**Confidence:** High - `skipBrowserRedirect` should resolve cookie persistence

## Background: Why This Happens

Supabase auth with PKCE in Next.js can be tricky because:

1. **Multiple Domains:** Your app, Google, and Supabase all handle the request
2. **Cookie Restrictions:** Modern browsers block 3rd-party cookies
3. **SameSite Policies:** Cookies need proper SameSite attributes
4. **Server Components:** Next.js App Router requires careful cookie handling

The fix ensures Supabase's client-side auth library properly manages the PKCE flow including storage and retrieval of the code verifier.

