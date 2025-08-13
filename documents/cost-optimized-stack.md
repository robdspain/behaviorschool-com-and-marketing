### Cost-Optimized Stack (minimal monthly spend)

Goal: run the full marketing machine for BehaviorSchool.com at the lowest ongoing cost, using free tiers and self‑hosted OSS where practical.

---

### Core hosting

- **DigitalOcean Droplet (1–2GB RAM)**: Host Traefik, Ghost (multi‑site), MariaDB, n8n, Chatwoot, Kutt.
  - **Cost**: ~$12/month (can scale to ~$24 if needed).
- **Docker + Docker Compose**: Orchestrate all services.
  - **Cost**: Free.

### Services on the droplet (all free/self‑hosted)

- **Traefik + Let’s Encrypt**: Reverse proxy + HTTPS for all domains.
- **Ghost CMS (x2)**: `robspain.com`, `behaviorschool.com` content/blog.
- **MariaDB**: Database for Ghost.
- **n8n**: Automations (webhooks, CRM sync, alerts, deploy triggers).
- **Chatwoot (self‑host)**: Live chat + shared inbox.
- **Kutt (self‑host)**: Branded URL shortener with click stats.

### External services (free tiers)

- **Netlify (Free)**: Static landing pages/CDN if needed for marketing microsites.
- **Email marketing: MailerLite Free or ConvertKit Free**: Basic broadcasts + simple automations until list grows.
- **Transactional email: Amazon SES**: SMTP for Ghost newsletters/notifications (cheapest reliable option).
  - Cost: ~$0.10 per 1,000 emails.
- **Analytics**: GA4 (free) + Microsoft Clarity (free heatmaps/session replay).
- Optional: **Plausible** self‑host (free) if you prefer privacy analytics over GA4.

### Domains & DNS

- **Registrar (Namecheap/Google Domains)**: ~$12–$15/year per domain (not included in monthly below).

---

### Estimated monthly total

- Hosting: ~$12
- Email sends (SES): ~$0–$5 (depends on volume)
- Everything else: $0 (free/self‑host tiers)

**Estimated total**: ~$12–$17/month (excluding domain renewals).

---

### Why this is the least‑cost path

- Consolidates all OSS services on a single droplet.
- Uses free tiers for deployment (Netlify), analytics (GA4/Clarity), and email marketing (MailerLite/ConvertKit Free).
- Swaps Mailgun (~$15/mo) for **SES** pay‑as‑you‑go.

---

### Quick implementation order

1. Provision DO droplet; install Docker/Compose.
2. Deploy Traefik + Let’s Encrypt; point DNS (A/AAAA + CNAMEs).
3. Stand up MariaDB + Ghost sites; restore/import themes.
4. Deploy n8n and create workflows for forms → CRM → email.
5. Deploy Chatwoot (widget on marketing pages) and Kutt (short domain).
6. Connect Netlify (if needed) for static sites; add GA4 + Clarity scripts.
7. Configure SES SMTP in Ghost; set DMARC/DKIM/SPF.
8. Start with MailerLite/ConvertKit Free; integrate via n8n.

---

### Notes & alternatives

- If the droplet gets tight on RAM/CPU, upgrade to ~$24/month before adding more services.
- Prefer self‑host Chatwoot and Kutt to avoid monthly fees; if you need zero ops, use Tawk.to (free) and hosted `kutt.it`.


