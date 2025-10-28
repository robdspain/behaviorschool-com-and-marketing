import { NextRequest, NextResponse } from 'next/server';

const PRESENTON_API_BASE = 'https://api.presenton.ai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, slideCount = 5, template = 'modern', tone = 'professional', apiKey } = body;

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required. Please configure your Presenton API key in the settings above.' },
        { status: 400 }
      );
    }

    // Map our template names to Presenton's
    const templateMap: Record<string, string> = {
      modern: 'modern',
      professional: 'general',
      elegant: 'swift',
    };

    // Generate presentation using Presenton API
    console.log('Calling Presenton API...');
    const presentonResponse = await fetch(`${PRESENTON_API_BASE}/api/v1/ppt/presentation/generate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: topic,
        n_slides: slideCount,
        language: 'English',
        template: templateMap[template] || 'modern',
        export_as: 'pptx',
      }),
    });

    if (!presentonResponse.ok) {
      const errorText = await presentonResponse.text();
      console.error('Presenton API error:', errorText);

      if (presentonResponse.status === 401) {
        throw new Error('Invalid Presenton API key. Please check your API key and try again.');
      }
      if (presentonResponse.status === 402) {
        throw new Error('Insufficient credits. Please add credits to your Presenton account.');
      }
      if (presentonResponse.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a few moments.');
      }

      throw new Error(`Presenton API error: ${errorText}`);
    }

    const presentonData = await presentonResponse.json();
    console.log('Presenton response:', presentonData);

    // Download the generated presentation
    if (!presentonData.path) {
      throw new Error('No download path returned from Presenton API');
    }

    const fileResponse = await fetch(presentonData.path);
    if (!fileResponse.ok) {
      throw new Error('Failed to download presentation file');
    }

    const fileBuffer = await fileResponse.arrayBuffer();
    const uint8Array = new Uint8Array(fileBuffer);

    // Return the file
    return new NextResponse(uint8Array, {
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

function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-z0-9]/gi, '_')
    .replace(/_+/g, '_')
    .substring(0, 50);
}
