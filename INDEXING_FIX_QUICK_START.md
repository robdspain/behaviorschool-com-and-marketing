# Indexing Fix - Quick Start Guide

**Problem:** 71 pages (85% of sitemap) not indexing due to technical errors

**Time to fix:** 2-4 hours for critical issues

---

## Step 1: Run the Audit Script (5 minutes)

```bash
cd "/Users/robspain/Desktop/marketing suite"
./scripts/audit-sitemap-urls.sh
```

This will show you:
- ✅ Which URLs work (200 OK)
- 🔀 Which URLs redirect (need fixing)
- ❌ Which URLs return 404 (need removing)

---

## Step 2: Get Search Console Data (10 minutes)

### Export the problem URLs:

1. **404 Errors (36 pages):**
   - Go to: https://search.google.com/search-console
   - Click: Coverage → "Not found (404)"
   - Click: Export → Download CSV
   - Save as: `404-urls.csv`

2. **Redirects (24 pages):**
   - Coverage → "Page with redirect"
   - Export → Download CSV
   - Save as: `redirect-urls.csv`

3. **Thin Content (9 pages):**
   - Coverage → "Crawled - currently not indexed"
   - Export → Download CSV
   - Save as: `crawled-not-indexed.csv`

4. **Soft 404s (2 pages):**
   - Coverage → "Soft 404"
   - Export → Download CSV
   - Save as: `soft-404-urls.csv`

---

## Step 3: Clean Sitemap - Remove 404s (30-60 minutes)

### Open sitemap:
```bash
open public/sitemap.xml
```

### For EACH URL in `404-urls.csv`:

1. **Search for the URL in sitemap.xml**
2. **Delete the entire `<url>...</url>` block**
3. **Save the file**

### Example - DELETE blocks like this:
```xml
<!-- DELETE THIS if URL returns 404 -->
<url>
  <loc>https://behaviorschool.com/old-page-that-doesnt-exist</loc>
  <lastmod>2025-09-02</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.75</priority>
</url>
```

### Common 404s to remove:
- Ghost CMS URLs: `/tag/*`, `/author/*`, `/ghost/*`
- Old blog posts that were deleted
- `/test/` pages
- Pages you never built

---

## Step 4: Fix Redirects (30-60 minutes)

### For EACH URL in `redirect-urls.csv`:

1. **Test where it redirects to:**
   ```bash
   curl -I https://behaviorschool.com/YOUR-URL
   ```

2. **Look for trailing slash issues:**
   - Sitemap says: `/school-bcba/`
   - But Next.js serves: `/school-bcba`
   - **Fix:** Remove trailing slash from sitemap

3. **Update sitemap to use FINAL destination URL**

### Example fixes:

#### Before (WRONG - has redirect):
```xml
<url>
  <loc>https://behaviorschool.com/school-bcba/</loc>
  <!-- Redirects to /school-bcba (no slash) -->
</url>
```

#### After (CORRECT - no redirect):
```xml
<url>
  <loc>https://behaviorschool.com/school-bcba</loc>
  <!-- Direct hit, no redirect -->
</url>
```

---

## Step 5: Add Missing Page (5 minutes)

Add `job-guide-2025` to sitemap (currently missing):

```xml
<url>
  <loc>https://behaviorschool.com/school-bcba/job-guide-2025</loc>
  <lastmod>2025-10-12</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.9</priority>
</url>
```

Insert this around line 130, near the other job-guide entries.

---

## Step 6: Verify Your Changes (10 minutes)

### Run audit script again:
```bash
./scripts/audit-sitemap-urls.sh
```

### Goal: 100% green checkmarks!
- ✅ All URLs should return 200 OK
- ❌ No 404s
- 🔀 No redirects

### Check URL count:
```bash
grep -c '<loc>' public/sitemap.xml
```
- Should be ~40-45 URLs (down from 60+)

---

## Step 7: Deploy & Submit to Google (15 minutes)

### Deploy your changes:
```bash
git add public/sitemap.xml
git commit -m "Fix sitemap: remove 404s and redirects"
git push
```

### Submit to Search Console:

1. Go to: https://search.google.com/search-console
2. Click: "Sitemaps" (left sidebar)
3. Remove old sitemap (if shown)
4. Add new sitemap URL: `https://behaviorschool.com/sitemap.xml`
5. Click "Submit"

### Request re-crawl:

1. Go to URL Inspection tool
2. Enter each important URL (school-bcba pages)
3. Click "Request Indexing"
4. Repeat for 5-10 most important pages

---

## Step 8: Expand Thin Content (This Week)

### From `crawled-not-indexed.csv`, expand these pages:

Priority pages:
1. `/school-bcba/salary-by-state` (currently 63 lines → expand to 1000+ words)
2. `/school-bcba/vs-school-based-bcba` (currently 80 lines → expand to 500+ words)

### What to add:
- Real salary data with charts/tables
- State-by-state comparison
- Cost of living adjustments
- Negotiation tips
- Benefits breakdown
- Real job posting examples
- District preferences
- Career progression paths
- FAQs with structured data
- 5+ internal links per page
- Images with alt text

### After expansion:
1. Request indexing in Search Console
2. Wait 2-4 weeks
3. Check coverage report

---

## Step 9: Fix Soft 404s (This Week)

### From `soft-404-urls.csv`:

1. Visit each of the 2 URLs
2. Check if page has substantial content
3. Options:
   - **If it should exist:** Add 500+ more words
   - **If it's an error:** Return proper 404 status
   - **If it's low-value:** Remove from sitemap

---

## Step 10: Implement Dynamic Sitemap (Next Week)

**Problem:** Manual sitemap requires updates for every new page

**Solution:** Create auto-generating sitemap

Create `src/app/sitemap.ts`:
```typescript
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://behaviorschool.com',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://behaviorschool.com/school-bcba',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    // Add all other pages here
    // Next.js will auto-generate sitemap.xml
  ]
}
```

This prevents future 404/redirect issues!

---

## Monitoring (Ongoing)

### Weekly:
- Check Search Console → Coverage
- Monitor indexed page count
- Fix any new issues immediately

### Monthly:
- Run `./scripts/audit-sitemap-urls.sh`
- Verify all URLs still work
- Check for new thin content

### Success Metrics:
- Sitemap health score: 95%+
- Indexed pages: 35+ of 40 submitted
- 404 errors: 0
- Redirects in sitemap: 0
- Crawled-not-indexed: < 3 pages

---

## Expected Timeline

| Action | Time | Impact |
|--------|------|--------|
| Clean sitemap (404s) | 1 hour | Immediate crawl budget improvement |
| Fix redirects | 1 hour | Immediate indexability improvement |
| Deploy & submit | 15 min | Tells Google to re-crawl |
| Google re-crawls | 3-7 days | Google discovers clean sitemap |
| Expand thin content | 4-8 hours | Takes 2-4 weeks to see results |
| Pages get indexed | 2-4 weeks | Should see 30+ pages indexed |

---

## Quick Reference Commands

```bash
# Run sitemap audit
./scripts/audit-sitemap-urls.sh

# Count URLs in sitemap
grep -c '<loc>' public/sitemap.xml

# View all URLs
grep '<loc>' public/sitemap.xml

# Test specific URL
curl -I https://behaviorschool.com/YOUR-URL

# Deploy changes
git add public/sitemap.xml
git commit -m "Fix sitemap indexing issues"
git push
```

---

## Need Help?

1. **Read full report:** `INDEXING_ANALYSIS_REPORT.md`
2. **Check Search Console:** https://search.google.com/search-console
3. **Test URLs:** Use audit script or curl commands
4. **Monitor progress:** Coverage report in Search Console

---

## Success Checklist

- [ ] Run audit script
- [ ] Export CSVs from Search Console (4 files)
- [ ] Remove all 404 URLs from sitemap (36 URLs)
- [ ] Fix all redirect URLs in sitemap (24 URLs)
- [ ] Add job-guide-2025 to sitemap
- [ ] Verify: audit script shows 100% success
- [ ] Deploy changes to production
- [ ] Submit sitemap to Search Console
- [ ] Request indexing for key pages
- [ ] Expand salary-by-state page
- [ ] Expand vs-school-based-bcba page
- [ ] Fix 2 soft 404 pages
- [ ] Check coverage report in 1 week
- [ ] Check indexed count in 2-4 weeks
- [ ] Celebrate when 30+ pages are indexed! 🎉

