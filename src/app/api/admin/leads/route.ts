import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { createSupabaseAdminClient } from '@/lib/supabase-admin'
import { isAuthorizedAdmin } from '@/lib/admin-config'

async function getAuthorizedEmail(request: NextRequest): Promise<string | null> {
  const supabase = await createClient()
  // Try cookie-based session first
  const { data: { user: cookieUser } } = await supabase.auth.getUser()
  let email = cookieUser?.email?.toLowerCase() || null
  if (email) return email

  // Fallback: Authorization: Bearer <token>
  const token = (request.headers.get('authorization') || '').replace('Bearer ', '').trim()
  if (token) {
    const { data: { user: tokenUser } } = await supabase.auth.getUser(token)
    email = tokenUser?.email?.toLowerCase() || null
  }
  return email
}

export async function GET(request: NextRequest) {
  try {
    const email = await getAuthorizedEmail(request)
    if (!email || !isAuthorizedAdmin(email)) {
      return NextResponse.json({ success: false, message: 'Unauthorized access' }, { status: 401 })
    }

    const supabase = createSupabaseAdminClient()

    // Downloads (lead magnets)
    const { data: downloads, error: downloadsError } = await supabase
      .from('download_submissions')
      .select('id,email,name,resource,source,created_at')
      .order('created_at', { ascending: false })

    // Subscribers (newsletter/email captures)
    const { data: subscribers, error: subscribersError } = await supabase
      .from('subscribers')
      .select('id,email,name,status,source,tags,subscribed_at')
      .order('subscribed_at', { ascending: false })

    const payload = { success: true, downloads: downloads || [], subscribers: subscribers || [] } as {
      success: true;
      downloads: NonNullable<typeof downloads>;
      subscribers: NonNullable<typeof subscribers>;
      downloadsError?: string;
      subscribersError?: string;
    }
    if (downloadsError) payload.downloadsError = downloadsError.message
    if (subscribersError) payload.subscribersError = subscribersError.message

    return NextResponse.json(payload)
  } catch (error) {
    console.error('Error fetching leads:', error)
    return NextResponse.json({ success: false, message: 'Failed to fetch leads' }, { status: 500 })
  }
}
