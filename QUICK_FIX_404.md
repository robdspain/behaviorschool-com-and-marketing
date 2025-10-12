# 🚨 QUICK FIX: Admin Login 404 Error

## The Problem
You're seeing a **beautiful login page** ✅  
But clicking "Continue with Google" gives you a **404 error** ❌

## Why It Happens
The OAuth flow tries to redirect back to your site, but Supabase is blocking it because the redirect URL isn't whitelisted.

## The 5-Minute Fix

### Step 1: Open This Diagnostic Tool
Visit: **https://behaviorschool.com/test-oauth.html**

This page will show you the exact URLs you need to add.

### Step 2: Open Supabase Dashboard  
Visit: **https://app.supabase.com/project/dugolglucuzolzvuqxmi/auth/url-configuration**

### Step 3: Set Site URL
In the "Site URL" field, enter:
```
https://behaviorschool.com
```

### Step 4: Add Redirect URLs
Click the **"Add URL"** button and add these 4 URLs (one at a time):

1. `https://behaviorschool.com/auth/callback`
2. `https://behaviorschool.com/auth/callback?next=/admin`
3. `https://behaviorschool.com/admin`
4. `https://behaviorschool.com/admin/login`

**Tip:** Use the "Copy" buttons on the test-oauth.html page!

### Step 5: Save
Click **"Save"** at the bottom of the Supabase page.

### Step 6: Test
1. Wait 2 minutes ⏱️
2. Clear your browser cache (Cmd+Shift+Delete on Mac, Ctrl+Shift+Delete on Windows)
3. Go to: https://behaviorschool.com/admin/login
4. Click "Continue with Google"
5. ✅ Should work now!

## Visual Guide

```
┌─────────────────────────────────────────┐
│  Supabase Dashboard                     │
│  ━━━━━━━━━━━━━━━━━━                     │
│                                         │
│  Authentication → URL Configuration     │
│                                         │
│  Site URL:                              │
│  ┌───────────────────────────────────┐  │
│  │ https://behaviorschool.com        │  │
│  └───────────────────────────────────┘  │
│                                         │
│  Redirect URLs:                         │
│  ┌───────────────────────────────────┐  │
│  │ https://behaviorschool.com/...    │  │
│  └───────────────────────────────────┘  │
│  [+ Add URL] ← Click this 4 times      │
│                                         │
│  [Save] ← Click when done              │
└─────────────────────────────────────────┘
```

## What Happens After Configuration

### Before (404 Error):
```
You click "Login" 
  → Redirects to Google ✅
  → Google authenticates you ✅
  → Tries to redirect back ❌ 404 ERROR
```

### After (Works Perfectly):
```
You click "Login"
  → Redirects to Google ✅
  → Google authenticates you ✅  
  → Redirects to /auth/callback ✅
  → Creates session ✅
  → Redirects to /admin ✅
  → You're logged in! 🎉
```

## Troubleshooting

### Still getting 404 after configuration?
1. **Clear cache completely** - The browser might be caching the old redirect
2. **Try incognito/private mode** - Fresh browser session
3. **Wait 5 minutes** - Supabase might need more time to propagate changes

### "Redirect URL not whitelisted" error?
- Double-check you added the EXACT URLs (including `https://`)
- Make sure you clicked "Save" in Supabase
- Verify the Site URL matches exactly

### Login works but redirects to wrong page?
- Check that you included the URL with `?next=/admin` parameter
- This tells the app where to redirect after successful login

## Quick Links

- 🧪 **Test Tool:** https://behaviorschool.com/test-oauth.html
- ⚙️ **Supabase Config:** https://app.supabase.com/project/dugolglucuzolzvuqxmi/auth/url-configuration
- 🔐 **Login Page:** https://behaviorschool.com/admin/login
- 📚 **Full Guide:** See `SUPABASE_REDIRECT_CONFIG.md`

## Need More Help?

If you're still having issues, check:
1. Browser DevTools → Console (F12) for error messages
2. Network tab to see exact redirect URLs being used
3. Make sure you're using the production domain (not localhost)

---

**Status:** Ready for configuration  
**Time Required:** ~5 minutes  
**Difficulty:** Easy ⭐

