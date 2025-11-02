Supabase Newsletter (Listmonk‑like) on Netlify

Overview
- Full newsletter management on Netlify + Supabase without Listmonk/DigitalOcean.
- Features implemented:
  - Lists: create/update/delete lists (`nm_lists`).
  - Subscribers: list and create (`nm_subscribers`, `nm_subscriber_lists`).
  - Templates: create/update/delete HTML templates with `{{content}}` placeholder.
  - Campaigns: create, preview, test send, run/schedule; attach to lists.
  - Queue + Worker: enqueues recipients and sends via Mailgun.
- Tracking: open pixel and click redirects with analytics (`nm_events`, `nm_links`).
- Analytics: per-campaign totals and daily opens/clicks, with top links.

What’s included
- API routes under `/api/nm/*` for lists, templates, campaigns, worker.
- Admin UI at `/admin/newsletter` for basic management (lists, templates, campaigns, subscribers).
- Link/open tracking endpoints under `/r/click` and `/r/open/:cid/:sid`.
- Import/Export: CSV export and import for subscribers and memberships.

Prerequisites
- Supabase project and service role key configured in env.
- Mailgun domain + API key for sending.
- Public base URL for tracking links (your Netlify site URL).

Environment variables
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase URL.
- `SUPABASE_SERVICE_ROLE`: Supabase service key.
- `MAILGUN_DOMAIN`: Mailgun domain (e.g. `email.example.com`).
- `MAILGUN_API_KEY`: Mailgun API key.
- `MAIL_FROM_EMAIL` (optional): Custom From email (defaults to `hello@MAILGUN_DOMAIN`).
- `PUBLIC_BASE_URL` or `NEXT_PUBLIC_SITE_URL`: Public site base (e.g. `https://behaviorschool.com`).
- `NM_WORKER_SECRET` (recommended): Shared secret to trigger the worker.

Database schema
- Apply `sql/nm_schema_v1.sql` in Supabase SQL editor.
- This creates: `nm_lists`, `nm_subscribers`, `nm_subscriber_lists`, `nm_templates`,
  `nm_campaigns`, `nm_campaign_lists`, `nm_queue`, `nm_events`, `nm_links`, `nm_settings`.

Endpoints
- Lists: `GET/POST/PUT/DELETE /api/nm/lists`
- Templates: `GET/POST/PUT/DELETE /api/nm/templates`
- Campaigns:
  - `GET /api/nm/campaigns` — recent campaigns
  - `POST /api/nm/campaigns` — create campaign `{ name, subject, body_html?, body_text?, template_id?, list_ids?, schedule_at? }`
  - `PUT /api/nm/campaigns/:id/status` — set status: `running` or `scheduled { scheduled_at }`. When set to `running`, recipients are enqueued.
  - `GET /api/nm/campaigns/:id/preview` — preview rendered HTML
  - `POST /api/nm/campaigns/:id/test` — send test to comma‑separated emails
  - `GET /api/nm/campaigns/:id/analytics` — totals (opens, clicks), daily series, top links
- Queue worker: `POST /api/nm/worker/process` — processes up to 100 queued items. Protect with header `x-nm-worker-secret: <NM_WORKER_SECRET>` or `Authorization: Bearer <NM_WORKER_SECRET>`.
- Tracking:
  - Open pixel: `GET /r/open/:cid/:sid`
  - Click redirect: `GET /r/click?cid=ID&sid=UUID&url=https%3A%2F%2F...`
- Import/Export:
  - Export subscribers: `GET /api/nm/export/subscribers` (CSV with columns: id,email,name,status,created_at,lists)
  - Export memberships: `GET /api/nm/export/subscriber_lists` (CSV with columns: subscriber_id,list_id,status,created_at)
  - Import subscribers: `POST /api/nm/import/subscribers` with `text/csv` body (columns: email,name,status,lists; lists are semicolon-separated names; creates missing lists)
  - Import memberships: `POST /api/nm/import/subscriber_lists` with `text/csv` body (columns: subscriber_id,list_id,status)

How sending works
1) Create lists and subscribers; attach subscribers to lists (`nm_subscriber_lists.status = 'subscribed'`).
2) Create templates (optional) with `{{content}}` placeholder.
3) Create a campaign and attach lists (in POST provide `list_ids`).
4) Send now: `PUT /api/nm/campaigns/:id/status { status: 'running' }` → enqueues recipients.
5) Worker: call `POST /api/nm/worker/process` — renders HTML (injects open pixel, rewrites links) and sends via Mailgun.

Scheduling
- Set `scheduled_at` on the campaign and use status `scheduled`.
- The worker only sends items whose `scheduled_at <= now()` and `status = 'queued'`.
- You can schedule calls to the worker using:
  - Netlify Scheduled Functions (create a lightweight function that calls this endpoint), or
  - Supabase cron (call the public endpoint with `NM_WORKER_SECRET`).

Security notes
- Set `NM_WORKER_SECRET` and require it on `/api/nm/worker/process`.
- Restrict admin UI with Supabase auth; the page already checks for a valid session.
- Consider adding RLS to `nm_*` tables to restrict writes to service role only.

Extending analytics
- `nm_events.type`: open|click|bounce|unsub|complaint. Current implementation records open/click.
- Build admin charts by querying counts grouped by `type`, `campaign_id`, and time.

UI usage
- Navigate to `/admin/newsletter`.
- Create a list; create a template; create a campaign; attach lists; Send now.
- Click “Run Worker” to process the queue (or set up scheduled worker).
- Use Export buttons in the Subscribers section to download CSVs.
- Use the Import section to upload subscribers or memberships CSV files.

Migration from Listmonk (optional)
- Export subscribers from Listmonk and import into `nm_subscribers`; attach to lists via `nm_subscriber_lists`.
- Copy templates’ HTML into `nm_templates.body_html` with `{{content}}`.

Troubleshooting
- “Mailgun not configured”: ensure `MAILGUN_DOMAIN` and `MAILGUN_API_KEY` are set in Netlify env.
- Links not tracked: ensure `PUBLIC_BASE_URL` points to your production domain.
- Worker unauthorized: set `NM_WORKER_SECRET` in env and include the header in requests.
