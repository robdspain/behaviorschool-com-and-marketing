# Admin Panel Setup Guide

## Overview
The admin panel is now ready with Google Authentication through Supabase. This guide will help you configure and deploy the admin functionality.

## Features
- ✅ Google OAuth authentication
- ✅ Protected admin routes
- ✅ Admin dashboard with statistics
- ✅ Session management
- ✅ Middleware-based route protection
- ✅ Sign out functionality

## Setup Instructions

### 1. Supabase Project Setup

1. Create a Supabase account at [https://supabase.com](https://supabase.com)
2. Create a new project
3. Once created, go to Settings > API to find your:
   - Project URL
   - Anon Key
   - Service Role Key

### 2. Google OAuth Configuration

1. **In Supabase Dashboard:**
   - Navigate to Authentication > Providers
   - Find and enable the Google provider

2. **In Google Cloud Console:**
   - Go to [https://console.cloud.google.com](https://console.cloud.google.com)
   - Create a new project or select an existing one
   - Enable the Google+ API
   - Go to Credentials > Create Credentials > OAuth 2.0 Client ID
   - Set application type to "Web application"
   - Add authorized redirect URI: `https://YOUR_SUPABASE_URL.supabase.co/auth/v1/callback`
   - Copy the Client ID and Client Secret

3. **Back in Supabase:**
   - Paste the Google Client ID and Client Secret in the Google provider settings
   - Save the configuration

### 3. Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE=your_service_role_key
   SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

### 4. Admin User Management

By default, any user who can authenticate with Google can access the admin panel. To restrict access:

1. **Create an admin users table in Supabase:**
   ```sql
   CREATE TABLE admin_users (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     email TEXT UNIQUE NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   
   -- Add your admin email
   INSERT INTO admin_users (email) VALUES ('your-email@gmail.com');
   ```

2. **Update the admin layout** (`/src/app/admin/layout.tsx`) to check admin status:
   ```typescript
   // Add after getting the user
   const { data: adminUser } = await supabase
     .from('admin_users')
     .select('*')
     .eq('email', user.email)
     .single()
   
   if (!adminUser) {
     redirect('/unauthorized')
   }
   ```

### 5. Testing Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Visit [http://localhost:3000/admin](http://localhost:3000/admin)

4. You should be redirected to the login page

5. Click "Sign in with Google" and authenticate

6. After successful authentication, you'll be redirected to the admin dashboard

## File Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── layout.tsx        # Protected admin layout
│   │   ├── page.tsx          # Admin dashboard
│   │   └── login/
│   │       └── page.tsx      # Login page with Google OAuth
│   └── api/
│       └── auth/
│           ├── callback/
│           │   └── route.ts  # OAuth callback handler
│           └── signout/
│               └── route.ts  # Sign out handler
├── lib/
│   ├── supabase-browser.ts  # Browser client
│   └── supabase-server.ts   # Server client
├── contexts/
│   └── auth-context.tsx     # Auth context (optional, for client components)
└── middleware.ts             # Route protection middleware
```

## Security Considerations

1. **Never expose your Service Role Key** - Keep it server-side only
2. **Use Row Level Security (RLS)** in Supabase for data protection
3. **Implement admin user verification** as shown above
4. **Enable 2FA** for admin Google accounts
5. **Regular security audits** of your Supabase policies

## Deployment

### Netlify
1. Add environment variables in Netlify dashboard
2. Update `NEXT_PUBLIC_SITE_URL` to your production URL
3. Deploy as usual

### Vercel
1. Add environment variables in Vercel dashboard
2. Update `NEXT_PUBLIC_SITE_URL` to your production URL
3. Deploy as usual

## Troubleshooting

### "Supabase admin env vars are not configured"
- Ensure all environment variables are set correctly
- Restart your development server after adding env vars

### Google OAuth not redirecting properly
- Check that your redirect URI in Google Console matches exactly
- Ensure your Supabase URL is correct in env vars
- Check browser console for errors

### User can't access admin after login
- Verify the user's session in Supabase Dashboard > Authentication > Users
- Check middleware is running (check terminal logs)
- Ensure cookies are enabled in the browser

## Next Steps

1. Customize the admin dashboard with your specific needs
2. Add more admin pages (users, posts, settings, etc.)
3. Implement role-based access control if needed
4. Add analytics and monitoring
5. Set up email notifications for admin actions

## Support

For issues related to:
- Supabase: Check [Supabase Docs](https://supabase.com/docs)
- Next.js: Check [Next.js Docs](https://nextjs.org/docs)
- Google OAuth: Check [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)