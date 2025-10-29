import { NextRequest, NextResponse } from 'next/server'
import { listmonkFetch, getListmonkConfig } from '@/lib/listmonk'
import { verifyAdminSession } from '@/lib/admin-auth'

function extractCount(json: any): number | null {
  try {
    if (!json) return null
    if (typeof json === 'number') return json
    const data = json.data || json
    if (typeof data?.total === 'number') return data.total
    if (Array.isArray(data?.results)) return data.results.length
    if (Array.isArray(json)) return json.length
  } catch {}
  return null
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await verifyAdminSession()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!getListmonkConfig()) return NextResponse.json({ error: 'Listmonk not configured' }, { status: 200 })
  const id = params.id
  try {
    const [viewsRes, clicksRes, bouncesRes, linksRes] = await Promise.all([
      listmonkFetch(`/api/campaigns/analytics/views?campaign_id=${id}`),
      listmonkFetch(`/api/campaigns/analytics/clicks?campaign_id=${id}`),
      listmonkFetch(`/api/campaigns/analytics/bounces?campaign_id=${id}`),
      listmonkFetch(`/api/campaigns/analytics/links?campaign_id=${id}`),
    ])
    const [views, clicks, bounces, links] = await Promise.all([
      viewsRes.ok ? viewsRes.json() : null,
      clicksRes.ok ? clicksRes.json() : null,
      bouncesRes.ok ? bouncesRes.json() : null,
      linksRes.ok ? linksRes.json() : null,
    ])
    return NextResponse.json({
      success: true,
      metrics: {
        views: extractCount(views),
        clicks: extractCount(clicks),
        bounces: extractCount(bounces),
        links: extractCount(links),
      }
    })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch analytics', details: String(e) }, { status: 502 })
  }
}
