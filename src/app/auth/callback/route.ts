import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const next = requestUrl.searchParams.get('next') || '/admin'
  
  console.log('[Auth Callback] Implicit flow - redirecting to admin')
  console.log('[Auth Callback] Tokens will be handled by client-side Supabase')
  
  // For implicit flow, tokens are in URL fragment (not accessible server-side)
  // Just redirect to admin, client will handle token extraction
  const response = NextResponse.redirect(new URL(next, request.url))
  
  return response
}

