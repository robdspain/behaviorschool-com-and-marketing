# Shared Newsletter System

BehaviorSchool.com and Robspain.com now use the same newsletter subscription model:

- **Canonical sender/list database:** Listmonk
- **Compatibility mirrors:** Convex and Supabase, when configured
- **BehaviorSchool public endpoints:** `/api/newsletter`, `/api/newsletter/subscribe`, `/api/subscribe`
- **Robspain public endpoint:** `/.netlify/functions/newsletter-subscribe`

Set these Netlify environment variables on both sites and point them at the same Listmonk instance and list ID:

```env
LISTMONK_URL=
LISTMONK_USERNAME=
LISTMONK_PASSWORD=
LISTMONK_NEWSLETTER_LIST_ID=
LISTMONK_DEFAULT_LIST_ID=
```

`LISTMONK_NEWSLETTER_LIST_ID` is preferred. `LISTMONK_DEFAULT_LIST_ID` remains as a fallback for older code paths. Multiple list IDs can be comma-separated.

All public signups include source metadata in Listmonk:

- `site`
- `source`
- `page`
- `tags`
- `subscribed_at`

Use the BehaviorSchool Listmonk admin area for campaign sends so newsletters go to the shared Listmonk list instead of split Convex, Supabase, or Resend-only stores.
