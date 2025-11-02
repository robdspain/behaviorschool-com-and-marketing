import { NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase-admin'

function toCSV(rows: any[]): string {
  const esc = (v: any) => {
    if (v == null) return ''
    const s = String(v)
    if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"'
    return s
  }
  if (!rows.length) return ''
  const headers = Object.keys(rows[0])
  const lines = [headers.map(esc).join(',')]
  for (const r of rows) lines.push(headers.map(h => esc((r as any)[h])).join(','))
  return lines.join('\n')
}

export async function GET(req: Request) {
  const db = createSupabaseAdminClient()
  const { searchParams } = new URL(req.url)
  const includeLists = searchParams.get('include_lists') !== '0'

  const { data: subs, error } = await db.from('nm_subscribers').select('*').order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: String(error) }, { status: 500 })

  let listMap: Record<string, string[]> = {}
  if (includeLists && subs && subs.length) {
    const ids = subs.map(s => s.id)
    const { data: joins } = await db
      .from('nm_subscriber_lists')
      .select('subscriber_id, list_id, status')
      .in('subscriber_id', ids)
    const { data: lists } = await db.from('nm_lists').select('id, name')
    const nameById = new Map<number, string>((lists || []).map(l => [l.id, l.name]))
    for (const j of joins || []) {
      const name = nameById.get(j.list_id)
      if (!name) continue
      const arr = listMap[j.subscriber_id] || []
      arr.push(name)
      listMap[j.subscriber_id] = arr
    }
  }

  const rows = (subs || []).map(s => ({
    id: s.id,
    email: s.email,
    name: s.name || '',
    status: s.status,
    created_at: s.created_at,
    lists: includeLists ? (listMap[s.id]?.join(';') || '') : ''
  }))

  const csv = toCSV(rows)
  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="subscribers.csv"'
    }
  })
}

