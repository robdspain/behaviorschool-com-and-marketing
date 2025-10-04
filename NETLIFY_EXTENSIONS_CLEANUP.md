# Netlify Extensions Cleanup Guide

## Issue
The Neon extension is being loaded during builds but is not needed:
```
9:37:20 AM: ❯ Installing extensions
9:37:20 AM:    - neon
```

## Solution: Remove Unused Extensions

### Step 1: Access Netlify Dashboard
1. Go to https://app.netlify.com
2. Select your site: **behaviorschool-com-and-marketing**

### Step 2: Navigate to Extensions
1. Click **Integrations** in the left sidebar
2. Or go to: Site Settings → Build & Deploy → Extensions

### Step 3: Remove Neon Extension
1. Find "Neon" in the list of installed extensions
2. Click **Configure** or **Remove**
3. Confirm removal

### Alternative: Disable via UI
If you can't find the extensions section:
1. Go to **Site Settings**
2. Click **Build & Deploy**
3. Scroll to **Build extensions**
4. Remove or disable Neon

## Expected Result
After removal, build logs should show:
```
❯ Installing extensions
   (no extensions listed)
```

## Other Extensions to Review

Check if these extensions are needed:
- **@netlify/plugin-lighthouse** - Runs performance audits (useful for monitoring)
- **netlify-plugin-submit-sitemap** - Auto-submits sitemap to search engines (keep this)
- Any database-related extensions if not using external DB

## Current Active Extensions

From `netlify.toml`:
```toml
[[plugins]]
  package = "@netlify/plugin-nextjs"  # Required for Next.js

[[plugins]]
  package = "netlify-plugin-submit-sitemap"  # Useful - auto sitemap submission
  [plugins.inputs]
    sitemapUrl = "https://behaviorschool.com/sitemap.xml"
    providers = ["google", "bing"]
```

From Netlify UI only:
- `@netlify/plugin-lighthouse` - Performance monitoring
- `neon` - Database extension (NOT NEEDED - remove this)

## Recommended Setup

**Keep:**
- @netlify/plugin-nextjs (required)
- netlify-plugin-submit-sitemap (helpful for SEO)
- @netlify/plugin-lighthouse (optional - for performance monitoring)

**Remove:**
- neon (database extension - not in use)

---

*Last Updated: October 2025*
