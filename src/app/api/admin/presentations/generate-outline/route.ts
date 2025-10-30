import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, slideCount = 10, tone = 'professional', language = 'English', model = 'gemini-1.5-pro-latest', provider = 'google', apiKey, ollamaEndpoint } = body;

    if (!apiKey && provider !== 'ollama') {
      return NextResponse.json({ error: 'API key is required' }, { status: 400 });
    }

    let slides: Array<{ title: string; content: string[] }> = [];
    if (provider === 'google') {
      slides = await generateWithGemini(apiKey, topic, slideCount, tone, language, model);
    } else if (provider === 'openai') {
      slides = await generateWithOpenAI(apiKey, topic, slideCount, tone, language, model);
    } else if (provider === 'anthropic') {
      slides = await generateWithAnthropic(apiKey, topic, slideCount, tone, language, model);
    } else if (provider === 'ollama') {
      slides = await generateWithOllama(ollamaEndpoint, topic, slideCount, tone, language, model);
    } else {
      return NextResponse.json({ error: 'Invalid provider' }, { status: 400 });
    }

    return NextResponse.json({ slides });
  } catch (error) {
    console.error('Generate outline error:', error);
    return NextResponse.json({ error: 'Failed to generate outline' }, { status: 500 });
  }
}

function normalizeGeminiModel(name?: string) {
  const n = (name || '').trim();
  if (!n) return 'gemini-1.5-pro-latest';
  if (n === 'gemini-1.5-pro') return 'gemini-1.5-pro-latest';
  if (n === 'gemini-1.5-flash') return 'gemini-1.5-flash-latest';
  if (n === 'gemini-pro') return 'gemini-1.5-flash-latest';
  return n;
}

async function generateWithGemini(
  apiKey: string,
  topic: string,
  slideCount: number,
  tone: string,
  language: string,
  modelName: string
) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: normalizeGeminiModel(modelName) });
  const prompt = basePrompt(topic, slideCount, tone, language);
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const m = text.match(/\[[\s\S]*\]/);
  if (!m) throw new Error('Parse error');
  return JSON.parse(m[0]);
}

async function generateWithOpenAI(
  apiKey: string,
  topic: string,
  slideCount: number,
  tone: string,
  language: string,
  modelName: string
) {
  const prompt = basePrompt(topic, slideCount, tone, language);
  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: modelName || 'gpt-4o', messages: [{ role: 'user', content: prompt }], temperature: 0.7 }),
  });
  if (!resp.ok) throw new Error('OpenAI error');
  const data = await resp.json();
  const content = data.choices?.[0]?.message?.content || '';
  const m = content.match(/\[[\s\S]*\]/);
  if (!m) throw new Error('Parse error');
  return JSON.parse(m[0]);
}

async function generateWithAnthropic(
  apiKey: string,
  topic: string,
  slideCount: number,
  tone: string,
  language: string,
  modelName: string
) {
  const prompt = basePrompt(topic, slideCount, tone, language);
  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({ model: modelName || 'claude-3-haiku-20240307', max_tokens: 2000, messages: [{ role: 'user', content: prompt }] }),
  });
  if (!resp.ok) throw new Error('Anthropic error');
  const data = await resp.json();
  const content = data.content?.[0]?.text || '';
  const m = content.match(/\[[\s\S]*\]/);
  if (!m) throw new Error('Parse error');
  return JSON.parse(m[0]);
}

async function generateWithOllama(
  endpoint: string,
  topic: string,
  slideCount: number,
  tone: string,
  language: string,
  modelName: string
) {
  if (!endpoint) throw new Error('Ollama endpoint required');
  const prompt = basePrompt(topic, slideCount, tone, language);
  const resp = await fetch(`${endpoint.replace(/\/$/, '')}/api/generate`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: modelName || 'llama3.1', prompt, stream: false, options: { temperature: 0.7 } })
  });
  if (!resp.ok) throw new Error('Ollama error');
  const data = await resp.json();
  const content = data.response || '';
  const m = content.match(/\[[\s\S]*\]/);
  if (!m) throw new Error('Parse error');
  return JSON.parse(m[0]);
}

function basePrompt(topic: string, slideCount: number, tone: string, language: string) {
  return `Create a ${slideCount}-slide presentation about "${topic}" in ${language}.
The tone should be ${tone}.

For each slide (excluding the title slide), provide:
1. A clear, concise title
2. 3-5 bullet points with key information

Output only a JSON array of objects with this structure:
[
  { "title": "Slide Title", "content": ["Bullet 1", "Bullet 2", "Bullet 3"] }
]

Generate ${slideCount - 1} content slides (the title slide will be added automatically).`;
}
