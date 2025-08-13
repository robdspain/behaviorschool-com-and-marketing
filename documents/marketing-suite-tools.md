### Marketing Suite: Tools, Roles, and Costs

This document lists the tools and services integrated into the marketing suite, what each does, why it’s used, and approximate costs.

---

### Hosting & Infrastructure

- **DigitalOcean Droplet**
  - **Purpose**: VPS hosting for Ghost CMS (multi-site), Traefik reverse proxy, and N8N automation.
  - **Reason**: Full control over server, affordable, scalable.
  - **Cost**: ~$24–$48/month depending on plan.

---

### Web Server & Reverse Proxy

- **Traefik**
  - **Purpose**: Handles HTTPS (Let’s Encrypt), routes traffic to Ghost sites, redirects HTTP → HTTPS.
  - **Reason**: Auto-SSL with Let’s Encrypt, easy multi-domain routing.
  - **Cost**: Free (open source).

---

### Content Management

- **Ghost CMS**
  - **Purpose**: Powers robspain.com and behaviorschool.com content/blog.
  - **Reason**: SEO-friendly, clean interface, works with static frontends (Netlify).
  - **Cost**: Free self-hosted; Ghost(Pro) would be ~$9–$45/month (not used).

---

### Automation & Integrations

- **N8N**
  - **Purpose**: Automates workflows (e.g., Ghost → Netlify build triggers, form data to email lists).
  - **Reason**: No-code/low-code automation between services.
  - **Cost**: Free self-hosted; Cloud starts at $20/month.

---

### Frontend Deployment

- **Netlify**
  - **Purpose**: Hosts static frontends for behaviorstudytools.com and behaviorschool.com.
  - **Reason**: Continuous deployment, free SSL, global CDN.
  - **Cost**: Free tier available; Pro is $19/month.

---

### Domain & DNS

- **Namecheap / Registrar**
  - **Purpose**: Owns and manages domains (robspain.com, behaviorschool.com, behaviorstudytools.com).
  - **Reason**: Control over DNS for routing traffic through Traefik/Netlify.
  - **Cost**: ~$10–$15/year per domain.

---

### Email & Marketing

- **Kit.com / Email Marketing Platform**
  - **Purpose**: Email automation and campaigns for Behavior Study Tools.
  - **Reason**: Targeted marketing, onboarding sequences.
  - **Cost**: ~$20–$50/month depending on list size.

---

### SSL/TLS Certificates

- **Let’s Encrypt (via Traefik)**
  - **Purpose**: Issues free HTTPS certificates.
  - **Reason**: Secure connections without recurring cost.
  - **Cost**: Free.

---

### Version Control & Dev Environment

- **Cursor IDE + GitHub**
  - **Purpose**: Code editor with AI prompts (Cursor), repository hosting (GitHub).
  - **Reason**: Collaborative coding, AI assistance.
  - **Cost**: Cursor ~$20/month for Pro; GitHub free for public repos, ~$4/user/month for Pro.

---

### Quick Cost Overview (approx.)

- **DigitalOcean**: ~$24–$48/month
- **Traefik**: Free
- **Ghost (self-hosted)**: Free
- **N8N (self-hosted)**: Free (Cloud from $20/month)
- **Netlify**: Free (Pro $19/month)
- **Domains**: ~$10–$15/year each
- **Email platform (Kit.com)**: ~$20–$50/month
- **Let’s Encrypt**: Free
- **Cursor + GitHub**: ~$20/month + ~$4/user/month (if Pro)

---

### Notes

- Self-hosted services (Ghost, N8N, Traefik) are consolidated on a DigitalOcean Droplet for cost efficiency and control.
- Frontends are deployed on Netlify to leverage CDN, HTTPS, and CI/CD.
- Traefik automates SSL via Let’s Encrypt and simplifies routing for multiple domains.


