### Open-Source Marketing Tools for BehaviorSchool.com

This document summarizes the open-source products recommended to power a lean "marketing machine" for BehaviorSchool.com. Each section includes a brief overview, standout features, deployment options, and how it fits into the current stack.

---

### Plausible Analytics

- **What it is**: Privacy‑friendly website analytics with simple, actionable reports.
- **Why use it**: Lightweight script, no cookies by default, GDPR‑friendly; ideal alongside or instead of GA4.
- **Key features**: Real‑time dashboards, campaign tracking (UTM), goals/conversions, custom events, shared dashboards, API.
- **Deploy**: Self‑host (Docker) or hosted at plausible.io.
- **Cost**: Self‑host $0 (+server); hosted from ~$9/month.
- **Stack fit**: Add to Netlify frontends and Ghost themes; feed key events to n8n via API for alerts/scoring.

---

### Kutt URL Shortener

- **What it is**: Free, modern link shortener with custom domains and stats. Project: [Kutt site](https://kutt.it/) · Repo: [thedevs-network/kutt](https://github.com/thedevs-network/kutt).
- **Why use it**: Own your short links for campaigns; use branded domain; detailed click stats; API access.
- **Key features**: Custom domains, link password/expiry, UTM support, API/SDKs, browser extensions, per‑link stats.
- **Deploy**: Self‑host (Docker) or use hosted `kutt.it`.
- **Cost**: Self‑host $0 (+server). Hosted has a free tier; premium available.
- **Stack fit**: Create short links for newsletters/social; pipe click data to n8n for segmentation and retargeting.

---

### Chatwoot (Live chat and shared inbox)

- **What it is**: Open‑source alternative to Intercom/HelpScout for chat, email, and social DMs in one inbox. Site: [chatwoot.com](https://www.chatwoot.com/).
- **Why use it**: Own your support stack; automations, canned responses, CRM context; integrates via webhooks.
- **Key features**: Website chat widget, shared inbox, routing, macros, CSAT, knowledge base, chat automations/bots.
- **Deploy**: Self‑host (Docker) or hosted cloud by Chatwoot.
- **Cost**: Self‑host $0 (+server); cloud from ~$19–$29/agent/month.
- **Stack fit**: Embed on Netlify/marketing pages; send conversations and intents to n8n for lead scoring and CRM updates.

---

### Cal.com (Scheduling)

- **What it is**: Open‑source Calendly‑style scheduling with advanced routing. Site: [cal.com](https://cal.com/).
- **Why use it**: Flexible flows (routing forms, round‑robin), can self‑host later; strong integrations.
- **Key features**: Team booking, round‑robin, routing forms, paid meetings, webhooks/API, calendar sync.
- **Deploy**: Self‑host (Docker) or hosted at Cal.com.
- **Cost**: Self‑host $0 (+server); hosted free tier with paid from ~$12/month.
- **Stack fit**: Use different booking pages for teachers vs. admins; trigger n8n flows for reminders, pre‑call materials, and CRM entries.

---

### n8n (Automation)

- **What it is**: Open‑source workflow automation (Zapier alternative). Site: [n8n.io](https://n8n.io/).
- **Why use it**: Powerful nodes, conditional logic, code steps; ideal for connecting Ghost, Netlify, email tools, and analytics.
- **Key features**: Triggers (webhooks/schedules), 400+ integrations, expressions, versioned workflows, queue mode.
- **Deploy**: Self‑host on the DigitalOcean droplet (Docker) or use n8n Cloud.
- **Cost**: Self‑host $0 (+server); cloud from ~$20/month.
- **Stack fit**: Central automation bus for lead capture (Tally/Chatwoot/Kutt clicks) → CRM → email sequences → Slack alerts → Netlify builds.

---

### Suggested initial rollout

1. Add Plausible to all sites; enable goals for demo bookings, newsletter joins, and resource downloads.
2. Deploy Kutt with a branded short domain; start tagging campaigns and capturing click stats.
3. Embed Chatwoot on marketing pages; route conversations to the appropriate queue; send events to n8n.
4. Use Cal.com booking links segmented by audience; push bookings to CRM via n8n.
5. Centralize automations in n8n (webhooks, lead scoring, notifications, Netlify deploy triggers).

References: [Kutt site](https://kutt.it/), [Kutt GitHub](https://github.com/thedevs-network/kutt).


