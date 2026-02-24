export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { query, provider = 'auto', perPage = 8 } = await req.json();
    if (!query || String(query).trim().length === 0) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const pexelsKey = process.env.PEXELS_API_KEY;
    const pixabayKey = process.env.PIXABAY_API_KEY;

    let useProvider = provider;
    if (provider === 'auto') {
      useProvider = pexelsKey ? 'pexels' : pixabayKey ? 'pixabay' : 'none';
    }
    if (useProvider === 'none') {
      return NextResponse.json({ error: 'No image provider keys configured' }, { status: 400 });
    }

    if (useProvider === 'pexels') {
      if (!pexelsKey) return NextResponse.json({ error: 'PEXELS_API_KEY not set' }, { status: 400 });
      const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}`;
      const res = await fetch(url, { headers: { Authorization: pexelsKey } });
      if (!res.ok) throw new Error(`Pexels HTTP ${res.status}`);
      const data = await res.json();
      const images = (data.photos || []).map((p: any) => ({
        url: p.src?.large || p.src?.original,
        thumb: p.src?.medium || p.src?.small,
        source: 'pexels',
        author: p.photographer,
      }));
      return NextResponse.json({ images });
    }

    if (useProvider === 'pixabay') {
      if (!pixabayKey) return NextResponse.json({ error: 'PIXABAY_API_KEY not set' }, { status: 400 });
      const url = `https://pixabay.com/api/?key=${pixabayKey}&q=${encodeURIComponent(query)}&image_type=photo&per_page=${perPage}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Pixabay HTTP ${res.status}`);
      const data = await res.json();
      const images = (data.hits || []).map((h: any) => ({
        url: h.largeImageURL || h.webformatURL,
        thumb: h.previewURL || h.webformatURL,
        source: 'pixabay',
        author: h.user,
      }));
      return NextResponse.json({ images });
    }

    return NextResponse.json({ error: 'Unsupported provider' }, { status: 400 });
  } catch (error) {
    console.error('Image search error:', error);
    return NextResponse.json({ error: 'Failed to search images' }, { status: 500 });
  }
}

