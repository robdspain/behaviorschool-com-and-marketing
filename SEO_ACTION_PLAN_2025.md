# SEO Action Plan 2025 - 4-Week Growth Sprint

**Goal**: Increase organic traffic from 40 clicks/week to 120+ clicks/week in 28 days

**Start Date**: January 2025
**Owner**: Rob Spain + Claude Code
**Tracking**: This document (update weekly)

---

## 📊 Current Baseline (Week 0)

- **Organic Clicks/Week**: ~40
- **Average CTR**: ~2-3% (estimated)
- **Top Pages**:
  - `/bcba-exam-prep`
  - `/free-bcba-practice-exam`
  - `/iep-behavior-goals`
  - `/school-bcba`
  - `/products`
- **Structured Data**: Organization, Course, FAQPage (limited pages), SoftwareApplication
- **Homepage LCP**: Need to measure (target: < 2.5s mobile)

---

## Week 1: Quick Wins - Lift CTR on Existing Impressions

### 1. Homepage Improvements

#### A. Hero Section "Start Free Mock Exam" CTA
**Status**: ⬜ Not Started
**Priority**: 🔴 Critical
**Effort**: 2 hours
**File**: `src/app/page.tsx`

**Task**:
- [ ] Add prominent "Start Free Mock Exam" button above the fold
- [ ] Copy: "185 Questions • No Signup Required • Instant Results"
- [ ] Link to `/free-bcba-practice-exam`
- [ ] Use emerald gradient button with hover state
- [ ] Add tracking event: `hero_free_mock_exam_click`

**Success Metric**: 15%+ click-through from hero

---

#### B. "Top Tasks" Navigation Strip
**Status**: ⬜ Not Started
**Priority**: 🔴 Critical
**Effort**: 3 hours
**File**: `src/app/page.tsx`

**Task**:
- [ ] Add horizontal strip below hero with 6 quick-access cards
- [ ] Cards:
  1. 🎯 Free Mock Exam → `/free-bcba-practice-exam`
  2. 📝 IEP Goal Writer → `/iep-behavior-goals`
  3. 📚 Study Tools → `/study`
  4. 🏫 School BCBA Hub → `/school-bcba`
  5. 📊 Exam Prep → `/bcba-exam-prep`
  6. 👥 Community → `/community`
- [ ] Each card: Icon + Title + Short Description (8-10 words)
- [ ] Mobile: Horizontal scroll
- [ ] Desktop: 3x2 grid

**Success Metric**: 20%+ engagement with task cards

---

#### C. Performance Optimization
**Status**: ⬜ Not Started
**Priority**: 🟡 High
**Effort**: 1 hour
**File**: `src/app/layout.tsx`

**Task**:
- [ ] Preload hero background image with `<link rel="preload">`
- [ ] Preload primary font (Inter or current font)
- [ ] Add `priority` prop to hero Image component
- [ ] Test LCP on mobile with Lighthouse
- [ ] Target: LCP < 2.5s on 3G

**Success Metric**: LCP < 2.5s on mobile

---

### 2. Add FAQ Schema to High-Potential Pages

#### A. Free BCBA Mock Practice Test
**Status**: ⬜ Not Started
**Priority**: 🔴 Critical
**Effort**: 2 hours
**File**: `src/app/free-bcba-mock-practice-test/page.tsx` (or create layout.tsx)

**FAQs to Add**:
1. "Is the free BCBA mock practice test really free?"
   - "Yes, completely free with no signup required. Access all 185 questions instantly."

2. "How many questions are on the BCBA mock exam?"
   - "Our free mock exam has 185 questions matching the real BCBA exam format (175 scored + 10 unscored)."

3. "Can I take the free BCBA practice test multiple times?"
   - "Yes! Take it as many times as you need. Questions are randomized each time for better practice."

4. "How accurate is this compared to the real BCBA exam?"
   - "Questions are written by BCBAs and cover all 9 content areas matching the BACB task list."

5. "Do I need to sign up to take the free mock exam?"
   - "No signup required! Start practicing immediately and track your progress locally."

6. "How long should I take to complete the mock exam?"
   - "The real BCBA exam allows 4 hours. We recommend timing yourself for realistic practice."

**Task**:
- [ ] Check if page exists, create if needed
- [ ] Add FAQ section to page with visual Q&A accordion
- [ ] Add FAQPage JSON-LD schema
- [ ] Include internal links in answers (to `/bcba-exam-prep`, `/study`)

---

#### B. BCBA Practice Exam
**Status**: ⬜ Not Started
**Priority**: 🔴 Critical
**Effort**: 2 hours
**File**: `src/app/bcba-practice-exam/page.tsx` (or create)

**FAQs to Add**:
1. "What's the difference between free and paid BCBA practice exams?"
   - "Our free exam offers 185 questions. Paid platforms may include additional features like video explanations or study schedules."

2. "How do I know if I'm ready to take the BCBA exam?"
   - "Consistent 80%+ scores on practice exams across all domains indicate strong readiness. Focus on weak areas identified through practice."

3. "Which BCBA practice exam is most accurate?"
   - "Look for exams written by BCBAs covering all BACB task list items. Our questions are developed by practicing BCBAs."

4. "Should I take a full BCBA mock exam or study by domain?"
   - "Both! Start with full mocks to identify weak domains, then targeted practice on specific areas."

5. "How many BCBA practice exams should I take before the real test?"
   - "Most successful candidates take 3-5 full mock exams plus hundreds of individual questions by domain."

**Task**:
- [ ] Check if page exists (verify route)
- [ ] Add FAQ section with accordion UI
- [ ] Add FAQPage JSON-LD schema
- [ ] Link to `/free-bcba-practice-exam`, `/bcba-exam-prep`

---

#### C. Products Page
**Status**: ⬜ Not Started
**Priority**: 🟡 High
**Effort**: 1.5 hours
**File**: `src/app/products/page.tsx`

**FAQs to Add**:
1. "Are Behavior School tools free to use?"
   - "Yes! All our core tools are 100% free with no signup required, including BCBA practice exams and IEP goal generators."

2. "Do I need a subscription to access BCBA practice questions?"
   - "No subscription needed. Access unlimited BCBA practice questions for free anytime."

3. "What tools does Behavior School offer for school BCBAs?"
   - "We offer free IEP goal writers, behavior plan templates, FBA tools, ACT Matrix worksheets, and the 8-week BCBA transformation program."

4. "Can I use these tools on my phone?"
   - "Yes! All tools are mobile-responsive and work on any device with a browser."

**Task**:
- [ ] Add FAQ section at bottom of products page
- [ ] Add FAQPage JSON-LD schema
- [ ] Ensure CTAs link to actual tools

---

### 3. Add BreadcrumbList JSON-LD Sitewide

**Status**: ⬜ Not Started
**Priority**: 🟡 High
**Effort**: 3 hours
**Files**: Multiple pages

**Approach**: Create a reusable breadcrumb schema generator component

**Task**:
- [ ] Create `src/lib/seo/breadcrumb-schema.ts` utility function
- [ ] Input: Array of breadcrumb items from `Breadcrumbs` component
- [ ] Output: BreadcrumbList JSON-LD
- [ ] Add to all pages with breadcrumbs:
  - [ ] `/bcba-exam-prep`
  - [ ] `/school-bcba/*`
  - [ ] `/iep-behavior-goals`
  - [ ] `/iep-goals`
  - [ ] `/behavior-plans`
  - [ ] `/blog/[slug]`
  - [ ] `/products`
  - [ ] `/free-bcba-practice-exam`

**Example Implementation**:
```typescript
// src/lib/seo/breadcrumb-schema.ts
export function generateBreadcrumbSchema(items: BreadcrumbItem[], baseUrl = 'https://behaviorschool.com') {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": item.href ? `${baseUrl}${item.href}` : undefined
    }))
  }
}
```

---

### 4. Meta Title & Description Optimization (GSC Analysis Required)

**Status**: ⬜ Waiting for GSC Data
**Priority**: 🟡 High
**Effort**: 4 hours

**Process**:
1. Export top 20 queries from Google Search Console
2. Identify pages with CTR < 2%
3. Rewrite titles/descriptions for exact match + intent
4. Focus on modifiers: "free", "185 questions", "no signup", "examples"

**Target Pages** (initial guess, pending GSC data):
- [ ] `/free-bcba-practice-exam` - Add "185 Questions" + "No Signup"
- [ ] `/bcba-practice-exam` - Emphasize "Full-Length Mock"
- [ ] `/iep-behavior-goals` - Add "Measurable Examples"
- [ ] `/behavior-plans` - Add "Free Templates"
- [ ] `/school-bcba/salary-by-state` - Add "2025 Updated"

**Action**: Review GSC → Create title/description doc → Implement changes

---

## Week 2-3: Content Sprint + Distribution

### 5. Blog Content Calendar (3 posts/week = 6 posts total)

#### Post 1: BCBA Domain A Practice Questions
**Status**: ⬜ Not Started
**Priority**: 🔴 Critical
**Effort**: 4 hours writing + 1 hour editing
**Publish Date**: Week 2, Day 1
**File**: Create via `/admin/blog/editor`

**Outline**:
- **Title**: "BCBA Domain A: 25 Concepts & Principles Practice Questions (With Detailed Explanations)"
- **Meta Description**: "Master BCBA Domain A with 25 free practice questions covering philosophical underpinnings, concepts, and principles. Includes explanations and study tips."
- **H2 Sections**:
  1. What is Domain A on the BCBA Exam?
  2. 25 Practice Questions by Topic
     - Philosophical Underpinnings (5 Qs)
     - Concepts (10 Qs)
     - Principles (10 Qs)
  3. Answer Key with Detailed Explanations
  4. Study Tips for Domain A Mastery
  5. FAQ: Domain A Questions
- **Internal Links**:
  - Top: "Take Full Free Mock Exam" → `/free-bcba-practice-exam`
  - Middle: "Study All Domains" → `/bcba-exam-prep`
  - Bottom: "Free Study Tools" → `/study`
- **CTA**: "Practice 185+ questions across all domains - Start Free Mock Exam"
- **FAQ Schema**: 4 Q&As about Domain A
- **Tags**: BCBA Exam Prep, Study Materials, Domain A, Free Practice Test

---

#### Post 2: BCBA Domain G Behavior-Change Procedures
**Status**: ⬜ Not Started
**Priority**: 🔴 Critical
**Effort**: 4 hours
**Publish Date**: Week 2, Day 3

**Outline**:
- **Title**: "BCBA Domain G: 30 Behavior-Change Procedures Questions You'll Actually See on the Exam"
- **Meta Description**: "Practice 30 real-world BCBA Domain G questions on behavior-change procedures. Free questions with explanations covering reinforcement, punishment, and more."
- **H2 Sections**:
  1. Why Domain G is the Hardest BCBA Section
  2. 30 Practice Questions
     - Reinforcement (8 Qs)
     - Extinction (5 Qs)
     - Punishment (5 Qs)
     - Generalization & Maintenance (6 Qs)
     - Chaining & Task Analysis (6 Qs)
  3. Answer Explanations
  4. Common Domain G Mistakes to Avoid
  5. FAQ
- **Internal Links**: Same as Post 1
- **CTA**: "Master all 9 domains with our adaptive study platform"
- **FAQ Schema**: 4 Q&As

---

#### Post 3: Free BCBA Mock Exam Timing Strategy
**Status**: ⬜ Not Started
**Priority**: 🟡 High
**Effort**: 3 hours
**Publish Date**: Week 2, Day 5

**Outline**:
- **Title**: "Free BCBA Mock Exam: Timing Strategy and Review Checklist for 185 Questions"
- **Meta Description**: "Master the 4-hour BCBA exam with proven timing strategies. Learn how to pace yourself through 185 questions and maximize your score."
- **H2 Sections**:
  1. Understanding the BCBA Exam Format (185 questions, 4 hours)
  2. Optimal Timing Strategy by Domain
  3. The 3-Pass Review System
  4. Free Mock Exam Checklist
  5. FAQ
- **Internal Links**: Heavy emphasis on `/free-bcba-practice-exam`
- **CTA**: "Put these strategies into practice - Take Free Mock Exam"
- **FAQ Schema**: 5 Q&As

---

#### Post 4: IEP Behavior Goals Examples
**Status**: ⬜ Not Started
**Priority**: 🔴 Critical
**Effort**: 4 hours
**Publish Date**: Week 3, Day 2

**Outline**:
- **Title**: "IEP Behavior Goals: 15 Measurable Examples with Baselines and Criteria (Free Templates)"
- **Meta Description**: "Copy-paste ready IEP behavior goals with baseline data and success criteria. Free templates for emotional regulation, social skills, and task completion."
- **H2 Sections**:
  1. Components of Measurable Behavior Goals
  2. 15 Ready-to-Use IEP Goal Examples
     - Emotional Regulation (3)
     - Social Skills (3)
     - Task Completion (3)
     - Compliance (3)
     - Safety Behaviors (3)
  3. How to Write Your Own Goals
  4. Free IEP Goal Generator Tool
  5. FAQ
- **Internal Links**:
  - `/iep-behavior-goals` (goal generator tool)
  - `/iep-goals`
  - `/behavior-plans`
- **CTA**: "Generate custom IEP goals in 5 minutes - Use Free Tool"
- **FAQ Schema**: 4 Q&As

---

#### Post 5: ACT Matrix for K-12 Implementation
**Status**: ⬜ Not Started
**Priority**: 🟡 High
**Effort**: 5 hours
**Publish Date**: Week 3, Day 4

**Outline**:
- **Title**: "ACT Matrix for K-12: 7-Step Implementation Guide with Worksheets and Classroom Scripts"
- **Meta Description**: "Implement the ACT Matrix in your school with our complete guide. Includes free worksheets, teacher scripts, and real classroom examples."
- **H2 Sections**:
  1. What is the ACT Matrix?
  2. Why School BCBAs Should Use ACT Matrix
  3. 7-Step Implementation Process
  4. Free Downloadable Worksheets
  5. Classroom Scripts for Teachers
  6. Case Study: Middle School Implementation
  7. FAQ
- **Internal Links**:
  - `/act-matrix`
  - `/the-act-matrix-a-framework-for-school-based-bcbas`
  - `/school-bcba`
- **CTA**: "Join the School BCBA Transformation Program"
- **FAQ Schema**: 4 Q&As

---

#### Post 6: School BCBA Salary by State 2025
**Status**: ⬜ Not Started
**Priority**: 🔴 Critical
**Effort**: 6 hours (data research intensive)
**Publish Date**: Week 3, Day 6

**Outline**:
- **Title**: "School BCBA Salary by State: 2025 Complete Guide + Negotiation Templates"
- **Meta Description**: "Updated 2025 school BCBA salaries for all 50 states. Includes salary ranges, benefits, negotiation templates, and cost-of-living analysis."
- **H2 Sections**:
  1. Average School BCBA Salary Overview (2025)
  2. Salary by State (sortable table)
  3. Factors Affecting School BCBA Pay
  4. Benefits Beyond Salary
  5. Salary Negotiation Templates
  6. Career Growth Opportunities
  7. FAQ
- **Internal Links**:
  - `/school-bcba/salary-by-state` (update existing page or link to it)
  - `/school-bcba/job-guide-2025`
  - `/school-bcba/how-to-become`
- **CTA**: "Advance your school BCBA career - Join Transformation Program"
- **FAQ Schema**: 5 Q&As
- **HowTo Schema**: "How to negotiate school BCBA salary"

---

### 6. Blog Infrastructure Improvements

#### A. "Popular This Week" Block
**Status**: ⬜ Not Started
**Priority**: 🟡 High
**Effort**: 3 hours
**File**: `src/app/blog/page.tsx`

**Task**:
- [ ] Add "Popular Hub Pages" section to blog homepage
- [ ] Feature 4-6 cornerstone pages with rich descriptions:
  1. **BCBA Exam Prep** - "Free practice questions, study guides, and mock exams"
  2. **Free BCBA Mock Test** - "185 questions, no signup, instant feedback"
  3. **IEP Goal Writer** - "Generate measurable behavior goals in minutes"
  4. **School BCBA Hub** - "Career guides, salaries, and job resources"
  5. **Study Tools** - "Adaptive learning platform for BCBA certification"
  6. **Behavior Plans** - "Free FBA and BIP templates for schools"
- [ ] Use card design with icons
- [ ] Track clicks with analytics events

---

#### B. Internal Linking System
**Status**: ⬜ Not Started
**Priority**: 🟡 High
**Effort**: 2 hours

**Task**:
- [ ] Create standard internal linking template for all blog posts
- [ ] Top section: Contextual hub links (2-3 related pages)
- [ ] Bottom section: "Related Resources" with 4-6 tool links
- [ ] Add to blog editor as snippet/template

**Standard Link Locations**:
- Intro paragraph: Link to primary hub (e.g., BCBA Exam Prep)
- Mid-content: Link to tool (e.g., Free Mock Exam, IEP Generator)
- Conclusion: CTA with link to product/program
- Sidebar/Bottom: "Related Resources" card stack

---

### 7. Distribution & Outreach

#### A. Newsletter Setup
**Status**: ⬜ Not Started
**Priority**: 🟡 High
**Effort**: 4 hours
**File**: Listmonk integration

**Task**:
- [ ] Set up weekly newsletter template in Listmonk
- [ ] Template sections:
  1. Featured new blog post
  2. Product spotlight (rotating)
  3. Quick tip/resource
  4. CTA to free tool
- [ ] Auto-publish schedule: Every Monday 9am
- [ ] First newsletter: Announce Domain A post + Free Mock Exam

---

#### B. Social Media Auto-Posting
**Status**: ⬜ Not Started
**Priority**: 🟡 High
**Effort**: 2 hours
**File**: `src/app/api/admin/blog/social-post` (already exists)

**Task**:
- [ ] Verify social posting API works
- [ ] Create post templates for each platform:
  - **LinkedIn**: Professional, data-driven snippets
  - **Twitter/X**: Quick tips, question hooks
- [ ] Schedule: New post goes live → Auto-post within 1 hour
- [ ] Track engagement by platform

**Sample Templates**:
```
LinkedIn: "New resource for BCBAs: 25 Domain A practice questions with detailed explanations. Perfect for exam prep. [link] #BCBA #ABA #ExamPrep"

X: "Struggling with BCBA Domain A? Here are 25 practice questions to master concepts & principles 🧠 [link]"
```

---

#### C. Outreach Campaign
**Status**: ⬜ Not Started
**Priority**: 🟡 High
**Effort**: 5 hours/week (ongoing)

**Target List** (first 25 prospects):
1. University ABA programs (15 contacts)
2. School district SEL coordinators (5 contacts)
3. BCBA supervisor networks (5 contacts)

**Email Template**:
```
Subject: Free BCBA resources for [University/District] students

Hi [Name],

I'm Rob Spain, a BCBA and founder of Behavior School. We've created free tools specifically for BCBA candidates and school-based behavior analysts:

• 185-question mock exam (no signup required)
• IEP behavior goal generator
• Adaptive study platform across all 9 domains

Would you be open to sharing these with your students/team? Happy to set up a brief demo or provide any materials you need.

All tools are 100% free and designed by practicing BCBAs.

Best,
Rob
```

**Task**:
- [ ] Build prospect list (25 contacts)
- [ ] Send 5 outreach emails/week
- [ ] Track responses and link placements
- [ ] Follow up after 1 week

**Target Outcome**: 5-10 backlinks from edu/org domains within 4 weeks

---

## Week 4: Scale & Iterate

### 8. Programmatic SEO (Pending Approval)

**Status**: ⬜ Awaiting Approval
**Priority**: 🟢 Medium
**Effort**: 20+ hours

**Concept**: Create domain-specific landing sections

**Proposed Structure**:
- `/bcba-exam-prep/domain-a-concepts-principles`
- `/bcba-exam-prep/domain-b-measurement`
- `/bcba-exam-prep/domain-c-assessment`
- ... (9 total domains)

**Each Page Includes**:
- 8-35 curated practice questions
- Domain overview and breakdown
- Study tips specific to that domain
- Glossary of key terms
- FAQ schema (4-5 Q&As)
- Strong internal linking to full mock exam

**Decision Point**: Approve only if:
- Can maintain quality (not thin content)
- Can keep updated
- Aligns with product strategy

**Task**:
- [ ] Get approval from Rob
- [ ] Create content template
- [ ] Draft first 3 domain pages
- [ ] Review before scaling to all 9

---

### 9. GSC Iteration & Optimization

**Status**: ⬜ Not Started
**Priority**: 🟡 High
**Effort**: Ongoing

**Weekly Tasks**:
- [ ] Export GSC data (queries, pages, CTR, position)
- [ ] Identify queries with:
  - High impressions (100+) but low CTR (< 2%)
  - Position 5-15 (opportunity to move to top 5)
  - Branded variations we're missing
- [ ] Optimize titles/descriptions for exact match variants
- [ ] Add new FAQ questions based on real queries
- [ ] Document changes and monitor results

**Top 20 Query Optimization** (Examples - Update with Real Data):

| Query | Current Page | Current Position | Current CTR | Action |
|-------|-------------|------------------|-------------|--------|
| "free bcba practice test" | `/free-bcba-practice-exam` | 8 | 1.8% | Add "185 Questions" to title |
| "bcba exam questions" | `/bcba-exam-prep` | 12 | 1.2% | Create dedicated questions page |
| "iep behavior goals examples" | `/iep-behavior-goals` | 6 | 2.5% | Add "15 Examples" to title |
| ... | ... | ... | ... | ... |

---

### 10. Additional Rich Snippet Opportunities

#### A. HowTo Schema
**Status**: ⬜ Not Started
**Priority**: 🟢 Medium
**Effort**: 2 hours per page

**Target Pages**:
- [ ] "How to Study for BCBA Exam" section on `/bcba-exam-prep`
- [ ] "How to Write IEP Goals" on `/iep-behavior-goals`
- [ ] "How to Implement ACT Matrix" on `/act-matrix`
- [ ] "How to Become a School BCBA" on `/school-bcba/how-to-become`

**Template**:
```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Study for the BCBA Exam",
  "description": "Step-by-step guide to preparing for the BCBA certification exam",
  "totalTime": "PT3M",
  "step": [
    {
      "@type": "HowToStep",
      "name": "Take a baseline mock exam",
      "text": "Start with a full 185-question mock exam to identify weak domains",
      "url": "https://behaviorschool.com/free-bcba-practice-exam"
    },
    // ... more steps
  ]
}
```

---

#### B. Video Schema (Future)
**Status**: ⬜ Future
**Priority**: 🟢 Low
**Effort**: TBD

**Note**: If creating video content (study tips, exam walkthroughs), add VideoObject schema

---

## 📈 Metrics & Tracking

### Primary KPIs

**Weekly Tracking** (Update every Monday):

| Week | Organic Clicks | Impressions | Avg CTR | Top Query Positions | Conversions* |
|------|----------------|-------------|---------|---------------------|--------------|
| 0 (Baseline) | 40 | ~2,000 | 2.0% | TBD | TBD |
| 1 | | | | | |
| 2 | | | | | |
| 3 | | | | | |
| 4 | | | | | |

*Conversions = Free Mock Exam starts, IEP Generator uses, email signups

**Target by Week 4**:
- ✅ 120+ organic clicks/week (3x baseline)
- ✅ CTR improvement: +2-4% on top queries
- ✅ 3+ rich snippets appearing in SERPs
- ✅ 5-10 new backlinks from .edu/.org domains

---

### Secondary Metrics

- **Content Engagement**:
  - Average time on page for blog posts (target: 3+ minutes)
  - Scroll depth (target: 70%+ reach bottom)
  - Internal link CTR (target: 15%+ click through)

- **Conversion Funnel**:
  - Homepage → Tool page conversion (target: 25%)
  - Blog post → Tool usage (target: 10%)
  - Email signup rate (target: 5% of tool users)

- **Technical SEO**:
  - Mobile LCP < 2.5s (all pages)
  - CLS < 0.1
  - Indexed pages: maintain current count (no indexation drops)

---

## 🚀 Implementation Checklist

### Immediate (This Week)

**High-Priority Code Changes**:
- [ ] Homepage hero CTA: "Start Free Mock Exam"
- [ ] Homepage "Top Tasks" navigation strip
- [ ] Preload hero image + primary font
- [ ] Add FAQ schema to 3 pages (free mock, practice exam, products)
- [ ] Add BreadcrumbList JSON-LD to 10+ pages

**Estimated Total Time**: 12-15 hours of development

---

### Week 1 Content

- [ ] Set up blog post template with internal linking
- [ ] Draft Post 1: Domain A Practice Questions
- [ ] Draft Post 2: Domain G Behavior-Change Questions
- [ ] Set up social auto-posting

**Estimated Total Time**: 10-12 hours of writing

---

### Week 2-3 Content

- [ ] Publish Posts 1-2
- [ ] Draft Posts 3-6
- [ ] Build outreach prospect list (25 contacts)
- [ ] Send first 10 outreach emails
- [ ] Launch weekly newsletter

**Estimated Total Time**: 20-25 hours

---

### Week 4 Analysis

- [ ] Pull GSC data and analyze trends
- [ ] Identify top 20 query optimizations
- [ ] Update titles/descriptions based on data
- [ ] Review rich snippet appearance
- [ ] Document learnings and next 4-week plan

**Estimated Total Time**: 6-8 hours

---

## 📝 Content Calendar

| Week | Mon | Wed | Fri |
|------|-----|-----|-----|
| 2 | Post 1: Domain A Questions | Post 2: Domain G Questions | Post 3: Timing Strategy |
| 3 | Newsletter #1 | Post 4: IEP Examples | Newsletter #2 |
| 4 | Post 5: ACT Matrix | Post 6: Salary Guide | Final Analysis |

---

## 🔗 Quick Reference Links

### Key Files to Edit

- Homepage: `src/app/page.tsx`
- Blog List: `src/app/blog/page.tsx`
- Products: `src/app/products/page.tsx`
- Free Mock Exam: `src/app/free-bcba-practice-exam/page.tsx` (check if exists)
- BCBA Practice Exam: `src/app/bcba-practice-exam/page.tsx` (check if exists)
- Breadcrumb Schema Util: `src/lib/seo/breadcrumb-schema.ts` (create new)

### Documentation

- Current SEO Status: `SEO_IMPROVEMENTS_2025.md`
- Site Structure: `SITE_MAP.md`
- Brand Guidelines: `BRAND_STYLE_GUIDE.md`

### Tools & Resources

- Google Search Console: [Link to GSC property]
- Google Analytics: [Link to GA4 property]
- Listmonk: `/admin/newsletter` (Listmonk)
- Blog Editor: `/admin/blog/editor`

---

## ✅ Definition of Done

### For Technical Tasks
- [ ] Code implemented and tested locally
- [ ] Mobile responsive verified
- [ ] Lighthouse score reviewed (LCP, CLS)
- [ ] Committed with descriptive message
- [ ] Deployed to production
- [ ] Verified live on behaviorschool.com
- [ ] Structured data validated with Google Rich Results Test

### For Content Tasks
- [ ] Outline approved
- [ ] Draft written (1,500-2,500 words)
- [ ] FAQ section included (4+ questions)
- [ ] Internal links added (top, middle, bottom)
- [ ] Images optimized (WebP, alt text)
- [ ] Meta title & description written
- [ ] FAQ JSON-LD schema added
- [ ] Published and indexed
- [ ] Social media posts scheduled
- [ ] Added to newsletter queue

### For Outreach Tasks
- [ ] Prospect list compiled
- [ ] Email template personalized
- [ ] Emails sent
- [ ] Responses tracked in spreadsheet
- [ ] Follow-ups scheduled
- [ ] Link placements documented

---

## 🎯 Success Criteria

**This plan is successful if by Week 4**:

1. ✅ Organic clicks increase from 40/week to 120+/week (3x growth)
2. ✅ CTR improves by 2-4% on top 20 queries
3. ✅ At least 3 rich snippets appear in Google search results
4. ✅ 6 high-quality blog posts published with strong engagement
5. ✅ 5-10 backlinks acquired from relevant domains
6. ✅ Homepage LCP < 2.5s on mobile
7. ✅ Newsletter launched with 100+ subscribers
8. ✅ Free tool conversion rates documented and improving

---

## 🤝 Approval & Sign-Off

**Proceed with the following NOW** (no approval needed):
- ✅ FAQ schema additions (3 pages)
- ✅ BreadcrumbList JSON-LD (all pages)
- ✅ Homepage hero CTA
- ✅ Homepage "Top Tasks" strip
- ✅ Performance preloads

**Awaiting Approval**:
- ⏸️ Programmatic domain pages (Week 4)
- ⏸️ Paid content promotion budget (if any)

**Rob's Sign-Off**:
- [ ] Approved to proceed with Week 1 immediate tasks
- [ ] Approved to draft first 3 blog posts
- [ ] Approved to begin outreach campaign

---

**Last Updated**: January 2025
**Next Review**: End of Week 1
**Owner**: Rob Spain + Claude Code
