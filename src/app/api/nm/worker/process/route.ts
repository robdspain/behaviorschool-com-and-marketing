import { NextRequest, NextResponse } from 'next/server'
import { processQueueBatch } from '@/lib/nm-mail'

export async function POST(req: NextRequest) {
  const secret = process.env.NM_WORKER_SECRET
  const hdr = req.headers.get('x-nm-worker-secret') || req.headers.get('authorization')?.replace('Bearer ', '')
  if (secret && hdr !== secret) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  const { processed } = await processQueueBatch(100)
  return NextResponse.json({ ok: true, processed })
}

