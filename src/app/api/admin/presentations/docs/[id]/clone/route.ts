export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { api, getConvexClient } from '@/lib/convex';
import type { Id } from '@/lib/convex';

type PresentationDocId = Id<"presentationDocs">;

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const cloneId = await getConvexClient().mutation(api.presentations.cloneDoc, {
      id: id as PresentationDocId,
    });
    return NextResponse.json({ ok: true, id: cloneId });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to clone presentation document';
    const status = message.includes('not found') ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
