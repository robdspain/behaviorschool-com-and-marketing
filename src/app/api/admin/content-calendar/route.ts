import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminSession } from '@/lib/admin-auth'
import { api, getConvexClient } from '@/lib/convex'

export const dynamic = 'force-dynamic'

// GET all content calendar posts
export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdminSession()
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams
    const platform = searchParams.get('platform')
    const status = searchParams.get('status')
    const contentType = searchParams.get('content_type')
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')

    const data = await getConvexClient().query(api.contentCalendar.listPosts, {
      platform: platform || undefined,
      status: status || undefined,
      contentType: contentType || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    })

    return NextResponse.json({ success: true, posts: data })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST create new content calendar post
export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdminSession()
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      title,
      caption,
      platforms,
      content_type,
      media_url,
      scheduled_date,
      timezone,
      status,
      tags,
      notes,
      character_counts
    } = body

    // Validate required fields
    if (!title || !platforms || platforms.length === 0 || !content_type || !scheduled_date) {
      return NextResponse.json(
        { error: 'Missing required fields: title, platforms, content_type, scheduled_date' },
        { status: 400 }
      )
    }

    const data = await getConvexClient().mutation(api.contentCalendar.createPost, {
      title,
      caption: caption || undefined,
      platforms,
      contentType: content_type,
      mediaUrl: media_url || undefined,
      scheduledDate: scheduled_date,
      timezone: timezone || 'America/Los_Angeles',
      status: status || 'draft',
      tags: tags || [],
      notes: notes || undefined,
      characterCounts: character_counts || {},
    })

    return NextResponse.json({ success: true, post: data }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
