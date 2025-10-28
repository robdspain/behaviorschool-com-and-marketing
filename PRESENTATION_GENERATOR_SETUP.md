# AI Presentation Generator Setup

The AI Presentation Generator has been integrated directly into your admin panel using Presenton's API service.

## Features

- **AI-Powered Content**: Uses Presenton AI to generate professional presentations
- **Multiple Templates**: Choose from Modern, Professional, or Elegant designs
- **Customizable**: Select slide count, tone, and style
- **Instant Download**: Generates PowerPoint (.pptx) files ready to use
- **Cloud-Based**: Uses Presenton's hosted API service

## Setup Instructions

### 1. Get a Presenton API Key

1. Go to: https://presenton.ai
2. Create an account or sign in
3. Navigate to your account settings/API section
4. Create a new API key
5. Copy the key (starts with `sk-presenton-`)

### 2. Configure in Admin Panel

1. Navigate to: `/admin/presentations`
2. Find the **API Configuration** section at the top
3. Enter your Presenton API key
4. Click **Save**

The API key is stored in your browser's localStorage and sent with each generation request.

## How to Use

1. **Configure API Key**: Enter and save your Presenton API key in the settings
2. **Enter Topic**: Describe what you want your presentation to be about
3. **Select Slides**: Choose number of slides (3-20)
4. **Pick Template**: Modern, Professional, or Elegant
5. **Choose Tone**: Professional, Casual, Educational, Inspirational, or Technical
6. **Generate**: Click "Generate Presentation" and download your file

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

- **Service**: Presenton API (https://api.presenton.ai)
- **File Format**: PowerPoint 2007+ (.pptx)
- **Templates**: Modern, General (Professional), Swift (Elegant)
- **API Endpoint**: `/api/v1/ppt/presentation/generate`

## Files

- `/src/app/api/admin/presentations/generate/route.ts` - API proxy endpoint
- `/src/components/admin/PresentationGenerator.tsx` - UI component
- `/src/components/admin/PresentationSettings.tsx` - API key configuration
- `/src/app/admin/presentations/page.tsx` - Admin page

## Troubleshooting

### "Failed to generate presentation"
- Check that your Presenton API key is entered correctly
- Verify your API key is active at https://presenton.ai
- Ensure you have credits in your Presenton account
- Check browser console for specific error messages

### "Download not starting"
- Check browser console for errors
- Ensure pop-ups are not blocked
- Try a different browser

### TypeScript Errors
- Run `pnpm install` to ensure all dependencies are installed
- Restart your IDE/editor

## Cost

- Presenton operates on a credit-based system
- Check https://presenton.ai for current pricing
- Credits are consumed per presentation generated

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
