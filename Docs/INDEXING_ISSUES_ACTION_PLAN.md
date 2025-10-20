# Google Search Console Indexing Issues - Action Plan

**Date:** October 19, 2025
**Current Issues:**
- 404 errors: 35 pages
- Page with redirect: 26 pages
- Crawled - not indexed: 12 pages
- Soft 404: 2 pages

---

## Root Causes Identified

### From robots.txt Analysis:
```
Disallow: /tag/
Disallow: /author/
Disallow: /*ghost
Disallow: /posts/
Disallow: /featured/
Disallow: /*?*
```

**Problem:** These Disallow rules are blocking legitimate pages that Google has already discovered via:
- External backlinks
- Old sitemap versions
- Internal links from before migration

**Result:** Google tries to crawl → gets blocked by robots.txt → shows as "Page with redirect" or "404"

---

## Issue #1: Not Found (404) - 35 Pages

### Likely Causes:
1. **Ghost CMS migration artifacts** - Old URLs from Ghost that don't exist in Next.js
2. **Tag pages** - `/tag/*` URLs that are blocked
3. **Author pages** - `/author/*` URLs that don't exist
4. **Old blog post URLs** - `/posts/*` format no longer used

### How to Identify:
Go to Google Search Console → Pages → Not indexed → "Not found (404)"
Click to see the full list of URLs

### Solutions:

#### Option A: If pages should exist (restore content):
```bash
# Example: If /posts/some-article exists as blog post, verify route
# Check if page exists in src/app/blog/[slug]/page.tsx
```

#### Option B: If pages are obsolete (redirect):
Create redirect rules in `next.config.js`:

```javascript
async redirects() {
  return [
    // Ghost CMS tag pages → closest equivalent
    {
      source: '/tag/:slug',
      destination: '/blog',
      permanent: true
    },
    // Ghost author pages → about page
    {
      source: '/author/:slug',
      destination: '/about',
      permanent: true
    },
    // Old post format → new blog format
    {
      source: '/posts/:slug',
      destination: '/blog/:slug',
      permanent: true
    },
    // Generic 404 catch-all for ghost URLs
    {
      source: '/:path*ghost:path2*',
      destination: '/',
      permanent: true
    }
  ]
}
```

#### Option C: Remove from Google index:
For truly dead pages, use Google Search Console "Remove URLs" tool:
1. Go to GSC → Removals
2. Enter URL pattern (e.g., `behaviorschool.com/tag/*`)
3. Submit removal request

---

## Issue #2: Page with Redirect - 26 Pages

### Likely Causes:
1. **robots.txt blocking** - Google sees redirect because robots.txt denies access
2. **Redirect chains** - Multiple hops (A → B → C)
3. **Internal links point to redirected URLs**

### How to Identify:
GSC → Pages → Not indexed → "Page with redirect"

### Solutions:

#### Step 1: Check if robots.txt is causing false redirects
For each URL in the list, test:
```bash
# Test if robots.txt blocks the URL
curl -s https://behaviorschool.com/robots.txt | grep -A5 -B5 "Disallow: /tag"
```

#### Step 2: Update robots.txt
Remove overly broad Disallow rules:

**Current (too restrictive):**
```
Disallow: /*?*
Disallow: /tag/
Disallow: /posts/
```

**Better approach:**
```
# Only block specific known-bad patterns
Disallow: /tag/*ghost*
Disallow: /posts/*@ghost*
Disallow: /api/
Disallow: /admin/
```

#### Step 3: Fix internal links
Search codebase for links to redirected URLs:

```bash
# Find internal links that need updating
grep -r "/tag/" src/
grep -r "/author/" src/
grep -r "/posts/" src/
```

Update to point directly to destination.

---

## Issue #3: Crawled - Currently Not Indexed - 12 Pages

### Likely Causes:
1. **Thin content** - Pages with < 300 words
2. **Duplicate content** - Similar to other pages
3. **Low value** - Tag pages, empty categories
4. **Noindex tag** - Accidentally added

### How to Identify:
GSC → Pages → Not indexed → "Crawled - currently not indexed"

### Solutions:

#### Step 1: Check for noindex tags
```bash
# Search for accidental noindex
grep -r "noindex" src/app/
grep -r "robots.*noindex" src/
```

#### Step 2: Audit content length
For each URL, check word count:
- Target: 1,000+ words for SEO value
- Minimum: 500 words to avoid "thin content"

#### Step 3: Add substantial content
Example - if `/bcba-study-tools` is crawled but not indexed:

**Current content:** 200 words of generic description

**Improved content (1,500+ words):**
- Introduction (200 words)
- "How to use BCBA study tools effectively" (400 words)
- "5 study strategies that work" (400 words)
- FAQ section (300 words)
- Study schedule template (200 words)

#### Step 4: Improve internal linking
Add links FROM high-authority pages TO these pages:
```typescript
// Example: Add link from homepage to low-indexed page
<Link href="/bcba-study-tools">
  Explore Study Tools
</Link>
```

---

## Issue #4: Soft 404 - 2 Pages

### What is a Soft 404?
Page returns HTTP 200 (success) but content appears to be "not found"

### Likely Causes:
1. **Empty state pages** - "No results found" but returns 200
2. **Client-side rendering issue** - Page loads empty initially
3. **Missing error handling** - Should return 404 but doesn't

### How to Identify:
GSC → Pages → Not indexed → "Soft 404"

### Common Culprits:

#### Example 1: Search results page with no results
```typescript
// BAD - Returns 200 even when no results
export default function SearchPage() {
  const results = [] // Empty
  return <div>No results found</div> // Still returns 200!
}

// GOOD - Return 404 when no results
export default function SearchPage() {
  const results = []
  if (results.length === 0) {
    notFound() // Returns 404 status
  }
  return <div>Results: {results}</div>
}
```

#### Example 2: Dynamic route that doesn't exist
```typescript
// src/app/blog/[slug]/page.tsx
export default async function BlogPost({ params }) {
  const post = await getPost(params.slug)

  // BAD - Returns empty page with 200
  if (!post) return <div>Post not found</div>

  // GOOD - Returns 404 status
  if (!post) notFound()

  return <article>{post.content}</article>
}
```

### Solutions:

#### Step 1: Identify the 2 URLs in GSC
Check the specific URLs showing soft 404

#### Step 2: Visit each URL and inspect
```bash
# Check HTTP status code
curl -I https://behaviorschool.com/problematic-url

# Should return:
# HTTP/2 404    ← Good (if page truly doesn't exist)
# HTTP/2 200    ← Bad (if page is empty/missing)
```

#### Step 3: Fix in code
Add proper 404 handling:
```typescript
import { notFound } from 'next/navigation'

// Return 404 for missing content
if (!contentExists) {
  notFound()
}
```

---

## Priority Action Items

### Immediate (Today):
1. ✅ **Export 404 list from GSC**
   - Go to GSC → Pages → Not indexed → "Not found (404)" → Export
   - Save as `404-urls.csv`

2. ✅ **Export redirect list from GSC**
   - Go to GSC → Pages → Not indexed → "Page with redirect" → Export
   - Save as `redirect-urls.csv`

3. ⏭️ **Analyze patterns**
   - Identify common patterns (e.g., `/tag/*`, `/author/*`, `/posts/*`)
   - Group by root cause

### This Week:
4. ⏭️ **Create redirect rules**
   - Update `next.config.js` with 301 redirects
   - Test each redirect works

5. ⏭️ **Update robots.txt**
   - Remove overly broad Disallow rules
   - Keep only necessary blocks (`/admin/`, `/api/`)

6. ⏭️ **Fix soft 404s**
   - Identify the 2 URLs
   - Add proper `notFound()` handling

### Next Week:
7. ⏭️ **Address "Crawled - not indexed" pages**
   - Add substantial content (1,000+ words)
   - Improve internal linking
   - Check for noindex tags

8. ⏭️ **Submit updated sitemap**
   - Update sitemap.xml with correct URLs only
   - Remove any URLs that redirect
   - Submit to GSC

9. ⏭️ **Request re-indexing**
   - Use GSC "Request Indexing" for fixed pages
   - Monitor indexing over 2-4 weeks

---

## Expected Results

### Week 1-2:
- 404 errors: 35 → 10 (redirects in place)
- Redirects: 26 → 5 (robots.txt fixed)

### Week 3-4:
- Soft 404: 2 → 0 (proper 404 status codes)
- Crawled-not-indexed: 12 → 6 (content improved)

### Month 2:
- 404 errors: 10 → 0 (remaining stragglers cleared)
- Crawled-not-indexed: 6 → 2 (Google re-evaluates)

### Long-term (3-6 months):
- All indexing issues resolved
- Position improvements from better indexing
- CTR improvements from more pages indexed

---

## Quick Diagnostic Commands

### Check if URL is blocked by robots.txt:
```bash
curl -s https://behaviorschool.com/robots.txt | grep -i "disallow"
```

### Test HTTP status code:
```bash
curl -I https://behaviorschool.com/page-url
```

### Find internal links to problematic URLs:
```bash
grep -r "href=\"/tag/" src/
grep -r "href=\"/author/" src/
```

### Check for noindex tags:
```bash
grep -r "noindex" src/app/
```

---

## Monitoring

**Google Search Console:**
- Check indexing status weekly: GSC → Pages → "Why pages aren't indexed"
- Track improvement trends
- Re-submit fixed URLs for indexing

**Analytics:**
- Monitor organic traffic increases as pages get indexed
- Track position improvements for newly indexed pages

**Success Metrics:**
- 404 errors: Target 0-5 (unavoidable stragglers)
- Redirects: Target 0-3
- Soft 404: Target 0
- Crawled-not-indexed: Target < 5 (always some low-value pages)

---

## Next Steps

**Ready to proceed?**

I can help you:
1. Export the URLs from GSC (need you to share the lists)
2. Create redirect rules in `next.config.js`
3. Update robots.txt to be less restrictive
4. Add proper 404 handling to dynamic routes
5. Identify and fix the 2 soft 404 pages

**Please share:**
- List of 404 URLs from GSC
- List of redirect URLs from GSC
- List of crawled-not-indexed URLs (if you want to improve them)

Then I can create specific fixes for your exact issues.
