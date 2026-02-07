# Content Calendar - Quick Setup Guide

## ✅ What's Been Built

A complete content calendar and scheduling system has been built into your admin panel. Here's what you have:

### Features
- 📅 **Calendar View** - Visual monthly calendar with color-coded posts by platform
- 📝 **Post Creator** - Create/edit posts with smart scheduling suggestions
- 📊 **Pipeline View** - List all posts, filter, sort, and bulk update
- 🎥 **Video Gallery** - Preview and schedule generated Remotion videos
- 🧠 **AI Scheduling** - Auto-suggests optimal posting times based on research
- ⚠️ **Smart Warnings** - Alerts when posting at suboptimal times

### Research Completed
All posting times, frequencies, and content strategies are documented in:
- `/Users/Neo/clawd/social-media-strategy.md` (comprehensive research)
- Platform-specific recommendations stored in database

## 🚀 Setup Steps (Do These Next)

### Step 1: Create Database Tables

Run this SQL in your Supabase dashboard or via CLI:

```bash
psql $DATABASE_URL < sql/create-content-calendar.sql
```

This creates:
- `content_calendar` table (stores all posts)
- `posting_time_recommendations` table (optimal posting times)
- `weekly_posting_template` table (default schedule)

### Step 2: Seed Initial Content

Run the seed script to populate 13 draft posts:

```bash
cd /Users/Neo/Desktop/Neo\ Code/behaviorschool-com-and-marketing
node scripts/seed-content-calendar.js
```

This creates:
- 5 video script posts (quiz clips, explainers, relatable content)
- 5 "BCBA Question of the Day" text posts
- 3 blog post promotion drafts

All posts are set to **draft** status and scheduled according to the weekly template.

### Step 3: Access the Calendar

Navigate to: **https://behaviorschool.com/admin/content-calendar**

(After deploying or running locally with `npm run dev`)

### Step 4 (Optional): Push to GitHub

The changes are committed locally but couldn't push due to SSH key permissions. To push:

```bash
cd /Users/Neo/Desktop/Neo\ Code/behaviorschool-com-and-marketing
git push origin main
```

## 📁 Files Created

### Admin Pages
- `src/app/admin/content-calendar/page.tsx` - Main calendar interface

### API Routes
- `src/app/api/admin/content-calendar/route.ts` - GET/POST endpoints
- `src/app/api/admin/content-calendar/[id]/route.ts` - Individual post CRUD
- `src/app/api/admin/posting-recommendations/route.ts` - Get optimal times

### Database
- `sql/create-content-calendar.sql` - Database schema

### Scripts
- `scripts/seed-content-calendar.js` - Populate initial draft posts

### Documentation
- `CONTENT_CALENDAR_README.md` - Full feature documentation
- `/Users/Neo/clawd/social-media-strategy.md` - Research findings

### Updated
- `src/app/admin/page.tsx` - Added "Content Calendar" card to admin dashboard

## 🎯 Weekly Posting Template

The system is pre-configured with this optimal schedule:

```
Monday:    LinkedIn (7-9 AM) + Email (9-11 AM)
Tuesday:   Instagram Reel (9-11 AM)
Wednesday: YouTube Short (7-9 AM) + Facebook (10-11 AM) + LinkedIn (5-6 PM)
Thursday:  Instagram Reel (9-11 AM) + Email (9-11 AM)
Friday:    Instagram Reel (2-4 PM) + Facebook (10-11 AM)
Saturday:  Instagram (10 AM-12 PM, optional) + YouTube (9 AM-12 PM, optional)
Sunday:    Rest or evergreen reshare
```

**Total:** 11-12 posts per week (sustainable, high-quality output)

## 💡 How to Use

### Creating a Post
1. Click "New Post" button
2. Fill in title, caption, select platforms
3. Choose content type (Video Clip, Carousel, Blog Post, etc.)
4. Add media URL if applicable (videos show live preview!)
5. Pick a date - system suggests optimal time automatically
6. Add tags (Exam Prep, BCBA Tips, IEP Tools, etc.)
7. Save as Draft or mark as Scheduled

### Smart Scheduling in Action
- Select **Instagram** as platform
- Pick **Tuesday** as date
- System auto-suggests: **"7-9 AM PST - Peak engagement for educational content"**
- Alternative times shown: 12-1 PM (lunch), 7-9 PM (evening)

### Viewing Content
- **Calendar View**: See all posts in monthly grid, color-coded by platform
- **List View**: Filter by platform, status, content type, date range
- **Videos View**: Preview generated Remotion videos, click "Schedule This"

## 🎨 Platform Colors

Posts are color-coded in the calendar:
- **Instagram**: Purple  
- **LinkedIn**: Blue
- **Facebook**: Navy
- **YouTube**: Red
- **Email**: Emerald

## 📊 Content Strategy Highlights

### Best Posting Times (PST)
- **Instagram**: Mon-Fri, 9-11 AM, 2-4 PM
- **LinkedIn**: Tue-Thu, 7-9 AM, 5-6 PM  
- **Facebook**: Wed-Thu, 9-11 AM
- **YouTube**: Weekdays 6-9 AM, 6-10 PM
- **Email**: Tue-Thu, 8-10 AM

### Content That Works
- **Instagram Reels**: Short quiz clips (15-30 sec) = highest engagement
- **LinkedIn**: Carousels (278% better than video!)
- **YouTube Shorts**: 45-60 sec explainers
- **Facebook**: Blog shares and community questions perform well
- **Email**: Clear subject lines + one primary CTA

### Posting Frequency
- Instagram: 3-5x per week
- LinkedIn: 2-5x per week (3 is optimal)
- YouTube Shorts: 2-3x per week
- Facebook: 2-4x per week
- Email: 1-2x per week (campaigns or newsletters)

## 🏷️ Content Pillars (Target Mix)
- 30% Exam Prep
- 25% Professional Development
- 25% Clinical Skills
- 15% Community & Engagement
- 5% Product Updates

Track this balance using the tags in the pipeline view!

## ⚡ Quick Wins

### This Week
1. Review the 13 seeded draft posts
2. Customize captions to match your voice
3. Schedule 3-5 posts for this week
4. Watch the calendar fill up!

### This Month
1. Create content for all days in the weekly template
2. Generate Remotion videos and schedule them
3. Mix content types (videos, carousels, text posts)
4. Monitor which posts perform best

## 🐛 Troubleshooting

**Q: Can't see the Content Calendar link in admin**
A: Clear cache, or check that `src/app/admin/page.tsx` was updated

**Q: Tables don't exist error**
A: Run the SQL migration: `psql $DATABASE_URL < sql/create-content-calendar.sql`

**Q: No draft posts showing**
A: Run the seed script: `node scripts/seed-content-calendar.js`

**Q: Optimal time suggestions not appearing**
A: Check that `posting_time_recommendations` table is populated (happens in SQL migration)

## 📞 Need Help?

Check these resources:
1. `CONTENT_CALENDAR_README.md` - Full documentation
2. `/Users/Neo/clawd/social-media-strategy.md` - Research data
3. Code comments in `src/app/admin/content-calendar/page.tsx`

---

**You're all set!** 🎉 

This is a professional-grade content calendar system ready for daily use. The research is done, the templates are loaded, and the smart scheduling will help you post at optimal times for maximum BCBA audience engagement.

Happy posting! 🚀
