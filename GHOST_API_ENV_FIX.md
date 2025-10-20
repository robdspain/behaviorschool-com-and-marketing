# Ghost API Environment Variable Fix

## Problem
The admin content page shows "No posts found" because the `GHOST_ADMIN_KEY` environment variable is missing in Netlify.

## Error Message
```
{"success":false,"error":"Ghost Admin API key not configured"}
```

## Solution: Add Environment Variables to Netlify

### Step 1: Get Your Ghost Admin Key
From your `.env.local` file, you have:
```
GHOST_ADMIN_KEY=67b19c0c5db7be0001c0e715:083ac197565fea2fd87f44a37204db0baa769791f4ba5102b9912a4b9beb82a3
```

### Step 2: Add to Netlify

1. **Go to Netlify Environment Variables:**
   - https://app.netlify.com/sites/YOUR-SITE-NAME/configuration/env

2. **Add the following environment variable:**

   **Key:** `GHOST_ADMIN_KEY`
   
   **Value:** `67b19c0c5db7be0001c0e715:083ac197565fea2fd87f44a37204db0baa769791f4ba5102b9912a4b9beb82a3`
   
   **Scopes:** Check "All" (or at minimum: Production, Deploy Previews, Branch Deploys)

3. **Click "Save"**

### Step 3: Optional - Verify Other Ghost Variables

While you're there, also verify these are set:

| Variable | Value | Status |
|----------|-------|--------|
| `GHOST_CONTENT_URL` | `https://ghost.behaviorschool.com` | Should exist |
| `GHOST_CONTENT_KEY` | `675e5c4d3a1b2c8d9f0e4a5c...` | Should exist |
| `GHOST_ADMIN_KEY` | `67b19c0c5db7be0001c0e715:...` | **MISSING - ADD THIS** |

### Step 4: Redeploy

After adding the environment variable:

**Option A: Trigger Redeploy in Netlify UI**
- Go to: Deploys → Trigger deploy → Clear cache and deploy site

**Option B: Trigger Redeploy via Git** (preferred)
```bash
git commit --allow-empty -m "Trigger redeploy for Ghost API env var"
git push origin main
```

### Step 5: Test

After deployment completes (2-3 minutes):
1. Go to: https://behaviorschool.com/admin/content
2. You should now see your blog posts!
3. Open browser console (F12) - should see: "Fetched X posts from Ghost"

## Why This Happened

The environment variables in your local `.env.local` file are **not automatically synced** to Netlify. You need to manually add them in the Netlify dashboard.

## Quick Checklist

- [ ] Add `GHOST_ADMIN_KEY` to Netlify environment variables
- [ ] Set scopes to "All" (or Production + Deploy Previews + Branch Deploys)
- [ ] Save the variable
- [ ] Trigger a new deployment
- [ ] Wait for deployment to complete
- [ ] Test the admin content page

---

**Note:** After adding environment variables, you MUST redeploy for them to take effect. The variables are only loaded at build time.

