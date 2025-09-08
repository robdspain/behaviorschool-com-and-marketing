'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Loader2, Shield, LogOut, BarChart3, Users, Mail, Settings, FileText } from 'lucide-react'
import Link from 'next/link'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase-client'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    if (pathname === '/admin/login') {
      setLoading(false)
      return
    }

    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      const AUTHORIZED_ADMIN_EMAILS = [
        'rob@behaviorschool.com',
        // Add more authorized emails here as needed
      ]

      if (session && session.user?.email) {
        setUser(session.user)
        // Check if user is in whitelist
        if (AUTHORIZED_ADMIN_EMAILS.includes(session.user.email)) {
          setIsAdmin(true)
        } else {
          // Authenticated but not authorized
          setIsAdmin(false)
          router.push('/admin/login?error=unauthorized')
          return
        }
      } else {
        router.push('/admin/login')
        return
      }
      setLoading(false)
    }

    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (!session) {
        router.push('/admin/login')
      } else if (session.user?.email) {
        const AUTHORIZED_ADMIN_EMAILS = [
          'rob@behaviorschool.com',
          // Add more authorized emails here as needed
        ]
        if (!AUTHORIZED_ADMIN_EMAILS.includes(session.user.email)) {
          router.push('/admin/login?error=unauthorized')
        } else {
          setIsAdmin(true)
        }
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, pathname, supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Access Denied</h2>
          <p className="text-slate-600 mb-4">You don&apos;t have permission to access the admin panel.</p>
          <button
            onClick={() => router.push('/admin/login')}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  const navigationItems = [
    { name: 'Dashboard', href: '/admin', icon: BarChart3 },
    { name: 'Signups', href: '/admin/signups', icon: Users },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Blog', href: '/admin/blog', icon: FileText },
    { name: 'Email Templates', href: '/admin/email-templates', icon: Mail },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Shield className="w-6 h-6 text-emerald-600" />
              <div>
                <h1 className="text-lg font-semibold text-slate-900">Behavior School Admin</h1>
                <p className="text-sm text-slate-600">Welcome back, {user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleSignOut}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="mb-8">
          <div className="flex flex-wrap gap-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </nav>
        
        <main>{children}</main>
      </div>
    </div>
  )
}