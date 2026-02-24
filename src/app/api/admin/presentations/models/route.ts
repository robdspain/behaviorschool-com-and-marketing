export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiKey, provider = 'google', ollamaEndpoint } = body;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }

    if (provider === 'google') {
      try {
        // Curated list: prefer 2.5 models, include 2.0 and 1.5 as fallbacks
        const availableModels = [
          { name: 'gemini-2.5-pro', displayName: 'Gemini 2.5 Pro', description: 'State-of-the-art reasoning model' },
          { name: 'gemini-2.5-flash', displayName: 'Gemini 2.5 Flash', description: 'Best price-performance, fast thinking' },
          { name: 'gemini-2.5-flash-lite', displayName: 'Gemini 2.5 Flash-Lite', description: 'Ultra fast, cost efficient' },
          { name: 'gemini-2.0-flash', displayName: 'Gemini 2.0 Flash', description: 'Second generation workhorse (1M context)' },
          { name: 'gemini-2.0-flash-lite', displayName: 'Gemini 2.0 Flash-Lite', description: 'Second gen small workhorse' },
          { name: 'gemini-1.5-pro-latest', displayName: 'Gemini 1.5 Pro (Latest)', description: 'Most capable 1.5 model' },
          { name: 'gemini-1.5-flash-latest', displayName: 'Gemini 1.5 Flash (Latest)', description: 'Fast and efficient (1.5)' },
        ];

        console.log('Available Gemini models:', availableModels.length);
        console.log('Default model (first):', availableModels[0].name);

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
      try {
        // Fetch models and filter to useful chat models
        const resp = await fetch('https://api.openai.com/v1/models', {
          headers: { Authorization: `Bearer ${apiKey}` },
          cache: 'no-store',
        });
        if (!resp.ok) throw new Error(`OpenAI HTTP ${resp.status}`);
        const data = await resp.json();
        const ids: string[] = (data?.data || []).map((m: any) => m.id);
        const preferred = ids.filter((id) => /^(gpt\-4|gpt\-4o|gpt\-4\.1|gpt\-4\-turbo|gpt\-3\.5\-turbo)/.test(id));
        const unique = Array.from(new Set(preferred));
        const models = unique.map((id: string) => ({
          name: id,
          displayName: id.replaceAll('-', ' ').toUpperCase(),
          description: 'OpenAI chat model',
        }));
        // Sensible ordering: 4.1/4o -> 4-turbo -> 4 -> 3.5
        const order = (n: string) => n.includes('4.1') || n.includes('4o') ? 1 : n.includes('4-turbo') ? 2 : n.includes('gpt-4') ? 3 : 4;
        models.sort((a, b) => order(a.name) - order(b.name));
        return NextResponse.json({ models: models.length ? models : [
          { name: 'gpt-4o', displayName: 'GPT-4o', description: 'Multimodal optimized' },
          { name: 'gpt-4-turbo', displayName: 'GPT-4 Turbo', description: 'Fast GPT-4' },
          { name: 'gpt-3.5-turbo', displayName: 'GPT-3.5 Turbo', description: 'Affordable' },
        ] });
      } catch (error) {
        console.error('OpenAI models list error:', error);
        return NextResponse.json({
          models: [
            { name: 'gpt-4o', displayName: 'GPT-4o', description: 'Multimodal optimized' },
            { name: 'gpt-4-turbo', displayName: 'GPT-4 Turbo', description: 'Fast GPT-4' },
            { name: 'gpt-3.5-turbo', displayName: 'GPT-3.5 Turbo', description: 'Affordable' },
          ]
        });
      }
    } else if (provider === 'anthropic') {
      // No public list endpoint; return curated list
      return NextResponse.json({
        models: [
          { name: 'claude-3-5-sonnet-20241022', displayName: 'Claude 3.5 Sonnet', description: 'Latest balanced' },
          { name: 'claude-3-opus-20240229', displayName: 'Claude 3 Opus', description: 'Most capable' },
          { name: 'claude-3-sonnet-20240229', displayName: 'Claude 3 Sonnet', description: 'Balanced' },
          { name: 'claude-3-haiku-20240307', displayName: 'Claude 3 Haiku', description: 'Fast' },
        ]
      });
    } else if (provider === 'ollama') {
      try {
        if (!ollamaEndpoint) throw new Error('Ollama endpoint is required');
        const url = `${ollamaEndpoint.replace(/\/$/, '')}/api/tags`;
        const resp = await fetch(url, { cache: 'no-store' });
        if (!resp.ok) throw new Error(`Ollama HTTP ${resp.status}`);
        const data = await resp.json();
        const models = (data?.models || []).map((m: any) => ({
          name: m.name,
          displayName: (m.name || '').split(':')[0],
          description: m.details?.parameter_size || 'Ollama model',
        }));
        return NextResponse.json({ models });
      } catch (error) {
        console.error('Ollama models list error:', error);
        return NextResponse.json({ models: [] });
      }
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
