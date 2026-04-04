export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server'
import { verifyAdminSession } from '@/lib/admin-auth'
import { recordRequestAuditEvent } from '@/lib/audit-log'
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
  const admin = await verifyAdminSession()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = createSupabaseAdminClient()
  const { data, error } = await db
    .from('nm_subscriber_lists')
    .select('subscriber_id, list_id, status, created_at')
  if (error) {
    await recordRequestAuditEvent(req, {
      category: 'admin_action',
      actionType: 'export',
      resource: 'nm_subscriber_lists',
      status: 'failure',
      actorUserId: admin.id,
      actorEmail: admin.email,
      metadata: { error: String(error), format: 'csv' },
    })
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }

  const csv = toCSV(data || [])
  await recordRequestAuditEvent(req, {
    category: 'admin_action',
    actionType: 'export',
    resource: 'nm_subscriber_lists',
    status: 'success',
    actorUserId: admin.id,
    actorEmail: admin.email,
    metadata: { rowCount: data?.length ?? 0, format: 'csv' },
  })
  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="subscriber_lists.csv"'
    }
  })
}
