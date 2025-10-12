import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    // Use service role key for server-side operations
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE!
    )

    const { data, error } = await supabase
      .from('signup_submissions')
      .select('*')
      .order('submitted_at', { ascending: false })

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

