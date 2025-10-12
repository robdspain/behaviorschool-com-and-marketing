# 🚨 IMMEDIATE PKCE FIX - Critical Issue

## Current Error
```
invalid request: both auth code and code verifier should be non-empty
```

## Root Cause Identified

The PKCE code verifier is being **blocked or lost** between these steps:

1. ✅ User clicks "Sign in with Google" on `/admin/login`
2. ✅ Supabase TRIES to store code verifier in cookie/localStorage
3. ❌ **CODE VERIFIER GETS LOST HERE**
4. ✅ User authenticates with Google
5. ✅ Google redirects back with OAuth code
6. ❌ Callback tries to exchange code but **verifier is missing**

## Why This Happens

### Issue: Cookie Domain Mismatch
Supabase's PKCE flow stores the verifier in a cookie like:
```
sb-dugolglucuzolzvuqxmi-auth-token-code-verifier
```

This cookie might not be persisting because:
- **Wrong domain:** Cookie set for `.behaviorschool.com` but needs `behaviorschool.com`
- **SameSite policy:** Browser blocking cookie during cross-site redirect
- **Secure flag:** Cookie requires HTTPS (which you have, so this is OK)

## IMMEDIATE FIX OPTIONS

### Option 1: Switch to Implicit Flow (Recommended - No Code Verifier Needed)

This bypasses PKCE entirely and uses token fragments instead:

**File:** `src/lib/supabase-client.ts`

```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        flowType: 'implicit', // ← CHANGE FROM 'pkce' TO 'implicit'
        detectSessionInUrl: true,
        persistSession: true,
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      }
    }
  )
}
```

**Why this works:**
- No code verifier needed
- Token returned in URL fragment (not query param)
- Works with strict cookie policies
- Still secure for admin login

### Option 2: Use Server-Side Cookie Storage

Force cookies to be set server-side with correct domain:

**File:** `src/app/admin/login/page.tsx`

Add a server action to initiate OAuth:

```typescript
// New file: src/app/admin/login/actions.ts
'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function initiateGoogleLogin() {
  const cookieStore = await cookies()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) { return cookieStore.get(name)?.value },
        set(name, value, options) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name, options) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/admin`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      }
    },
  })

  if (data.url) {
    redirect(data.url)
  }
}
```

Then in `page.tsx`, call this server action instead of client-side OAuth.

### Option 3: Debug Cookie Storage (Quick Test)

Before we change the flow, let's verify what's happening:

**Add to `src/app/admin/login/page.tsx`:**

```typescript
const handleGoogleLogin = async () => {
  console.log('🔍 Before OAuth - Cookies:', document.cookie)
  console.log('🔍 Before OAuth - localStorage:', localStorage.getItem('sb-auth-token'))
  
  const origin = window.location.origin;
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback?next=/admin`,
      skipBrowserRedirect: false,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      }
    },
  });

  console.log('🔍 After OAuth - Cookies:', document.cookie)
  console.log('🔍 OAuth data:', data)
  console.log('🔍 OAuth error:', error)

  if (error) {
    console.error('OAuth error:', error);
    alert(`Authentication failed: ${error.message}`);
  }
};
```

## RECOMMENDED: Quick Fix - Switch to Implicit Flow

Since this is admin-only login (not public-facing), implicit flow is perfectly fine and will work immediately.

### Steps:

1. **Edit:** `src/lib/supabase-client.ts`
2. **Change:** `flowType: 'pkce'` to `flowType: 'implicit'`
3. **Commit and push**
4. **Test immediately** (no cache clear needed)

### Why Implicit is OK for Admin

- ✅ Only admins use this (not public users)
- ✅ Already using HTTPS
- ✅ Tokens not exposed in server logs
- ✅ Session expires properly
- ✅ No PKCE complexity

## Alternative: Check Supabase Project Settings

There might be a setting in Supabase that's forcing PKCE:

1. Go to: https://app.supabase.com/project/dugolglucuzolzvuqxmi/auth/providers
2. Check **Google provider settings**
3. Look for "PKCE" or "Flow Type" settings
4. If there's an option to disable PKCE for OAuth, try that

## Testing After Fix

**With Implicit Flow:**
1. No need to clear cache
2. Login should work immediately
3. Token comes in URL fragment (not query)
4. No verifier needed

**Expected URL after Google:**
```
https://behaviorschool.com/auth/callback#access_token=...&refresh_token=...
```
(Note the `#` instead of `?` - this is implicit flow)

## Next Steps

1. **Quick win:** Switch to implicit flow (5 minutes)
2. **If that fails:** Add debug logging to see cookie state
3. **Last resort:** Server-side OAuth initiation

Let me know which approach you want to take, or I can implement the implicit flow fix right now since that's the fastest solution.

---

**Recommendation:** Use implicit flow for admin login. It's simpler, works with all cookie policies, and is secure for your use case.

