# Ghost Newsletter Integration Setup

This document explains how to set up and use Ghost CMS for newsletter management with the Behavior School landing pages.

## Overview

We've integrated Ghost CMS in headless mode to handle newsletter subscriptions across all landing pages. Ghost provides:

- Professional newsletter management
- Member/subscriber database
- Email sending capabilities
- Newsletter templates and customization
- GDPR-compliant subscription management
- Analytics and engagement tracking

## Architecture

```
Landing Pages (Next.js)
    ↓
Newsletter Signup Component
    ↓
/api/ghost-subscribe endpoint
    ↓
Ghost Admin API
    ↓
Ghost CMS (Headless)
    ↓
Email Service (Mailgun/SMTP)
```

## Quick Start

### 1. Start Ghost with Docker

```bash
# Run the setup script
./scripts/setup-ghost.sh

# Or manually with docker-compose
docker-compose up -d
```

### 2. Configure Ghost

1. Access Ghost Admin: http://localhost:2368/ghost
2. Complete the setup wizard
3. Create a custom integration:
   - Go to Settings → Integrations
   - Click "Add custom integration"
   - Name it "Newsletter API"
   - Save and copy the API keys

### 3. Configure Environment Variables

Create a `.env.local` file in your Next.js project:

```env
# Ghost API Configuration
GHOST_CONTENT_URL=http://localhost:2368
GHOST_ADMIN_URL=http://localhost:2368
GHOST_ADMIN_KEY=your_admin_key_id:your_admin_key_secret
GHOST_CONTENT_KEY=your_content_api_key

# Email Service (optional fallback)
MAILGUN_ENDPOINT=https://your-backup-endpoint.com
```

### 4. Configure Email Sending

In Ghost Admin:
1. Go to Settings → Email newsletter
2. Configure SMTP settings:
   - Mailgun, SendGrid, or any SMTP service
   - Add your credentials
   - Test email sending

## Newsletter Signup Components

### Basic Usage

```tsx
import { NewsletterSignup } from '@/components/newsletter-signup';

// Default card variant
<NewsletterSignup
  source="landing-page"
  title="Subscribe to our newsletter"
  description="Get weekly updates"
  buttonText="Subscribe"
  showNameField={true}
/>

// Inline variant for hero sections
<NewsletterSignupInline
  source="hero-section"
  buttonText="Get Started"
  placeholder="Enter your email"
/>
```

### Component Props

- `source`: Track where signups come from (e.g., "supervisors-landing", "study-hero")
- `title`: Heading text for the signup form
- `description`: Subheading/description text
- `buttonText`: CTA button text
- `variant`: "default" | "inline" | "card"
- `showNameField`: Whether to show optional name field
- `className`: Additional CSS classes

## API Endpoints

### POST /api/ghost-subscribe

Subscribe a new member to the newsletter.

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "source": "landing-page"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully subscribed!",
  "member": {
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

## Ghost Admin Features

### Managing Subscribers

1. View all subscribers: Ghost Admin → Members
2. Filter by source/label
3. Export subscriber lists
4. Manage unsubscribes

### Creating Newsletters

1. Go to Ghost Admin → Newsletters
2. Create different newsletter types:
   - Product updates
   - Educational content
   - Feature announcements
3. Customize design and branding
4. Set sending schedule

### Email Templates

Ghost provides customizable email templates:
- Welcome emails
- Newsletter templates
- Transactional emails

## Production Deployment

### Using Docker

1. Update `docker-compose.yml` with production settings
2. Use environment variables for sensitive data
3. Set up SSL/TLS with reverse proxy (nginx/Caddy)
4. Configure backup strategy for database

### Environment Variables

Production environment variables:

```env
NODE_ENV=production
GHOST_URL=https://ghost.yourdomain.com
GHOST_ADMIN_KEY=production_admin_key
GHOST_CONTENT_KEY=production_content_key

# Production email service
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USER=apikey
MAIL_PASSWORD=your_sendgrid_api_key
MAIL_FROM=newsletter@yourdomain.com
```

### Security Considerations

1. **API Keys**: Keep Ghost API keys secure, never commit to git
2. **Rate Limiting**: Implemented in `/api/ghost-subscribe`
3. **Honeypot**: Anti-spam field in signup forms
4. **CORS**: Configure allowed origins in production
5. **SSL/TLS**: Always use HTTPS in production

## Monitoring & Analytics

### Ghost Analytics

Ghost provides built-in analytics for:
- Open rates
- Click rates
- Subscriber growth
- Engagement metrics

### Custom Tracking

Track signups by source using the `source` parameter:
- "supervisors-landing"
- "study-landing"
- "blog-sidebar"
- etc.

## Troubleshooting

### Common Issues

1. **Ghost not starting**: Check Docker logs
   ```bash
   docker-compose logs ghost
   ```

2. **Email not sending**: Verify SMTP configuration in Ghost Admin

3. **API authentication failing**: Ensure API keys are correctly formatted (id:secret)

4. **Subscribers not appearing**: Check Ghost Admin → Members

### Debug Mode

Enable debug logging:

```javascript
// In ghost-admin.ts
console.log('Ghost API Response:', response);
```

## Migration from Existing System

If migrating from another email service:

1. Export existing subscribers as CSV
2. Import in Ghost Admin → Members → Import
3. Map fields appropriately
4. Test with small batch first

## Backup & Recovery

### Database Backup

```bash
# Backup Ghost database
docker exec ghost-db mysqldump -u ghost -p ghost > ghost-backup.sql

# Restore database
docker exec -i ghost-db mysql -u ghost -p ghost < ghost-backup.sql
```

### Content Backup

Ghost content is stored in:
- `/var/lib/ghost/content` (in container)
- `ghost-content` volume (Docker)

## Support & Resources

- [Ghost Documentation](https://ghost.org/docs/)
- [Ghost Admin API](https://ghost.org/docs/admin-api/)
- [Ghost Newsletters Guide](https://ghost.org/docs/newsletters/)
- [Docker Compose Reference](https://docs.docker.com/compose/)

## Next Steps

1. Set up production Ghost instance
2. Configure custom email templates
3. Create newsletter segments
4. Set up automated welcome series
5. Integrate with analytics platform