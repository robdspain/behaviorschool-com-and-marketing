import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { verifyAdminSession } from '@/lib/admin-auth'

export async function GET(_request: NextRequest) {
  // Ensure the user is authenticated (admin session)
  const user = await verifyAdminSession()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('signup_submissions')
      .select('*')
      .order('submitted_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ submissions: data ?? [] })
  } catch (err) {
    console.error('Error fetching submissions:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

