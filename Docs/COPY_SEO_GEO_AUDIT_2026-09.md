# behaviorschool.com copy, SEO, and AI-search audit (September 2026)

Scope: every public route under `src/app` (about 140), global metadata and JSON-LD, header and footer, `robots.txt`, and the sitemap. Goal: improve conversion, organic search, and how AI answer engines (Google AI Overviews, ChatGPT search, Perplexity, Claude) recognize and cite the site, while staying inside the `AGENTS.md` public-copy authenticity rules.

This document has three parts: what changed in this PR, what was found but deliberately not changed, and questions that need a decision from Rob.

---

## 1. What changed

### 1.1 Positioning and default metadata (`src/app/layout.tsx`, `src/app/page.tsx`)

Problem: the site-wide default title, description, keywords, and Organization JSON-LD still described Behavior School primarily as a BCBA exam-prep company. The homepage hero did the same. But the product mix, the nav, and most indexable pages are about school-based practice (IEP goals, FBA and BIP tools, the Transformation Program, CEUs). Search engines and LLMs pick up the strongest, most repeated signal; that signal was pointing at the smaller product.

Changes:

- Default title: `Behavior School | Tools & Training for School BCBAs`. Default description leads with school-BCBA tools, then CEUs and exam prep.
- Organization JSON-LD description rewritten; `sameAs` now lists only real, consistent profile URLs; broken `SearchAction` (pointed at `/blog?q=` which does not search) removed.
- Removed non-standard or unverifiable `<meta>` tags (COPPA, "child-safe", ICRA, `verify-v1`, `expertise`, `authority`, `trustworthiness`, `content-accuracy`, Dublin Core, SafeSearch, duplicate `og:type`). None of these are read by Google; some are read by LLM scrapers and looked like keyword stuffing.
- Homepage hero now states who the site is for and what it does in the first sentence ("Behavior Tools and Training for School BCBAs"), with the eyebrow "Built by a practicing school BCBA."
- Added a definition paragraph in the About section ("Behavior School is a resource company for school-based BCBAs. It publishes...") because answer engines quote the first clear "X is Y" sentence they can find.
- Removed the duplicate "Creator Bio" at the bottom of the homepage; kept one author block with credentials, tenure (from `founder-tenure.ts`), and a link to robspain.com.
- Exam-prep band moved below school tools and framed as the secondary offer; it now says exactly what the free thing is (9-question Quick domain check, instant score, rationales).

### 1.2 Transformation Program (`transformation-program/page.tsx`, `layout.tsx`, `lib/transformation-program.ts`)

- Meta description now matches the page (six-week live cohort, what you build, cohort label and seat cap pulled from constants).
- Course JSON-LD `description` and `teaches` aligned to the actual six-week curriculum; instructor `url` added.
- New `TRANSFORMATION_PROGRAM_FAQ` constant is the single source for the visible FAQ accordion and a new `FAQPage` JSON-LD block. Includes a cost answer (there was none before).
- Removed the duplicated "Who this is for" section.
- Hero note and district-pay paragraph rewritten to say the order of operations plainly (apply, review, fit call, seat).
- Instructor block gives full credentials and tenure and a note on how CE is verified.

### 1.3 Navigation and footer

- Header CTA: `Apply: October 2026 cohort` (was ungrammatical).
- Footer tagline and entity line rewritten. Footer link list reorganized by intent (Tools, Training, Career, Exam Prep, Company). Removed links to noindex pages (`/resources`), the self-link, and duplicate exam links; added `/school-bcba`, `/ceus`, `/supervisors`, `/subscribe` (The Weekly Research Brief), `/contact`.

### 1.4 Authenticity and policy fixes (AGENTS.md "Public Copy Authenticity")

Removed or rewrote:

| File | Was | Now |
|---|---|---|
| `act-fba-bip/page.tsx` | H1 "Stop Writing FBAs at 10 PM." (banned pattern) | "ACT-Informed FBA and BIP for School Teams" |
| `about/AboutContent.tsx` | "proven behavioral science"; unverified student-outcome number | "published behavior-analytic literature"; non-quantified outcome (see Q5) |
| `toolkit/page.tsx` | "used by top school-based BCBAs"; dead download button | neutral phrasing; button now downloads the existing PDF |
| `passbehavior-alternative/page.tsx` | claims that a competitor is "unavailable / DNS issues" (body), "site appears to be down" (meta) | neutral "if it is not the right fit"; meta rewritten; CTAs to `/free-practice/` |
| `compare/behaviorschool-vs-studyaba/page.tsx` | "best chance to pass", "far more value", "better overall value", "potentially unlimited" questions | balanced verdict; competitor figures attributed to "its published product pages" |
| `compare/behaviorschool-vs-magicschool/page.tsx` | "simply can't match", "Absolutely! Many school-based BCBAs use...", "significantly better value" | balanced verdict; no usage claims |
| `school-bcba/salary-by-state/page.tsx` | "Real ranges from 500+ district postings" | "Directional ranges aggregated from public K-12 district postings" |
| `school-bcba/job-guide/page.tsx` | "Become Interview-Ready in 8 Weeks" (program is 6 weeks) | "Build the Systems Districts Ask About" |
| `ce-events/CEEventsClient.tsx` | "Instant Certificates" | "CE Certificates After Verified Completion" |
| `videos/page.tsx`, `ebook/bcba-exam-guide/*` | "pass on your first attempt", "proven" | removed |
| `bcba-readiness-quiz/BCBAReadinessQuiz.tsx` | "Most popular / Best value" badges (unverified) | plan-name badges |
| `masterclass/*` | broken description; "Master proven strategies" | fixed; "Practical strategies" |
| `rbt-study/page.tsx` | H1 was a sales line | "RBT exam prep: mock exams, flashcards, and SAFMEDS." |

### 1.5 Brand voice: "AI-powered" leads removed

Per `MARKETING_CONTEXT.md`, the product should not lead with "AI-powered." Rewrote: `behavior-tools/page.tsx` H1 and IEP card, `behavior-tools/layout.tsx` description, `behavior-plans/layout.tsx` (also removed a stale "Coming Soon" title that contradicted the live tool), `fba-decision-matrix/FBADecisionMatrix.tsx` (three instances), `faq/FAQClient.tsx` link text.

### 1.6 Broken or stale items

- `act-tools/page.tsx`: "ACT Matrix Builder" card linked to `/act-fba-bip`; now links to `/act-matrix-builder`.
- `school-bcba/how-to-become` and `school-bcba/vs-school-based-bcba`: "2025" removed from titles and link labels (evergreen titles).
- `research-digest/page.tsx` (noindex): renamed "ABA Research Digest" to "The Weekly Research Brief" per the newsletter identity rule.
- `quiz/iep-goal-program`: meta description trimmed from 189 to under 160 characters.

### 1.7 Missing metadata and E-E-A-T

- `/free-study-plan`: was a client page with no metadata and an H1 ("Free Practice Exam") that did not match the URL or the page (study guide PDFs + practice exam routing + study-plan form). Added `layout.tsx` with title/description/canonical; H1 now "Free Study Guides and Practice Exams."
- `/subscribe`: in the sitemap but had no metadata. Added `layout.tsx` using `buildPageMetadata` with The Weekly Research Brief title.
- `/faq`: FAQ data moved to `faq/faq-data.tsx` with a `plainAnswer` field; `faq/page.tsx` now emits `FAQPage` JSON-LD. Answers rewritten from the verified program constants (they previously said "several weeks," "CEU details temporarily unavailable while provider renewal is processed," "multiple cohorts throughout the year," and hedged on refunds).
- Blog posts (`blog/[slug]/page.tsx`): visible byline "By Rob Spain, M.S., BCBA, IBA · date · Updated date" added under the H1; OG `authors` changed from "Behavior School" to "Rob Spain"; Article JSON-LD author now includes `sameAs: robspain.com`; publisher name fixed to "Behavior School." Google's and LLMs' author-attribution both key off visible bylines matched to schema.

### 1.8 AI-search assets

- `public/robots.txt`: explicit `Allow` group for GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, Claude-User, anthropic-ai, PerplexityBot, Perplexity-User, Google-Extended, Applebot-Extended, Amazonbot, meta-externalagent, DuckAssistBot, YouBot, CCBot, with the same private-path disallows. Training bots stay allowed (Rob, September 10, 2026).
- `public/llms.txt`: identity, offerings, key URLs, machine-readable resources, citation guidance, and the exam-prep/newsletter boundary. All URLs verified to exist and be indexable; the redirected `/iep-behavior-goals` was excluded.

---

## 2. Found, not changed (needs approval or a product decision)

### 2.1 Duplicate or cannibalizing pages

These pairs targeted the same query and split link equity. Rob approved 301s (September 10, 2026):

- `/school-bcba-training-program` → `/transformation-program`
- `/events` and `/events/:id` → `/ce-events` and `/ce-events/:id` (ACE certificate/quiz/feedback stay on `/events/:id/...`)
- `/research-digest` → `/subscribe`

Losers are out of `sitemap.ts` and listed in `legacyRedirectPaths`. `/ce-events` was added to the sitemap as the canonical catalog.
- ~~Exam-prep landing pages on the marketing domain.~~ Resolved in this PR. Each remaining exam page now has one job and one study.behaviorschool.com CTA (UTM'd via `behaviorStudyToolsAppHref` with a page-specific `intent`):

  | Route | Job | Single study CTA | Related links (internal only) |
  | --- | --- | --- | --- |
  | `/bcba-readiness-quiz` | Self-assess readiness | Results: ≤70 → free practice, >70 → free timed mock (was `?plan=monthly/quarterly/annual` with prices on the button) | weak areas, study schedule |
  | `/bcba-exam-weak-areas` | Diagnose the miss pattern | Free practice ("find weak areas in the app") | readiness quiz, retake plan, study schedule |
  | `/bcba-study-schedule` | Pick an 8/12/16-week timeline | Free practice for the baseline (was the internal pacing planner) | pacing planner, readiness quiz, retake plan |
  | `/failed-bcba-exam-help` | Build a 30-day retake plan | Free practice by domain | weak areas, study schedule, pacing planner |
  | `/ebook/bcba-exam-guide` | Deliver the PDF | Free practice after the guide | — |
  | `/rbt-study` | RBT exam prep | Primary CTA stays `rbtstudy.behaviorschool.com` (different product); the one BCBA cross-link now goes to study free practice instead of behaviorstudytools.com | — |

  `/free-bcba-practice` and `/free-bcba-practice-test` were already 301'd to `study.behaviorschool.com/free-practice/`, so the "same query" fight was settled at the routing layer; the page files were dead code (inline 20-question quiz with unverified "60-75% pass rate" copy, an ungated copy of the survival-guide PDF, and a results page that expected localStorage from the retired widget). Both directories are deleted, `/free-bcba-practice-test/results` now 301s too, and the retired paths are in `verify-canonical-links.mjs` and `verify-bcba-acquisition-routing.mjs`. Keyword-stuffed sidebars (four labels → one URL, duplicate React keys) are gone. See Q12 for the ebook PDF itself.

### 2.2 Thin or stub pages that make promises

- `/fba-to-bip`: describes a "free FBA-to-BIP generator" but the wizard is stubbed. Either finish the wizard, redirect to `/behavior-plans`, or noindex until it is real.
- `/school-bcba/first-90-days`, `/school-bcba/interview-questions`: good topics, thin bodies. Worth 600-1,000 more words each with concrete examples.
- ~~Several `/compare/*` pages carry competitor prices and question counts that will drift.~~ Resolved: no compare page lists a competitor price, question count, or tool count anymore (BDS, ABA Exam Review, MagicSchool). Pricing tables compare the *model* (one-time bundle vs. subscription; free tier vs. paid individual plan) and only our own Stripe-confirmed prices carry a "checked on" date. Nothing on those pages now needs a quarterly re-check except our own `STUDY_PRICING`.

### 2.3 Title and description hygiene

- ~~14 pages have `<title>` over 60 characters.~~ ~~Brand suffix is inconsistent: `| Behavior School`, `| BehaviorSchool`, `- Behavior School`, none.~~ Resolved. Convention: `Primary phrase | Behavior School`, 60 characters or fewer, measured on the rendered `<title>` in the build output (not the source string, which also caught `og:title`). Pages whose primary phrase already contains the brand (home, the four `/compare/behaviorschool-vs-*` pages titled "Behavior School vs X") carry no extra suffix. `BehaviorSchool` (one word) now appears only in product names (`BehaviorSchool Pro`, the study-app override title). About 50 page titles were rewritten; the middle keyword segment was dropped rather than the brand. Redirected legacy pages were not retitled.
- `scripts/verify-title-hygiene.mjs` runs in `postbuild` (also `pnpm seo:verify-titles`). It reads every prerendered sitemap page and fails the build if a `<title>` is over 60 characters, lacks "Behavior School", or ends in `| BehaviorSchool` / `- Behavior School`. Blog posts (`meta_title` from the CMS, already suffixed `| Behavior School`) are rendered on demand and are outside the check.
- `/videos/[slug]` titles come from the video record. The five videos in `public/data/videos.json` have long editorial titles (up to 71 characters with the suffix), so the `Video` type gained an optional `seoTitle` that the page prefers when present; the display title is unchanged. The admin videos writer serializes the same JSON shape, so the field round-trips.
- The study-app SEO override (`seo-draft-overrides.ts`) appended `| BehaviorSchool Study`; now `| Behavior School`.

### 2.4 Navigation IA

"Free Tools" (`/free-tools`) was added to the primary nav as the first item; it is the highest-intent free entry point for the school-BCBA audience and feeds the Transformation Program. The `/school-bcba` hub stays out of the primary nav: it is job-search content (jobs, salary, interviews), which is a different reader than a practicing BCBA deciding on the program. The `/products` nav item is labeled **Products** so it does not sit next to Free Tools as a second “Tools.”

### 2.5 Pricing inconsistency

Study product prices now come from `src/lib/study-pricing.ts`, matching live Stripe (`$29.99/month`, `$89.99/quarter`, `$288/year`, checked September 10, 2026). Stale `$49 / $149 / $199 / $249` figures were removed from the compare pages. The BDS compare page does not link out to BDS and does not restate their catalog or prices.

**Compare-page copy pass (second round).** FAQ answers and comparison rows no longer carry competitor figures of any kind: the ABA Wizard "three-mock bundle" and the BDS "thousands of module questions" phrasing are gone, and the remaining competitor statements describe *how* each product teaches (lecture-and-drill, fluency modules, fixed mock bundles) rather than how much it sells. The shared `BcbaComparisonLanding` copy dropped its "where available" / "when those features are available in your study path" hedges in favor of the approved product language (missed domain → rationale → next task; readiness from domain accuracy, response time, consistency, and mock endurance). The four keyword-titled resource cards on both comparison layouts ("BCBA practice exam", "BCBA mock exam free", two of which pointed at the same URL) were collapsed to two honest cards: free practice questions and free timed mock. The MagicSchool page hides that exam-practice section entirely since it is an IEP-tools comparison. Feature grids lost self-claims that were not verifiable on the site: "Professional Community" / "School BCBA Community" (`/community` 301s to the Transformation Program), "FERPA / COPPA Compliant" (we publish a FERPA overview; nothing on COPPA), "District / Enterprise Pricing" (now `partial`), and "FBA-to-BIP pipeline — no competitor has this."

**Dead BDS pages removed.** `src/app/compare/behaviorschool-vs-bds/` and `src/app/bds-modules-alternative/` were already 301'd to `/compare/behaviorschool-vs-bds-modules` on `main`, so the earlier "BDS: don't link out, don't restate the catalog" edits had landed on an unreachable page. Both directories are deleted; the live `bds-modules` page now carries that framing. `/passbehavior-alternative` metadata no longer asserts that the competitor's site "appears to be down" (unverified), and its CTAs go through the canonical `/free-practice/` path instead of `study.behaviorschool.com/signup`.

### 2.6 Stray files

- Accidental macOS `* 2` copies (including `src/app/subscribe/page 2.tsx` and `src/components/admin/PresentationSettings 2.tsx`) were deleted. None were imported.

### 2.7 Pre-existing lint errors

`pnpm lint` reports 250 pre-existing errors (mostly `react/no-unescaped-entities`). This PR adds none and fixes none; a mechanical cleanup PR would be low risk.

---

## 3. Questions for Rob

1. ~~X / Twitter handle.~~ Confirmed live account is `https://x.com/behavior_school`. Organization JSON-LD, school-based-bcba schema, and the newsletter template now match the footer.
2. ~~Nav "Exam Prep" destination.~~ The header "Exam Prep" item (and the landing-nav "Study Tools" link) send to `https://study.behaviorschool.com/free-practice/`. The study app's root is noindex and `scripts/verify-bcba-acquisition-routing.mjs` (run in `postbuild`) fails the build when any public page links to it, so the canonical free-practice page is the entry point. behaviorstudytools.com remains a live product but is not in the primary nav.
3. ~~Add "School BCBA Career" and "Free Tools" to the primary nav?~~ Decided: "Free Tools" added; the career hub stays in the footer only.
4. ~~Study pricing.~~ Live Stripe (checked September 10, 2026): $29.99/month, $89.99/quarter, $288/year. Compare pages now use those figures with a "checked on" note. Competitor prices, question counts, and tool counts were removed from every compare page (decided after the BDS change): they drift, they send shoppers to the competitor's checkout, and the pricing *model* is the honest comparison anyway. Second pass: FAQ answers and comparison rows are figure-free too (see §2.5).
5. ~~About-page anecdote.~~ Use the general line: the student made significant progress. Do not publish the specific “three grade levels in reading” outcome. The evidence-based line stays “published behavior-analytic literature,” not “proven.”
6. ~~Founding date.~~ Delaware Certificate of Formation is April 1, 2024 (file 3358113). Publishing that year would make the organization look newer than the founder’s work history, and 2020 is not documented. `foundingDate` omitted from Organization JSON-LD.
7. ~~AI crawler policy.~~ Leave training bots allowed. `robots.txt` keeps the explicit Allow group for search crawlers and training agents (`GPTBot`, `Google-Extended`, `CCBot`, `anthropic-ai`, and the rest). Same private-path disallows as `*`.
8. ~~Duplicate page consolidation.~~ 301s added for `/school-bcba-training-program`, `/events` + `/events/:id`, and `/research-digest`. Internal links and sitemap updated.
9. **`/fba-to-bip` stub.** Finish, redirect to `/behavior-plans`, or noindex?
10. **Salary data sourcing.** The salary pages say figures come from 2024-2025 district postings and HR schedules. Is there a saved dataset or list of sources I can cite by name (state DOE schedules, EdJoin, etc.) so the page can show its work? That is the biggest E-E-A-T lift available on those pages.
11. ~~Stray duplicate files.~~ Deleted all tracked macOS `* 2` copies (19 files). None were imported.
12. ~~The BCBA Exam Survival Guide PDF is written to the 5th Edition Task List.~~ Rebuilt on the 6th Edition. `public/ebooks/bcba-exam-guide-2026.pdf` is now generated from `scripts/generate-bcba-exam-guide-pdf.tsx` (`pnpm pdf:bcba-exam-guide`, `@react-pdf/renderer`, 13 pages) so it can be regenerated when the BACB revises the outline. Domain names, task counts (104), scored-question counts (175, plus 10 unscored pilot = 185), and percentages are copied from the BACB *BCBA Test Content Outline (6th ed.)*, updated 09/2024, and the script asserts the totals. Content: what the exam is and two "edition tells" for spotting stale materials; the nine-domain table plus a questions-per-task read and a factual "what changed from the 5th Edition" list (Task List → TCO, 92 → 104 tasks, A and E renamed, E.9–E.11 cultural humility/responsiveness/bias, weight shift toward F/H/I); a 12-week schedule that assigns domains to weeks with two full timed mocks and the four approved readiness signals; concept chapter (reinforcement/punishment, functions and assessment methods, ethics sequence, measurement, supervision); pacing at 78 s/question; mistakes with fixes; official BACB documents and two textbooks; a 30-day checklist; and a single CTA to `study.behaviorschool.com/free-practice/` with UTMs. Removed from the old file: the "64% first-time pass rate" statistic, the "thousands pass every year" line, "your first instinct is usually correct," the competitor question banks (Pass the Big ABA Exam, ABA Exam Review), and the closing "BehaviorSchool Pro / AI-powered / free 14-day trial" pitch (Pro is the FBA/BIP workspace, not exam prep). The retired 11-page duplicate `public/downloads/bcba-exam-survival-guide-2026.pdf` was deleted (nothing linked to it). Landing-page copy, chapter cards, and meta description now say 6th Edition without hedging. Separately, the email gate had never worked: it posted `firstName` but `/api/crm` requires `name`, so every submission got a 400 and nobody received the file. Fixed here. `/ebook/school-bcba-starter-kit` has the same one-line bug (not touched; outside this scope).
13. **`/rbt-study` is not in `sitemap.ts`.** It has a canonical and is indexable, but it was never added to the sitemap. Add it, or leave it discoverable via links only? Not changed (sitemap additions need approval).
14. **All five `/videos/*` pages are in the sitemap with placeholder YouTube URLs.** Every entry in `public/data/videos.json` has `videoUrl: https://www.youtube.com/watch?v=PLACEHOLDER`, so the indexed pages embed a broken player and the VideoObject JSON-LD points at a non-existent video. Options: fill in the real URLs, or pull the video pages from the sitemap and noindex them until the recordings exist. Not changed (sitemap and indexing changes need approval); titles were shortened via `seoTitle` in the meantime.
15. **`/calaba40` claims "10,000+ AI Questions."** I could not verify that count against the study app or `behaviorStudyToolsMarketing.ts`. Confirm the figure or I will replace it with the approved product language.
16. **Two orphan PDFs still mention the 5th Edition Task List.** `public/ebooks/10-bcba-practice-questions.pdf` and `public/ebooks/12-week-bcba-study-schedule.pdf` (both produced by `scripts/generate-all-cited-pdfs.tsx`) are not linked from any page. Regenerate them on the 6th Edition or delete them; not touched here.

---

## 4. Verification run for this PR

- `pnpm copy:guard`: pass
- `pnpm authenticity:check`: pass
- `pnpm typecheck`: pass
- `pnpm lint`: 250 pre-existing errors, 0 new (diffed before/after by file and message)
- `node scripts/verify-canonical-links.mjs`: pass
- `node scripts/verify-title-hygiene.mjs` (after `next build`): pass, 50 prerendered titles at 60 characters or fewer with the `Behavior School` brand
- `pnpm build` including `postbuild` routing verification: see PR description for the result
