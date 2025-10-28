# AI Presentation Generator Setup

The AI Presentation Generator has been integrated directly into your admin panel. It runs on your server without Docker and uses Google Gemini AI to generate professional presentations.

## Features

- **AI-Powered Content**: Uses Google Gemini AI to generate presentation content
- **Multiple Templates**: Choose from Modern, Professional, or Elegant designs
- **Customizable**: Select slide count, tone, and style
- **Instant Download**: Generates PowerPoint (.pptx) files ready to use
- **No Docker Required**: Runs directly on your Next.js server

## Setup Instructions

### 1. Install Dependencies

```bash
pnpm install
```

This will install the required packages:
- `pptxgenjs` - PowerPoint generation
- `@google/generative-ai` - Google Gemini AI integration

### 2. Add Your Gemini API Key

1. Get your API key from: https://aistudio.google.com/app/apikey
2. Open `.env.local` and update:

```bash
GEMINI_API_KEY=your_actual_api_key_here
```

### 3. Restart Your Development Server

```bash
pnpm dev
```

### 4. Access the Presentation Generator

Navigate to: `https://behaviorschool.com/admin/presentations`

## How to Use

1. **Enter Topic**: Describe what you want your presentation to be about
2. **Select Slides**: Choose number of slides (3-20)
3. **Pick Template**: Modern, Professional, or Elegant
4. **Choose Tone**: Professional, Casual, Educational, Inspirational, or Technical
5. **Generate**: Click "Generate Presentation" and download your file

## Templates

### Modern
- Navy blue header with white text
- Emerald green accents
- Clean, contemporary design

### Professional
- Blue header with white text
- Light blue accents
- Traditional business style

### Elegant
- Gray header with white text
- Purple accents
- Sophisticated look

## API Endpoint

The generator uses the following API endpoint:

**POST** `/api/admin/presentations/generate`

**Request Body:**
```json
{
  "topic": "Your presentation topic",
  "slideCount": 5,
  "template": "modern",
  "tone": "professional"
}
```

**Response:** PowerPoint file (.pptx) download

## Technical Details

- **AI Model**: Google Gemini 1.5 Flash
- **File Format**: PowerPoint 2007+ (.pptx)
- **Slide Structure**: Title slide + content slides with bullet points + speaker notes

## Files Created

- `/src/app/api/admin/presentations/generate/route.ts` - API endpoint
- `/src/components/admin/PresentationGenerator.tsx` - UI component
- `/src/app/admin/presentations/page.tsx` - Admin page (updated)

## Troubleshooting

### "Failed to generate presentation"
- Check that your `GEMINI_API_KEY` is set correctly in `.env.local`
- Ensure your API key is valid and active at https://aistudio.google.com/
- Restart your development server after adding the API key

### "Download not starting"
- Check browser console for errors
- Ensure pop-ups are not blocked
- Try a different browser

### TypeScript Errors
- Run `pnpm install` to ensure all dependencies are installed
- Restart your IDE/editor

## Cost Estimation

- Google Gemini 1.5 Flash has a generous free tier
- Free tier includes 15 requests per minute
- Essentially free for most use cases

## Future Enhancements

Possible improvements:
- Add image generation for slides
- Support for custom color schemes
- PDF export option
- Presentation history/library
- Collaboration features
- Templates for specific topics (BCBA, education, etc.)

## Support

If you encounter any issues:
1. Check the development console for errors
2. Verify your API key is valid
3. Ensure all dependencies are installed
4. Restart your development server
