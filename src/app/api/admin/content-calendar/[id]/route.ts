import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminSession } from '@/lib/admin-auth'
import { api, getConvexClient } from '@/lib/convex'

export const dynamic = 'force-dynamic'

// GET single post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const admin = await verifyAdminSession()
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await getConvexClient().query(api.contentCalendar.getPost, { id })

    if (!data) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, post: data })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT update post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const admin = await verifyAdminSession()
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const data = await getConvexClient().mutation(api.contentCalendar.updatePost, {
      id,
      title: body.title,
      caption: body.caption || undefined,
      platforms: body.platforms,
      contentType: body.content_type,
      mediaUrl: body.media_url || undefined,
      scheduledDate: body.scheduled_date,
      timezone: body.timezone,
      status: body.status,
      tags: body.tags,
      notes: body.notes || undefined,
      characterCounts: body.character_counts,
    })

    return NextResponse.json({ success: true, post: data })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const admin = await verifyAdminSession()
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await getConvexClient().mutation(api.contentCalendar.deletePost, { id })

    return NextResponse.json({ success: true, message: 'Post deleted' })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
