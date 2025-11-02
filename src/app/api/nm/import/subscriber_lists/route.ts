import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase-admin'

type Row = Record<string, string>

function parseCSV(text: string): Row[] {
  const rows: Row[] = []
  const lines = text.replace(/\r\n?/g, '\n').split('\n').filter(l => l.trim().length)
  if (!lines.length) return rows
  const headers = splitCSVLine(lines[0])
  for (let i = 1; i < lines.length; i++) {
    const cols = splitCSVLine(lines[i])
    const row: Row = {}
    headers.forEach((h, idx) => row[h] = (cols[idx] ?? '').trim())
    rows.push(row)
  }
  return rows
}

function splitCSVLine(line: string): string[] {
  const out: string[] = []
  let cur = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') { cur += '"'; i++ } else { inQuotes = false }
      } else { cur += ch }
    } else {
      if (ch === '"') { inQuotes = true }
      else if (ch === ',') { out.push(cur); cur = '' }
      else { cur += ch }
    }
  }
  out.push(cur)
  return out
}

export async function POST(req: NextRequest) {
  const text = await req.text()
  if (!text) return NextResponse.json({ error: 'CSV body required' }, { status: 400 })
  const rows = parseCSV(text)
  if (!rows.length) return NextResponse.json({ error: 'No rows found' }, { status: 400 })
  const db = createSupabaseAdminClient()

  let inserted = 0, updated = 0, errors: any[] = []

  for (const r of rows) {
    try {
      const subId = r.subscriber_id
      const listId = Number(r.list_id)
      const status = r.status || 'subscribed'
      if (!subId || !listId) { errors.push({ row: r, error: 'missing ids' }); continue }
      const { error: iErr } = await db.from('nm_subscriber_lists').insert({ subscriber_id: subId, list_id: listId, status })
      if (iErr && (iErr as any).code === '23505') {
        const { error: uErr } = await db.from('nm_subscriber_lists').update({ status }).eq('subscriber_id', subId).eq('list_id', listId)
        if (uErr) throw uErr
        updated++
      } else if (iErr) {
        throw iErr
      } else {
        inserted++
      }
    } catch (e) {
      errors.push({ row: r, error: String(e) })
    }
  }

  return NextResponse.json({ ok: true, inserted, updated, errors })
}

