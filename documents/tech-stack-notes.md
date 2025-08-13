### Tech Stack Notes

This document summarizes the current stack components, their roles, rationale, and typical costs.

---

### Server & Hosting

- **DigitalOcean Droplet**
  - **Use**: Hosts all Ghost blog instances, Traefik, and related services.
  - **Why**: Reliable, affordable VPS with predictable performance.
  - **Cost**: ~$12–$24/month depending on droplet size.
- **Docker + Docker Compose**
  - **Use**: Containerizes Ghost instances and Traefik to make deployment consistent.
  - **Why**: Portable, version-controlled infrastructure, easy to replicate for multiple sites.
  - **Cost**: Free.

---

### CMS & Content

- **Ghost CMS (Self-Hosted)**
  - **Use**: behaviorschool.com, robspain.com, Ghost subdomains.
  - **Why**: Clean, SEO-friendly blogging & publishing platform; supports custom themes.
  - **Cost**: Free (self-hosted) vs. $9–$25/month if hosted by Ghost(Pro).
- **MySQL / MariaDB**
  - **Use**: Database for Ghost sites.
  - **Why**: Ghost requirement.
  - **Cost**: Free (bundled with hosting).

---

### Reverse Proxy & SSL

- **Traefik**
  - **Use**: Routes traffic to Ghost containers and handles SSL via Let’s Encrypt.
  - **Why**: Automatic HTTPS certs, easy multi-domain routing.
  - **Cost**: Free.
- **Let’s Encrypt**
  - **Use**: Free SSL certificates for all domains.
  - **Why**: Security, SEO ranking boost.
  - **Cost**: Free.

---

### Automation & Workflows

- **n8n (Self-Hosted)**
  - **Use**: Automation for Ghost webhooks, marketing triggers, and integrations.
  - **Why**: Replace Zapier with free/open-source automation.
  - **Cost**: Free (self-hosted) or $20–$50/month (cloud).
- **Netlify**
  - **Use**: Hosts marketing landing pages, possibly Behavior Study Tools site front-ends.
  - **Why**: Fast static hosting, CI/CD from GitHub.
  - **Cost**: Free tier available; Pro ~$19/month.

---

### Marketing & Communication

- **Email (Mailgun / SMTP)**
  - **Use**: Transactional emails from Ghost (newsletters, account notifications).
  - **Why**: Reliable email delivery.
  - **Cost**: ~$15/month (Mailgun).
- **Google Analytics / Plausible Analytics**
  - **Use**: Track site traffic and marketing performance.
  - **Why**: Data-driven marketing.
  - **Cost**: GA free; Plausible ~$9/month.

---

### Domains & DNS

- **Namecheap / Google Domains**
  - **Use**: Domain registration (robspain.com, behaviorschool.com, behaviorstudytools.com).
  - **Why**: Control over DNS for multi-site setup.
  - **Cost**: ~$12–$15/year per domain.

---

### Architecture diagram and cost breakdown

See the Mermaid source at `documents/architecture-diagram.mmd`. You can render it in Markdown engines that support Mermaid, or export to PNG/SVG via your editor.

| Component | Use | Cost (approx.) |
|---|---|---|
| DigitalOcean Droplet | Host Ghost, Traefik, n8n | $12–24/month |
| Ghost CMS | Web platforms (robspain.com, behaviorschool.com) | $0–25/month (if using Ghost Pro; self-host $0) |
| MySQL / MariaDB | DB for Ghost | Included (self-host) |
| Traefik | HTTPS + routing for multiple domains | Free |
| n8n | Webhooks & automation | $0 self-host, $0–50/month (cloud optional) |
| Netlify | Static landing pages, CDN, HTTPS | $0–19/month (optional) |
| Mailgun | Transactional email (Ghost newsletters/notifications) | ~$15/month |
| Let’s Encrypt | SSL certs for all domains | Free |
| Total | Typical blended monthly range | ~$12–133/month |


