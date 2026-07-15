export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminSession } from '@/lib/admin-auth'
import { api, getConvexClient } from '@/lib/convex'

// Simple page indexing settings API

export async function GET() {
  try {
    const admin = await verifyAdminSession()
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const items = await getConvexClient().query(api.indexing.listSettings, {})
    return NextResponse.json({ items }, { status: 200 })
  } catch (e) {
    console.warn('Indexing GET error', e)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await verifyAdminSession()
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json().catch(() => ({})) as { path?: string; index?: boolean; in_sitemap?: boolean; deleted?: boolean }
    if (!body.path || (typeof body.index !== 'boolean' && typeof body.in_sitemap !== 'boolean' && typeof body.deleted !== 'boolean')) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const item = await getConvexClient().mutation(api.indexing.upsertSetting, {
      path: body.path,
      index: body.index,
      inSitemap: body.in_sitemap,
      deleted: body.deleted,
    })
    return NextResponse.json({ item }, { status: 200 })
  } catch (e) {
    console.error('Indexing POST exception', e)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
