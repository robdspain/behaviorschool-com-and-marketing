export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase-admin'

type Row = Record<string, string>

function parseCSV(text: string): Row[] {
  // Minimal CSV parser (handles quotes)
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

  let inserted = 0, updated = 0, joined = 0, errors: any[] = []

  // Preload list name->id
  const { data: lists } = await db.from('nm_lists').select('id,name')
  const nameToId = new Map<string, number>((lists || []).map(l => [String(l.name).toLowerCase(), l.id]))

  for (const r of rows) {
    try {
      const email = r.email || r.Email || r.EMail
      if (!email) { errors.push({ row: r, error: 'missing email' }); continue }
      const name = r.name || r.Name || ''
      const status = r.status || 'enabled'
      const listNames = (r.lists || r.list_names || '').split(';').map(s => s.trim()).filter(Boolean)

      // upsert subscriber by email
      const { data: existing } = await db.from('nm_subscribers').select('*').eq('email', email).maybeSingle()
      let subId = existing?.id
      if (!existing) {
        const { data: ins, error: iErr } = await db.from('nm_subscribers').insert({ email, name, status }).select('*').single()
        if (iErr) throw iErr
        inserted++
        subId = ins.id
      } else {
        const { error: uErr } = await db.from('nm_subscribers').update({ name, status }).eq('id', subId as string)
        if (uErr) throw uErr
        updated++
      }

      // handle list joins
      for (const ln of listNames) {
        if (!nameToId.has(ln.toLowerCase())) {
          // create list
          const { data: l, error: lErr } = await db.from('nm_lists').insert({ name: ln }).select('*').single()
          if (lErr) throw lErr
          nameToId.set(ln.toLowerCase(), l.id)
        }
        const listId = nameToId.get(ln.toLowerCase()) as number
        const { error: jErr } = await db.from('nm_subscriber_lists').insert({ subscriber_id: subId, list_id: listId, status: 'subscribed' })
        if (jErr && (jErr as any).code === '23505') {
          // duplicate -> update
          await db.from('nm_subscriber_lists').update({ status: 'subscribed' }).eq('subscriber_id', subId as string).eq('list_id', listId)
        } else if (jErr) {
          throw jErr
        }
        joined++
      }
    } catch (e) {
      errors.push({ row: r, error: String(e) })
    }
  }

  return NextResponse.json({ ok: true, inserted, updated, joined, errors })
}

