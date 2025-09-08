import { createClient } from '@/lib/supabase-server'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const supabase = await createClient()

  const { data } = await supabase.auth.getUser()

  if (data.user) {
    return NextResponse.next()
  } else {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }
}

export const config = {
  matcher: ['/admin'],
}