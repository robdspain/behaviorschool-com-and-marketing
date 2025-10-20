# Listmonk Integration Setup Guide

This guide will help you set up [Listmonk](https://listmonk.app/) - a self-hosted newsletter and mailing list manager - with your Behavior School admin dashboard.

## What is Listmonk?

Listmonk is a **free and open source** newsletter and mailing list manager that provides:
- ✅ **Self-hosted** - Full control over your data
- ✅ **High performance** - Multi-threaded, handles millions of subscribers
- ✅ **Analytics** - Built-in campaign performance tracking
- ✅ **Templating** - Powerful Go templates with WYSIWYG editor
- ✅ **Transactional emails** - API for sending transactional messages
- ✅ **Extensible** - SMS, WhatsApp via Messenger webhooks
- ✅ **Low resource usage** - Single binary, minimal CPU/RAM footprint

**License:** AGPLv3 (Free and Open Source)

---

## Installation Options

### Option 1: Docker (Recommended - Easiest)

1. **Install Docker** on your server if not already installed
2. **Download the compose file:**
   ```bash
   curl -LO https://github.com/knadh/listmonk/raw/master/docker-compose.yml
   ```
3. **Start Listmonk:**
   ```bash
   docker compose up -d
   ```
4. **Access Listmonk:** Visit `http://your-server-ip:9000`

### Option 2: One-Click Deploy (Cloud Providers)

Deploy Listmonk with one click on these providers:
- [Railway](https://railway.app/) - Easy deployment
- [PikaPods](https://www.pikapods.com/) - Managed hosting
- [DigitalOcean App Platform](https://www.digitalocean.com/products/app-platform) - Your existing provider!

**Recommended for you:** Since you're already using DigitalOcean for your database, consider deploying Listmonk on DigitalOcean App Platform for easy management.

### Option 3: Binary (Direct Install)

1. **Download the latest binary** (v5.1.0):
   - [Linux 64-bit](https://github.com/knadh/listmonk/releases/download/v5.1.0/listmonk_5.1.0_linux_amd64.tar.gz)
   - [macOS (Darwin)](https://github.com/knadh/listmonk/releases/download/v5.1.0/listmonk_5.1.0_darwin_amd64.tar.gz)

2. **Install:**
   ```bash
   # Generate config
   ./listmonk --new-config
   
   # Edit config.toml with your settings
   nano config.toml
   
   # Setup database
   ./listmonk --install
   
   # Run Listmonk
   ./listmonk
   ```

3. **Access:** Visit `http://localhost:9000`

---

## Configuration

### 1. Database Setup

Listmonk requires **PostgreSQL**. You have two options:

#### Option A: Use Your Existing Supabase Database
Since you already have a Supabase Postgres database, you can use it:

```toml
[db]
host = "db.yourproject.supabase.co"
port = 5432
user = "postgres"
password = "your-supabase-password"
database = "postgres"
ssl_mode = "require"
```

**Note:** Create a separate schema for Listmonk to keep it organized:
```sql
CREATE SCHEMA listmonk;
```

#### Option B: Create a New PostgreSQL Database
Use DigitalOcean Managed PostgreSQL or run Postgres in Docker alongside Listmonk.

### 2. SMTP Configuration

Configure your email sending. You can use:
- **Mailgun** (you already have this configured!)
- **Amazon SES**
- **SendGrid**
- **Your own SMTP server**

Example for Mailgun:
```toml
[app]
address = "0.0.0.0:9000"

[[smtp]]
enabled = true
host = "smtp.mailgun.org"
port = 587
auth_protocol = "login"
username = "postmaster@mg.behaviorschool.com"
password = "your-mailgun-smtp-password"
hello_hostname = "behaviorschool.com"
max_conns = 10
idle_timeout = "15s"
wait_timeout = "5s"
max_msg_retries = 2
tls_enabled = true
tls_skip_verify = false
```

### 3. Reverse Proxy Setup (Production)

For production, set up a reverse proxy with SSL:

**Nginx Example:**
```nginx
server {
    listen 80;
    server_name newsletter.behaviorschool.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name newsletter.behaviorschool.com;
    
    ssl_certificate /etc/letsencrypt/live/newsletter.behaviorschool.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/newsletter.behaviorschool.com/privkey.pem;
    
    location / {
        proxy_pass http://localhost:9000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## Integration with Admin Dashboard

### Environment Variables

Add these to your **Netlify environment variables** (or `.env.local` for local development):

```bash
# Required: Listmonk API credentials
LISTMONK_URL=https://newsletter.behaviorschool.com
LISTMONK_USERNAME=admin
LISTMONK_PASSWORD=your-listmonk-admin-password

# Optional: Public embed URL (if you want to embed Listmonk in admin)
NEXT_PUBLIC_LISTMONK_EMBED_URL=https://newsletter.behaviorschool.com
```

**To add in Netlify:**
1. Go to **Netlify Dashboard** → **Site settings** → **Environment variables**
2. Add each variable
3. **Redeploy** your site

### Access Listmonk

Once configured, you can access Listmonk from your admin dashboard:
1. Navigate to **Admin Dashboard** → **Newsletter (Listmonk)**
2. View connection status and stats
3. Click **"Open Listmonk"** to manage campaigns

---

## Initial Setup (First Time)

### 1. Create Admin Account
When you first access Listmonk, you'll be prompted to create an admin account.

### 2. Configure Settings
Go to **Settings** in Listmonk and configure:
- **Company name:** Behavior School
- **From email:** noreply@behaviorschool.com
- **Privacy policy URL:** https://behaviorschool.com/privacy
- **Bounce processing:** Enable to handle bounced emails

### 3. Create Your First List
1. Go to **Lists** → **New List**
2. Name: "Behavior School Newsletter"
3. Type: **Public** (if you want signup forms) or **Private**
4. Opt-in: **Single** or **Double** (double recommended)

### 4. Create Templates
1. Go to **Campaigns** → **Templates** → **New Template**
2. Use the **visual drag-and-drop builder** or **HTML editor**
3. Include your brand colors (Emerald: `#10b981`, Slate: `#475569`)

### 5. Import Existing Subscribers (if any)
1. Go to **Subscribers** → **Import**
2. Upload CSV with columns: `email`, `name`, `status`
3. Map fields and import

---

## API Integration

The admin dashboard already has API integration built-in at `/api/admin/listmonk/status`.

### Create Subscribers via API

You can also use Listmonk's API to add subscribers programmatically:

```typescript
// Example: Add subscriber from a form submission
const response = await fetch('https://newsletter.behaviorschool.com/api/subscribers', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Basic ' + Buffer.from('admin:password').toString('base64')
  },
  body: JSON.stringify({
    email: 'user@example.com',
    name: 'User Name',
    status: 'enabled',
    lists: [1], // List IDs to subscribe to
    attribs: {
      // Custom attributes
      signup_source: 'website'
    }
  })
});
```

---

## Recommended Setup for Behavior School

### Suggested Lists:
1. **Main Newsletter** - General updates and content
2. **BCBA Exam Prep Updates** - For exam prep subscribers
3. **School BCBA Resources** - For school-based practitioners
4. **IEP Goals Updates** - For special education professionals
5. **Course Announcements** - For online course students

### Suggested Campaign Types:
1. **Weekly Newsletter** - Blog posts, resources, tips
2. **Product Updates** - New features, tools
3. **Course Launch** - When new courses are available
4. **Transactional** - Welcome emails, password resets
5. **Drip Campaigns** - Onboarding sequences

---

## Cost Comparison

**Listmonk (Self-Hosted):**
- Software: **FREE** (open source)
- Hosting: ~$5-20/month (DigitalOcean droplet)
- SMTP: Use existing Mailgun account
- **Total: $5-20/month** for unlimited subscribers

**vs. Hosted Alternatives:**
- Mailchimp: $13-350+/month (based on subscriber count)
- ConvertKit: $29-149+/month
- ActiveCampaign: $29-259+/month

**Savings: ~$100-300/month** 💰

---

## Security Best Practices

1. **Use strong passwords** for Listmonk admin
2. **Enable HTTPS** with Let's Encrypt (free SSL)
3. **Restrict database access** to only Listmonk
4. **Enable bounce processing** to maintain sender reputation
5. **Set up SPF, DKIM, and DMARC** records for your domain
6. **Regular backups** of Postgres database
7. **Keep Listmonk updated** to latest version

---

## Monitoring & Maintenance

### Health Checks
Monitor Listmonk health at:
- `https://newsletter.behaviorschool.com/health`

### Database Backups
```bash
# Automated daily backups
pg_dump -h localhost -U listmonk listmonk_db > backup_$(date +%Y%m%d).sql
```

### Updates
```bash
# For Docker
docker compose pull
docker compose up -d

# For binary
./listmonk --upgrade
```

---

## Troubleshooting

### Can't connect from admin dashboard
1. Check environment variables are set in Netlify
2. Verify Listmonk is running: `curl https://newsletter.behaviorschool.com/health`
3. Check CORS settings in Listmonk config

### Emails not sending
1. Check SMTP configuration in Listmonk settings
2. Verify Mailgun credentials
3. Check bounce logs in Listmonk

### Database errors
1. Verify Postgres is running
2. Check database credentials in config
3. Run `./listmonk --upgrade` to update schema

---

## Resources

- **Official Docs:** https://listmonk.app/docs
- **GitHub:** https://github.com/knadh/listmonk
- **Community Forum:** https://github.com/knadh/listmonk/discussions
- **API Documentation:** https://listmonk.app/docs/apis/apis

---

## Next Steps

1. ✅ **Add Listmonk to admin sidebar** (Already done!)
2. ⬜ **Deploy Listmonk** (Choose installation method above)
3. ⬜ **Configure environment variables** in Netlify
4. ⬜ **Set up SMTP** with your Mailgun account
5. ⬜ **Create your first list** and templates
6. ⬜ **Import existing subscribers** (if any)
7. ⬜ **Launch your first campaign!** 🚀

---

## Support

If you need help with Listmonk setup, you can:
1. Check the [official documentation](https://listmonk.app/docs)
2. Ask in [GitHub Discussions](https://github.com/knadh/listmonk/discussions)
3. Reach out to me for assistance with the integration

---

**Happy Email Marketing! 📧**

