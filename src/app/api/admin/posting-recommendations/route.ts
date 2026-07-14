import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminSession } from '@/lib/admin-auth'
import { api, getConvexClient } from '@/lib/convex'

export const dynamic = 'force-dynamic'

// GET posting time recommendations
export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdminSession()
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const platform = searchParams.get('platform')

    const data = await getConvexClient().query(api.contentCalendar.listRecommendations, {
      platform: platform || undefined,
    })

    return NextResponse.json({ success: true, recommendations: data })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
