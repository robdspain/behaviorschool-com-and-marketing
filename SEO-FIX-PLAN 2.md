# Behaviorschool.com SEO Fix Plan
**Generated:** October 29, 2025
**Source:** Ahrefs Site Audit
**Total Issues:** 171 tracked (5 new)

---

## Executive Summary

This document provides a comprehensive, prioritized plan to resolve all SEO issues identified in the Ahrefs site audit. Issues are organized by severity and grouped by category for efficient remediation.

### Priority Levels
- 🔴 **CRITICAL** - Immediate action required (affects indexing, user experience)
- 🟠 **HIGH** - Address within 1 week (affects SEO performance)
- 🟡 **MEDIUM** - Address within 2 weeks (affects optimization)
- 🟢 **LOW** - Address as time permits (minor improvements)

---

## Phase 1: Critical Issues (Fix Immediately)

### 🔴 1.1 Broken Images (33 total issues)
**Impact:** Broken user experience, poor Core Web Vitals, negative SEO signals

#### Issues:
- Page has broken image: **13 pages** (12 new)
- Image broken: **7 images** (6 new)
- Image file size too large: **1 image** (NEW)
- Missing alt text: **12 images** (5 new)

#### Action Items:
1. **Identify all broken images:**
   ```bash
   # Export broken image list from Ahrefs
   # Review pages with broken images
   ```

2. **Fix broken image sources:**
   - Check if images exist in correct paths
   - Update image URLs in components/pages
   - Replace missing images with alternatives
   - Verify external image URLs are valid

3. **Optimize large images:**
   - Convert to WebP format (target: <100KB for thumbnails, <500KB for full images)
   - Use proper Next.js Image component with optimization
   - Implement responsive image sizes

4. **Add alt text to all images:**
   - Write descriptive, keyword-rich alt text
   - Include context for accessibility
   - Follow format: "Description | Context | Brand" (keep under 125 chars)

**Estimated Time:** 4-6 hours
**Tools:** Ahrefs export, cwebp, Next.js Image component

---

### 🔴 1.2 Indexability Issues (4 pages)
**Impact:** Pages removed from Google index = lost traffic

#### Issues:
- **Indexable page became non-indexable (NEW):** 4 pages
- Canonical points to redirect: 1 page

#### Action Items:
1. **Identify the 4 pages that became non-indexable:**
   - Export list from Ahrefs
   - Check robots.txt and meta robots tags
   - Verify canonical tags aren't pointing to redirects

2. **Restore indexability:**
   - Remove noindex tags if present
   - Fix canonical tags to point to correct URLs
   - Ensure pages aren't blocked by robots.txt
   - Submit to Google Search Console for immediate re-indexing

3. **Fix canonical pointing to redirect:**
   - Update canonical URL to final destination
   - Test with redirect checker

**Estimated Time:** 2-3 hours
**Files to Check:** `src/app/**/page.tsx`, `robots.txt`, `next.config.ts`

---

### 🔴 1.3 3XX Redirects in Sitemap (4 URLs)
**Impact:** Search engines waste crawl budget on redirects

#### Issues:
- **3XX redirect in sitemap (NEW):** 4 URLs
- 3XX redirect: 11 total (4 new)

#### Action Items:
1. **Identify redirected URLs in sitemap:**
   - Check `/public/sitemap.xml`
   - Find all URLs that return 3XX status codes

2. **Update sitemap with final destinations:**
   - Replace redirected URLs with their final destinations
   - Verify all sitemap URLs return 200 status codes

3. **Review all redirect rules:**
   - Audit `next.config.ts` redirect rules
   - Check `netlify.toml` redirects
   - Remove unnecessary redirect chains

4. **Submit updated sitemap:**
   - Submit to Google Search Console
   - Submit to Bing Webmaster Tools

**Estimated Time:** 2 hours
**Files:** `public/sitemap.xml`, `next.config.ts`, `netlify.toml`

---

## Phase 2: High Priority Issues (Fix Within 1 Week)

### 🟠 2.1 Meta Description Issues (49 pages)
**Impact:** Poor click-through rates from search results

#### Issues (Indexable):
- Meta description too long: 23 pages
- Meta description missing or empty: 4 pages
- Meta description too short: 3 pages

#### Issues (Non-indexable):
- Meta description too long: 19 pages

#### Action Items:
1. **Export all affected pages from Ahrefs**

2. **Fix meta descriptions:**
   - **Optimal length:** 150-160 characters
   - **Too long (42 pages):** Trim to 160 chars, maintain keywords
   - **Missing (4 pages):** Write compelling descriptions
   - **Too short (3 pages):** Expand with relevant keywords and benefits

3. **Meta description formula:**
   ```
   [Value Proposition] + [Key Benefit] + [Call to Action] + [Brand]
   Example: "Generate compliant IEP behavior goals in 5 minutes. Free tool for BCBAs and teachers. No signup required - start creating now! | Behavior School"
   ```

4. **Update page metadata:**
   - Edit `src/app/**/page.tsx` files
   - Update metadata.description fields
   - Test in Google SERP Simulator

**Estimated Time:** 6-8 hours
**Target:** All descriptions 150-160 characters, unique, compelling

---

### 🟠 2.2 Title Tag Issues (28 pages)
**Impact:** Poor rankings, low CTR, missed keyword opportunities

#### Issues (Indexable):
- Title too long: 10 pages
- Title too short: 1 page
- Page and SERP titles do not match: 3 pages

#### Issues (Non-indexable):
- Title too long: 17 pages

#### Action Items:
1. **Fix title lengths:**
   - **Optimal length:** 50-60 characters (max 70)
   - **Too long (27 pages):** Shorten while keeping primary keywords
   - **Too short (1 page):** Expand with relevant modifiers

2. **Title tag formula:**
   ```
   [Primary Keyword] | [Modifier/Benefit] | [Brand]
   Example: "IEP Behavior Goals Generator | Free Tool | Behavior School"
   ```

3. **Fix SERP title mismatches:**
   - Ensure `<title>` matches metadata.title in Next.js
   - Verify no external scripts are modifying titles
   - Check that canonical URLs are correct

4. **Update all title tags:**
   - Edit metadata.title in page.tsx files
   - Include primary keywords at the start
   - Add year where relevant (2025)
   - Test in Google SERP Preview

**Estimated Time:** 4-5 hours
**Files:** `src/app/**/page.tsx`

---

### 🟠 2.3 Missing H1 Tags (6 pages)
**Impact:** Poor content structure, missed SEO opportunities

#### Issues:
- H1 tag missing or empty: 6 pages
- Multiple H1 tags (non-indexable): 1 page

#### Action Items:
1. **Identify pages without H1:**
   - Export from Ahrefs
   - Manually check each page

2. **Add H1 tags:**
   - Every page must have exactly ONE H1
   - H1 should match or closely relate to title tag
   - Place H1 near top of page content
   - Make it descriptive and keyword-rich

3. **Fix multiple H1 issue:**
   - Find page with multiple H1s
   - Change additional H1s to H2 or H3

4. **H1 best practices:**
   ```jsx
   <h1 className="text-4xl font-bold text-slate-900">
     Primary Page Topic with Keywords
   </h1>
   ```

**Estimated Time:** 2-3 hours
**Files:** Various `page.tsx` and component files

---

### 🟠 2.4 Page Speed Optimization (9 pages)
**Impact:** Poor Core Web Vitals, reduced rankings, high bounce rate

#### Issues:
- Slow page: 9 pages (2 new)

#### Action Items:
1. **Identify slow pages:**
   - Export from Ahrefs
   - Test each in PageSpeed Insights
   - Measure LCP, FID, CLS

2. **Common fixes:**
   - Convert all images to WebP
   - Implement lazy loading
   - Minimize JavaScript bundles
   - Use Next.js dynamic imports for heavy components
   - Optimize fonts (preload, font-display: swap)
   - Minimize CSS (remove unused styles)

3. **Next.js optimizations:**
   ```typescript
   // Implement dynamic imports for heavy components
   const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'), {
     loading: () => <Skeleton />,
     ssr: false
   });

   // Optimize images
   <Image
     src="/image.webp"
     alt="Description"
     width={800}
     height={600}
     loading="lazy"
     quality={85}
   />
   ```

4. **Test and measure:**
   - Target: LCP < 2.5s, FID < 100ms, CLS < 0.1
   - Use Lighthouse CI for automated testing

**Estimated Time:** 8-10 hours
**Tools:** PageSpeed Insights, Lighthouse, Next.js Image optimization

---

### 🟠 2.5 Open Graph Issues (16 pages)
**Impact:** Poor social media sharing appearance, reduced click-through

#### Issues:
- Open Graph tags incomplete: 11 pages
- Open Graph URL not matching canonical: 5 pages

#### Action Items:
1. **Complete Open Graph tags for 11 pages:**
   - Required: og:title, og:description, og:image, og:url, og:type
   - Optimal image size: 1200x630px (WebP format)

2. **Fix OG URL mismatches:**
   - Ensure og:url matches canonical URL exactly
   - Check for http vs https mismatches
   - Verify trailing slash consistency

3. **Update metadata in page.tsx files:**
   ```typescript
   export const metadata: Metadata = {
     title: "Page Title",
     description: "Page description",
     openGraph: {
       title: "Page Title",
       description: "Page description",
       type: "website",
       url: "https://behaviorschool.com/page-url",
       images: [
         {
           url: "https://behaviorschool.com/og-image.webp",
           width: 1200,
           height: 630,
           alt: "Image description"
         }
       ]
     }
   };
   ```

4. **Test social sharing:**
   - Use Facebook Debugger
   - Use Twitter Card Validator
   - Use LinkedIn Post Inspector

**Estimated Time:** 3-4 hours
**Files:** `src/app/**/page.tsx`

---

## Phase 3: Medium Priority Issues (Fix Within 2 Weeks)

### 🟡 3.1 Link Issues
**Impact:** Crawl inefficiency, poor link equity distribution

#### Issues (Indexable):
- Page has no outgoing links: 2 pages
- Page has links to redirect: 5 pages
- Page has only one dofollow incoming internal link: 4 pages

#### Issues (Non-indexable):
- Page has no outgoing links: 11 pages
- HTTPS page has internal links to HTTP: 4 pages
- Page has links to redirect: 4 pages
- Redirected page has no incoming internal links (NEW): 1 page

#### Action Items:
1. **Add outgoing links to isolated pages:**
   - Add contextual links to related content
   - Link to relevant product/service pages
   - Add footer navigation
   - Minimum: 3-5 internal links per page

2. **Fix links to redirects:**
   - Update all internal links to point directly to final destinations
   - Search codebase for hardcoded redirect URLs
   - Update navigation components

3. **Fix HTTP links on HTTPS pages:**
   - Search for `http://` in codebase
   - Replace with `https://`
   - Use relative URLs where possible

4. **Improve internal linking:**
   - Add breadcrumbs to all pages
   - Implement related content sections
   - Add contextual links in content

**Estimated Time:** 4-6 hours
**Tools:** VS Code global search, Link checker

---

### 🟡 3.2 Low Word Count (13 pages)
**Impact:** Thin content, poor rankings for target keywords

#### Issues:
- Low word count (indexable): 2 pages
- Low word count (non-indexable): 11 pages

#### Action Items:
1. **Identify pages with low word count:**
   - Target: Minimum 300 words for utility pages, 800+ for content pages

2. **Expand content strategically:**
   - Add FAQs sections
   - Include detailed explanations
   - Add use cases and examples
   - Include relevant statistics and research
   - Add call-to-action sections

3. **For non-indexable pages:**
   - Evaluate if these should be indexable
   - If utility pages, consider adding educational content
   - If truly thin, consider noindex status

**Estimated Time:** 6-8 hours
**Target:** 300+ words minimum per page

---

### 🟡 3.3 Sitemap Issues (15 pages)
**Impact:** Missed indexing opportunities, crawl inefficiency

#### Issues:
- Indexable page not in sitemap: 14 pages
- Non-canonical page in sitemap: 1 page

#### Action Items:
1. **Add missing indexable pages to sitemap:**
   - Identify 14 missing pages from Ahrefs
   - Add URLs to `/public/sitemap.xml`
   - Ensure all important pages are included

2. **Remove non-canonical page:**
   - Find the non-canonical URL
   - Remove from sitemap
   - Verify canonical tag is correct

3. **Sitemap best practices:**
   - Only include indexable, canonical URLs
   - Include lastmod dates
   - Set appropriate priorities
   - Submit updated sitemap to search engines

4. **Consider dynamic sitemap generation:**
   ```typescript
   // src/app/sitemap.ts
   export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
     // Dynamically generate from your pages/data
   }
   ```

**Estimated Time:** 3-4 hours
**Files:** `public/sitemap.xml` or `src/app/sitemap.ts`

---

### 🟡 3.4 Redirect Optimization
**Impact:** Slow page loads, wasted crawl budget

#### Issues:
- HTTP to HTTPS redirect: 4 pages
- Redirect chain: 1 page

#### Action Items:
1. **Eliminate redirect chains:**
   - Identify chain: A → B → C
   - Update A to point directly to C
   - Test all redirect paths

2. **Ensure canonical HTTPS URLs:**
   - Update all internal links to use https://
   - Update external backlinks where possible
   - Verify HSTS headers are set

3. **Audit next.config.ts redirects:**
   - Consolidate redundant rules
   - Ensure redirects are necessary
   - Document purpose of each redirect

**Estimated Time:** 2-3 hours
**Files:** `next.config.ts`, `netlify.toml`

---

## Phase 4: Low Priority Issues (Fix as Time Permits)

### 🟢 4.1 Noindex/Nofollow Pages (24 pages)
**Status:** Review to ensure these are intentionally blocked

#### Issues:
- Nofollow page: 8
- Noindex page: 8
- Noindex and nofollow page: 8

#### Action Items:
1. **Audit each non-indexable page:**
   - Verify it should be blocked from search
   - Common legitimate noindex pages: thank you pages, internal tools, admin sections

2. **Update if needed:**
   - Remove noindex if page should be indexed
   - Keep noindex for utility/transactional pages

**Estimated Time:** 2 hours

---

### 🟢 4.2 Structured Data Validation (60 issues)
**Impact:** Missing rich snippets, reduced SERP features

#### Issues:
- Structured data has schema.org validation error: 46
- Structured data has Google rich results validation error: 14

#### Action Items:
1. **Test structured data:**
   - Use Google Rich Results Test
   - Use Schema.org validator
   - Check each page with structured data

2. **Common fixes:**
   - Fix missing required fields
   - Correct property names/values
   - Update to latest schema.org vocabulary
   - Validate JSON-LD syntax

3. **Priority schemas to implement/fix:**
   - Article/BlogPosting
   - FAQ
   - Product
   - Organization
   - BreadcrumbList
   - WebPage

**Estimated Time:** 6-8 hours
**Tools:** Google Rich Results Test, Schema.org validator

---

### 🟢 4.3 IndexNow Submission (8 pages)
**Impact:** Faster discovery by search engines

#### Issues:
- Pages to submit to IndexNow (NEW): 8

#### Action Items:
1. **Set up IndexNow integration:**
   - Get API key from IndexNow
   - Implement automatic submission on page updates

2. **Submit 8 new/updated pages:**
   - Use IndexNow API
   - Submit to Bing and Yandex

**Estimated Time:** 2 hours
**Tools:** IndexNow API

---

## Implementation Checklist

### Week 1: Critical Issues
- [ ] Fix all 13 broken images
- [ ] Add alt text to 12 images
- [ ] Optimize 1 large image file
- [ ] Restore indexability to 4 pages
- [ ] Fix canonical pointing to redirect
- [ ] Update sitemap to remove 4 redirected URLs
- [ ] Submit updated sitemap to search engines

### Week 2: High Priority
- [ ] Fix 49 meta description issues
- [ ] Fix 28 title tag issues
- [ ] Add H1 tags to 6 pages
- [ ] Fix multiple H1 issue
- [ ] Complete Open Graph tags for 11 pages
- [ ] Fix 5 OG URL mismatches

### Week 3: High Priority (Continued)
- [ ] Optimize 9 slow pages
- [ ] Convert remaining images to WebP
- [ ] Implement lazy loading
- [ ] Reduce JavaScript bundle size

### Week 4: Medium Priority
- [ ] Fix all link issues (29 total)
- [ ] Expand content on 13 low word count pages
- [ ] Add 14 missing pages to sitemap
- [ ] Remove 1 non-canonical page from sitemap
- [ ] Eliminate redirect chain
- [ ] Fix 4 HTTP to HTTPS redirects

### Ongoing: Low Priority
- [ ] Review 24 noindex/nofollow pages
- [ ] Fix 60 structured data errors
- [ ] Set up IndexNow integration
- [ ] Submit 8 pages to IndexNow

---

## Testing & Validation

After each phase, perform these checks:

1. **Crawl test:** Re-run Ahrefs audit to verify fixes
2. **Manual checks:**
   - Test pages in browser
   - Verify images load correctly
   - Check mobile responsiveness
   - Test page speed with Lighthouse
3. **Search Console:** Monitor for indexing issues
4. **Social sharing:** Test OG tags with social media debuggers

---

## Success Metrics

Track these KPIs to measure improvement:

- **Ahrefs Health Score:** Target 90+ (currently showing 171 issues)
- **Indexable pages:** Maintain or grow indexed page count
- **Core Web Vitals:** All pages pass LCP, FID, CLS thresholds
- **Broken images:** 0
- **Redirect chains:** 0
- **Pages in sitemap:** 100% coverage of indexable pages
- **Meta completeness:** 100% of pages have optimized titles and descriptions

---

## Notes

- **Backup before making changes:** Git commit before each phase
- **Test incrementally:** Don't fix everything at once
- **Monitor rankings:** Track keyword positions during fixes
- **Document changes:** Update this plan as you complete tasks
- **Re-audit weekly:** Schedule weekly Ahrefs crawls to catch new issues

---

## Quick Win Priority List

If time is limited, focus on these high-impact, quick fixes first:

1. ✅ Fix 13 broken images (already some fixed in recent commits)
2. Fix 4 redirects in sitemap
3. Restore indexability to 4 pages
4. Add missing meta descriptions (4 pages)
5. Add missing H1 tags (6 pages)
6. Complete Open Graph tags (11 pages)
7. Add 14 pages to sitemap

**Estimated Time for Quick Wins:** 12-15 hours
**Expected Impact:** ~60-70 issues resolved

---

**Last Updated:** October 29, 2025
**Status:** Ready for implementation
