# Video Management System

This document explains the video management system built for BehaviorSchool.com.

## Overview

The video system allows Rob to manage and display educational videos for BCBA exam prep and school BCBA tips. It supports YouTube, Vimeo, and direct video file uploads.

## Features

### Public-Facing Pages

1. **Video Library (`/videos`)**
   - Grid layout of all videos organized by category
   - Categories: "Exam Prep", "School BCBA Tips", "Tool Tutorials"
   - SEO optimized for "BCBA exam prep videos", "free BCBA study videos"
   - Responsive design with hover effects
   - Call-to-action to sign up for study tools

2. **Individual Video Page (`/videos/[slug]`)**
   - Responsive video player supporting:
     - YouTube embeds (just paste the URL)
     - Vimeo embeds (just paste the URL)
     - Direct MP4/video files (HTML5 video player)
   - Video information (title, description, category)
   - Optional transcript section
   - Related videos sidebar
   - Call-to-action sections
   - Schema.org VideoObject structured data for SEO

### Admin Management

**Admin Video Manager (`/admin/videos`)**
   - View all videos in a table
   - Add new videos with form
   - Edit existing videos
   - Delete videos (with confirmation)
   - Reorder videos within categories (up/down arrows)
   - Support for YouTube, Vimeo, or direct uploads

## Data Storage

Videos are stored in a simple JSON file at `/public/data/videos.json`.

### JSON Structure

```json
{
  "videos": [
    {
      "id": "unique-id",
      "slug": "url-friendly-slug",
      "title": "Video Title",
      "description": "Video description",
      "category": "Exam Prep",
      "videoUrl": "https://www.youtube.com/watch?v=...",
      "videoSource": "youtube",
      "thumbnailUrl": "/images/video-thumbnails/custom.jpg",
      "transcript": "Optional transcript text",
      "duration": 180,
      "publishedAt": "2026-02-07T00:00:00Z",
      "updatedAt": "2026-02-07T00:00:00Z",
      "order": 1,
      "metaDescription": "SEO meta description",
      "keywords": ["keyword1", "keyword2"]
    }
  ],
  "lastUpdated": "2026-02-07T00:00:00Z"
}
```

### Video Source Types

- **`youtube`**: Paste any YouTube URL (watch, share, embed formats supported)
- **`vimeo`**: Paste any Vimeo URL
- **`upload`**: Direct link to video file (MP4, etc.) - hosted on Supabase Storage, Cloudflare R2, or external CDN

## How to Add a Video

### Option 1: Via Admin Interface (Recommended)

1. Navigate to `/admin/videos`
2. Click "+ Add New Video"
3. Fill in the form:
   - **Title**: Video title (required)
   - **Slug**: Auto-generated from title, or customize
   - **Description**: Full description (required)
   - **Category**: Select from dropdown (required)
   - **Video Source**: YouTube, Vimeo, or Upload (required)
   - **Video URL**: Paste YouTube/Vimeo URL or direct file URL (required)
   - **Thumbnail URL**: Optional custom thumbnail (YouTube auto-generates)
   - **Transcript**: Optional full transcript
   - **Display Order**: Position within category (auto-filled)
4. Click "Add Video"

### Option 2: Manually Edit JSON

Edit `/public/data/videos.json` and add a new video object to the `videos` array.

## Placeholder Videos

The system currently includes 5 placeholder videos based on Rob's video scripts:

1. **5 BCBA Ethics Questions That Trip Everyone Up** (Exam Prep)
2. **Reinforcement vs Punishment: The Question That Separates Passers from Failers** (Exam Prep)
3. **Experimental Design Made Simple: The 3 Things You MUST Know** (Exam Prep)
4. **From FBA to BIP in 10 Minutes: A School BCBA's Guide** (School BCBA Tips)
5. **How to Actually Pass the BCBA Exam: A Study Strategy That Works** (Exam Prep)

**To activate these videos:**
1. Record the videos
2. Upload to YouTube
3. Go to `/admin/videos`
4. Edit each video and replace the placeholder YouTube URL with the real URL
5. Optionally add thumbnails, transcripts, and duration

## Video Thumbnails

Thumbnails are stored in `/public/images/video-thumbnails/`.

- **YouTube**: Auto-fetches from YouTube if no custom thumbnail provided
- **Vimeo**: Requires custom thumbnail
- **Upload**: Requires custom thumbnail or uses placeholder

Recommended thumbnail specs:
- Size: 1280x720px (16:9 aspect ratio)
- Format: JPG or PNG
- File size: < 200KB

## SEO Features

1. **Page-level SEO**:
   - Custom meta titles and descriptions
   - Keywords array
   - OpenGraph tags for social sharing

2. **Structured Data**:
   - Schema.org VideoObject on each video page
   - Includes name, description, thumbnail, upload date, duration

3. **Sitemap Integration**:
   - `/videos` page included in sitemap
   - All video pages dynamically added to sitemap
   - Auto-updates when videos are added/removed

## Video Player Features

- **Responsive**: 16:9 aspect ratio maintained on all screen sizes
- **YouTube**: Full iframe embed with autoplay, controls
- **Vimeo**: Full iframe embed with player controls
- **Direct Upload**: HTML5 video element with:
  - Controls (play, pause, volume, fullscreen)
  - Poster image (thumbnail)
  - Preload metadata for faster loading

## File Upload Support

To enable direct file uploads (not just URLs):

### Option 1: Supabase Storage

1. Create a bucket in Supabase (e.g., `videos`)
2. Upload video file to bucket
3. Get public URL
4. Paste URL into admin form with source = "upload"

### Option 2: Cloudflare R2

1. Upload to R2 bucket
2. Get public URL
3. Use in admin form

### Option 3: External CDN

- Bunny CDN
- AWS CloudFront
- Any public video CDN URL

## Future Enhancements

Potential improvements:
- [ ] Direct file upload interface in admin
- [ ] Video analytics (views, watch time)
- [ ] Comments system
- [ ] Video series/playlists
- [ ] Automatic transcript generation
- [ ] Video search functionality
- [ ] Closed captions support

## Troubleshooting

### Video won't play
- **YouTube**: Check URL format, ensure video is not private
- **Vimeo**: Check privacy settings on Vimeo
- **Upload**: Ensure URL is publicly accessible, check CORS settings

### Thumbnail not showing
- Check thumbnail URL is accessible
- For YouTube, it auto-fetches (may take a moment to load)
- Ensure image path starts with `/images/` for local files

### Admin changes not reflecting
- Clear browser cache
- Check `/public/data/videos.json` was updated
- Verify JSON is valid (no syntax errors)

## Components Reference

- **`VideoPlayer`** (`src/components/VideoPlayer.tsx`): Universal video player component
- **`VideoCard`** (`src/components/VideoCard.tsx`): Video grid card with thumbnail
- **Video Library Page** (`src/app/videos/page.tsx`): Main video listing
- **Video Detail Page** (`src/app/videos/[slug]/page.tsx`): Individual video page
- **Admin Page** (`src/app/admin/videos/page.tsx`): Video management interface
- **API Route** (`src/app/api/admin/videos/route.ts`): Save videos endpoint

## Support

For issues or questions, contact the development team.
