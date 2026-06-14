import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

const allowedOrigins = new Set([
  'https://behaviorstudytools.com',
  'https://www.behaviorstudytools.com',
  'https://study.behaviorschool.com',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:3000',
])

function corsHeaders(origin: string | null) {
  const allowedOrigin = origin && allowedOrigins.has(origin) ? origin : 'https://behaviorstudytools.com'
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  }
}

function cleanString(value: unknown, max = 500) {
  return typeof value === 'string' ? value.slice(0, max) : ''
}

function cleanObject(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, val]) => [
      key.slice(0, 80),
      typeof val === 'string' ? val.slice(0, 1000) : val,
    ])
  )
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(request.headers.get('origin')),
  })
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin')
  const headers = corsHeaders(origin)

  try {
    const body = await request.json()
    const receivedAt = new Date().toISOString()
    const event = {
      event_name: cleanString(body.event, 120),
      source: cleanString(body.source, 120) || 'behaviorstudytools.com',
      page_path: cleanString(body.pagePath || body.path, 500),
      page_url: cleanString(body.url, 1000),
      page_title: cleanString(body.title, 300),
      visitor_id: cleanString(body.visitorId, 120),
      session_id: cleanString(body.sessionId, 120),
      location: cleanString(body.location, 200),
      intent: cleanString(body.intent, 120),
      destination: cleanString(body.destination, 1000),
      payload: cleanObject(body),
      received_at: receivedAt,
    }

    if (!event.event_name) {
      return NextResponse.json({ ok: false, error: 'Missing event name' }, { status: 400, headers })
    }

    let stored = false
    if (supabaseAdmin) {
      const { error } = await supabaseAdmin
        .from('behavior_study_tools_marketing_events')
        .insert(event)

      if (error) {
        console.warn('Behavior Study Tools event was accepted but not stored:', error.message)
      } else {
        stored = true
      }
    }

    console.info('Behavior Study Tools marketing event', {
      event_name: event.event_name,
      page_path: event.page_path,
      location: event.location,
      intent: event.intent,
      stored,
    })

    return NextResponse.json({ ok: true, stored }, { status: 202, headers })
  } catch (error) {
    console.warn('Invalid Behavior Study Tools marketing event payload:', error)
    return NextResponse.json({ ok: false, error: 'Invalid payload' }, { status: 400, headers })
  }
}
