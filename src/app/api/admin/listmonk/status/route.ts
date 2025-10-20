import { NextResponse } from 'next/server'
import { getListmonkConfig, listmonkFetch } from '@/lib/listmonk'

interface ListmonkResponse {
  total?: number;
  data?: {
    total?: number;
    results?: unknown[];
  } | unknown[];
  results?: unknown[];
}

function extractTotal(json: ListmonkResponse | unknown[] | null): number | null {
  try {
    if (!json) return null;
    
    // Type guard for array
    if (Array.isArray(json)) return json.length;
    
    // Type guard for object with properties
    if (typeof json === 'object' && json !== null) {
      const obj = json as ListmonkResponse;
      
      if (typeof obj.total === 'number') return obj.total;
      
      if (obj.data) {
        if (typeof obj.data === 'object' && !Array.isArray(obj.data)) {
          if (typeof obj.data.total === 'number') return obj.data.total;
          if (Array.isArray(obj.data.results)) return obj.data.results.length;
        }
        if (Array.isArray(obj.data)) return obj.data.length;
      }
      
      if (Array.isArray(obj.results)) return obj.results.length;
    }
  } catch {}
  return null;
}

export async function GET() {
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

