# R2 Video System - Testing Guide

## Prerequisites

Before testing, ensure environment variables are configured in `.env.local`:

```bash
CF_R2_ACCESS_KEY_ID=<your-key>
CF_R2_SECRET_ACCESS_KEY=<your-secret>
CF_R2_BUCKET_NAME=<bucket-name>
CF_R2_PUBLIC_BASE_URL=<public-url>
CF_R2_ACCOUNT_ID=<account-id>
```

## Test Checklist

### 1. Environment Setup ✓

- [ ] Copy `.env.example` to `.env.local`
- [ ] Fill in R2 credentials
- [ ] Verify credentials work (check R2 dashboard)
- [ ] Start dev server: `pnpm dev`

### 2. API Routes Testing

#### Test Presigned URL Generation

```bash
curl -X POST http://localhost:3000/api/videos/upload \
  -H "Content-Type: application/json" \
  -d '{"fileName":"test.mp4","contentType":"video/mp4"}'
```

Expected response:
```json
{
  "key": "videos/20260207123456-test.mp4",
  "url": "https://...",
  "publicUrl": "https://..."
}
```

#### Test Multipart Upload Initiation

```bash
curl -X POST http://localhost:3000/api/videos/multipart/initiate \
  -H "Content-Type: application/json" \
  -d '{"fileName":"large-video.mp4","contentType":"video/mp4","size":52428800}'
```

Expected response with `uploadId` and `parts` array.

### 3. Admin Video Upload (Manual UI Testing)

1. Navigate to `http://localhost:3000/admin/videos`
2. Click "Add New Video"
3. Fill in:
   - Title: "Test R2 Video"
   - Description: "Testing R2 upload"
   - Category: "Exam Prep"
   - Video Source: "Direct Upload"
4. **Small file test (<10MB)**:
   - Drag and drop a small MP4 file
   - Verify thumbnail preview appears
   - Click "Upload to R2"
   - Watch progress bar reach 100%
   - Verify video URL populates automatically
   - Verify thumbnail URL populates
5. **Large file test (>10MB)**:
   - Upload a larger video file
   - Verify multipart upload with progress tracking
   - Check browser network tab for multiple PUT requests
6. Click "Add Video" to save
7. Verify video appears in admin list

### 4. Public Video Playback

1. Navigate to the video page: `http://localhost:3000/videos/test-r2-video`
2. Verify R2VideoPlayer loads
3. Check video plays correctly
4. Verify thumbnail displays before play
5. Test video controls (play, pause, seek)
6. Check progress bar updates
7. Verify time display shows correctly

### 5. Video Source Detection

Test that VideoPlayer correctly routes to R2VideoPlayer for R2 URLs:

- R2 URL patterns that should trigger R2VideoPlayer:
  - Contains `.mp4`, `.webm`, `.m3u8`
  - Contains `r2.cloudflarestorage.com`
  - Contains the `CF_R2_PUBLIC_BASE_URL` domain
  
- Other URLs should use standard iframe/video player:
  - YouTube URLs → iframe embed
  - Vimeo URLs → iframe embed

### 6. Error Handling

Test error scenarios:

- [ ] Upload without R2 credentials configured
- [ ] Upload invalid file type (e.g., .txt)
- [ ] Upload extremely large file (>500MB)
- [ ] Network interruption during upload
- [ ] Invalid video URL in player

### 7. Cross-Browser Testing

Test in multiple browsers:

- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

### 8. Mobile Responsive Testing

- [ ] Test upload on mobile (if supported)
- [ ] Test video playback on mobile
- [ ] Verify responsive design

## Known Limitations

1. **File size**: Multipart upload supports files up to ~5GB (10000 parts × 10MB)
2. **File types**: Only MP4, MOV, WebM are supported
3. **HLS**: HLS (.m3u8) playback requires browser HLS.js support
4. **Thumbnails**: Auto-generated client-side, quality depends on video

## Troubleshooting

### Upload fails immediately
- Check R2 credentials in `.env.local`
- Verify R2 bucket exists and has correct permissions
- Check browser console for CORS errors

### Video won't play
- Verify R2 bucket has public read access OR custom domain is configured
- Check video URL is publicly accessible
- Try opening video URL directly in browser

### Slow upload speeds
- Multipart uploads should parallelize automatically
- Check network connection
- Verify R2 region is geographically close

### Thumbnail not generating
- Ensure video is valid and playable
- Check browser console for canvas errors
- Try a different video file

## Success Criteria

All tests passing = ✅ R2 video system is fully functional

- Upload flow works end-to-end
- Videos play on public pages
- Admin can manage videos with R2 URLs
- Progress tracking works
- Thumbnails auto-generate
- Large files use multipart upload
- Error states handled gracefully
