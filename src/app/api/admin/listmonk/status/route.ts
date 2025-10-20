import { NextRequest, NextResponse } from 'next/server'
import { getListmonkConfig, listmonkFetch } from '@/lib/listmonk'

function extractTotal(json: any): number | null {
  try {
    if (!json) return null;
    if (typeof json.total === 'number') return json.total;
    if (json.data) {
      if (typeof json.data.total === 'number') return json.data.total;
      if (Array.isArray(json.data.results)) return json.data.results.length;
      if (Array.isArray(json.data)) return json.data.length;
    }
    if (Array.isArray(json.results)) return json.results.length;
    if (Array.isArray(json)) return json.length;
  } catch {}
  return null;
}

export async function GET(_req: NextRequest) {
  const cfg = getListmonkConfig();

  if (!cfg) {
    return NextResponse.json({
      success: true,
      configured: false,
      message: 'Listmonk is not configured. Set LISTMONK_URL (+ optional LISTMONK_USERNAME, LISTMONK_PASSWORD).'
    });
  }

  try {
    // Probe three core endpoints for counts
    const [listsRes, subsRes, campRes] = await Promise.all([
      listmonkFetch('/api/lists?per_page=1'),
      listmonkFetch('/api/subscribers?per_page=1'),
      listmonkFetch('/api/campaigns?per_page=1'),
    ]);

    const [listsJson, subsJson, campJson] = await Promise.all([
      listsRes.ok ? listsRes.json() : Promise.resolve(null),
      subsRes.ok ? subsRes.json() : Promise.resolve(null),
      campRes.ok ? campRes.json() : Promise.resolve(null),
    ]);

    return NextResponse.json({
      success: true,
      configured: true,
      endpoint: cfg.url,
      status: {
        lists: listsRes.ok ? (extractTotal(listsJson) ?? 'unknown') : 'error',
        subscribers: subsRes.ok ? (extractTotal(subsJson) ?? 'unknown') : 'error',
        campaigns: campRes.ok ? (extractTotal(campJson) ?? 'unknown') : 'error',
      },
      raw: {
        listsOk: listsRes.ok,
        subsOk: subsRes.ok,
        campOk: campRes.ok,
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      configured: true,
      error: 'Failed to connect to Listmonk',
      details: String(error)
    }, { status: 502 });
  }
}

