---
title: BehaviorSchool business plan and time priorities
status: active strategic handoff
owner: Rob Spain
last_updated: 2026-08-27
audience: All BehaviorSchool agents and collaborators
---

# BehaviorSchool business plan and time priorities

This is the business and money-making context for the BehaviorSchool marketing agent. Read it before proposing work. It explains what the business is trying to sell, which work deserves Rob's limited attention, and how marketing, product, finance, and engineering work should connect.

This is a strategic handoff, not a live financial statement. The underlying revenue strategy and conversion audit were written earlier in 2026. Re-check live Stripe, analytics, billing, email, and deployment state before treating any number or status below as current.

## The decision in one sentence

BehaviorSchool should make money by turning existing professional audiences into paid subscriptions and high-value training sales, using free tools and useful content as the acquisition layer and the connected product ecosystem as the retention layer.

The immediate objective is not to build every product. It is to prove one repeatable path from attention to email/signup to payment, then reuse that path across the product family.

## What the business is

BehaviorSchool is a professional ecosystem for BCBAs, RBTs, school-based behavior professionals, and special-education teams. `behaviorschool.com` is the front door and trust-building layer.

The monetization paths are:

1. **BCBA exam-prep subscription** at `study.behaviorschool.com` for people preparing for the BCBA exam.
2. **BehaviorSchool Pro** at `plan.behaviorschool.com` for working BCBAs who need FBA/BIP, IEP, assessment, ACT, progress-monitoring, and related tools.
3. **Supervision and hour tracking** at `supervision.behaviorschool.com`, which can become both a paid product and an acquisition channel through supervisors and trainees.
4. **Training and CEUs**, including the school-BCBA Transformation Program and the learning platform.
5. **District/team sales** for school systems that need seats, implementation support, and professional development.

The strategic flywheel is:

```text
Free content or tool
  -> email capture / account
  -> immediate product value
  -> paid subscription or training
  -> cross-sell to the next BehaviorSchool product
  -> more usage, referrals, and district credibility
```

## What should make money first

### 1. Existing study-app audience: fastest consumer revenue test

The prior analysis identified the BCBA study app as the fastest path to revenue because it already had a product, users, and a Stripe path. The working offer was a free entry point followed by a paid monthly or annual plan, with an annual offer used to improve cash collection.

The agent should first verify:

- How many people registered recently.
- How many are active.
- How many are paying in live mode.
- Where the free-to-paid boundary is.
- Whether the app records signup, activation, paywall view, checkout start, and purchase events.
- Whether live prices, checkout, webhooks, and subscription access actually work.

The conversion path to improve is:

```text
Free practice exam or study content
  -> email/account
  -> study session and progress feedback
  -> clear usage limit or upgrade moment
  -> monthly/annual subscription
```

### 2. Free IEP Behavior Goal Writer: strongest acquisition loop

The IEP Behavior Goal Writer is a high-potential free tool for special-education teachers and BCBAs. It gives users value before asking for an email, then points qualified users toward the broader BehaviorSchool Pro toolkit.

The conversion path to improve is:

```text
SEO/social referral
  -> free goal writer
  -> useful preview/output
  -> email capture for export or follow-up
  -> FBA/BIP and planning tools
  -> BehaviorSchool Pro subscription
```

The tool should remain genuinely useful for free. The paid offer should sell workflow depth, saved time, exports, history, additional tools, and team value—not artificial obstruction.

### 3. Transformation Program: owner-led high-ticket cash

The school-BCBA Transformation Program is a high-ticket offer for employed school BCBAs and district behavior leaders. The earlier offer was framed around building practical systems over six weeks, with a full price of $2,997 or three payments of $1,097 and district purchase orders as a payment route.

This is not an evergreen assumption or permission to publish a new campaign. Before promoting it, verify cohort dates, capacity, delivery readiness, checkout, payment terms, and whether Rob still wants to sell it.

When active, Rob's highest-value personal work here is direct conversations with warm prospects, district contacts, and prior participants. Agents can prepare the landing page, email drafts, lead list, follow-up reminders, and reporting; Rob should handle the trust-building sales conversations and final offer decisions.

### 4. District/team sales: larger contracts after proof

District sales can produce larger revenue, but they require credible product evidence, a working lead-capture path, clear implementation support, and a buyer-specific ROI story. Do not spend the first block of available time polishing a district page while consumer conversion and lead capture are unmeasured.

The district path should be:

```text
Warm school/district contact or useful free tool
  -> qualified conversation
  -> demo with real product evidence
  -> pilot or paid seats/training
  -> renewal, expansion, and referrals
```

Never put unsupported time-savings, outcome, adoption, or ROI claims on a public page. Use only approved evidence and label estimates as estimates.

## What Rob should focus his time on

Rob's job is to create trust, make offers, and speak with buyers. Agents should absorb the implementation and reporting burden.

Use this default time budget until live data justifies changing it:

| Focus | Share of working time | Rob's job | Agent support |
|---|---:|---|---|
| Revenue and customer conversations | 40% | Talk to warm users, prospects, supervisors, and districts; make the offer; close or learn | Prepare lead lists, scripts, follow-ups, CRM notes, and objection summaries |
| Conversion and measurement decisions | 20% | Choose one bottleneck and approve the offer/threshold | Instrument funnels, verify checkout, report baselines, and run QA |
| Distribution | 25% | Record or approve authentic insights in Rob's voice; send the important emails | Turn ideas into drafts, SEO pages, social posts, repurposed content, and UTM links |
| Product direction and customer learning | 15% | Review real user feedback and choose the next highest-value capability | Implement the smallest change, preserve the visual system, and document results |

If Rob has only one hour, use it in this order:

1. Follow up with the warmest buyer or user who can pay or introduce a buyer.
2. Review the one daily revenue/conversion number that is currently the bottleneck.
3. Approve or record one useful piece of content with a single CTA.
4. Make one product decision that removes friction from the active funnel.

Rob should not spend scarce time on broad refactors, cosmetic redesigns, inventing new products, manually checking every implementation detail, or creating content with no path to a product or email list.

## The execution sequence

### Phase 0: establish the truth

Before making a growth decision, inspect the current production state:

- Live Stripe mode, products, prices, checkout, webhooks, and active subscriptions.
- Current users, email subscribers, leads, and product activity.
- Analytics events from first visit through payment.
- Current email provider, list segmentation, deliverability, and automations.
- Current deployed URLs and which repository is canonical.

Record unknowns as unknowns. Do not convert an old target into a claimed result.

### Phase 1: unblock payment and measurement

Fix the smallest number of issues that could prevent a willing customer from paying:

- Replace any placeholder or test-only payment configuration with verified live configuration.
- Test the full checkout-to-entitlement path using safe test procedures.
- Add or verify events for landing-page CTA, email capture, account creation, activation, paywall/upgrade view, checkout start, purchase, and cancellation.
- Ensure every cross-property link has consistent UTM parameters.
- Repair high-value lead forms that only show a browser alert or otherwise fail to persist the lead.

Do not start paid acquisition until this path is measurable.

### Phase 2: activate warm demand

Use existing users and subscribers before buying more traffic:

- Send a personal, useful email to the study-app audience with one clear offer.
- Follow up with practice-exam completers and IEP-tool users.
- Add the post-value CTA and email sequence where the product naturally creates buying intent.
- Cross-sell study users to working-professional tools only when the relevance is clear.
- Personally contact qualified school and district leads.

The first campaign goal is learning and payment, not list vanity. Report sends, delivery, clicks, activated users, checkout starts, purchases, revenue, and replies.

### Phase 3: build the repeatable acquisition engine

Once a funnel has a verified baseline:

- Publish SEO content around real user problems and connect it to a free tool or practice experience.
- Use the IEP Goal Writer, practice exam, templates, and study resources as entry points.
- Reuse one strong idea across email, LinkedIn, Instagram, Pinterest, and short video where appropriate.
- Add referral mechanics only after the core product experience and attribution work.
- Test paid acquisition with a small budget only when CAC and conversion data are available.

### Phase 4: expand account value

After one consumer funnel is working, connect the products:

- Study app -> supervision and hour tracking.
- RBT study -> supervisor relationship and supervision platform.
- Free IEP/behavior tool -> BehaviorSchool Pro.
- Pro or supervision usage -> CEUs, training, and district conversations.
- Training and district work -> team seats and recurring product revenue.

Integration should make the next purchase more obvious and more useful. Do not add integrations merely because the ecosystem diagram looks complete.

## The agent's weekly scoreboard

Create or maintain one simple weekly report. The baseline should be populated from live systems, not guessed.

| Metric | Why it matters |
|---|---|
| Live revenue and new paid customers | Confirms money is actually moving |
| Qualified conversations and proposals | Measures high-ticket pipeline |
| New email leads by source | Measures acquisition quality |
| Free-tool completions and email-capture rate | Measures value-to-lead conversion |
| Study-app activation and paywall-to-checkout rate | Measures product conversion |
| Checkout completion rate | Finds payment friction |
| Paid retention/cancellation | Tests whether the offer delivers ongoing value |
| Product-to-product referrals | Tests the ecosystem flywheel |

Every weekly report should state:

1. The current bottleneck.
2. The baseline and date.
3. The one experiment or fix being run.
4. The success threshold.
5. The next decision if the threshold is or is not met.

## Guardrails for marketing and product work

- Product evidence beats broad promises.
- No invented testimonials, customer names, outcome statistics, usage counts, or ROI claims.
- Use one strong CTA per page or campaign.
- Preserve BehaviorSchool's visual identity and professional tone.
- Free tools must deliver real value before asking for an email whenever practical.
- Do not launch a new public page, publish new copy, or change indexing without maintainer approval under this repository's `AGENTS.md` rules.
- The current repository rules and live source code override stale historical notes.
- Keep student, client, trainee, financial, and other sensitive data out of this document and out of logs.

## What not to do yet

Unless live evidence changes the priority, do not spend the next work block on:

- Building a completely new product because it sounds exciting.
- A broad visual redesign with no measured conversion problem.
- Paid ads before checkout and attribution are verified.
- A district ROI calculator using unsupported numbers.
- Complex referral automation before a manual referral test works.
- Recreating old Listmonk, Supabase, or Stripe integrations without checking the current repository boundary and deployment configuration.
- Treating the old CALABA launch calendar or old revenue targets as current commitments.

## Source notes and confidence

This handoff distills the following internal working documents:

- `neo-workspace/revenue-strategy-2026.md` — prior revenue plan, funnels, offers, campaign sequence, and execution order.
- `neo-workspace/revenue-audit-2026-02-08.md` — prior product, checkout, email, and analytics audit.
- `neo-workspace/agents/marketing/MEMORY.md` — audience, SEO, free-tool, and content priorities.
- `neo-workspace/agents/behaviorschool/AGENT.md` and `neo-workspace/agents/ECOSYSTEM.md` — canonical product/repository map.

The plan's strategic direction is useful, but its dated implementation details, prices, product status, analytics status, and revenue targets require fresh verification. The most important enduring conclusion is: activate existing demand, make payment measurable, focus Rob on buyers and trust, and let agents execute the smallest evidence-based improvements.

