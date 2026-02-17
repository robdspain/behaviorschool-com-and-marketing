import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseAdminClient()
    const body = await request.json()
    const { name, email, role } = body || {}

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 })
    }

    if (!role) {
      return NextResponse.json({ message: 'Role is required' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: 'Please enter a valid email address' }, { status: 400 })
    }

    const [firstName, ...rest] = String(name || '').trim().split(' ')
    const lastName = rest.join(' ') || ''

    const { error } = await supabase
      .from('signup_submissions')
      .insert([
        {
          first_name: firstName || null,
          last_name: lastName || null,
          email,
          phone: null,
          organization: 'Behavior School',
          role,
          caseload_size: null,
          current_challenges: 'RBT exam prep waitlist',
          status: 'new',
          submitted_at: new Date().toISOString(),
          source: 'behaviorschool_rbt_waitlist_business'
        }
      ])

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ message: 'Failed to save waitlist. Please try again.' }, { status: 500 })
    }

    try {
      await fetch(process.env.CRM_URL || 'https://robspain.com/api/crm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          first_name: firstName,
          last_name: lastName,
          role,
          organization: 'Behavior School',
          source: 'behaviorschool_rbt_waitlist'
        })
      })
    } catch (crmError) {
      console.error('CRM sync error:', crmError)
    }

    return NextResponse.json({ message: 'You are on the waitlist!' })
  } catch (err) {
    console.error('RBT waitlist error:', err)
    return NextResponse.json({ message: 'Unexpected error' }, { status: 500 })
  }
}
