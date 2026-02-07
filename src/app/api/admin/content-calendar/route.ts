import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

// GET all content calendar posts
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams
    const platform = searchParams.get('platform')
    const status = searchParams.get('status')
    const contentType = searchParams.get('content_type')
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')

    // Build query
    let query = supabase
      .from('content_calendar')
      .select('*')
      .order('scheduled_date', { ascending: true })

    // Apply filters
    if (platform) {
      query = query.contains('platforms', [platform])
    }
    if (status) {
      query = query.eq('status', status)
    }
    if (contentType) {
      query = query.eq('content_type', contentType)
    }
    if (startDate) {
      query = query.gte('scheduled_date', startDate)
    }
    if (endDate) {
      query = query.lte('scheduled_date', endDate)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching content calendar:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, posts: data })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST create new content calendar post
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
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

    const { data, error } = await supabase
      .from('content_calendar')
      .insert({
        title,
        caption,
        platforms,
        content_type,
        media_url,
        scheduled_date,
        timezone: timezone || 'America/Los_Angeles',
        status: status || 'draft',
        tags: tags || [],
        notes,
        character_counts: character_counts || {}
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating post:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, post: data }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
