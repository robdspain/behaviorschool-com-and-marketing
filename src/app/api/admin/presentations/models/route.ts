import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiKey, provider = 'google' } = body;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }

    if (provider === 'google') {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const models = await genAI.listModels();

        // Filter to only models that support generateContent
        const availableModels = models
          .filter((model) =>
            model.supportedGenerationMethods?.includes('generateContent')
          )
          .map((model) => ({
            name: model.name.replace('models/', ''),
            displayName: model.displayName || model.name,
            description: model.description,
          }));

        console.log('Available Gemini models:', availableModels.length);

        return NextResponse.json({ models: availableModels });
      } catch (error) {
        console.error('Error fetching Gemini models:', error);
        return NextResponse.json(
          {
            error: 'Failed to fetch models',
            details: error instanceof Error ? error.message : 'Unknown error'
          },
          { status: 500 }
        );
      }
    } else if (provider === 'openai') {
      // For OpenAI, return hardcoded list since their API requires different auth
      return NextResponse.json({
        models: [
          { name: 'gpt-4', displayName: 'GPT-4', description: 'Most capable model' },
          { name: 'gpt-4-turbo', displayName: 'GPT-4 Turbo', description: 'Faster GPT-4' },
          { name: 'gpt-3.5-turbo', displayName: 'GPT-3.5 Turbo', description: 'Fast and affordable' },
        ]
      });
    } else if (provider === 'anthropic') {
      // For Anthropic, return hardcoded list
      return NextResponse.json({
        models: [
          { name: 'claude-3-opus-20240229', displayName: 'Claude 3 Opus', description: 'Most capable' },
          { name: 'claude-3-sonnet-20240229', displayName: 'Claude 3 Sonnet', description: 'Balanced' },
          { name: 'claude-3-haiku-20240307', displayName: 'Claude 3 Haiku', description: 'Fast and compact' },
        ]
      });
    }

    return NextResponse.json(
      { error: 'Unsupported provider' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Models endpoint error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch models', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
