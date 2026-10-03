# CRM: Frappe CRM assessment

Date checked: 1 October 2026.

Recommendation: keep the Behavior School CRM in Convex and borrow five specific Frappe ideas. Do not migrate to Frappe CRM, and do not run a hybrid. Section 6 recommends the same kind of decision for email: keep the current Resend, Mailgun, and Convex newsletter senders, and do not add Mautic.

This is an assessment only. No application code was changed. Prices below are the figures published on the cited pages on 1 October 2026. This note does not invent a VPS bill, a Twilio bill, a contact count, or a revenue outcome. Day figures are engineering estimates from the files named, not a delivery schedule.

## 1. What we have

### The live system is Convex

The CRM that the admin panel uses is Convex, in `convex/crm.ts` and `convex/schema.ts`, with screens at `/admin/crm`, `/admin/crm/contacts`, `/admin/crm/pipeline`, `/admin/crm/tasks`, and `/admin/crm/discovery-calls`.

`CRM_SETUP_COMPLETE.md` describes a different system. It tells you to run `supabase-crm-setup.sql`, and it lists `crm_email_sequences` and `crm_sequence_enrollments`. Those sequence tables are not in the Convex schema. The live marketing and admin CRM does not use that Supabase design. Treat that file as a stale setup note.

### Data model

These Convex tables are the CRM and the records that hang off it.

| Table | What it stores |
| --- | --- |
| `crmContacts` | Person record. Name, email, phone, organization, role, employer, role category (`school_bcba`, `clinic_bcba`, `other`), payment path (`self_pay`, `district_po`, `district_card`, `unknown`), urgency (`this_month`, `this_quarter`, `this_year`, `exploring`), caseload size, status, lead source, tags, notes, marketing consent, attribution, lead score, priority, follow-up date, Stripe customer id, revenue, archive flag. |
| `crmDeals` | A titled opportunity on a contact. Value, stage string, probability, expected close date, payment option, optional discovery call. |
| `crmTasks` | Follow-up on a contact. Title, due date, priority, status (`pending`, `completed`, `overdue`), task type, optional discovery call. No assignee field. |
| `crmActivities` | Log line. Type, subject, body, optional metadata, links to contact, task, deal, and discovery call. |
| `crmDiscoveryCalls` | Call log. Time, role, school setting notes, fit (`perfect_fit`, `strong_fit`, `not_fit`, `needs_follow_up`), program, payment option discussed, next step, checkout link, follow-up status. |
| `crmEmailLogs` | Checkout follow-up email. Recipient, subject, link, provider message id, status (`draft`, `sent`, `failed`). |
| `stripeWebhookEvents` | Idempotency ledger for Transformation Program Stripe events. Event id, session, invoice, customer, subscription, amount, contact. |
| `transformationNurtureEnrollments` and `transformationNurtureEmails` | Drip enrollment and queued steps, each tied to a contact. |

Contact status values are `lead`, `contacted`, `qualified`, `onboarding`, `customer`, `churned`, and `inactive`.

Nearby tables are not the CRM, but they hold people who sometimes also become contacts: `signupSubmissions`, `downloadSubmissions`, `schoolBcbaSurveyResponses`, and `iepGoalProgramQuizResponses`.

Indexes exist for email, Stripe customer id, status, archive, deal stage, task due date, and discovery follow-up status. Several list queries still call `.collect()` and filter in memory, including `listContacts` and the dashboard.

### Features that work

- Contact list, search, status, tags, notes, lead score, priority, archive, and hard delete. The contacts API is admin-gated.
- Manual contact create from `/admin/crm/contacts`.
- Transformation Program application capture, including employer, role category, payment path, urgency, certification number in the notes, marketing consent, and attribution.
- Discovery call logging. Saving a call updates or creates the contact, writes the call, creates a "Send checkout follow-up" task, and creates a deal. `getDealValue` in `convex/crm.ts` returns 1997 for every payment option discussed. The comment in that function says this matches the October public tuition.
- Checkout follow-up from the discovery call screen. The route sends mail through Mailgun and then marks the task complete and the email log sent, or logs a failure.
- Tasks list, create, update, and delete.
- Deals list and create through `/api/admin/crm/deals`.
- Stripe `checkout.session.completed` marks the contact as a customer, adds the paid amount to `revenue`, closes an open deal as `closed_won` or inserts one, and stores the webhook receipt. Later `invoice.paid` events add revenue only when a contact already exists for that Stripe customer or email. A failed invoice writes an activity and does not change status. Duplicate Stripe event ids are ignored.
- Dashboard query in `convex/crm.ts`: contact counts, pipeline value, pending tasks, discovery calls today, follow-ups not sent, and paid enrollments. The admin home page reads the discovery slice of that payload.
- Transformation nurture. `src/lib/transformation-nurture.ts` queues steps on the contact and sends due mail through Resend. `netlify/functions/transformation-nurture-worker.ts` calls `/api/transformation-program/nurture/process` with a shared secret. A purchase marks the nurture converted.
- Marketing readers. The transformation marketing admin and the Behavior Study Tools referral campaign read `crmContacts`. They do not create the sales record.

### Features that look finished and are not

- The pipeline page is a filterable table. The Add Deal button has no handler. The stage filter is `qualification`, `proposal`, `negotiation`, `closed_won`, and `closed_lost`. Discovery calls write `discovery_call_completed`, so those deals only appear under All Deals.
- View, edit, and delete icons on pipeline rows have no handlers.
- `crmActivities` is written by applications, calls, checkout mail, and Stripe. None of the pages under `src/app/admin/crm` render that timeline.
- Lead score is a stored number. New applications start at 50, priority quiz leads at 40, other quiz leads at 20, and most other creates at 0. Nothing recalculates it from later behavior.
- There is no per-person assignment. Tasks have no owner field.
- `CRM_SETUP_COMPLETE.md` promises email sequences, a kanban, and a Supabase migration. The live sequence mechanism is the Transformation nurture tables, not those promised CRM sequence tables.

### Who writes a CRM contact

These paths insert or update `crmContacts`.

| Path | How |
| --- | --- |
| `/api/admin/crm/contacts` | Admin creates a contact. Session required. |
| `/admin/crm/discovery-calls` | Admin logs a call, which upserts the contact and opens a task and a deal. |
| `/api/transformation-program/apply` | `recordTransformationApplication`, then a signup submission, then nurture. |
| `/api/signup` | Does not write `crmContacts`. It writes `signupSubmissions` only. |
| `/api/lead-magnet` | `upsertContact`, then the separate newsletter list. Transformation-intent magnets also start nurture. |
| `/api/quiz/iep-goal-program` | Quiz mutation writes the contact and the quiz response. Priority access can start nurture. |
| `/api/school-bcba-survey` | Survey mutation writes a contact only when the person consents to contact and gives a first name. The route can also start nurture. |
| `/api/hold-my-spot` | Starts nurture, which upserts the contact. |
| `/api/transformation-program/nurture` | Starts nurture, which upserts the contact. |
| `/api/integrations/plan-leads` | Shared-secret webhook from plan.behaviorschool.com. Upserts a contact and subscribes the newsletter list. |
| `convex/stripeWebhook.ts` | Purchase can create a contact. Installment payment and payment failure require a contact that already matches the Stripe customer or email. |
| `/api/crm` | Legacy GET, POST, and PATCH on contacts. This route file does not call `requireAdminApiSession`. |

### What does not write the CRM

Checked, and not connected to `crmContacts`:

- The public contact page posts to `/api/newsletter`. That list lives on a separate Convex deployment (`src/lib/convex-newsletter.ts`), not in these CRM tables. The Weekly Research Brief stays on that newsletter boundary.
- `/api/download-subscribe` writes `downloadSubmissions` and calls Listmonk.
- `/api/collect-email` and `/api/quiz-signup` write a Supabase `email_leads` table when that client is configured.
- `/api/accelerator-waitlist` and `/api/observations-beta-waitlist` append local JSON files.
- `/api/calaba-signup` creates a Resend contact and sends a Resend email.
- `/api/ace/registrations/waitlist` writes ACE event registration records.
- Calendly is the booking page linked from `src/lib/transformation-program.ts` (`https://calendly.com/robspain/behavior-school-transformation-system-phone-call`). Nothing in this repo receives a Calendly webhook. The call enters the CRM only when someone types it into the discovery call form.
- No application source calls n8n. A string match in `package-lock.json` is an integrity hash, not an integration.

### Integrations that do touch the CRM

- Stripe, for Transformation Program checkout and installment invoices.
- Mailgun, for the one checkout follow-up template.
- Resend, for Transformation nurture.
- The plan.behaviorschool.com lead webhook.
- Google sign-in for admin, via the allowlist in `ADMIN_GOOGLE_ALLOWED_EMAILS`.

### Who uses it

The admin login is Google, limited to the allowlist. After login, `src/lib/admin-auth.ts` treats every session as one shared user, `admin@behaviorschool.com`. The CRM has no owner, team, or role on a contact.

The screens and the checkout email are built for one operator running Behavior School sales. The follow-up letter is signed Rob Spain, BCBA. The same contact list is also read by the transformation marketing screen and the Behavior Study Tools referral audience. This is not a multi-rep sales desk.

## 2. Frappe CRM

Sources for this section are the Frappe docs, the Frappe CRM README, the GitHub repository metadata, and the pricing pages linked at the end. Repository metadata was read from the GitHub API on 1 October 2026: license `AGPL-3.0`, default branch `develop`, `pushed_at` `2026-10-01T02:25:16Z`.

### Features Frappe ships

From the README and the CRM docs:

- Leads and deals, with convert-lead-to-deal. Conversion can create or link a Contact and an Organization.
- List and kanban for leads and deals, plus saved custom views.
- One record page with activity, email, comments, data, calls, tasks, notes, and attachments.
- Email send and receive on the lead or deal, including templates.
- Calls. Twilio is a built-in integration for calls from the lead, deal, and contact pages, with optional recording. Exotel is a built-in integration for calls through an agent's mobile phone, also with recording. Both need that vendor's account.
- WhatsApp through the separate [Frappe WhatsApp](https://github.com/shridarpatil/frappe_whatsapp) app named in the README.
- Tasks and notes on the lead or deal.
- SLA policies on leads or deals: response time, optional rolling response, working hours, and a holiday list. Documented at [Service Level Agreement](https://docs.frappe.io/crm/service-level-agreement).
- Assignment rules on leads or deals: condition, user list, auto-rotate or assign-by-workload, unassignment condition, and a day schedule. Documented at [Assignment Rule](https://docs.frappe.io/crm/assignment-rule).
- Web forms that create a Lead or a Deal, with a hosted link or an iframe embed. Documented at [Web Form](https://docs.frappe.io/crm/web-form) and [Capturing leads with a web form](https://docs.frappe.io/crm/capturing-leads/web-form).
- Other capture paths named in the lead doc: Facebook and Instagram lead ads, spreadsheet import, and custom scripts.
- REST for every DocType at `/api/resource/:doctype`, plus whitelisted methods at `/api/method/...`. Auth is token or password. Documented in the [Frappe REST API](https://docs.frappe.io/framework/user/en/api/rest).
- Webhooks on a DocType event, with optional conditions, headers, and an `X-Frappe-Webhook-Signature` HMAC. Documented in [Webhooks](https://docs.frappe.io/framework/user/en/guides/integration/webhooks).
- ERPNext, if you want invoicing and accounting in the same Frappe site.
- Roles such as Sales Manager and System Manager. The CRM pricing FAQ says plans do not cap leads, deals, contacts, or sales agents.

Frappe does not ship Behavior School's discovery fit field, payment path, urgency window, Thursday-session capacity, Stripe installment ledger, or Transformation nurture. Those would be custom fields, a custom app, or scripts.

### Hosting and the prices they publish

Two options.

Self-host. The software cost on [the CRM pricing FAQ](https://frappe.io/crm/pricing) is zero: "You can self-host Frappe CRM for free since it's fully open-source." The [README](https://github.com/frappe/crm) production path is `easy-install.py` with the container image `ghcr.io/frappe/crm`. The stack under that is Frappe Framework, which brings MariaDB, Redis, Python, and a Vue front end. Frappe's [cloud pricing comparison](https://frappe.io/cloud/pricing) describes self-hosting as manual deploy, manual upgrades, manual backups, and manual monitoring, and it labels self-host pricing "complicated and unpredictable." That page does not publish a VPS price. This assessment does not add one.

Frappe Cloud. The same CRM FAQ says managed hosting starts at $5/month. [Shared hosting](https://frappe.io/cloud/shared-hosting) is the page with a full table:

- Shared bench groups start at $5 per site per month. Private bench groups start at $25 per site per month.
- Shared benches auto-upgrade and include Frappe-maintained apps such as Frappe CRM. Private benches can turn upgrades off, install Marketplace or custom apps, and get SSH.
- The rupee ladder on that page is ₹410, ₹820, ₹2,050, ₹3,075, and ₹4,100 per month, with daily CPU time of 0.5, 1, 2, 3, and 4 hours, database size of 0.2, 0.5, 1.0, 1.5, and 2.0 GB, and storage of 2.5, 5, 25, 37.5, and 50 GB.
- No per-user cap. The limit that matters is daily CPU time.
- The page's example of a starting plan is $10/month if you are unsure.

[The CRM pricing page](https://frappe.io/crm/pricing) also shows $20 and ₹1,800 in its plan picker, next to copy about a single site and a virtual machine. [The customer guide](https://docs.frappe.io/customer-guide/pricing/frappe-cloud-pricing) says site plans start from around $5/month, server plans start from around $20/month, and site plans run from around $5 to $200/month. It says the live source of truth is [frappe.io/cloud/pricing](https://frappe.io/cloud/pricing), because figures move.

Twilio, Exotel, and WhatsApp are not included in those hosting figures. Each is a separate account.

A Behavior School custom app, or any script that cannot live on a shared bench, needs a private bench. That published floor is $25 per site per month, before the CPU tier and before Twilio.

### License

Frappe's [license and trademark policy](https://docs.frappe.io/legal/others/license-and-trademark), updated 28 June 2026, lists Frappe CRM as GNU Affero General Public License v3.0. The GitHub API reports the same SPDX id, `AGPL-3.0`. Frappe Framework itself is MIT. ERPNext is GPLv3. Those are different licenses, and only the CRM license applies to the CRM app.

AGPL-3.0 section 13, in [the GNU text](https://www.gnu.org/licenses/agpl-3.0.html), covers remote network use of a modified program. If you modify the CRM and users interact with that modified program over a network, you must offer those users the corresponding source under the AGPL. Running the unmodified app for Behavior School's own sales does not, by itself, force the Next.js site to become AGPL. A fork that hard-codes discovery calls, Stripe, or checkout mail into `frappe/crm` would. A tightly linked custom Frappe app can raise the same question. Frappe's trademark FAQ says you may build paid apps if you comply with the underlying product license. This paragraph is not legal advice. Any fork should go to counsel before it is deployed.

The trademark policy also forbids putting "Frappe" in a product or domain name without written permission. An internal tool name does not need their brand.

### Operational burden

Frappe Cloud on a shared bench removes server care and blocks custom apps. A private bench or a VPS puts upgrades, backups, Redis, MariaDB, email domain authentication, and the Vue/Python release train on us. The CRM README supports Frappe v15 and v16 on the stable line, and the `develop` branch tracks a future v17.

We would also operate a second production system beside Convex. Stripe receipts, nurture steps, quiz answers, survey answers, and signup submissions would still need a home. Frappe would not replace those writers by itself.

Email inside Frappe CRM wants a mailbox connected to the site. Our checkout mail is a single Mailgun template, and nurture is Resend. Moving conversation history means moving those sends, or accepting that the Frappe timeline will not show them.

## 3. Side by side

| Question | Behavior School CRM today | Frappe CRM |
| --- | --- | --- |
| Where the sales record lives | Convex, next to signup, quiz, survey, nurture, and Stripe receipts | Its own MariaDB site |
| Users | One shared admin session. No assignees. | Unlimited users on every published plan. Assignment rules expect a team. |
| Pipeline | Table. Discovery stage does not match the filter chips. No drag and drop. | Kanban and list, custom stages, convert lead to deal. |
| Calls | Manual log after a Calendly call. Fit and payment option are first-class fields. | Twilio and Exotel click-to-call, plus a call log. No Calendly connector in the docs read here. |
| Email | One outbound Mailgun checkout letter, plus a separate Resend nurture. No inbound thread on the contact. | Send and receive on the lead or deal, with templates. |
| Tasks | Real CRUD, tied to a contact and sometimes a discovery call. | Tasks on the lead or deal. |
| SLA | Dashboard counts pending follow-ups and overdue tasks. No policy clock. | SLA policies with hours and holidays. |
| Web forms | Next.js routes with Behavior School fields and spam checks. | Hosted or embedded forms that create a Lead or Deal. |
| API | Convex mutations, some of them reachable without the admin session check. | REST and webhooks with token auth and a webhook signature. |
| Payments | Stripe customer id, revenue, idempotent webhook ledger, installment failure log. | Not built in. ERPNext is the documented path for invoicing. |
| Program fields | Role category, payment path, urgency, fit, Thursday capacity in the application notes. | Would be custom fields. |
| Newsletter | Separate Convex list. The Weekly Research Brief stays off this CRM. | Not our newsletter system. |
| Hosting cost of the CRM itself | Included in the existing Convex deployment. No second CRM invoice in this repo. | $0 software if self-hosted, or Frappe Cloud from $5/month shared and $25/month private, plus CPU tier. |
| Change risk | We already own the code path from form to Stripe. | New stack, new auth, and a rewrite of every writer in section 1. |

## 4. Recommendation

Choose (b). Keep this CRM and copy five Frappe behaviors into it.

### Why a full move is the wrong trade

The part that makes this CRM useful is not the contact grid. It is the path from a school BCBA application, through a discovery call, to a $1997 deal, a Mailgun checkout link, a Stripe receipt, and a closed deal. That path is already in Convex. Frappe's kanban, SLA, and telephony are real, and they are also generic. Recreating fit, payment path, urgency, consent, nurture, and the Stripe ledger inside Frappe is a second build of the same workflow.

The operator model does not match Frappe's best features. Assignment rules, auto-rotate, and workload balancing need more than one rep. The allowlist session is one shared admin. Twilio and WhatsApp add vendors we do not use for this sale. Calendly is the booking tool, and the call notes are the product.

AGENTS.md keeps behaviorschool.com marketing and admin on Convex. A Frappe site would be a second database for the same people, with MariaDB and Redis to patch. The stale Supabase setup note is a warning, not a template. We already left one extra CRM database behind.

`/api/crm` and the Convex CRM mutations are a real gap. Frappe's roles are better than a missing session check. That gap is a small fix in the current app. It is not a reason to change platforms.

### Why a hybrid loses

A hybrid would keep Convex as the system of record and use Frappe as the screen, or the reverse. Every writer in section 1 would need a webhook in one direction and a reconciliation job in the other. Stripe's idempotency ledger, nurture conversion, and the "do not double-count revenue" rule would have two copies. Calendly, Mailgun, and Resend would still sit outside Frappe unless we moved them too. For one operator, two CRMs means two places a follow-up can be marked sent.

No migration plan is included, because the recommendation is not (a) or (c).

## 5. Five features to add, in order

Each estimate is engineering time from the files named. It is not a promise about calendar time.

1. Close the public write path. About 2 days. `/api/crm` does not call `requireAdminApiSession`, and the mutations in `convex/crm.ts` do not check an admin identity. Admin routes already use the session helper. Keep the public captures that are supposed to be public (`lead-magnet`, the quiz, the application, the plan webhook, the survey) on their own validated routes. Stop treating the legacy `/api/crm` POST as an open upsert. This is the Frappe idea of a role boundary, applied to the code we have.

2. Make the pipeline match the deals we actually write. About 3 days. Add a deal stage update on `crmDeals`. Rebuild `/admin/crm/pipeline` as a kanban whose columns include `discovery_call_completed`, then the later stages through `closed_won` and `closed_lost`. Wire Add Deal, and wire move, edit, and delete. Today the discovery deal is invisible inside the stage chips.

3. One contact page. About 3 days. `crmActivities`, `crmDiscoveryCalls`, `crmDeals`, `crmTasks`, `crmEmailLogs`, consent, and Stripe revenue already exist. The admin CRM screens do not show the activity rows. A single contact screen should list them in time order, which is the Frappe lead page without a new database.

4. A follow-up clock. About 2 days. The dashboard query already counts `followUpNotSent` and overdue tasks. Turn that into a queue: discovery calls still `pending`, applications with `followUpDate` of today or earlier, and tasks past due. Store a due time and a breached flag. Skip holiday calendars and multi-agent assignment. One operator does not need the full Frappe SLA document.

5. Put program applications on the contact. About 2 days. `/api/transformation-program/apply` writes both `crmContacts` and `signupSubmissions`. `/api/signup` writes only `signupSubmissions`. Route the signup form through the same contact upsert, with lead source `signup`, and leave the newsletter, the Weekly Research Brief, exam-prep magnets, and download Listmonk calls where they are. The sales CRM should see program applicants. It should not absorb every email list.

Leave these Frappe features alone for now: Twilio, Exotel, WhatsApp, assignment rotation, Facebook and Instagram lead ads, and ERPNext. They need extra vendors or a second product, and they do not fix the discovery-to-Stripe path.

## 6. Mautic for email campaigns

### How campaigns and lifecycle mail work today

`docs/EMAIL_SYSTEM_COMPLETE.md` is not in this repository. The closest written maps are `Docs/newsletter-system.md`, `Docs/EMAIL_BRAND_VOICE.md`, `LISTMONK_NEWSLETTER_CAMPAIGN_SETUP.md`, and `src/lib/email-marketing-catalog.ts`. No application source calls n8n. The only `n8n` string in the tree is an integrity hash in `package-lock.json`.

`Docs/newsletter-system.md` says the Convex-backed School BCBA Research Brief workspace at `/admin/newsletter` is the only active newsletter manager, and that the old Supabase and Listmonk manager has been retired. The same file keeps an older note that a production check on 3 July 2026 found Listmonk `configured:false` and the Supabase and Mailgun newsletter status at 0 subscribers, 0 lists, and 0 campaigns. The catalog still labels The Weekly Research Brief as `Listmonk broadcasts`. Those two documents disagree. The code that public signup uses is the Convex path.

| Job | What actually sends | Where it lives |
| --- | --- | --- |
| Research brief signup | Convex action `newsletterActions:requestSubscription` on the delivery deployment (`precious-clownfish-797` unless `NEWSLETTER_CONVEX_URL` overrides it) | `src/lib/convex-newsletter.ts`, `/api/newsletter`, `/api/newsletter/subscribe` |
| Research brief editing and send records | Convex admin calls with `NEWSLETTER_CONVEX_ADMIN_TOKEN` | `src/lib/newsletter-admin.ts`, `/admin/newsletter` |
| Optional Resend contact mirror | Resend Contacts API, into `RESEND_SUBSCRIBERS_SEGMENT_ID` or `RESEND_AUDIENCE_ID` | `upsertNewsletterSubscriber` in `src/lib/resend.ts` |
| Transformation Program drip | Five queued steps in Convex, sent by the Resend emails API. Delays are day 0, 1, 3, 5, and 7. A Netlify function calls `/api/transformation-program/nurture/process` with a shared secret. | `convex/transformationNurture.ts`, `src/lib/transformation-nurture.ts` |
| Discovery checkout follow-up | One Mailgun template after a logged call | `src/app/api/admin/crm/discovery-calls/[id]/follow-up/route.ts` |
| Signup notification | Mailgun, using a Convex `emailTemplates` row, to `NOTIFICATION_EMAIL` | `src/app/api/signup/route.ts` |
| Payment link and masterclass certificate | Mailgun | `src/app/api/admin/send-payment-link/route.ts`, `src/lib/masterclass/certificate-service.ts` |
| Welcome, marketing, newsletter helper, transactional, IEP checklist, contact form | Resend emails API from `src/lib/email.ts` | Callers across API routes |
| CalABA, observations beta, tool signup, FBA tool, hold-my-spot, support | Resend emails API, sometimes also a Resend contact | The matching routes under `src/app/api` |
| Legacy list campaigns | Supabase tables `nm_campaigns`, `nm_queue`, and `nm_subscribers`, then Mailgun, with a click wrapper and an open pixel | `src/lib/nm-mail.ts`. The newsletter doc says this manager is retired. |
| Listmonk | Client code still in `src/lib/listmonk.ts` and `src/lib/newsletter.ts` | Newsletter doc says it is not the live source of truth. |

The catalog marks two sequences live: Behavior Study Tools (`Study app nurture + Resend`) and the Transformation Program (`Resend`). The four Study Tools steps exist as copy in `src/lib/email-marketing-catalog.ts`. No sender in this repository reads `behaviorStudyToolsSequence`. Supervision is marked manual. Behavior School core templates are marked manual. Upcoming products are marked planned. The Weekly Research Brief is marked manual.

From addresses in `src/lib/resend.ts` use `updates.behaviorschool.com` (`noreply@`, `rob@`, and `support@`). Reply-to for Rob's mail is `rob@behaviorschool.com`.

There is no visual campaign builder, no A/B test, no website tracking pixel, and no points model that changes a send. The CRM `leadScore` field is a stored number, set at create time, and it does not drive email.

### What Mautic adds

Mautic 8 docs, checked 1 October 2026, describe the pieces this repo builds by hand:

- Segments are static or dynamic lists of contacts. Dynamic membership is recalculated by cron from filters, including points. Docs: [Managing Segments](https://docs.mautic.org/en/8.0/segments/manage_segments.html).
- The campaign builder starts from a segment or a form. Decisions include device, asset download, form submit, and page visit. Conditions include tags, segments, points, and field values. Actions include send email, change points, and change segments. Delays are part of the graph. Docs: [Campaigns overview](https://docs.mautic.org/en/8.0/campaigns/campaigns_overview.html) and [Using the Campaign Builder](https://docs.mautic.org/en/8.0/campaigns/campaign_builder.html).
- Drip is that builder, not a separate product. A wait, then an email, then a branch if the contact did not visit a page, is a campaign.
- Lead scoring is Points. Form submit actions can add, subtract, multiply, or divide points. Point triggers can move a contact into a segment. Docs: [Forms](https://docs.mautic.org/en/8.0/components/forms.html) and the points trigger section of the segments doc.
- Forms are campaign forms or standalone forms, with progressive profiling and submit actions. They can be embedded.
- Landing pages are a Mautic component, including drafts when `page_draft_enabled` is set. Docs: [Landing Pages](https://docs.mautic.org/en/8.0/components/landing_pages.html).
- Tracking is a JavaScript snippet or a tracking pixel on your site, plus an email open pixel Mautic inserts. The contact doc says the script is preferred over the pixel, and that logged-in Mautic users are not tracked. Docs: [Managing Contacts](https://docs.mautic.org/en/8.0/contacts/manage_contacts.html) and [configuration settings](https://docs.mautic.org/en/8.0/configuration/settings.html).
- A/B tests apply to segment emails. You set the winner rule, such as read rate or click rate, a wait (the doc's default is 24 hours), and a test slice (the doc's default is 10 percent). The rest of the segment gets the winner. Docs: [Emails](https://docs.mautic.org/en/8.0/channels/emails.html).

Template emails are the repeatable campaign messages. Segment emails are the one-send-per-contact broadcasts.

### Hosting and published prices

The software download is free. [Mautic's download page](https://mautic.org/download/) says it will stay free to download and use, and it says not to install it on cheap shared hosting. It tells you to use a virtual private server or a dedicated server, and to be ready for the command line, Apache or nginx, MySQL or MariaDB, PHP, and cron. [The install doc](https://docs.mautic.org/en/8.0/getting_started/how_to_install_mautic.html) requires PHP `max_execution_time` of at least 240 seconds. Mautic does not publish a VPS price. This note does not add one.

[Cron jobs](https://docs.mautic.org/en/8.0/configuration/cron_jobs.html) are mandatory for segment updates, campaign actions, and queued or scheduled mail. That page says you add them yourself.

Managed hosting on [Mautic's own managed page](https://mautic.org/start-using-mautic/managed-mautic/) is sold by Dropsolid, named there as the official trials and hosting partner. Figures on that page:

- Essential, from €247.50 per month when billed annually, or €275 per month when billed quarterly. Shared hosting, email service included, up to 50,000 emails a month, up to 50,000 contacts, up to 100 emails a minute.
- Professional, from €1,237 per month. Dedicated hosting, dedicated IP, from 50,000 emails and 50,000 contacts a month, up to 2,000 emails a minute.
- Enterprise, custom pricing, up to 6 million emails a month and up to 4,000 emails a minute.
- No per-user fee on those plans.
- Setup and migration fees are not listed. The FAQ says they vary by partner.

[Mautic's comparison with ActiveCampaign](https://mautic.org/mautic-vs-activecampaign/) repeats "managed Mautic from €247.50 per month" and says the price driver is infrastructure and email volume, not contacts.

Those Dropsolid plans include their email service. Bringing Resend or SES instead is the self-host or Enterprise "custom email provider" case, not the Essential bundle.

### Deliverability if Mautic sends through Resend or SES

Mautic does not own a sending reputation. [Email settings](https://docs.mautic.org/en/8.0/configuration/settings.html) say SMTP is the default transport, configured as a Symfony mailer DSN. The example form is `smtp://user:pass@smtp.example.com:port`. The install wizard can also pick a listed provider or "Other SMTP Server."

Resend's SMTP settings, from [Send emails with SMTP](https://resend.com/docs/send-with-smtp), are host `smtp.resend.com`, username `resend`, password equal to the API key, and ports 465 or 2465 for implicit TLS, or 587, 2587, or 25 for STARTTLS. Mautic's settings doc says to avoid port 25. A Mautic DSN would look like `smtp://resend:API_KEY@smtp.resend.com:587`. Mail sent that way shows up in Resend's emails table, and Resend's API rate limit still applies.

[Resend's email types doc](https://resend.com/docs/email-types) separates the products. A transactional plan sends through the API, the CLI, or SMTP. A marketing plan sends Broadcasts from the dashboard or the Broadcast API, with Resend doing the queue, throttle, and schedule. Mautic campaign mail over SMTP would not be a Resend Broadcast. It would not use Resend segments, the Resend unsubscribe page, or broadcast analytics. It would be a stream of individual SMTP messages on the transactional side of the account. This repo already sends the Transformation drip that way, one Resend API call per step, without Mautic.

Amazon SES can be the SMTP server in that same "Other SMTP Server" slot. SES also has an API. A Mautic maintainer's note on [GitHub issue 13181](https://github.com/mautic/mautic/issues/13181) says Mautic 5 dropped the old Amazon SMTP picker, and that SES API sending needs `composer require symfony/amazon-mailer` and a `ses+api` DSN, or plain SMTP credentials from Amazon. The API path is faster. Bounce feedback is not included in plain SMTP. That issue says you read bounces from a mailbox, or you add a plugin and an SNS callback. [Amazon SES pricing](https://aws.amazon.com/ses/pricing/), read 1 October 2026, lists à la carte outbound email at $0.10 per 1,000 emails, plus $0.12 per GB of attachment data. The Essentials plan on that page is $0.16 per 1,000 for the first 10 million emails in a month. Dedicated IPs are a separate line. This note does not pick a plan or estimate a monthly SES bill, because this repo does not record send volume.

Using either transport means the domain that signs the mail (`updates.behaviorschool.com` today) needs SPF, DKIM, and DMARC at that provider. Mautic does not replace that DNS work.

### Operational burden

Self-host means PHP, a web server, MySQL or MariaDB, disk for the contact and hit tables, backups, upgrades, and the cron set. Segment and campaign sends stop when cron stops. The download page says shared hosting is a bad fit because of resource limits and missing control over config.

Managed Essential removes that server work and caps you at the published 50,000 contacts and 50,000 emails, on Dropsolid's included mail service. Custom fields for payment path, urgency, and fit, plus a webhook back to Convex when a drip converts, are integration work on top of the hosting fee. Enterprise is the plan that lists custom email provider support.

### License

`LICENSE.txt` on the `7.x` branch says "Mautic is released under the GPL v3" and "GNU General Public License ... version 3." The file is at [github.com/mautic/mautic/blob/7.x/LICENSE.txt](https://github.com/mautic/mautic/blob/7.x/LICENSE.txt). The GitHub API on 1 October 2026 did not return an SPDX id (`NOASSERTION`). The license file is the clearer source.

GPL-3.0 is not the AGPL. Frappe CRM, in section 2, is AGPL-3.0, which has a network-use source obligation. GPL-3.0's copyleft is triggered by distribution of the program, not by someone merely using your unmodified server over the web. Running Mautic for Behavior School's own campaigns is the ordinary self-host case described on [mautic.org/download](https://mautic.org/download/). Shipping a modified Mautic, or a plugin that is a derivative work, to someone else requires offering that source under the GPL. This is not legal advice.

The license file also says "Mautic" is a trademark of the Mautic project. Do not put it in a product name.

### Mautic next to Frappe, and whether we need both

They overlap on the person record and on one-to-one email. They do not do the same job.

Frappe CRM is the sales desk: leads, deals, kanban, call logging, and email on that record. Mautic is the campaign desk: segments, timed branches, points, forms, landing pages, and open and click tracking. Mautic's campaign overview says a campaign can push a contact into a CRM. That is an integration, not one product.

Section 4 already says not to adopt Frappe. Adding Mautic as well would mean three systems for one operator: Convex for the Stripe ledger and the site, Frappe for the deal, and Mautic for the drip. The Transformation path would be copied into both new tools. We do not need both. We do not need either one to send the mail we send today.

### Recommendation

Keep the current senders. Do not install Mautic.

The live lifecycle mail is one five-step Resend drip, a few transactional Resend and Mailgun letters, and a separate Convex newsletter for the research brief. Mautic's builder, A/B tests, and tracking matter when many campaigns are being edited by a marketer who should not edit TypeScript. That volume is not what this repository contains. The catalog's other sequences are manual, shared, or planned, and the Study Tools steps are not wired to a sender here.

The Dropsolid floor that includes mail is €247.50 per month. A self-host adds a PHP and MySQL service and a cron dependency beside Convex. Pointing Mautic at Resend SMTP would also bypass the Broadcast product Resend already offers for marketing mail.

Effort for this path is no migration. The nurture worker already skips a step when the contact status is `customer` or the enrollment is not `active`. Leave the section 5 CRM work as the email-adjacent build. A Mautic install that replaces the five-step drip, imports contacts, embeds a form or a webhook, and keeps Stripe and the research brief in Convex is about 10 days of engineering, plus the hosting line above, and it still leaves Mailgun and Resend in place for transactional mail. That day figure is an estimate from the files named, not a schedule.

## Sources

- Frappe CRM repository README: https://github.com/frappe/crm
- GitHub repository metadata, including the AGPL-3.0 license, read 1 October 2026: https://api.github.com/repos/frappe/crm
- Frappe license and trademark policy, updated 28 June 2026: https://docs.frappe.io/legal/others/license-and-trademark
- GNU AGPL-3.0, section 13: https://www.gnu.org/licenses/agpl-3.0.html
- CRM pricing, including the self-host FAQ and the $5/month managed start: https://frappe.io/crm/pricing
- Frappe Cloud pricing comparison: https://frappe.io/cloud/pricing
- Shared hosting prices, including $5, $25, and the rupee CPU tiers: https://frappe.io/cloud/shared-hosting
- How Frappe Cloud pricing is structured: https://docs.frappe.io/customer-guide/pricing/frappe-cloud-pricing
- Leads: https://docs.frappe.io/crm/lead
- Web form: https://docs.frappe.io/crm/web-form
- Capturing leads with a web form: https://docs.frappe.io/crm/capturing-leads/web-form
- Email communication: https://docs.frappe.io/crm/email-communication
- Twilio: https://docs.frappe.io/crm/twilio
- Service level agreement: https://docs.frappe.io/crm/service-level-agreement
- Assignment rule: https://docs.frappe.io/crm/assignment-rule
- Frappe REST API: https://docs.frappe.io/framework/user/en/api/rest
- Frappe webhooks: https://docs.frappe.io/framework/user/en/guides/integration/webhooks
- Frappe WhatsApp app linked from the CRM README: https://github.com/shridarpatil/frappe_whatsapp
- Mautic download and self-host guidance: https://mautic.org/download/
- Mautic managed plans (Dropsolid): https://mautic.org/start-using-mautic/managed-mautic/
- Mautic pricing comparison: https://mautic.org/mautic-vs-activecampaign/
- Mautic GPL-3.0 license file: https://github.com/mautic/mautic/blob/7.x/LICENSE.txt
- Mautic install requirements note: https://docs.mautic.org/en/8.0/getting_started/how_to_install_mautic.html
- Mautic cron jobs: https://docs.mautic.org/en/8.0/configuration/cron_jobs.html
- Mautic email transport settings: https://docs.mautic.org/en/8.0/configuration/settings.html
- Mautic segments: https://docs.mautic.org/en/8.0/segments/manage_segments.html
- Mautic campaigns: https://docs.mautic.org/en/8.0/campaigns/campaigns_overview.html
- Mautic campaign builder: https://docs.mautic.org/en/8.0/campaigns/campaign_builder.html
- Mautic forms: https://docs.mautic.org/en/8.0/components/forms.html
- Mautic landing pages: https://docs.mautic.org/en/8.0/components/landing_pages.html
- Mautic contacts and tracking: https://docs.mautic.org/en/8.0/contacts/manage_contacts.html
- Mautic emails and A/B tests: https://docs.mautic.org/en/8.0/channels/emails.html
- Mautic 5 SES transport note: https://github.com/mautic/mautic/issues/13181
- Resend SMTP: https://resend.com/docs/send-with-smtp
- Resend transactional and marketing email types: https://resend.com/docs/email-types
- Amazon SES pricing: https://aws.amazon.com/ses/pricing/
