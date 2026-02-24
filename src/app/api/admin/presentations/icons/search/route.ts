export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { query, perPage = 12 } = await req.json();
    if (!query || String(query).trim().length === 0) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }
    const key = process.env.PIXABAY_API_KEY;
    if (!key) return NextResponse.json({ error: 'PIXABAY_API_KEY not set' }, { status: 400 });
    const url = `https://pixabay.com/api/?key=${key}&q=${encodeURIComponent(query)}&image_type=vector&per_page=${perPage}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Pixabay HTTP ${res.status}`);
    const data = await res.json();
    const icons = (data.hits || []).map((h: any) => ({
      url: h.webformatURL || h.largeImageURL || h.previewURL,
      thumb: h.previewURL || h.webformatURL,
      author: h.user,
    }));
    return NextResponse.json({ icons });
  } catch (error) {
    console.error('Icon search error:', error);
    return NextResponse.json({ error: 'Failed to search icons' }, { status: 500 });
  }
}

