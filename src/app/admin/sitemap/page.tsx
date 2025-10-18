'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  Users,
  Mail,
  Lock,
  CreditCard,
  BarChart3,
  FileText,
  Settings,
  ExternalLink,
  Layers
} from 'lucide-react'

interface PageLink {
  name: string
  path: string
  description: string
  external?: boolean
}

interface PageSection {
  title: string
  icon: React.ReactNode
  pages: PageLink[]
}

export default function AdminSitemapPage() {
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    document.title = 'Admin Sitemap | Behavior School Admin'

    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.push('/admin/login')
      } else {
        setIsAuthenticated(true)
      }
      setLoading(false)
    }

    checkAuth()
  }, [supabase, router])

  const sections: PageSection[] = [
    {
      title: 'Overview',
      icon: <LayoutDashboard className="w-6 h-6" />,
      pages: [
        {
          name: 'Dashboard',
          path: '/admin',
          description: 'Main dashboard with recent activity, stats, and quick actions'
        },
        {
          name: 'Analytics',
          path: '/admin/analytics',
          description: 'Traffic, conversion metrics, and performance analytics'
        }
      ]
    },
    {
      title: 'User Management',
      icon: <Users className="w-6 h-6" />,
      pages: [
        {
          name: 'Signup Submissions',
          path: '/admin/submissions',
          description: 'View and manage transformation program signup submissions'
        },
        {
          name: 'Checkout Access',
          path: '/admin/checkout-access',
          description: 'Manage checkout page access and passwords'
        }
      ]
    },
    {
      title: 'Email & Communications',
      icon: <Mail className="w-6 h-6" />,
      pages: [
        {
          name: 'Email Templates',
          path: '/admin/email-templates',
          description: 'Create and edit automated email templates'
        }
      ]
    },
    {
      title: 'Content Management',
      icon: <FileText className="w-6 h-6" />,
      pages: [
        {
          name: 'Blog Posts',
          path: '/admin/content',
          description: 'View all blog posts from Ghost CMS'
        },
        {
          name: 'Blog Editor',
          path: '/admin/blog/editor',
          description: 'Create and edit blog posts with Ghost Admin API'
        }
      ]
    },
    {
      title: 'Settings',
      icon: <Settings className="w-6 h-6" />,
      pages: [
        {
          name: 'Payment Page',
          path: '/admin/payment-page',
          description: 'Configure payment page settings'
        }
      ]
    },
    {
      title: 'External Resources',
      icon: <ExternalLink className="w-6 h-6" />,
      pages: [
        {
          name: 'Ghost CMS Admin',
          path: 'https://ghost.behaviorschool.com/ghost/',
          description: 'Access Ghost CMS admin interface directly',
          external: true
        },
        {
          name: 'Supabase Dashboard',
          path: 'https://supabase.com/dashboard',
          description: 'Manage database, authentication, and storage',
          external: true
        },
        {
          name: 'Netlify Dashboard',
          path: 'https://app.netlify.com',
          description: 'View deployments and site configuration',
          external: true
        }
      ]
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b-2 border-slate-200">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                <Layers className="w-8 h-8 text-emerald-600" />
                Admin Sitemap
              </h1>
              <p className="text-base text-slate-600 mt-1">
                Quick access to all admin pages
              </p>
            </div>
            <Link
              href="/admin"
              className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {sections.map((section, index) => (
            <div key={index} className="bg-white border-2 border-slate-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                  {section.icon}
                </div>
                <h2 className="text-2xl font-bold text-slate-900">{section.title}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.pages.map((page, pageIndex) => (
                  <div key={pageIndex}>
                    {page.external ? (
                      <a
                        href={page.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-4 border-2 border-slate-200 rounded-lg hover:border-emerald-500 hover:shadow-md transition-all group"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors flex items-center gap-2">
                              {page.name}
                              <ExternalLink className="w-4 h-4" />
                            </h3>
                            <p className="text-sm text-slate-600 mt-1">{page.description}</p>
                          </div>
                        </div>
                        <div className="mt-3 text-xs text-slate-500 font-mono bg-slate-50 px-2 py-1 rounded">
                          {page.path}
                        </div>
                      </a>
                    ) : (
                      <Link
                        href={page.path}
                        className="block p-4 border-2 border-slate-200 rounded-lg hover:border-emerald-500 hover:shadow-md transition-all group"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                              {page.name}
                            </h3>
                            <p className="text-sm text-slate-600 mt-1">{page.description}</p>
                          </div>
                        </div>
                        <div className="mt-3 text-xs text-slate-500 font-mono bg-slate-50 px-2 py-1 rounded">
                          {page.path}
                        </div>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Quick Stats */}
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-emerald-900 mb-2">Quick Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-emerald-600">
                  {sections.reduce((acc, section) => acc + section.pages.filter(p => !p.external).length, 0)}
                </div>
                <div className="text-sm text-emerald-700">Internal Pages</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">
                  {sections.reduce((acc, section) => acc + section.pages.filter(p => p.external).length, 0)}
                </div>
                <div className="text-sm text-blue-700">External Links</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600">
                  {sections.length}
                </div>
                <div className="text-sm text-purple-700">Categories</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600">
                  {sections.reduce((acc, section) => acc + section.pages.length, 0)}
                </div>
                <div className="text-sm text-orange-700">Total Links</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
