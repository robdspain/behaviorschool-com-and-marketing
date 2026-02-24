export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { query, numResults = 5 } = await req.json();
    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'query is required' }, { status: 400 });
    }
    const key = process.env.GOOGLE_SEARCH_API_KEY;
    const cx = process.env.GOOGLE_SEARCH_CX;
    if (!key || !cx) {
      return NextResponse.json({ error: 'Server missing GOOGLE_SEARCH_API_KEY / GOOGLE_SEARCH_CX' }, { status: 500 });
    }
    const url = new URL('https://www.googleapis.com/customsearch/v1');
    url.searchParams.set('key', key);
    url.searchParams.set('cx', cx);
    url.searchParams.set('q', query);
    url.searchParams.set('num', String(Math.max(1, Math.min(10, Number(numResults) || 5))));
    const resp = await fetch(url.toString());
    if (!resp.ok) {
      const txt = await resp.text().catch(()=> '');
      return NextResponse.json({ error: `Google Search HTTP ${resp.status}`, details: txt }, { status: 502 });
    }
    const data = await resp.json();
    const items = (data.items || []).map((it: any) => ({
      title: it.title,
      link: it.link,
      displayLink: it.displayLink,
      snippet: it.snippet,
    }));
    return NextResponse.json({ items });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Search failed' }, { status: 500 });
  }
}

