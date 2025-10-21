# 🚀 Analytics Tracking - Quick Start Guide

## What You Need to Do (5 Minutes)

I've implemented a complete analytics tracking system for your conversion funnel. **Here's what you need to do to activate it:**

---

## Step 1: Create Database Tables (Required) ⏱️ 2 minutes

### Option A: Automated Script (Easiest)
```bash
cd /Users/robspain/Desktop/marketing\ suite
node apply-analytics-migration.js
```

### Option B: Manual (If script doesn't work)
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Copy and paste this SQL:

```sql
-- Create analytics_events table
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type VARCHAR(100) NOT NULL,
  event_name VARCHAR(255) NOT NULL,
  source_page VARCHAR(500) NOT NULL,
  user_email VARCHAR(255),
  resource_name VARCHAR(255),
  value NUMERIC(10, 2) DEFAULT 0,
  additional_data JSONB,
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_source_page ON analytics_events(source_page);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_email ON analytics_events(user_email);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_name ON analytics_events(event_name);
```

5. Click **Run** (or press Cmd+Enter)
6. You should see "Success. No rows returned"

---

## Step 2: Verify It Works ⏱️ 2 minutes

### A. Check the Dashboard
1. Go to https://behaviorschool.com/admin/analytics
2. Log in if needed
3. Scroll down - you should see **"Conversion Tracking"** section
4. It should show conversion metrics (may be empty at first)

### B. Test Event Tracking
1. Go to https://behaviorschool.com/act-matrix
2. Click **"Download Free Guide"**
3. Enter an email and download
4. Go back to admin analytics dashboard
5. Click **"Refresh"** button
6. You should see your test download event appear!

### C. Check Database (Optional)
In Supabase SQL Editor, run:
```sql
SELECT * FROM analytics_events ORDER BY created_at DESC LIMIT 5;
```
You should see your test event!

---

## Step 3: Deploy to Production ⏱️ 1 minute

If everything works locally, deploy to Netlify:

```bash
git add .
git commit -m "Add analytics tracking with conversion dashboard"
git push origin main
```

Netlify will auto-deploy. Once deployed, repeat Step 2 on production.

---

## ✅ What's Now Tracking

Your site will automatically track:

| Event | Where | Value |
|-------|-------|-------|
| 📧 Email Signups | Newsletter forms, download popups | $5 |
| 📥 Downloads | ACT Matrix, IEP Goals guides | $10 |
| 📚 Course Inquiries | Contact forms, course pages | $25 |
| 📱 Study App Signups | Study app registration | $15 |
| 🛠️ Tool Usage | ACT Goal Assistant, etc. | $3 |

**Everything is already instrumented!** No code changes needed.

---

## 📊 What You Get

### In Admin Dashboard (`/admin/analytics`)

**Conversion Tracking Section:**
- Total conversions (last 30 days)
- Email signups with trend %
- Downloads with trend %
- Total lead value generated

**Conversion Breakdown:**
- Count by type (email, download, inquiry, etc.)

**Recent Conversions:**
- Live feed of latest events
- Shows user email, resource name, source page, date

**Trends:**
- Percentage change vs. previous 30 days
- Up/down indicators

---

## 🐛 Troubleshooting

### "Table does not exist" error
➜ Run the SQL from Step 1 again

### Dashboard shows "Error loading conversion data"
➜ Check Supabase credentials in `.env.local`
➜ Verify tables exist: `SELECT * FROM analytics_events LIMIT 1;`

### Events not appearing
➜ Check browser console for errors
➜ Verify you're logged in as admin
➜ Try the API directly: `/api/admin/analytics/conversions`

### Can't access admin dashboard
➜ Log in at `/admin/login` first
➜ Check that your user has admin access

---

## 📚 More Documentation

- **Full Setup Guide:** `ANALYTICS_TRACKING_SETUP.md`
- **Implementation Summary:** `ANALYTICS_IMPLEMENTATION_SUMMARY.md`
- **Original Plan:** `CONVERSION_TRACKING_SETUP.md`

---

## 🎉 That's It!

Once you complete Step 1, your analytics tracking is live!

**What happens automatically:**
✅ All downloads are tracked  
✅ All email signups are tracked  
✅ All events save to database  
✅ Trends are calculated  
✅ Dashboard updates in real-time  
✅ You get conversion insights!

**Need help?** Check the troubleshooting section above or review the detailed docs.

