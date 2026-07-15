export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { api, getConvexClient } from '@/lib/convex';
import type { Id } from '@/lib/convex';

type PresentationDocId = Id<"presentationDocs">;

export async function GET() {
  try {
    const data = await getConvexClient().query(api.presentations.listDocs, {
      limit: 200,
    });
    return NextResponse.json({ items: data || [] });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to list presentation documents';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, title, template, data } = body || {};
    if (!title || !data) {
      return NextResponse.json({ error: 'title and data are required' }, { status: 400 });
    }

    const docId = await getConvexClient().mutation(api.presentations.upsertDoc, {
      id: id ? String(id) as PresentationDocId : undefined,
      title,
      template: template || 'modern',
      data,
    });

    return NextResponse.json({ ok: true, id: docId });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to save presentation document';
    const status = message.includes('not found') ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
