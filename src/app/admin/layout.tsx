import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { isAuthorizedAdmin } from '@/lib/admin-config'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({ children }: { children: ReactNode }) {
  // Check admin_session cookie (Google Identity Services auth)
  const cookieStore = await cookies()
  const adminSessionCookie = cookieStore.get('admin_session')?.value

  if (!adminSessionCookie) {
    redirect('/admin/login')
  }

  try {
    const sessionData = JSON.parse(adminSessionCookie)
    const email = sessionData.email?.toLowerCase()

    if (!email || !isAuthorizedAdmin(email)) {
      redirect('/admin/login?error=unauthorized')
    }
  } catch (e) {
    console.error('[AdminLayout] Invalid session cookie:', e)
    redirect('/admin/login')
  }

  return <>{children}</>
}

