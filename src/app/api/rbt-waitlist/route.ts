import { NextRequest, NextResponse } from 'next/server'
import { getConvexClient } from '@/lib/convex'

export async function POST(request: NextRequest) {
  try {
    const convex = getConvexClient()
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

    await convex.mutation('waitlist:addSubmission', {
      email,
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      role,
      organization: 'Behavior School',
      source: 'behaviorschool_rbt_waitlist_business',
      notes: 'RBT exam prep waitlist'
    })

    const crmUrl = process.env.CRM_URL || 'https://robspain.com/api/crm'
    try {
      await fetch(crmUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          role,
          first_name: firstName,
          last_name: lastName,
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
