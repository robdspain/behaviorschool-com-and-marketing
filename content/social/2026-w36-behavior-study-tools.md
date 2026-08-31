---
campaign: 2026-W36 Behavior Study Tools
status: draft_ready_manual_handoff
created_at: 2026-08-31T07:15:00-07:00
buffer_workspace_status: not_verified
buffer_reason: Scoped Behavior School Buffer credentials were not found in macOS Keychain under the expected names.
production_asset_status: verification_failed_2026-08-31
primary_product: Behavior Study Tools
review_required: true
---

# 2026-W36 Behavior Study Tools Social Package

This package is ready for review and manual scheduling. It was not scheduled automatically because the required scoped Behavior School Buffer API key, organization ID, and profile channel IDs were not available in macOS Keychain during the 2026-08-31 automation run.

The verified Behavior School Buffer profiles from `Docs/BUFFER_WORKSPACE_MAPPING.md` remain:

- Facebook Page: `6a73be9f99afb443490c8753`
- `behavior.school` Instagram: `6a73bf3399afb443490c8916`
- Behavior School YouTube: `6a74bbc899afb443491344d2`

The repository publisher can queue text through Buffer when scoped credentials are present. This run did not verify the workspace or create queue entries. Treat Facebook as schedule-blocked and treat Instagram and YouTube as platform-ready manual handoff drafts with their matching assets.

Production asset verification failed after commit `779418f` was pushed to `origin/main`: the new `/social/2026-w36-bst/*.svg` URLs returned 404 across six bounded polls on 2026-08-31. Do not schedule posts from public asset URLs until the deployment exposes those assets, or upload the committed local SVG files manually in the platform composer.

## Shipped This Week, Verified for Claims

- `https://behaviorschool.com/products` is live and presents the BehaviorSchool product suite, including Behavior Study Tools, the IEP goal writer, the invite-only Pro workspace, and the School BCBA Transformation Program.
- `https://behaviorschool.com/pro` and `https://behaviorschool.com/pro/waitlist` are live and present BehaviorSchool Pro as invite-only.
- `https://behaviorschool.com/transformation-program` is live with Behavior School branding after the branding cleanup merged on 2026-08-27.
- `https://behaviorstudytools.com/` is live and presents Behavior Study Tools as a browser-based BCBA exam-prep product with free practice and full mock entry points.
- `https://study.behaviorschool.com/free-practice/` is live and offers a free 9-question diagnostic that can be started without an account.
- `https://study.behaviorschool.com/free-mock-exam/` is live and offers a free 185-question BCBA mock exam and domain mini exams in the browser.
- `https://behaviorstudytools.com/bcba-study-schedule/` is live and describes exam-date study planning, weekly capacity, domain review, and mock-exam checkpoints.
- `https://behaviorstudytools.com/bcba-study-app-school-based-bcbas/` is live and describes short study sessions, domain results, saved questions, and a recommended next action for school-based schedules.
- The W35 Behavior Study Tools social asset path now returns 200 on production at `https://behaviorschool.com/social/2026-w35-bst/diagnostic-next-step-facebook.svg`.

## Claim Boundaries

- Keep every public statement tied to a live, verified product capability.
- Avoid proof copy, outcome promises, user narratives, artificial urgency, ranked positioning, BACB affiliation language, native app claims, and unsupported statements about other products.
- Approved capability language for this package: free diagnostic entry point, free full mock entry point, domain mini exams, domain-level results, answer explanations after completion/account creation, browser access, saved questions, and pacing or study-plan support.

## Planned Manual Schedule (Pacific Time)

| Date | Time PT | Platform | Status | Asset |
| --- | ---: | --- | --- | --- |
| 2026-08-31 | 12:15 PM | Facebook Page | Schedule-blocked, missing scoped Buffer credentials | `/social/2026-w36-bst/question-review-facebook.svg` |
| 2026-09-01 | 8:20 AM | Instagram | Draft, manual handoff | `/social/2026-w36-bst/domain-map-instagram.svg` |
| 2026-09-02 | 3:35 PM | YouTube Shorts | Draft, manual video handoff | `/social/2026-w36-bst/full-mock-review-short.svg` |
| 2026-09-03 | 9:35 AM | Facebook Page | Schedule-blocked, missing scoped Buffer credentials | `/social/2026-w36-bst/study-plan-facebook.svg` |
| 2026-09-04 | 11:20 AM | Instagram | Draft, manual handoff | `/social/2026-w36-bst/school-week-dashboard-instagram.svg` |

## Facebook - Monday

**Workspace:** Behavior School Products
**Profile:** Behavior School Facebook Page
**Planned time:** 2026-08-31 12:15 PM PT
**Status:** Schedule-blocked, missing scoped Buffer credentials
**Tracked link:** https://study.behaviorschool.com/free-practice/?utm_source=facebook&utm_medium=social&utm_campaign=2026_w36_bst_week&utm_content=monday_question_review

Do not let a missed BCBA practice question end at the score.

Use the explanation to name the concept, identify the tempting distractor, and choose the next focused practice block. Behavior Study Tools gives candidates a browser-based place to start with a short diagnostic, review what happened, and decide what to study next.

Start free BCBA practice:
https://study.behaviorschool.com/free-practice/?utm_source=facebook&utm_medium=social&utm_campaign=2026_w36_bst_week&utm_content=monday_question_review

## Instagram - Tuesday

**Workspace:** Behavior School Products
**Profile:** behavior.school Instagram
**Planned time:** 2026-09-01 8:20 AM PT
**Status:** Draft, manual handoff
**Tracked link:** https://study.behaviorschool.com/free-practice/?utm_source=instagram&utm_medium=social&utm_campaign=2026_w36_bst_week&utm_content=tuesday_domain_map

### Caption

A broad BCBA review plan can hide the domain that needs attention.

Start smaller: take the free 9-question diagnostic, check the content-area signal, then choose one next study block. The goal is not to review everything equally. The goal is to make the next session specific.

Behavior Study Tools runs in the browser and gives candidates a practical starting point.

Link in bio.

#BCBA #BCBAExam #BehaviorAnalysis #ExamPrep

### Carousel Brief

1. Cover: "Make the next block specific"
2. "Start with 9 diagnostic questions"
3. "Check the content-area signal"
4. "Choose one domain mini mock"
5. "Review the explanation"
6. "Return to the plan"

### Alt Text

Behavior Study Tools carousel showing a BCBA candidate moving from a 9-question diagnostic to a focused content-area study block.

## YouTube Shorts - Wednesday

**Workspace:** Behavior School Products
**Profile:** Behavior School YouTube
**Planned time:** 2026-09-02 3:35 PM PT
**Status:** Draft, manual video handoff
**Tracked link:** https://study.behaviorschool.com/free-mock-exam/?utm_source=youtube&utm_medium=social&utm_campaign=2026_w36_bst_week&utm_content=wednesday_full_mock_review

### Short Script

Hook: A full mock should create a study plan, not just a score.

Beat 1: Show the free 185-question mock exam entry point.

Beat 2: Cut to the result review. "Now look for the domain pattern."

Beat 3: Name the next step: pick one domain, review explanations, then return to shorter practice before the next full mock.

Close: Start the free BCBA mock exam in Behavior Study Tools.

### Description

Use a full BCBA mock exam as a checkpoint. Then review the domain pattern and decide what belongs in the next study block.

Start the free full mock:
https://study.behaviorschool.com/free-mock-exam/?utm_source=youtube&utm_medium=social&utm_campaign=2026_w36_bst_week&utm_content=wednesday_full_mock_review

#BCBA #BCBAExam #BehaviorAnalysis

## Facebook - Thursday

**Workspace:** Behavior School Products
**Profile:** Behavior School Facebook Page
**Planned time:** 2026-09-03 9:35 AM PT
**Status:** Schedule-blocked, missing scoped Buffer credentials
**Tracked link:** https://behaviorstudytools.com/bcba-study-schedule/?utm_source=facebook&utm_medium=social&utm_campaign=2026_w36_bst_week&utm_content=thursday_study_plan

The study plan should connect to the practice result.

Start with your exam date and available weekly study time. Add a practice checkpoint. Then let the domain result decide which topic gets the next protected block.

Behavior Study Tools keeps the plan tied to practice, not just a list of topics.

Build a BCBA study schedule:
https://behaviorstudytools.com/bcba-study-schedule/?utm_source=facebook&utm_medium=social&utm_campaign=2026_w36_bst_week&utm_content=thursday_study_plan

## Instagram - Friday

**Workspace:** Behavior School Products
**Profile:** behavior.school Instagram
**Planned time:** 2026-09-04 11:20 AM PT
**Status:** Draft, manual handoff
**Tracked link:** https://behaviorstudytools.com/bcba-study-app-school-based-bcbas/?utm_source=instagram&utm_medium=social&utm_campaign=2026_w36_bst_week&utm_content=friday_school_week_dashboard

### Caption

School-based candidates need a study rhythm that survives a school week.

Use short practice when the day is packed. Save the full mock for protected time. Then return to domain results, saved questions, and the recommended next action so the next session starts faster.

Behavior Study Tools is built for browser access, focused review, and practical next steps.

Link in bio.

#BCBA #SchoolBCBA #BCBAExamPrep #BehaviorAnalysis

### Carousel Brief

1. Cover: "Study around the school week"
2. "Short practice for crowded days"
3. "Full mock for protected time"
4. "Domain results for focus"
5. "Saved questions for review"
6. "One next action"

### Alt Text

Behavior Study Tools carousel showing a school-based BCBA candidate using short practice, full mock checkpoints, domain results, saved questions, and a recommended next action.

## Manual Handoff Checklist

- Add scoped Behavior School Buffer credentials before scheduling from Buffer.
- Verify the Facebook, Instagram, and YouTube profiles match the Behavior School Products workspace.
- Use the tracked URL assigned to each post. Do not reuse another platform's UTM.
- Upload the matching asset for each post.
- Do not schedule LinkedIn from the Behavior School package unless a scoped Behavior School LinkedIn profile is added and verified.
- Do not schedule Instagram or YouTube content without reviewing the visual or video asset in the native platform composer.
- Record Buffer post IDs or native platform URLs in this file after scheduling or publishing.
