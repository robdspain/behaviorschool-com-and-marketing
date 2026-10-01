# CRM: Frappe CRM assessment

Date checked: 1 October 2026.

Recommendation: keep the Behavior School CRM in Convex and borrow five specific Frappe ideas. Do not migrate to Frappe CRM, and do not run a hybrid.

This is an assessment only. No application code was changed. Prices below are the figures published on the cited Frappe pages that day. This note does not invent a VPS bill, a Twilio bill, a contact count, or a revenue outcome. Day figures in the feature list are engineering estimates from the files named, not a delivery schedule.

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
