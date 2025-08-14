# Ghost Headless CMS Setup Guide

## Current Status
✅ **Newsletter Integration Complete**: Ghost newsletter signup forms are now integrated into all landing pages:
- Products page (`/products`)
- Study page (`/study`) 
- Supervisors page (`/supervisors`)
- Dedicated subscribe page (`/subscribe`)

## Ghost Configuration Needed

### 1. Ghost Instance Setup
You need a Ghost instance running at `https://behaviorschool.com`. Based on the code, it appears you already have this.

### 2. Environment Variables Required
Copy `.env.example` to `.env.local` and configure:

```bash
# Ghost Content API URL (your Ghost site URL)
GHOST_CONTENT_URL=https://behaviorschool.com

# Ghost Content API Key (get from Ghost Admin)
GHOST_CONTENT_KEY=your_actual_content_api_key

# Optional webhook configuration
GHOST_WEBHOOK_SECRET=your_webhook_secret
GHOST_WEBHOOK_TOKEN=your_webhook_token
```

### 3. Getting Your Ghost Content API Key

1. **Access Ghost Admin**: Go to `https://behaviorschool.com/ghost/`
2. **Navigate to Integrations**: Settings → Integrations
3. **Add Custom Integration**: 
   - Click "Add custom integration"
   - Name it something like "Behavior School Frontend"
   - Copy the **Content API Key** (not the Admin API Key)
4. **Update Environment**: Add the key to your `.env.local` file

### 4. Newsletter Feature Setup

The newsletter signup forms use Ghost's native signup form widget (`@~0.2/umd/signup-form.min.js`) which:
- ✅ Automatically handles subscription management
- ✅ Integrates with Ghost's built-in email system
- ✅ Provides responsive design
- ✅ Supports customization (colors, text, etc.)

### 5. Current Newsletter Configurations

#### Products Page
- **Title**: "Behavior School Updates"
- **Description**: "Join thousands of BCBAs getting weekly insights on effective behavior management and professional growth."
- **Button Color**: `#dfbf7c` (brand gold)

#### Study Page  
- **Title**: "BCBA Study Newsletter"
- **Description**: "Weekly study strategies, practice questions, and exam preparation tips from behavior analysis experts."
- **Button Color**: `#E3B23C` (study theme yellow)

#### Supervisors Page
- **Title**: "Supervision Newsletter" 
- **Description**: "Early access updates, supervision best practices, and resources for effective BCBA supervision."
- **Button Color**: `#E3B23C` (supervision theme yellow)

## Testing the Setup

### 1. Check Ghost Connection
```bash
# Test if Ghost API is accessible
curl "https://behaviorschool.com/ghost/api/content/posts/?key=YOUR_CONTENT_KEY&limit=1"
```

### 2. Verify Newsletter Signup
1. Visit any landing page with the newsletter form
2. Enter an email address
3. Check Ghost Admin → Members to see if the subscription was recorded

### 3. Development Testing
```bash
# Start development server
npm run dev

# Visit pages to test newsletter forms:
# http://localhost:3000/products
# http://localhost:3000/study  
# http://localhost:3000/supervisors
# http://localhost:3000/subscribe
```

## Troubleshooting

### Newsletter Form Not Loading
- Check browser console for JavaScript errors
- Verify Ghost site is accessible at `https://behaviorschool.com`
- Ensure Ghost newsletter feature is enabled in Ghost Admin

### API Connection Issues
- Verify `GHOST_CONTENT_URL` and `GHOST_CONTENT_KEY` in environment
- Check Ghost Admin → Integrations for correct API key
- Test API endpoint manually with curl/browser

### Styling Issues
- Newsletter forms inherit some styling from Ghost's default CSS
- Custom styling can be applied via the component props
- Check browser developer tools for CSS conflicts

## Next Steps

1. **Configure Environment**: Set up `.env.local` with actual Ghost credentials
2. **Test Newsletter**: Verify signup forms work end-to-end
3. **Email Setup**: Ensure Ghost email sending is configured (Settings → Email newsletter)
4. **Design Newsletter**: Create newsletter templates in Ghost Admin
5. **Analytics**: Set up tracking for newsletter signups (optional)

## Technical Notes

- Newsletter forms use Ghost's hosted JavaScript widget for maximum compatibility
- Forms are responsive and work on all device sizes
- Each landing page has a themed newsletter signup with relevant messaging
- The `GhostNewsletterSignup` component is reusable across the site
- All forms point to the same Ghost instance but can have different styling/messaging