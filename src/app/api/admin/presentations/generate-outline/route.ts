import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, slideCount = 10, tone = 'professional', language = 'English', model = 'gemini-2.5-flash', provider = 'google', apiKey, ollamaEndpoint, webGrounding = false, webResults = 5, webQuery } = body;

    if (!apiKey && provider !== 'ollama') {
      return NextResponse.json({ error: 'API key is required' }, { status: 400 });
    }

    // Optional grounding
    let webContext: string | undefined = undefined;
    if (webGrounding) {
      try {
        const q = (webQuery || topic || '').slice(0, 200);
        if (q) webContext = await fetchWebContext(q, Math.max(1, Math.min(10, Number(webResults) || 5)));
      } catch {}
    }

    let slides: Array<{ title: string; content: string[] }> = [];
    if (provider === 'google') {
      slides = await generateWithGemini(apiKey, topic, slideCount, tone, language, model, webContext);
    } else if (provider === 'openai') {
      slides = await generateWithOpenAI(apiKey, topic, slideCount, tone, language, model, webContext);
    } else if (provider === 'anthropic') {
      slides = await generateWithAnthropic(apiKey, topic, slideCount, tone, language, model, webContext);
    } else if (provider === 'ollama') {
      slides = await generateWithOllama(ollamaEndpoint, topic, slideCount, tone, language, model, webContext);
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
  // Prefer 2.5 family
  if (!n) return 'gemini-2.5-flash';
  if (n === 'gemini-2.5') return 'gemini-2.5-flash';
  if (n === 'gemini-2.5-pro-latest') return 'gemini-2.5-pro';
  if (n === 'gemini-2.5-flash-latest') return 'gemini-2.5-flash';
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
  modelName: string,
  webContext?: string
) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: normalizeGeminiModel(modelName) });
  const prompt = basePrompt(topic, slideCount, tone, language, webContext);
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
  modelName: string,
  webContext?: string
) {
  const prompt = basePrompt(topic, slideCount, tone, language, webContext);
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
  modelName: string,
  webContext?: string
) {
  const prompt = basePrompt(topic, slideCount, tone, language, webContext);
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
  modelName: string,
  webContext?: string
) {
  if (!endpoint) throw new Error('Ollama endpoint required');
  const prompt = basePrompt(topic, slideCount, tone, language, webContext);
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

async function fetchWebContext(query: string, numResults: number) {
  const key = process.env.GOOGLE_SEARCH_API_KEY;
  const cx = process.env.GOOGLE_SEARCH_CX;
  if (!key || !cx) throw new Error('Missing GOOGLE_SEARCH_API_KEY or GOOGLE_SEARCH_CX');
  const url = new URL('https://www.googleapis.com/customsearch/v1');
  url.searchParams.set('key', key);
  url.searchParams.set('cx', cx);
  url.searchParams.set('q', query);
  url.searchParams.set('num', String(Math.max(1, Math.min(10, Number(numResults) || 5))));
  const resp = await fetch(url.toString());
  if (!resp.ok) throw new Error(`Google Search HTTP ${resp.status}`);
  const data = await resp.json();
  const items: Array<{ title?: string; link?: string; snippet?: string; displayLink?: string }> = data.items || [];
  const lines = items.map((it, idx) => `(${idx+1}) ${it.title || ''} — ${it.snippet || ''} [${it.displayLink || it.link || ''}]`);
  return lines.join('\n');
}

function basePrompt(topic: string, slideCount: number, tone: string, language: string, webContext?: string) {
  return `Create a ${slideCount}-slide presentation about "${topic}" in ${language}.
The tone should be ${tone}.

${webContext ? `Use the following web research snippets as grounding. Prefer factual accuracy and cite sources inline in bullets when appropriate (short source name in parentheses).\n\n${webContext}\n\n` : ''}

For each slide (excluding the title slide), provide:
1. A clear, concise title
2. 3-5 bullet points with key information

Output only a JSON array of objects with this structure:
[
  { "title": "Slide Title", "content": ["Bullet 1", "Bullet 2", "Bullet 3"] }
]

Generate ${slideCount - 1} content slides (the title slide will be added automatically).`;
}
