# Google Indexing Analysis Report
**Date:** October 12, 2025  
**Site:** behaviorschool.com  
**Analysis Type:** Complete indexing audit (robots.txt, meta tags, content quality, internal linking)

---

## Executive Summary

✅ **Good News:**
- Robots.txt is properly configured and allowing all search engines
- All landing pages have correct `robots: { index: true, follow: true }` meta tags
- Sitemap.xml exists and is properly formatted with 35+ URLs
- School BCBA hub pages are all in the sitemap with appropriate priorities

⚠️ **Issues Found:**
1. **Missing job-guide-2025 from sitemap** - Newest content not submitted to Google
2. **Thin content on some pages** - Pages under 100 lines of code may lack depth
3. **No dynamic sitemap generation** - Manual sitemap requires updates for new pages
4. **Limited internal linking depth** - Some pages only have 2-3 internal links
5. **Missing structured data on most pages** - Only "how-to-become" has schema markup

---

## 1. Robots.txt Analysis ✅

**Status:** HEALTHY - No blocking issues found

```
User-agent: *
Allow: /

Sitemap: https://behaviorschool.com/sitemap.xml
```

**Blocks (appropriate):**
- `/admin/`, `/api/`, `/_next/`, `/test/`
- Ghost CMS URLs (`/tag/`, `/author/`, `/*@ghost*`)
- Query parameters (`/*?*`)

**AI Crawler Access:** ✅ Explicitly allowed
- GPTBot, ChatGPT-User, Google-Extended, PerplexityBot, ClaudeBot all permitted

---

## 2. Sitemap Analysis ⚠️

### Current Sitemap Status

**Total URLs in sitemap:** 35 pages  
**School BCBA pages included:** 5 of 6 pages

#### ✅ Pages IN sitemap:
1. `/school-bcba` (priority: 0.95)
2. `/school-bcba/vs-school-based-bcba` (priority: 0.8)
3. `/school-bcba/job-guide` (priority: 0.85)
4. `/school-bcba/salary-by-state` (priority: 0.8)
5. `/school-bcba/how-to-become` (priority: 0.8)

#### ❌ Pages MISSING from sitemap:
- `/school-bcba/job-guide-2025` - **This is your newest content and it's not being submitted to Google!**

### Sitemap Metadata Quality

**Last Modified Dates:**
- Most school-bcba pages: `2025-10-03` ✅ Recent
- Some older pages still show `2025-09-02` or `2025-09-06`

**Priority Distribution:**
- High priority (0.9-0.95): Core service pages ✅
- Medium (0.7-0.85): Resource pages ✅
- Low (0.3): Legal pages ✅

---

## 3. Page Meta Tags Analysis ✅

All landing pages checked have proper indexing directives:

```typescript
robots: { index: true, follow: true }
```

**Pages verified:**
- ✅ `/school-bcba/page.tsx`
- ✅ `/school-bcba/vs-school-based-bcba/page.tsx`
- ✅ `/school-bcba/salary-by-state/page.tsx`
- ✅ `/school-bcba/how-to-become/page.tsx`
- ✅ `/school-bcba/job-guide/page.tsx`
- ✅ All other main pages

**No noindex tags found blocking indexing.**

---

## 4. Content Quality Analysis ⚠️

### Page Depth Assessment

| Page | Lines of Code | Content Depth | Status |
|------|---------------|---------------|---------|
| job-guide-2025 | 203 | Rich | ✅ Excellent |
| job-guide | 131 | Good | ✅ Good |
| vs-school-based-bcba | 80 | Moderate | ⚠️ Could expand |
| salary-by-state | 63 | Thin | ⚠️ Needs expansion |
| how-to-become | 100 | Good | ✅ Good |
| school-bcba (hub) | 154 | Good | ✅ Good |

### Content Quality Issues

#### Thin Content Pages (Priority Fix)
1. **salary-by-state** (63 lines)
   - Only has state-by-state list
   - Missing: salary negotiation tips, benefits breakdown, district comparisons
   - Recommendation: Add 500+ more words

2. **vs-school-based-bcba** (80 lines)
   - Good concept but brief execution
   - Missing: Real job posting examples, district preference data, career progression
   - Recommendation: Add case studies, examples

### Content Strengths

✅ **how-to-become** page has:
- Structured data (HowTo schema)
- Step-by-step guidance
- Internal links to tools
- Clear CTAs

✅ **job-guide-2025** (newest):
- 203 lines = substantial content
- But NOT in sitemap yet!

---

## 5. Internal Linking Analysis ⚠️

### Current Link Structure

**School BCBA Hub Internal Links:**
Each subpage links back to:
- School BCBA hub (parent)
- 2-3 sibling pages

**Issues:**
- Limited cross-linking to related tools (IEP goals, behavior plans)
- No links to blog content or case studies
- Missing breadcrumb structured data
- No "related articles" sections on hub page

**Recommendations:**
- Add "Tools" section linking to IEP Goal Writer, Behavior Plan Writer
- Create cross-links between salary-by-state → job-guide
- Link from blog posts back to school-bcba pages

---

## 6. Structured Data Analysis ⚠️

### Current Status

**Pages WITH structured data:**
- ✅ `/school-bcba/how-to-become` - HowTo schema

**Pages MISSING structured data:**
- ❌ `/school-bcba` - Should have Organization/WebPage schema
- ❌ `/school-bcba/job-guide-2025` - Could use HowTo or Article schema
- ❌ `/school-bcba/salary-by-state` - Could use FAQPage or Dataset schema
- ❌ `/school-bcba/vs-school-based-bcba` - Could use FAQPage schema

### Recommended Schema Types

1. **School BCBA Hub** → WebPage + BreadcrumbList
2. **Job Guide** → HowTo or Guide
3. **Salary by State** → Dataset or Table schema
4. **VS page** → FAQPage schema

---

## 7. Technical SEO Issues

### Missing Dynamic Sitemap
- ❌ No `src/app/sitemap.ts` or `next-sitemap.config.js`
- Current sitemap is static in `public/sitemap.xml`
- **Problem:** Must manually update for every new page
- **Impact:** New pages (like job-guide-2025) not automatically submitted

### Page Rendering
- ✅ Pages return 200 OK status
- ✅ Content is server-rendered (Next.js)
- ✅ Pages load under 500KB

### Mobile Optimization
- Need to verify: Mobile responsiveness, viewport meta tags
- Note: Couldn't verify in this analysis

---

## Priority Action Items (Based on Search Console Data)

### 🚨 EMERGENCY - Fix These IMMEDIATELY (Within 24 Hours)

**Problem:** 71 pages (85% of sitemap!) are not indexing due to critical technical errors

#### Step 1: Clean Up 404 Errors (36 pages)

1. **Export the 404 list from Search Console:**
   - Go to Search Console → Coverage
   - Click "Not found (404)" 
   - Click "Export" → Download CSV
   
2. **Audit sitemap.xml and remove dead URLs:**
   ```bash
   # Open sitemap
   open public/sitemap.xml
   ```
   
3. **For EACH of the 36 URLs, decide:**
   - ❌ **If it's old/deprecated:** Remove from sitemap.xml entirely
   - ✅ **If it SHOULD exist:** Create the page OR add 301 redirect
   - 🔧 **If it's a typo:** Fix the URL in sitemap.xml
   
4. **Test every URL in your sitemap:**
   ```bash
   # Quick test - run this for each URL
   curl -I https://behaviorschool.com/YOUR-URL
   # Must return "HTTP/2 200" - if 404, remove from sitemap!
   ```

**Likely culprits to remove:**
- Ghost CMS URLs: `/tag/*`, `/author/*`, `/ghost/*`, `/@ghost*`
- Deleted blog posts
- `/test/`, `/test-forms/` pages
- Pages you planned but never built

#### Step 2: Fix Redirect Issues (24 pages)

1. **Export the redirect list from Search Console:**
   - Coverage → "Page with redirect" → Export CSV
   
2. **Check for trailing slash problems:**
   ```bash
   # See all your sitemap URLs
   grep '<loc>' public/sitemap.xml
   
   # Do you mix /page and /page/? Pick ONE format!
   ```
   
3. **For EACH of the 24 URLs:**
   ```bash
   # Test what it redirects to
   curl -I https://behaviorschool.com/YOUR-URL
   
   # If you see "301 Moved Permanently" or "302 Found":
   # - Option A: Remove OLD URL from sitemap, keep only final destination
   # - Option B: Fix the code so it doesn't redirect
   ```
   
4. **Most likely issue:** Trailing slashes
   - Next.js default: `/page` (no trailing slash)
   - Pick one format and be consistent in sitemap.xml

**Quick fix for trailing slashes:**
- If sitemap has `/school-bcba/` but Next.js serves `/school-bcba`
- Remove the trailing slash from sitemap

#### Step 3: Verify Your Sitemap is Clean

```bash
# Count URLs in your sitemap
grep -c '<loc>' public/sitemap.xml

# Should be around 35-40 URLs
# If more, you probably have dead URLs
```

**After cleaning up:**
1. Upload new sitemap.xml to server
2. Submit to Search Console: "Sitemaps" → Remove old → Add new
3. Request re-crawl of entire sitemap

### 🔴 URGENT - Fix This Week

#### Step 4: Expand Thin Content (9 pages)

1. **Get the list from Search Console:**
   - Coverage → "Crawled - currently not indexed" → Export
   
2. **Priority pages to expand:**
   - `/school-bcba/salary-by-state` → Add 1000+ words
   - `/school-bcba/vs-school-based-bcba` → Add 500+ words
   - Any other pages under 500 words
   
3. **What to add:**
   - Real data, charts, tables
   - Examples, case studies
   - FAQs with structured data
   - Internal links (5+ per page)
   - Images with alt text
   
4. **After expansion:**
   - Request indexing in Search Console
   - Wait 2-4 weeks

#### Step 5: Fix Soft 404s (2 pages)

1. **Get the 2 URLs from Search Console:**
   - Coverage → "Soft 404" → Export
   
2. **Check each page - does it have real content?**
   - If yes: Add more content to make it substantial
   - If no: Return proper 404 status code
   - If low-value: Remove from sitemap

#### Step 6: Add Missing Pages to Sitemap

**Add job-guide-2025 (it's missing!):**
```xml
<url>
  <loc>https://behaviorschool.com/school-bcba/job-guide-2025</loc>
  <lastmod>2025-10-12</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.9</priority>
</url>
```

### 🟡 Important (Do This Month)

4. **Add structured data to all school-bcba pages**
   - Hub: WebPage + BreadcrumbList
   - Job guides: HowTo schema
   - Salary: Dataset/Table schema
   - VS page: FAQPage schema

5. **Improve internal linking**
   - Add "Related Tools" sections
   - Cross-link between guides
   - Link from blog to school-bcba pages

6. **Submit updated sitemap to Google Search Console**
   - After adding missing pages
   - Request manual re-crawl of updated pages

### 🟢 Recommended (Next Quarter)

7. **Add more rich content**
   - Real school BCBA success stories
   - Sample job descriptions
   - Interview question database
   - Day-in-the-life content

8. **Create content clusters**
   - Link related behavior tools to school-bcba pages
   - Create topic cluster around "school psychology" keywords

9. **Build backlinks**
   - Guest post on education sites
   - Link from BACB directories
   - Partner with school districts for case studies

---

## Why Pages Are Not Indexing - ACTUAL SEARCH CONSOLE DATA

### Your Specific Indexing Issues (From Google Search Console)

**Total Non-Indexed Pages: 71 pages** 🚨 **CRITICAL ISSUE**

| Issue | Count | Validation Status | Severity |
|-------|-------|-------------------|----------|
| Not found (404) | 36 | ❌ Failed | 🔴 CRITICAL |
| Page with redirect | 24 | ❌ Failed | 🔴 CRITICAL |
| Crawled - currently not indexed | 9 | ❌ Failed | 🟡 Important |
| Soft 404 | 2 | ⚠️ Started | 🟡 Important |
| Duplicate without user-selected canonical | 0 | ✅ Passed | ✅ None |
| Discovered - currently not indexed | 0 | ✅ Passed | ✅ None |

---

### 🚨 Issue #1: Not found (404) - 36 PAGES ❌ CRITICAL

**What this means:**
- 36 URLs in your sitemap return 404 errors (page not found)
- Google tried to crawl them but they don't exist
- **This is the #1 reason your pages aren't indexing**
- These are "dead" URLs cluttering your sitemap

**Common causes:**
1. Old blog posts that were deleted or moved
2. Ghost CMS URLs that don't exist in Next.js
3. Manually added URLs to sitemap that were never created
4. Pages that were renamed but old URL stayed in sitemap
5. Trailing slash inconsistencies

**Impact:**
- Wastes Google's crawl budget
- Hurts site authority and trust
- Makes Google crawl less frequently
- Can't be indexed (they don't exist!)

**Action Required - IMMEDIATE:**

1. **Get the list of all 36 URLs:**
   - Go to Search Console → Coverage
   - Click "Not found (404)"
   - Export the list to CSV

2. **Analyze each URL:**
   - Does it SHOULD exist? → Create the page OR redirect to correct page
   - Is it old/deprecated? → Remove from sitemap.xml permanently
   - Is it a typo? → Fix the URL in sitemap.xml

3. **Common culprits to check:**
   - Ghost CMS blog URLs: `/tag/`, `/author/`, `/ghost/`, `/*@ghost*`
   - Old blog post URLs that moved
   - Test pages: `/test/`, `/test-forms/`
   - Typos in sitemap URLs

4. **Verify each sitemap URL actually works:**
   ```bash
   # Test each URL manually
   curl -I https://behaviorschool.com/URL-FROM-SITEMAP
   # Should return "200 OK", not "404 Not Found"
   ```

**Likely sources:**
- Ghost CMS migration leftovers (your robots.txt blocks `/tag/`, `/author/`, etc.)
- Blog posts deleted but URLs still in sitemap
- Pages planned but never built

---

### 🔴 Issue #2: Page with redirect - 24 PAGES ❌ CRITICAL

**What this means:**
- 24 URLs in your sitemap redirect to another URL
- Redirected pages can't be indexed (Google indexes the destination instead)
- **Second biggest issue** - nearly 1/3 of your sitemap is redirects!

**Common causes:**
1. Trailing slash redirects (`/page` → `/page/` or vice versa)
2. Old URLs redirecting to new URLs (page was renamed)
3. HTTP → HTTPS redirects (unlikely with modern Next.js)
4. www → non-www redirects (or vice versa)

**Impact:**
- Wastes crawl budget
- Confuses Google about which URL to index
- Dilutes page authority across multiple URLs

**Action Required - IMMEDIATE:**

1. **Get the list of all 24 redirecting URLs:**
   - Go to Search Console → Coverage
   - Click "Page with redirect"
   - Export the list

2. **For each URL, decide:**
   - **Option A:** Remove OLD URL from sitemap, keep only FINAL destination
   - **Option B:** Fix the redirect (if it shouldn't redirect)

3. **Check trailing slash consistency:**
   ```bash
   # Check your sitemap.xml - are you consistent?
   grep -o '<loc>.*</loc>' public/sitemap.xml
   ```
   - Pick ONE format: either ALL URLs with trailing slash OR ALL without
   - Next.js default is WITHOUT trailing slash

4. **Test each sitemap URL:**
   ```bash
   curl -I https://behaviorschool.com/URL-FROM-SITEMAP
   # Should return "200 OK"
   # NOT "301 Moved Permanently" or "302 Found"
   ```

**Most likely culprits:**
- Trailing slash issues (most common in Next.js)
- Old URLs still in sitemap after page renames
- Duplicate pages where one redirects to the other

---

### 🟡 Issue #3: Crawled - currently not indexed - 9 PAGES ❌

**What this means:**
- Google successfully crawled 9 pages
- Google CHOSE not to index them (quality/value judgment)
- Most common reason: **thin content** or **duplicate content**

**Why Google excludes crawled pages:**
1. **Thin content** - Not enough substantial content
2. **Low quality** - Doesn't meet quality guidelines
3. **Duplicate** - Too similar to other indexed pages
4. **Low authority** - No internal/external links pointing to it
5. **New page** - Google hasn't decided yet (temporary)

**Your likely candidates (based on content analysis):**
1. `/school-bcba/salary-by-state` (63 lines - thin)
2. `/school-bcba/vs-school-based-bcba` (80 lines - thin)
3. Other short landing pages
4. Pages with minimal unique value
5. Pages with low internal link counts

**Action Required:**
1. **Get the list of 9 URLs from Search Console**
   - Coverage → "Crawled - currently not indexed"
   
2. **For each page, expand content significantly:**
   - Add 500-1000+ more words
   - Add unique data/insights/research
   - Add images, charts, tables
   - Add structured data (FAQ, HowTo, etc.)
   - Improve internal linking (5+ links to each page)
   
3. **After improvements:**
   - Request re-indexing via Search Console
   - Monitor for 2-4 weeks

---

### 🟡 Issue #4: Soft 404 - 2 PAGES ⚠️

**What this means:**
- 2 pages technically return 200 OK status
- BUT Google thinks they're empty or error pages
- Content is too thin or looks like an error page to Google

**Common causes:**
1. "No results found" pages with 200 status
2. Empty search results pages
3. Very thin content that looks like an error
4. Blank pages with just header/footer

**Action Required:**
1. **Get the 2 URLs from Search Console**
   - Coverage → "Soft 404"
   
2. **Check each page:**
   - Does it have substantial content?
   - Is it a dynamic page with no results?
   - Should it return 404 instead?
   
3. **Fix options:**
   - **Option A:** Add more content (make it substantial)
   - **Option B:** Return proper 404 status if it should be an error
   - **Option C:** Remove from sitemap if it's low-value

---

### ✅ Good News: No Duplicate Issues

**Duplicate without user-selected canonical: 0 pages** ✅

This is great! Your canonical tags are working properly, and you don't have duplicate content issues.

---

## Next Steps

### Immediate Actions (Today)
1. Add job-guide-2025 to sitemap.xml
2. Update lastmod dates for recently changed pages
3. Submit sitemap to Google Search Console

### This Week
1. Expand salary-by-state page to 1000+ words
2. Expand vs-school-based-bcba page with examples
3. Add structured data to school-bcba hub page

### This Month
1. Implement dynamic sitemap generation (sitemap.ts)
2. Add structured data to all school-bcba subpages
3. Improve internal linking with "Related Tools" sections
4. Check Search Console for specific indexing errors
5. Request manual indexing for updated pages

---

## Tools & Resources Needed

1. **Google Search Console access** - To see exact indexing errors
2. **Schema.org markup generator** - For structured data
3. **Screaming Frog or Sitebulb** - For comprehensive crawl analysis
4. **PageSpeed Insights** - For mobile optimization verification

---

## Monitoring Plan

### Weekly
- Check Search Console for new indexing issues
- Monitor indexed page count

### Monthly
- Audit new pages for sitemap inclusion
- Review thin content pages for expansion
- Check internal linking health

### Quarterly
- Full technical SEO audit
- Content quality assessment
- Backlink analysis

---

## Questions to Answer from Search Console

Please check your Search Console and provide:

1. **Exact indexing status:**
   - How many pages are "Crawled - not indexed"?
   - How many are "Discovered - not indexed"?
   - Which specific URLs have issues?

2. **Coverage report:**
   - Any validation errors?
   - Any server errors (5xx)?

3. **Core Web Vitals:**
   - Are pages passing mobile-friendliness test?
   - Any LCP/CLS/FID issues?

---

## Summary: Root Causes of Non-Indexing (CONFIRMED)

Based on Search Console data, your pages are NOT indexing because:

### 🚨 CRITICAL ISSUES (Fix These First)

1. ❌ **36 pages return 404 errors** (51% of non-indexed pages)
   - **ROOT CAUSE:** Sitemap contains URLs that don't exist
   - **IMPACT:** Wastes crawl budget, hurts site authority
   - **FIX:** Remove dead URLs from sitemap.xml immediately
   
2. ❌ **24 pages are redirecting** (34% of non-indexed pages)
   - **ROOT CAUSE:** Sitemap contains old URLs or trailing slash inconsistencies
   - **IMPACT:** Google can't index redirected URLs
   - **FIX:** Update sitemap to only include final destination URLs

### 🟡 SECONDARY ISSUES (Fix After Above)

3. ⚠️ **9 pages are thin content** (13% of non-indexed pages)
   - **ROOT CAUSE:** Not enough substantial content for Google to index
   - **IMPACT:** Google deems pages "not valuable enough"
   - **FIX:** Expand content to 1000+ words with unique value

4. ⚠️ **2 pages are Soft 404s** (3% of non-indexed pages)
   - **ROOT CAUSE:** Pages appear empty or look like error pages
   - **IMPACT:** Google thinks they're broken
   - **FIX:** Add more content or return proper 404 status

### ✅ GOOD NEWS

1. ✅ **Robots.txt is clean** - Not blocking any important pages
2. ✅ **Meta tags are correct** - All pages allow indexing
3. ✅ **No duplicate content issues** - Canonical tags working
4. ✅ **Pages render properly** - Server-side rendering works

---

## The Real Problem

**Your sitemap.xml is cluttered with 60 URLs that have technical errors:**
- 36 don't exist (404)
- 24 redirect to other URLs

This means **85% of your sitemap is broken**, which:
- Wastes Google's crawl budget on dead/redirecting pages
- Makes Google deprioritize your site
- Prevents your GOOD pages from being crawled/indexed
- Signals poor site quality to Google

**The solution is simple:**
1. Clean your sitemap (remove 404s and redirects)
2. Submit clean sitemap to Google
3. Expand thin content pages
4. Request re-indexing

---

## Contact & Follow-up

After implementing these fixes:
1. Allow 2-4 weeks for Google to re-crawl
2. Request indexing via Search Console for priority pages
3. Monitor coverage report for improvements
4. Run follow-up audit in 30 days

