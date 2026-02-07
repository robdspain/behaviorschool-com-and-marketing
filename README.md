# BehaviorSchool.com - Marketing Site

Next.js marketing website for BehaviorSchool, featuring video library, blog, and course information.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4
- **Authentication**: NextAuth.js 5
- **Database**: Supabase
- **Video Hosting**: Cloudflare R2
- **Email**: Resend, Mailgun
- **AI**: Google Gemini

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+

### Installation

```bash
pnpm install
```

### Environment Setup

Copy `.env.example` to `.env.local` and configure:

```bash
cp .env.example .env.local
```

#### Required Environment Variables

See `.env.example` for all required variables.

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Video System

The site supports multiple video sources:

1. **YouTube** - Embedded via iframe
2. **Vimeo** - Embedded via iframe  
3. **R2 Direct Upload** - Self-hosted on Cloudflare R2

### Cloudflare R2 Configuration

R2 provides S3-compatible object storage for video hosting. We use the same R2 bucket as the learning platform.

#### Required Environment Variables

```bash
CF_R2_ACCESS_KEY_ID=<your-access-key>
CF_R2_SECRET_ACCESS_KEY=<your-secret-key>
CF_R2_BUCKET_NAME=<bucket-name>
CF_R2_PUBLIC_BASE_URL=<public-url>
CF_R2_ACCOUNT_ID=<account-id>
```

#### How to Get R2 Credentials

1. Log in to Cloudflare Dashboard
2. Go to **R2** → **Overview**
3. Create a bucket (or use existing `behaviorschool-videos`)
4. Go to **R2** → **Manage R2 API Tokens**
5. Create a new API token with read/write permissions
6. Copy the **Access Key ID** and **Secret Access Key**
7. Your **Account ID** is in the R2 URL: `https://<account-id>.r2.cloudflarestorage.com`
8. Set up a **Public Bucket** or **Custom Domain** for `CF_R2_PUBLIC_BASE_URL`

#### Custom Domain (Recommended)

For better performance and branding, configure a custom domain:

1. Go to your R2 bucket settings
2. Add a custom domain (e.g., `videos.behaviorschool.com`)
3. Update `CF_R2_PUBLIC_BASE_URL=https://videos.behaviorschool.com`

### Video Upload Flow

1. Admin navigates to `/admin/videos`
2. Clicks "Add New Video"
3. Selects "Direct Upload" as video source
4. Drags & drops video file or clicks to browse
5. Video uploads directly to R2 with:
   - Progress bar tracking
   - Automatic thumbnail generation
   - Multipart upload for large files (>10MB)
6. R2 URL automatically populates in the form
7. Save to publish video

### Video Components

- **`R2VideoPlayer`** - HTML5 player with progress tracking, HLS support
- **`R2VideoUpload`** - Drag-and-drop upload with multipart for large files
- **`VideoPlayer`** - Universal player that detects source and routes to appropriate player

## Deployment

```bash
pnpm build
pnpm start
```

### Netlify Deployment

This project is configured for Netlify deployment. Push to `main` branch to trigger auto-deploy.

## Project Structure

```
src/
├── app/
│   ├── admin/
│   │   └── videos/          # Video management admin
│   ├── api/
│   │   └── videos/          # R2 upload API routes
│   └── videos/              # Public video pages
├── components/
│   ├── video/
│   │   ├── R2VideoPlayer.tsx
│   │   └── R2VideoUpload.tsx
│   └── VideoPlayer.tsx      # Universal player
├── lib/
│   └── r2.ts               # R2 client utilities
└── types/
    └── video.ts            # Video type definitions
```

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm typecheck` - Run TypeScript type checking

## License

Proprietary - BehaviorSchool
