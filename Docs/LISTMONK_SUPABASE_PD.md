# Listmonk-on-Supabase (Netlify) — Product Design

Purpose
- Replace the external Listmonk service with a fully in‑house newsletter system built on Supabase (Postgres + Auth + Storage) and Netlify (hosting + scheduled functions), integrated into this Next.js app.

Goals (Parity Targets)
- Subscribers: CRUD, status (enabled/disabled/unsubscribed/blacklisted), attributes, import/export CSV.
- Lists: public/private, single/double opt‑in, per‑list subscriptions and statuses.
- Campaigns: draft/scheduled/running/paused/sent; templates; tags; optional plain text body; attachments (v2).
- Sending: queue generation + batched sending via provider adapters (Mailgun now, SMTP/Nodemailer optional); per‑message retries; throttling.
- Templates: reusable HTML templates with variables; basic preview; library management.
- Segments: tag/attribute filters (JSONB + generated views); v2: SQL‑like advanced segments.
- Analytics: opens (pixel), clicks (redirector), bounces/complaints (webhooks), per‑campaign metrics, top links.
- GDPR: double opt‑in workflow, preference center, consent timestamps, unsubscribe.
- Admin UI: parity with existing page (lists, subscribers, templates, campaigns, analytics).

Non‑Goals (Phase 1)
- MTA‑level tuning; advanced deliverability tooling.
- Full SQL segmentation editor.
- Multi‑tenant isolation (single tenant only).

Architecture Overview
- Frontend: Next.js (existing app). Admin at `/admin/listmonk` continues, gradually pointed to new APIs under `/api/nm/*`.
- Database: Supabase Postgres. Tables prefixed `nm_` (newsletter manager) to avoid collisions.
- Server: Next.js route handlers for admin/public APIs; Netlify scheduled functions (or cron) for campaign dispatch.
- Email providers: pluggable adapter (start with Mailgun via `mailgun.js`; SMTP adapter optional).
- Tracking: `/api/nm/t.gif` (open pixel), `/api/nm/r` (redirect for clicks) log events and redirect.

Data Model (Phase 1)
- `nm_lists` — id, name, visibility, optin, description.
- `nm_subscribers` — id (uuid), email (unique), name, status, attributes (jsonb), created_at, updated_at.
- `nm_subscriber_lists` — subscriber_id, list_id, status (pending/subscribed/unsubscribed), token (for double opt‑in), created_at, updated_at.
- `nm_templates` — id, name, body_html, body_text, created_at.
- `nm_campaigns` — id, name, subject, body_html, body_text, template_id, status, scheduled_at, sent_at, created_at.
- `nm_campaign_lists` — campaign_id, list_id.
- `nm_queue` — id, campaign_id, subscriber_id, status (queued/sent/failed/bounced/deferred), last_error, attempts, scheduled_at, sent_at.
- `nm_events` — id, campaign_id, subscriber_id, type (open/click/bounce/unsub/complaint), url, ua, ip, created_at.
- `nm_links` — id, campaign_id, url, click_count.
- `nm_settings` — provider config (provider, domain, api key ref), rate limits, concurrency.

API Surface (Phase 1)
- Admin (authenticated):
  - `GET/POST /api/nm/subscribers` (list/create), `GET/PUT/DELETE /api/nm/subscribers/[id]`.
  - `GET/POST /api/nm/lists`, `PUT/DELETE /api/nm/lists/[id]`, `POST /api/nm/lists/[id]/subscribe`.
  - `GET/POST /api/nm/templates`, `PUT/DELETE /api/nm/templates/[id]`.
  - `GET/POST /api/nm/campaigns`, `PUT /api/nm/campaigns/[id]`, `PUT /api/nm/campaigns/[id]/status`, `GET /api/nm/campaigns/[id]/preview`.
  - `GET /api/nm/status` summary and provider health.
  - `POST /api/nm/import/subscribers` (CSV), `GET /api/nm/export/subscribers` (CSV).
- Public:
  - `POST /api/nm/subscribe` (single/double opt‑in), `GET /api/nm/confirm?token=...`.
  - `POST /api/nm/unsubscribe`, `GET /preferences?token=...` (page).
  - `GET /api/nm/t.gif` (open pixel), `GET /api/nm/r?c=..&s=..&u=..` (redirector).

Sending Pipeline
- Draft -> Queue build (resolve campaign lists to subscriber set, apply suppression/unsub/bounces).
- Queue worker (scheduled): pull N queued, send via provider, update `nm_queue`, emit events.
- Retries with backoff for transient errors.

Security & Auth
- Admin endpoints require logged‑in admin (existing admin check util).
- Public endpoints tokenized for confirm/prefs/unsub.

Migration & Interop
- Phase 1: maintain existing `/api/admin/listmonk/*` for current UI; add new `/api/nm/*` and progressively point the UI.
- Provide importer from existing Listmonk export (CSV + JSON map).

Milestones
- M0 (this PR): Schema + basic APIs (status, subscribers create/list), tracking stubs.
- M1: Lists + subscriptions + templates + campaigns (draft -> preview -> queue build), send worker skeleton.
- M2: Analytics (open/click), unsubscribe/preferences, CSV import/export.
- M3: Segments, attachments, provider adapters, webhooks.

Notes
- Supabase is Postgres: can use constraints, JSONB, partial indexes, triggers for counters.
- Netlify Scheduled Functions: run queue workers every minute/5 minutes.

