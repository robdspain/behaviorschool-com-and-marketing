# Landing Page Build Instructions (SOP)

> Source video: https://youtube.com/shorts/DpFW28xBvGk
> Transcript: Add to the Appendix section below when available.

## Purpose
Create high-converting, fast, and accessible landing pages that clearly communicate value, reduce friction, and drive a single, measurable action.

## Outcomes and KPIs
- Primary conversion: Define one action (e.g., sign up, request demo, purchase)
- Supporting metrics: CTR to CTA, form completion rate, scroll depth, time on page, bounce rate
- Performance budgets: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1, page weight ≤ 1.0 MB (initial)

## Process Overview
1. Define audience, problem, and offer
2. Draft copy (above-the-fold first), then wireframe
3. Add social proof and objection handling
4. Design with a clear visual hierarchy and single primary CTA
5. Implement with performance, SEO, and accessibility as first-class requirements
6. QA, analytics instrumentation, and launch
7. A/B test highest-leverage elements (headline, hero, CTA, proof)

---

## Strategy
- Audience: Who is this page for? What language do they use to describe their pain and desired outcome?
- Promise: What outcome do we deliver? In how much time? With what level of effort or risk?
- Offer: What’s the simplest next step (the CTA) to experience value?
- Focus: One page, one job. Remove anything that doesn’t support the primary conversion.

## Above the Fold (Hero)
- Headline: Outcome-focused, specific, and scannable
  - Formula: [Desired outcome] without [big blocker] in [timeframe] — or — [Strong promise] for [persona]
  - Example: “Ship production-grade landing pages in hours, not weeks.”
- Subheadline: Clarify who it’s for and how it works in one sentence
- Primary CTA: One clear action (verb-led). Place it above the fold.
  - Examples: “Get a demo,” “Start free,” “Get instant access”
- Supporting visual: Product-in-context, short demo loop, or credible preview (avoid abstract stock art)
- Trust anchors: Logos, short testimonial, or key stat (if available)

## Body Structure (Suggested)
1. Problem → Agitation → Solution snapshot
2. Benefits (outcomes, not features). 3–5 bullets, each with a micro-proof (metric or quote)
3. Social proof: Testimonials, ratings, customer logos, case study highlight
4. How it works (3 steps max). Tie each step to a benefit
5. Feature detail: Use accordions or cards; keep scannable
6. Objections and risk reversal: FAQ, money-back guarantee, SLAs, compliance, security
7. Pricing/Plans (if applicable) with a “most popular” plan. Keep comparison simple
8. Secondary CTA for low-intent users (e.g., “Watch demo,” “Contact sales”)
9. Final CTA: Repeat the primary CTA with a concise reminder of the promise

## Copy Guidelines
- Clarity over cleverness; short sentences; present tense
- Use customer language (voice-of-customer from reviews, calls, support tickets)
- Lead with outcomes; back up with numbers and specifics
- Avoid vague superlatives; show proof instead (metrics, names, logos)
- Readability: Aim for Grade 7–8; avoid jargon unless audience expects it
- Microcopy: Buttons use verbs; forms use plain labels; errors are human and specific

## Design Guidelines
- Visual hierarchy: One primary CTA color; consistent spacing scale; clear section breaks
- Typography: 1–2 fonts; strong headline size; 45–75 characters per line
- Color and contrast: WCAG AA minimum for text and actionable elements
- Imagery: Show product in use; annotate as needed; avoid UI that misleads
- Motion: Prefer subtle loops (<6s). Provide reduced-motion fallback
- Components: Hero, Benefits, Social Proof, How It Works, Features, FAQ, Pricing, CTA, Footer

## Forms and Conversion
- Ask only for what you need now; defer extra fields
- Inline validation with clear, accessible errors
- Show privacy reassurance and how data will be used
- Post-submit state: Instant confirmation + next step (email, download, onboarding)
- Reduce friction: Autofill, sensible defaults, keyboard-friendly

## Technical Requirements
- Performance
  - Optimize and lazy-load images; serve modern formats (AVIF/WebP)
  - Defer non-critical JS; inline critical CSS; preconnect to necessary origins
  - Avoid layout shifts; reserve media space; use font-display: swap
- SEO
  - Unique title, meta description, h1; semantic headings (h1–h3)
  - Canonical tag; Open Graph/Twitter cards; alt text for images
  - Structured data as applicable: Product, FAQ, Organization, Breadcrumb
- Accessibility (WCAG 2.1 AA)
  - Proper landmarks (header, main, footer); labels tied to inputs
  - Keyboard focus visible and logical; color contrast ≥ 4.5:1 for text
  - ARIA used sparingly; ensure screen-reader-friendly CTA text
- Analytics and Testing
  - Event schema: view, scroll 25/50/75/100, CTA click, form start/complete, error
  - UTM standardization; consent management respected
  - A/B testing: server- or client-side with consistent bucketing and guardrails

## A/B Testing Priorities
1. Headline (promise, specificity)
2. Hero visual (contextual demo vs static)
3. Primary CTA text and placement
4. First social proof element (logo row vs testimonial vs stat)
5. Form length and microcopy

## QA Checklist (Pre-Launch)
- Copy and links
  - Spelling, grammar, and brand voice
  - All CTAs route to correct destinations; external links open as intended
- Layout
  - Responsive at 360, 768, 1024, 1280, 1440+ widths
  - No layout shift on slow 3G throttle
- Performance
  - Lighthouse: LCP ≤ 2.5s; CLS ≤ 0.1; INP ≤ 200ms on mobile
  - Image sizes appropriate; no unused JS/CSS bloat
- Accessibility
  - Keyboard-only navigation works; focus states visible
  - Axe/Pa11y checks pass; alt text present; labels read correctly
- Analytics
  - Events fire once; data shows in destination; UTMs preserved through flows
- Legal and compliance
  - Cookie/consent banners; privacy policy; terms; required notices

## Content Brief Template
- Page goal and single primary CTA
- Audience and stage (cold ad, retargeting, SEO, email, partner)
- Problem statement in customer words
- Promise (outcome + timeframe)
- Offer details (what they get next)
- 3–5 benefit bullets with micro-proof
- Social proof assets (logos, testimonials, stats) with approvals
- Objections and answers (top 5)
- Visual assets needed (hero demo, diagrams, screenshots)
- Measurement plan (primary metric, guardrail metrics)

## Recommended Section Order (Template)
1. Hero (Headline, Subheadline, Primary CTA, Visual, Trust anchor)
2. Problem → Agitation → Solution
3. Benefits (bullets with micro-proof)
4. Social Proof (logos + 1–2 testimonials)
5. How It Works (3 steps)
6. Features (scannable, grouped)
7. Objections and FAQ
8. Pricing (if applicable)
9. Final CTA

## Copy Formulas (Quick Reference)
- Headline: “Get [desired outcome] without [pain], in [timeframe].”
- Benefit bullet: “So you can [meaningful outcome], not just [feature].”
- Testimonial format: “Before → After” with a concrete metric
- CTA: “Start [desired outcome] now” vs generic “Submit”

## Tracking Plan (Event Names)
- lp_view
- lp_scroll_{25|50|75|100}
- lp_cta_click_{primary|secondary}
- lp_form_start
- lp_form_submit
- lp_form_error_{field}
- lp_video_play (if applicable)

## Governance and Review
- Approvals: Copy (PM/Marketing), Design (Design Lead), Legal (if needed)
- Source of truth: Store this page in the repo; track edits via PRs
- Revisions: A/B outcomes documented; learnings fed back into template

---

## Appendix A: Transcript (to be inserted)
Paste the verbatim transcript here once available. If the transcript includes timestamps, consider removing them for readability.

## Appendix B: Example Wireframe Notes
- Hero: headline (max ~9 words), subheadline (1–2 lines), CTA, 1-line trust
- Benefits: 3 cards with icons; 1 line each + micro-proof
- Social proof: 6–8 logos, balanced weight
- How it works: 3 steps, 1 sentence per step
- Feature list: 6–8 bullets, grouped into 2–3 clusters
- FAQ: 5–7 items addressing top objections
- Footer CTA: Repeat primary CTA with brief reminder of promise