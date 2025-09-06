# SchoolBCBA.com Domain Setup Instructions

## Overview
The domain `schoolbcba.com` will redirect to the powerful pillar landing page at `https://behaviorschool.com/school-based-bcba`.

## DNS Configuration Required

To make the redirect work, you need to configure DNS records for `schoolbcba.com`:

### Option 1: If using Netlify (Recommended)
1. **Add the domain to your Netlify site**:
   - Go to your Netlify dashboard
   - Navigate to your `behaviorschool.com` site
   - Go to "Domain settings"
   - Click "Add custom domain"
   - Add both `schoolbcba.com` and `www.schoolbcba.com`

2. **Configure DNS at your domain registrar**:
   ```
   Type: A
   Name: @
   Value: 75.2.60.5 (Netlify's load balancer IP)
   TTL: 3600

   Type: CNAME
   Name: www
   Value: schoolbcba.com
   TTL: 3600
   ```

### Option 2: If using Vercel
1. **Add the domain to your Vercel project**:
   - Go to your Vercel dashboard
   - Navigate to your project
   - Go to "Domains"
   - Add both `schoolbcba.com` and `www.schoolbcba.com`

2. **Configure DNS at your domain registrar**:
   ```
   Type: A
   Name: @
   Value: 76.76.19.61 (Vercel's IP)
   TTL: 3600

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   TTL: 3600
   ```

### Option 3: Domain-Level Redirect (Alternative)
If you prefer to handle the redirect at the DNS/domain level:
```
Type: CNAME
Name: @
Value: behaviorschool.com

Type: URL Redirect (301)
From: schoolbcba.com/*
To: https://behaviorschool.com/school-based-bcba
```

## Code Changes Made

### Next.js Configuration
Added host-based redirects in `next.config.ts`:
```typescript
{
  source: '/(.*)',
  destination: 'https://behaviorschool.com/school-based-bcba',
  permanent: true,
  has: [
    {
      type: 'host',
      value: 'schoolbcba.com',
    },
  ],
},
{
  source: '/(.*)',
  destination: 'https://behaviorschool.com/school-based-bcba',
  permanent: true,
  has: [
    {
      type: 'host',
      value: 'www.schoolbcba.com',
    },
  ],
}
```

## Landing Page Features

The `/school-based-bcba` page now includes:

### ✅ SEO Optimization
- Optimized meta title: "School-Based BCBA Operating System: From Crisis Manager to Systems Leader"
- Compelling meta description with keywords
- Comprehensive keyword targeting
- Structured data (FAQ schema markup)
- Open Graph and Twitter Cards

### ✅ Conversion-Focused Structure
- **Hero Section**: Clear value proposition with 4 key benefits
- **Educational Content**: What is a School-Based BCBA explanation
- **Core Responsibilities**: 5 key areas with tool CTAs
- **Social Proof**: Why schools need BCBAs
- **Program Promotion**: 8-week Transformation Program
- **Tool Showcase**: 4 main tools with direct links
- **Multiple CTAs**: 3 primary actions
- **FAQ Section**: 6 common questions with structured data

### ✅ Internal Linking Strategy
Links to key pages:
- `/transformation-program` (primary CTA)
- `/behavior-plans` (Behavior Plan Writer)
- `/iep-goals` (IEP Goal Generator)
- `/supervisors` (Supervision Tracker)
- `/behavior-study-tools` (Study Tools)
- `/resources` (All Tools)
- `/community` (Community)

## Testing the Setup

Once DNS is configured, test:
1. `http://schoolbcba.com` → Should redirect to `https://behaviorschool.com/school-based-bcba`
2. `http://www.schoolbcba.com` → Should redirect to `https://behaviorschool.com/school-based-bcba`
3. `https://schoolbcba.com` → Should redirect to `https://behaviorschool.com/school-based-bcba`
4. `https://www.schoolbcba.com` → Should redirect to `https://behaviorschool.com/school-based-bcba`

## SSL Certificate

Your hosting platform (Netlify/Vercel) will automatically provision SSL certificates for the new domain once DNS is configured.

## Timeline

- **DNS propagation**: 24-48 hours
- **SSL certificate**: 1-2 hours after DNS propagation
- **Ready to use**: Within 48 hours of DNS configuration

---

**Result**: `schoolbcba.com` will become a powerful, direct route to your comprehensive school-based BCBA resource hub, perfect for business cards, marketing materials, and direct referrals.