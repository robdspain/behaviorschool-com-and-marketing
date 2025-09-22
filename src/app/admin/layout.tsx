import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { isAuthorizedAdmin } from '@/lib/admin-config'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const email = user?.email?.toLowerCase() || null

  if (!email || !isAuthorizedAdmin(email)) {
    redirect('/admin/login?error=unauthorized')
  }

  return <>{children}</>
}

