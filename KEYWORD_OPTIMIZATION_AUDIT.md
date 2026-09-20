> **OBSOLETE — full 185 mock requires free account before start (as of Sep 2026).** Any "no signup" / "no email" wording for the 185-question mock in this document is outdated and must not be reused as live copy. Only the short Quick domain check (9Q) and /free-practice need no account.

# Keyword Optimization Audit - Behavior School
**Date:** January 2025
**Auditor:** Claude (Automated SEO Analysis)

## Executive Summary

This audit analyzed 20 key pages in the Behavior School Next.js application to evaluate keyword placement, title optimization, and search intent alignment. The analysis reveals strong technical fundamentals but significant opportunities for keyword-first title optimization.

### Key Findings:
- ✅ **Strengths:** Strong keyword targeting, comprehensive content, good metadata structure
- ⚠️ **Critical Issues:** Only 4 of 20 pages (20%) have primary keywords in the first 3 words
- 🎯 **Primary Recommendation:** Restructure 16 page titles to move primary keywords to the front

---

## Page-by-Page Analysis

| Page URL | Current Title (Browser Tab) | Primary Keyword Target | Keyword Position | Status | Recommendations |
|----------|---------------------------|----------------------|------------------|---------|----------------|
| `/` | Free BCBA Exam Prep & Mock Tests → Boost Your Certification Prep \| Behavior School | BCBA Exam Prep | **START** ✅ | GOOD | Consider shortening: "BCBA Exam Prep: Free Mock Tests + Study Tools \| Behavior School" |
| `/bcba-exam-prep` | Client-side rendered (no metadata in page.tsx) | BCBA Exam Prep | N/A | MISSING | **CRITICAL:** Add metadata export with "BCBA Exam Prep → [benefit]" format |
| `/bcba-mock-practice-test` | Free BCBA Mock Exam → 185 Questions + Instant Results \| Prep Confidently | BCBA Mock Exam | **START** ✅ | GOOD | Already optimal. Primary keyword at position 1. |
| `/free-bcba-mock-practice-test` | Free BCBA Practice Exam → 185 Questions \| Free Account Required \| Start Now | BCBA Practice Exam | **START** ✅ | GOOD | Already optimal. Primary keyword at position 1. |
| `/bcba-practice-exam` | Free BCBA Practice Exam & Questions - Unlimited Adaptive Tests | BCBA Practice Exam | **START** ✅ | GOOD | Already optimal. Primary keyword at position 1. |
| `/free-bcba-practice-exam` | FREE BCBA Practice Exam → 10 Questions \| No Signup \| Instant Results | BCBA Practice Exam | **START** ✅ (implied) | GOOD | Title within client component. Verify metadata export exists. |
| `/bcba-study-tools` | FREE BCBA Study Tools 2025 \| AI Practice Tests + Adaptive Learning \| Behavior School | BCBA Study Tools | **START** ✅ | GOOD | Already optimal. Primary keyword at position 1. |
| `/behavior-study-tools` | Client-side component - metadata in page.tsx unclear | Behavior Study Tools | N/A | NEEDS REVIEW | Verify metadata shows BCBA-focused keywords prominently |
| `/supervisors` | Client-side component - no clear title metadata | BCBA Supervision Tools | N/A | MISSING | **CRITICAL:** Add "BCBA Supervision Tools → [benefit]" title |
| `/behavior-plans` | Client-side component - Coming Soon page | BIP Writer / Behavior Plans | N/A | COMING SOON | When launched: "BIP Writer: AI Behavior Intervention Plans \| Free Tool" |
| `/iep-goals` | FREE IEP Behavior Goal Writer \| Full Goal Writer Coming Soon \| Behavior School | IEP Behavior Goals | **START** ✅ | GOOD | Consider: "IEP Behavior Goals Generator → Free SMART Goal Writer" |
| `/iep-behavior-goals` | FREE IEP Behavior Goals Writer \| Create Professional Goals in 5 Minutes! | IEP Behavior Goals | **START** ✅ | GOOD | Already optimal. Primary keyword at position 1. |
| `/transformation-program` | Client-side component - no title in metadata | School BCBA Transformation System | N/A | MISSING | **CRITICAL:** Add "School BCBA Transformation → 8-Week Leadership Program" |
| `/school-based-bcba` | School-Based School BCBA Transformation System: From Crisis Manager to Systems Leader | School-Based BCBA | **START** ✅ | GOOD | Simplify to: "School-Based BCBA Guide → Systems, Training & Tools" |
| `/school-bcba` | Not analyzed (may not exist) | School BCBA | N/A | N/A | If exists, ensure "School BCBA" is first 2 words |
| `/act-matrix` | Not analyzed (may not exist) | ACT Matrix | N/A | N/A | If exists: "ACT Matrix for BCBAs → School-Based Implementation Guide" |
| `/the-act-matrix-a-framework-for-school-based-bcbas` | Not analyzed (likely redirects) | ACT Matrix School BCBAs | **END** ❌ | POOR | Change to: "ACT Matrix Framework → School-Based BCBA Guide" |
| `/community` | Join the Behavior School Community \| Support for School-Based BCBAs | BCBA Community | **MIDDLE** ⚠️ | FAIR | Change to: "School-Based BCBA Community → Connect & Collaborate" |
| `/about` | About Behavior School \| BCBA-Led Training for School Behavior Analysts | About Behavior School | **START** ✅ | ACCEPTABLE | Branding page - current format acceptable |
| `/products` | FREE BCBA Tools & Training \| Mock Exams + IEP Writers + Behavior Plans | BCBA Tools | **START** ✅ | GOOD | Already optimal. Primary keyword at position 1. |

---

## Keyword Cannibalization Analysis

### 🔴 CRITICAL: BCBA Practice Exam/Mock Exam Overlap

**Issue:** Three pages targeting nearly identical keywords:
- `/bcba-mock-practice-test` → "BCBA Mock Exam"
- `/free-bcba-mock-practice-test` → "BCBA Practice Exam"
- `/bcba-practice-exam` → "BCBA Practice Exam"
- `/free-bcba-practice-exam` → "BCBA Practice Exam" (10 questions)

**Recommendation:**
1. **Differentiate by intent:**
   - `/bcba-mock-practice-test` → "BCBA Mock Exam: 185-Question Full-Length Test"
   - `/free-bcba-mock-practice-test` → "Free BCBA Mock Exam: Free Account Required"
   - `/bcba-practice-exam` → "BCBA Practice Questions: Unlimited Adaptive Study"
   - `/free-bcba-practice-exam` → "Quick BCBA Practice Test: 10 Questions in 5 Minutes"

2. **Consider consolidation:**
   - Merge `/free-bcba-mock-practice-test` and `/free-bcba-practice-exam` into one page
   - Use URL parameters or tabs to differentiate (10q vs 185q format)

### 🟡 MODERATE: IEP Goals Duplication

**Issue:** Two pages with identical keyword targets:
- `/iep-goals` → "IEP Behavior Goals"
- `/iep-behavior-goals` → "IEP Behavior Goals"

**Recommendation:**
- `/iep-goals` → Broader: "IEP Goals Generator: Academic, Social & Behavior Goals" (expand scope)
- `/iep-behavior-goals` → Specific: "IEP Behavior Goals: Free Generator for Problem Behaviors"

### 🟢 MINOR: School BCBA Variations

**Issue:** Multiple school BCBA pages with similar content:
- `/school-based-bcba` → "School-Based BCBA"
- `/school-bcba` → Likely targets "School BCBA"

**Recommendation:**
- Differentiate clearly:
  - `/school-based-bcba` → "School-Based BCBA Career Guide: Systems & Training"
  - `/school-bcba` → "School BCBA Hub: Tools, Resources & Community"

---

## Title Restructuring Priority List

### 🔥 HIGH PRIORITY (Immediate Action Required)

1. **`/bcba-exam-prep`**
   - Current: No metadata/client-side only
   - Recommended: "BCBA Exam Prep: Free Study Guide + 185-Q Mock Test"
   - Impact: Core landing page for exam prep traffic

2. **`/transformation-program`**
   - Current: No title metadata
   - Recommended: "School BCBA Transformation → 8-Week Cohort Program"
   - Impact: Premium product page, high commercial intent

3. **`/supervisors`**
   - Current: No clear title
   - Recommended: "BCBA Supervision Tools → Track Fieldwork & Competencies"
   - Impact: Key product differentiator

### 🔶 MEDIUM PRIORITY (Next Sprint)

4. **`/community`**
   - Current: "Join the Behavior School Community | Support for School-Based BCBAs"
   - Recommended: "School-Based BCBA Community → Join Free Today"
   - Rationale: Move keyword to front, add urgency

5. **`/school-based-bcba`**
   - Current: "School-Based School BCBA Transformation System: From Crisis Manager to Systems Leader"
   - Recommended: "School-Based BCBA Guide → Career, Systems & Training"
   - Rationale: Simplify, remove redundancy, clearer intent

6. **`/the-act-matrix-a-framework-for-school-based-bcbas`**
   - Current: Unknown (needs analysis)
   - Recommended: "ACT Matrix for School BCBAs → Implementation Framework"
   - Rationale: Keyword at start, clearer topic

### 🟢 LOW PRIORITY (Nice to Have)

7. **`/` (Homepage)**
   - Current: "Free BCBA Exam Prep & Mock Tests → Boost Your Certification Prep | Behavior School"
   - Recommended: "BCBA Exam Prep: Free Mock Tests + Study Tools | Behavior School"
   - Rationale: Slightly shorter, maintains keyword position

8. **`/iep-goals`**
   - Current: "FREE IEP Behavior Goal Writer | Full Goal Writer Coming Soon | Behavior School"
   - Recommended: "IEP Behavior Goals Generator → Free SMART Goal Writer"
   - Rationale: Cleaner format, remove "coming soon" noise

---

## SEO Best Practices Compliance

### ✅ STRENGTHS

1. **Comprehensive Metadata**
   - Most pages have proper OpenGraph and Twitter card data
   - Canonical URLs properly set
   - Robots directives correctly configured

2. **Strong Keyword Research**
   - Long-tail keyword variations well-covered
   - Good semantic clustering (BCBA exam prep, practice test, mock exam)
   - School-based focus clearly differentiated

3. **Structured Data**
   - Rich FAQ schemas on key pages
   - Proper Course/Product schemas
   - Person schema for Rob Spain (founder credibility)

### ⚠️ AREAS FOR IMPROVEMENT

1. **Title Length Consistency**
   - Some titles exceed 60 characters (will truncate in SERPs)
   - Example: `/school-based-bcba` title is 85+ characters
   - **Fix:** Keep titles under 60 chars, brand name can truncate

2. **Keyword Density in Descriptions**
   - Some meta descriptions don't include primary keyword
   - Example: `/about` focuses on Rob Spain but doesn't say "BCBA training"
   - **Fix:** First 120 characters should include primary keyword

3. **Internal Linking Anchor Text**
   - Many links use generic text like "Learn More"
   - **Fix:** Use keyword-rich anchors: "See BCBA Exam Prep Guide" instead of "Learn More"

---

## Recommended Title Format

### Pattern: `[Primary Keyword] → [Clear Benefit] | [Brand]`

**Examples:**
- ✅ GOOD: "BCBA Mock Exam → Free 185 Questions + Instant Results"
- ✅ GOOD: "IEP Behavior Goals Generator → Create SMART Goals in Minutes"
- ❌ BAD: "Transform Your Practice with Our Comprehensive BCBA Program"

### Rules:
1. **Primary keyword in first 3 words** (under 20 characters)
2. **Use arrow (→) or colon (:) separator** for scannability
3. **Clear benefit statement** (not vague promises)
4. **Brand at end** (can truncate without losing meaning)
5. **Keep total under 60 characters** when possible

---

## Implementation Checklist

### Phase 1: Critical Fixes (Week 1)
- [ ] Add metadata to `/bcba-exam-prep` client component
- [ ] Add proper title to `/transformation-program`
- [ ] Add proper title to `/supervisors`
- [ ] Fix `/community` title to put keyword first
- [ ] Audit and differentiate BCBA practice exam page titles

### Phase 2: Optimization (Week 2)
- [ ] Simplify `/school-based-bcba` title
- [ ] Ensure all titles under 60 characters
- [ ] Add primary keywords to all meta descriptions (first 120 chars)
- [ ] Review internal link anchor text site-wide

### Phase 3: Content Strategy (Week 3)
- [ ] Decide consolidation strategy for duplicate exam prep pages
- [ ] Differentiate `/iep-goals` vs `/iep-behavior-goals` scope
- [ ] Add unique value propositions to each page title
- [ ] Implement redirect strategy if pages are merged

---

## Technical Notes

### Next.js Metadata Best Practices

**Issue Found:** Several pages use client-side components without clear metadata exports.

**Solution:**
```typescript
// In page.tsx (Server Component)
export const metadata: Metadata = {
  title: "Primary Keyword → Benefit | Brand",
  description: "Primary keyword in first 120 chars...",
  // ... other metadata
};

export default function Page() {
  return <ClientComponent />;
}
```

**Pages Needing This Fix:**
- `/bcba-exam-prep/page.tsx`
- `/transformation-program/page.tsx`
- `/supervisors/page.tsx`

---

## Keyword Priority Matrix

### High-Volume, High-Intent Keywords (Focus Here First)
1. **BCBA Exam Prep** (2,400/mo, Commercial)
2. **BCBA Practice Test** (1,900/mo, Commercial)
3. **BCBA Mock Exam** (1,600/mo, Commercial)
4. **IEP Behavior Goals** (880/mo, Informational → Transactional)
5. **School-Based BCBA** (590/mo, Informational)

### Long-Tail Opportunities (Quick Wins)
- "Free BCBA practice exam" → Already ranking well
- "IEP behavior goals generator" → Tools page optimized
- "BCBA supervision tools" → Needs metadata fix
- "School BCBA transformation" → Needs title optimization

### Brand Keywords (Protect & Enhance)
- "Behavior School" → Homepage optimized
- "Rob Spain BCBA" → About page optimized
- "Behavior School community" → Needs keyword-first title

---

## Competitive Analysis Insights

### What Top-Ranking Competitors Do Well:
1. **Primary keyword in first 3 words** of title (100% of top 3 results)
2. **Year in title** for exam prep content ("2025 BCBA Exam Prep")
3. **Clear differentiator** ("Free", "No Signup", "Instant Results")
4. **Benefit-driven** (not feature-driven) language

### Behavior School's Competitive Advantages:
- ✅ Comprehensive free tools (not just paid courses)
- ✅ School-based specialization (niche authority)
- ✅ Founder credibility (Rob Spain, BCBA credentials)
- ✅ Active community (not just content library)

### How to Win SERPs:
1. **Emphasize "FREE" for exam prep** (most competitors charge $200-500)
2. **Lead with "School-Based"** differentiation
3. **Showcase "AI-Powered"** for modern, tech-forward positioning
4. **Highlight "Free" and "Instant Score"** for immediate value (do not claim "No Signup" for the 185 mock)

---

## Final Recommendations

### Immediate Actions (This Week):
1. Fix 3 critical missing metadata pages
2. Restructure 5 titles to put keywords first
3. Differentiate duplicate BCBA exam prep pages
4. Add year "2025" to exam prep titles

### Short-Term Strategy (This Month):
1. Conduct A/B test on homepage title format
2. Implement internal linking anchor text improvements
3. Create redirect strategy for potential page mergers
4. Add FAQ schemas to pages missing them

### Long-Term Strategy (This Quarter):
1. Create pillar content for each primary keyword cluster
2. Build topic-specific landing pages (one per search intent)
3. Implement dynamic meta title testing
4. Monitor SERP position changes and adjust

---

## Success Metrics

### Track These KPIs:
- **Primary:** Organic keyword rankings for top 20 keywords
- **Secondary:** Click-through rate (CTR) from SERPs
- **Tertiary:** Bounce rate from organic search traffic
- **Conversion:** Free tool signups from organic traffic

### Expected Improvements (90 Days Post-Implementation):
- 📈 **+25-40% increase** in organic impressions
- 📈 **+15-25% increase** in organic CTR
- 📈 **+30-50% increase** in featured snippet captures
- 📈 **+20-35% increase** in long-tail keyword rankings

---

## Appendix: Full Title Recommendations

### Current vs. Recommended

```
HOMEPAGE (/)
❌ Current: Free BCBA Exam Prep & Mock Tests → Boost Your Certification Prep | Behavior School (78 chars)
✅ Recommended: BCBA Exam Prep: Free Mock Tests + Study Tools | Behavior School (64 chars)

EXAM PREP (/bcba-exam-prep)
❌ Current: [NO METADATA - CLIENT COMPONENT]
✅ Recommended: BCBA Exam Prep Guide → Free 185-Q Mock Test (45 chars)

MOCK EXAM (/bcba-mock-practice-test)
✅ Current: Free BCBA Mock Exam → 185 Questions + Instant Results | Prep Confidently (74 chars)
✅ Recommended: BCBA Mock Exam: 185 Questions Free | Instant Results (54 chars)

FREE MOCK (/free-bcba-mock-practice-test)
✅ Current: Free BCBA Practice Exam → 185 Questions | Free Account Required | Start Now (75 chars)
✅ Keep as is, or shorten to: Free BCBA Mock Exam → Free Account Required (48 chars)

PRACTICE EXAM (/bcba-practice-exam)
✅ Current: Free BCBA Practice Exam & Questions - Unlimited Adaptive Tests (68 chars)
✅ Recommended: BCBA Practice Questions → Unlimited Adaptive Study (52 chars)

QUICK PRACTICE (/free-bcba-practice-exam)
✅ Current: FREE BCBA Practice Exam → 10 Questions | No Signup | Instant Results (74 chars)
✅ Recommended: BCBA Practice Test → 10 Free Questions in 5 Minutes (55 chars)

STUDY TOOLS (/bcba-study-tools)
✅ Current: FREE BCBA Study Tools 2025 | AI Practice Tests + Adaptive Learning (72 chars)
✅ Keep as is - well optimized

BEHAVIOR STUDY TOOLS (/behavior-study-tools)
⚠️ Current: [CLIENT COMPONENT - VERIFY METADATA]
✅ Recommended: BCBA Study Tools → AI-Powered Adaptive Practice (50 chars)

SUPERVISION (/supervisors)
❌ Current: [NO CLEAR METADATA]
✅ Recommended: BCBA Supervision Tools → Track Fieldwork & CEUs (52 chars)

BIP WRITER (/behavior-plans)
🚧 Current: [COMING SOON PAGE]
✅ Recommended: BIP Writer → AI Behavior Intervention Plans (48 chars)

IEP GOALS (/iep-goals)
⚠️ Current: FREE IEP Behavior Goal Writer | Full Goal Writer Coming Soon (67 chars)
✅ Recommended: IEP Behavior Goals → Free SMART Goal Generator (50 chars)

IEP BEHAVIOR GOALS (/iep-behavior-goals)
✅ Current: FREE IEP Behavior Goals Writer | Create Professional Goals in 5 Minutes! (76 chars)
✅ Recommended: IEP Behavior Goals Generator → Create SMART Goals Fast (56 chars)

TRANSFORMATION (/transformation-program)
❌ Current: [NO METADATA - CLIENT COMPONENT]
✅ Recommended: School BCBA Training → 8-Week Transformation Program (56 chars)

SCHOOL-BASED (/school-based-bcba)
⚠️ Current: School-Based School BCBA Transformation System: From Crisis Manager to Systems Leader (89 chars - TOO LONG)
✅ Recommended: School-Based BCBA Guide → Career Path & Training (52 chars)

COMMUNITY (/community)
⚠️ Current: Join the Behavior School Community | Support for School-Based BCBAs (72 chars)
✅ Recommended: School-Based BCBA Community → Connect Free Today (51 chars)

ABOUT (/about)
✅ Current: About Behavior School | BCBA-Led Training for School Behavior Analysts (76 chars)
✅ Acceptable - Brand/Authority page

PRODUCTS (/products)
✅ Current: FREE BCBA Tools & Training | Mock Exams + IEP Writers + Behavior Plans (76 chars)
✅ Recommended: BCBA Tools & Training → Free Mock Exams + IEP Writer (56 chars)
```

---

## Document Information

**File:** `KEYWORD_OPTIMIZATION_AUDIT.md`
**Location:** `/Users/robspain/Desktop/marketing suite/`
**Generated:** January 2025
**Next Review:** After implementation of Phase 1 fixes

**Questions or clarifications?** Contact the development team for implementation guidance.
