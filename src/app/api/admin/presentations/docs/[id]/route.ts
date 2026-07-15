export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { api, getConvexClient } from '@/lib/convex';
import type { Id } from '@/lib/convex';

type PresentationDocId = Id<"presentationDocs">;

function asDocId(id: string): PresentationDocId {
  return id as PresentationDocId;
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await getConvexClient().query(api.presentations.getDoc, {
      id: asDocId(id),
    });
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch presentation document';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { title, template, data } = body || {};
    await getConvexClient().mutation(api.presentations.updateDoc, {
      id: asDocId(id),
      title,
      template,
      data,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update presentation document';
    const status = message.includes('not found') ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await getConvexClient().mutation(api.presentations.deleteDoc, {
      id: asDocId(id),
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete presentation document';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
