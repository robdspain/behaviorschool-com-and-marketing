# Shared Newsletter System

BehaviorSchool.com and Robspain.com now use the same newsletter subscription model:

- **Current live subscriber registry:** Convex newsletter mutation
- **Optional campaign backend:** Listmonk, when `LISTMONK_URL` and list IDs are configured
- **Legacy/local mirror:** Supabase newsletter tables, when configured
- **BehaviorSchool public endpoints:** `/api/newsletter`, `/api/newsletter/subscribe`, `/api/subscribe`
- **Robspain public endpoint:** `/.netlify/functions/newsletter-subscribe`

Production check on July 3, 2026 showed `https://behaviorschool.com/api/admin/listmonk/status` returning `configured:false`, so Listmonk should not be treated as the active source of truth until the environment variables below are set and the status endpoint reports connected lists/subscribers/campaigns.

If Listmonk is deployed later, set these Netlify environment variables on both sites and point them at the same Listmonk instance and list ID:

```env
LISTMONK_URL=
LISTMONK_USERNAME=
LISTMONK_PASSWORD=
LISTMONK_NEWSLETTER_LIST_ID=
LISTMONK_DEFAULT_LIST_ID=
```

`LISTMONK_NEWSLETTER_LIST_ID` is preferred. `LISTMONK_DEFAULT_LIST_ID` remains as a fallback for older code paths. Multiple list IDs can be comma-separated.

All public signups include source metadata where the backend supports it:

- `site`
- `source`
- `page`
- `tags`
- `subscribed_at`

Until Listmonk is configured, the active subscriber path is Convex. The Supabase/Mailgun `/admin/newsletter` system exists but the live `/api/nm/status` endpoint reported 0 subscribers, 0 lists, and 0 campaigns on July 3, 2026.
