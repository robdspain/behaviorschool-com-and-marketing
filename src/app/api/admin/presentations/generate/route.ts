import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import PptxGenJS from 'pptxgenjs';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

interface SlideContent {
  title: string;
  content: string[];
  notes?: string;
}

interface PresentationData {
  title: string;
  slides: SlideContent[];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, slideCount = 5, template = 'modern', tone = 'professional' } = body;

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    // Generate presentation content using Claude
    const presentationData = await generatePresentationContent(topic, slideCount, tone);

    // Create PowerPoint presentation
    const pptxBuffer = await createPowerPoint(presentationData, template);

    // Return the file
    return new NextResponse(pptxBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'Content-Disposition': `attachment; filename="${sanitizeFilename(topic)}.pptx"`,
      },
    });
  } catch (error) {
    console.error('Presentation generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate presentation', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

async function generatePresentationContent(
  topic: string,
  slideCount: number,
  tone: string
): Promise<PresentationData> {
  const prompt = `Create a professional ${slideCount}-slide presentation about "${topic}".

The tone should be ${tone}. The presentation should be educational and engaging.

Return the content in the following JSON format:
{
  "title": "Presentation Title",
  "slides": [
    {
      "title": "Slide Title",
      "content": ["Bullet point 1", "Bullet point 2", "Bullet point 3"],
      "notes": "Speaker notes (optional)"
    }
  ]
}

Guidelines:
- First slide should be a title slide with just the title
- Each content slide should have 3-5 concise bullet points
- Keep bullet points brief and impactful
- Use clear, professional language
- Include a conclusion/summary slide at the end
- Add brief speaker notes for each slide

Return ONLY the JSON, no additional text.`;

  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  // Extract the text content from the response
  const content = message.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response format from Claude');
  }

  // Parse the JSON response
  const jsonMatch = content.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Could not extract JSON from Claude response');
  }

  const presentationData = JSON.parse(jsonMatch[0]);
  return presentationData;
}

interface ThemeConfig {
  titleBg: string;
  titleColor: string;
  contentBg: string;
  contentColor: string;
  accentColor: string;
}

async function createPowerPoint(data: PresentationData, template: string): Promise<Buffer> {
  const pptx = new PptxGenJS();

  // Set presentation metadata
  pptx.author = 'Behavior School';
  pptx.company = 'Behavior School';
  pptx.title = data.title;

  // Theme configurations
  const themes: Record<string, ThemeConfig> = {
    modern: {
      titleBg: '1e3a8a', // Navy blue
      titleColor: 'FFFFFF',
      contentBg: 'FFFFFF',
      contentColor: '1e293b',
      accentColor: '10b981', // Emerald
    },
    professional: {
      titleBg: '1e40af', // Blue
      titleColor: 'FFFFFF',
      contentBg: 'FFFFFF',
      contentColor: '1e293b',
      accentColor: '3b82f6', // Light blue
    },
    elegant: {
      titleBg: '1f2937', // Gray
      titleColor: 'FFFFFF',
      contentBg: 'FFFFFF',
      contentColor: '1f2937',
      accentColor: 'a78bfa', // Purple
    },
  };

  const theme = themes[template] || themes.modern;

  // Create slides
  data.slides.forEach((slideData, index) => {
    const slide = pptx.addSlide();

    if (index === 0) {
      // Title slide
      slide.background = { color: theme.titleBg };
      slide.addText(slideData.title, {
        x: 0.5,
        y: '40%',
        w: '90%',
        h: 1.5,
        fontSize: 44,
        color: theme.titleColor,
        bold: true,
        align: 'center',
        valign: 'middle',
      });
      slide.addText('Behavior School', {
        x: 0.5,
        y: '55%',
        w: '90%',
        h: 0.5,
        fontSize: 20,
        color: theme.titleColor,
        align: 'center',
      });
    } else {
      // Content slide
      slide.background = { color: theme.contentBg };

      // Add title
      slide.addText(slideData.title, {
        x: 0.5,
        y: 0.5,
        w: '90%',
        h: 0.75,
        fontSize: 32,
        color: theme.titleBg,
        bold: true,
      });

      // Add separator line
      slide.addShape(pptx.ShapeType.rect, {
        x: 0.5,
        y: 1.3,
        w: 9,
        h: 0.02,
        fill: { color: theme.accentColor },
      });

      // Add content bullets
      const bulletText = slideData.content.map((point) => ({
        text: point,
        options: { bullet: true, fontSize: 18, color: theme.contentColor },
      }));

      slide.addText(bulletText, {
        x: 0.75,
        y: 1.75,
        w: 8.5,
        h: 4,
        fontSize: 18,
        color: theme.contentColor,
      });

      // Add speaker notes if available
      if (slideData.notes) {
        slide.addNotes(slideData.notes);
      }
    }
  });

  // Generate buffer
  const buffer = await pptx.write({ outputType: 'nodebuffer' });
  return buffer as Buffer;
}

function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-z0-9]/gi, '_')
    .replace(/_+/g, '_')
    .substring(0, 50);
}
