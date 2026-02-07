# Content Calendar System

A comprehensive social media content planning and scheduling system built into the BehaviorSchool.com admin panel.

## Features

### 📅 Calendar View
- Monthly calendar grid showing all scheduled posts
- Color-coded by platform (TikTok=pink, Instagram=purple, YouTube=red, LinkedIn=blue, Facebook=navy, Twitter=sky)
- Click on any post to edit
- Navigate between months easily

### ✍️ Post Creator/Editor
- **Title & Caption** with character count
- **Multi-platform selection** - schedule one post to multiple platforms
- **Content types**: Video Clip, Blog Post, Carousel, Text Post, Story
- **Media attachment** - Add video URLs with preview
- **Smart scheduling** - AI-suggested optimal posting times based on research
- **Status tracking**: Draft, Scheduled, Posted, Failed
- **Tags/Categories**: Exam Prep, IEP Tools, BCBA Tips, Product Updates, Testimonials, Clinical Skills, Career Advice
- **Notes field** for internal reminders

### 🎯 Smart Scheduling
- Auto-suggests optimal posting times based on platform and day
- Shows warnings when posting at suboptimal times
- Warns if posting too frequently on same platform
- Heat map indicators for best posting windows

### 📊 Content Pipeline View
- List view of all content
- Sortable by date, platform, status
- Filter by platform, status, content type, date range
- Bulk status updates
- Quick stats: posts this week, scheduled posts, platforms covered

### 🎥 Video Preview Gallery
- Shows generated Remotion videos from `/bcba-video-generator/out/`
- Thumbnail grid with play preview
- "Schedule This" button pre-fills post creator with video
- Track status: Unscheduled, Scheduled, Posted

### 📋 Weekly Template
Built-in weekly posting schedule optimized for BCBA audiences:

```
Monday:    LinkedIn (7-9 AM) + TikTok (12-1 PM)
Tuesday:   Instagram Reel (9-11 AM) + Twitter (10 AM-12 PM)
Wednesday: YouTube Short (7-9 AM) + Facebook (10-11 AM) + TikTok (7-9 PM)
Thursday:  TikTok (12-1 PM) + LinkedIn (5-6 PM)
Friday:    Instagram Reel (2-4 PM) + Twitter (11 AM-1 PM)
Saturday:  TikTok (9-11 AM)
Sunday:    Rest or evergreen reshare
```

## Setup

### 1. Create Database Tables

Run the SQL migration to create the required tables:

```bash
psql $DATABASE_URL < sql/create-content-calendar.sql
```

Or use the Supabase dashboard to run the SQL directly.

### 2. Seed Initial Content

Populate the calendar with draft posts:

```bash
node scripts/seed-content-calendar.js
```

This will create:
- 5 video script drafts
- 5 "BCBA Question of the Day" posts
- 3 blog post ideas

All posts are set to draft status with suggested dates based on the weekly template.

### 3. Access the Calendar

Navigate to: `https://behaviorschool.com/admin/content-calendar`

(Requires admin authentication)

## Database Schema

### `content_calendar`
- **id**: UUID primary key
- **title**: Post title (required)
- **caption**: Post caption/description
- **platforms**: Array of platforms (TikTok, Instagram, etc.)
- **content_type**: Video Clip, Blog Post, Carousel, Text Post, Story
- **media_url**: URL to video/image file
- **scheduled_date**: When to post (timestamp with timezone)
- **timezone**: Default 'America/Los_Angeles'
- **status**: draft, scheduled, posted, failed
- **tags**: Array of category tags
- **notes**: Internal notes
- **character_counts**: JSON object with platform-specific character counts
- **created_at**, **updated_at**: Auto-managed timestamps

### `posting_time_recommendations`
Pre-populated with research-based optimal posting times for each platform:
- **platform**: TikTok, Instagram, LinkedIn, etc.
- **day_of_week**: 0 (Sunday) - 6 (Saturday)
- **time_window**: e.g., "7-9 AM PST"
- **priority**: primary, secondary, avoid
- **reason**: Why this time works

### `weekly_posting_template`
Default weekly schedule template showing recommended posting pattern.

## API Endpoints

### Get All Posts
```
GET /api/admin/content-calendar
Query params: platform, status, content_type, start_date, end_date
```

### Create Post
```
POST /api/admin/content-calendar
Body: { title, caption, platforms, content_type, media_url, scheduled_date, status, tags, notes }
```

### Get Single Post
```
GET /api/admin/content-calendar/[id]
```

### Update Post
```
PUT /api/admin/content-calendar/[id]
Body: { any fields to update }
```

### Delete Post
```
DELETE /api/admin/content-calendar/[id]
```

### Get Posting Recommendations
```
GET /api/admin/posting-recommendations
Query params: platform (optional)
```

## Research-Backed Strategy

All posting times and recommendations are based on 2025-2026 research compiled in:
`/Users/Neo/clawd/social-media-strategy.md`

Key insights:
- **Best days**: Tuesday, Wednesday, Thursday across most platforms
- **TikTok**: 7-9 AM, 12-1 PM, 7-9 PM (PST)
- **LinkedIn**: Morning commute (7-9 AM) and after work (5-6 PM)
- **Instagram**: 9-11 AM, 2-4 PM weekdays
- **Twitter**: Business hours (9 AM-3 PM) Tuesday-Thursday
- **YouTube Shorts**: Commute times and evening (6-10 PM)
- **Facebook**: Mid-morning (9-11 AM) Wednesday-Thursday

### Content Performance by Platform

**TikTok/Instagram Reels**: Short quiz clips (15-30 sec) perform best

**LinkedIn**: Carousels get 278% higher engagement than video

**Twitter**: Text posts with strong hooks drive discussion

**YouTube Shorts**: Longer explainers (45-60 sec) work well

## Content Pillars

Maintain this balance in your calendar:
- 30% Exam Prep
- 25% Professional Development
- 25% Clinical Skills
- 15% Community & Engagement
- 5% Product Updates

Use tags to track this balance in the pipeline view.

## Workflow

### Daily Routine
1. Check calendar for today's scheduled posts
2. Review drafts for upcoming week
3. Create 1-2 new posts
4. Update status of posted content

### Weekly Planning
1. Review upcoming week's schedule
2. Ensure all platforms are covered
3. Create content to fill gaps
4. Follow the weekly template as a guide

### Monthly Review
1. Analyze which posts performed best
2. Adjust posting times based on actual performance
3. Plan next month's content themes
4. Archive or update old drafts

## Tips for Success

1. **Batch create content** - Create multiple posts in one sitting
2. **Use the weekly template** - It's optimized for engagement
3. **Schedule during recommended times** - The research-backed times work
4. **Mix content types** - Don't just post videos; use carousels on LinkedIn
5. **Tag everything** - Makes filtering and reporting easier
6. **Add notes** - Future you will thank past you
7. **Check character counts** - Each platform has limits
8. **Preview videos** - Always watch before scheduling
9. **Monitor status** - Move posts from draft → scheduled → posted
10. **Stay consistent** - Better to post 3x/week reliably than 7x sporadically

## Character Limits by Platform

- **TikTok**: 2,200 characters (aim for 100-150)
- **Instagram**: 2,200 characters (first 125 visible)
- **YouTube Shorts**: 5,000 characters (title: 100)
- **LinkedIn**: 3,000 characters (first 140 visible)
- **Facebook**: 63,206 characters (first 120 visible, aim for 40-80)
- **Twitter**: 280 characters (4,000 with Blue)

## Troubleshooting

### Posts not showing in calendar
- Check date range filter
- Verify post has a scheduled_date
- Refresh the page

### Can't create post
- Ensure title, platforms, and scheduled_date are filled
- Check authentication session
- Verify database connection

### Optimal time suggestions not showing
- Make sure a platform is selected
- Check that posting_time_recommendations table is populated
- Verify the selected date has recommendations for that platform

### Videos not appearing in gallery
- Check bcba-video-generator/out directory exists
- Verify video file extensions (.mp4, .webm, .mov)
- Refresh the videos view

## Future Enhancements

Potential features to add:
- [ ] Drag-and-drop rescheduling in calendar view
- [ ] Actual posting automation (connect to platform APIs)
- [ ] Performance analytics (views, engagement, CTR)
- [ ] Content suggestions based on trending topics
- [ ] Hashtag recommendations
- [ ] A/B testing for post variations
- [ ] Team collaboration (assignments, approvals)
- [ ] Content recycling suggestions (repost evergreen content)

## Support

For questions or issues:
1. Check this README
2. Review `/Users/Neo/clawd/social-media-strategy.md` for strategy details
3. Check console logs for API errors
4. Verify database tables were created correctly

---

**Built for BehaviorSchool.com** | Last updated: February 7, 2026
