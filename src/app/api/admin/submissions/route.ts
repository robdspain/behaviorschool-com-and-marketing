import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    // Use service role key for server-side operations
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE!
    )

    // Get query parameter for showing archived
    const { searchParams } = new URL(request.url)
    const showArchived = searchParams.get('show_archived') === 'true'

    let query = supabase
      .from('signup_submissions')
      .select('*')

    // Filter by archived status
    if (!showArchived) {
      query = query.eq('archived', false)
    }

    const { data, error } = await query.order('submitted_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ submissions: data ?? [] })
  } catch (err) {
    console.error('Error fetching submissions:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE!
    )

    const body = await request.json()
    const { id, archived } = body

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const updateData: { archived: boolean; archived_at: string | null; archived_by: string } = {
      archived,
      archived_at: archived ? new Date().toISOString() : null,
      archived_by: 'Admin' // You can enhance this to use actual admin user info
    }

    const { data, error } = await supabase
      .from('signup_submissions')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, submission: data })
  } catch (err) {
    console.error('Error updating submission:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

