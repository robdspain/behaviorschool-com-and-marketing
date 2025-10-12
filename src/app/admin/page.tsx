'use client'

import Link from 'next/link'
import { Mail, Users, TrendingUp, BarChart3, FileText, ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      console.log('[Admin Dashboard] Session check:', session ? 'authenticated' : 'not authenticated')
      
      if (!session) {
        console.log('[Admin Dashboard] No session, redirecting to login')
        router.push('/admin/login')
      } else {
        setIsAuthenticated(true)
      }
      setLoading(false)
    }

    checkAuth()
  }, [supabase, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }
  const adminSections = [
    {
      title: 'Form Submissions',
      description: 'View and manage signup form submissions',
      href: '/admin/submissions',
      icon: Users,
      color: 'emerald',
      stats: '24 new'
    },
    {
      title: 'Email Templates',
      description: 'Create and edit automated email templates',
      href: '/admin/email-templates',
      icon: Mail,
      color: 'blue',
      stats: '8 active'
    },
    {
      title: 'Analytics',
      description: 'View site performance and user metrics',
      href: '/admin/analytics',
      icon: BarChart3,
      color: 'purple',
      stats: 'Coming soon'
    },
    {
      title: 'Content',
      description: 'Manage pages, posts, and site content',
      href: '/admin/content',
      icon: FileText,
      color: 'orange',
      stats: 'Coming soon'
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b-2 border-slate-200">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-base text-slate-600 mt-1">Welcome back! Here&apos;s what&apos;s happening.</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        <div className="mb-8 bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-emerald-900 mb-2">
                Welcome to Your Admin Panel
              </h2>
              <p className="text-base text-emerald-700">
                Manage your site content, view submissions, and configure email templates from here.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Total Submissions</h3>
              <Users className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-3xl font-bold text-slate-900">142</p>
            <p className="text-sm text-emerald-600 mt-1">+24 this week</p>
          </div>

          <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Active Templates</h3>
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-slate-900">8</p>
            <p className="text-sm text-slate-600 mt-1">2 draft</p>
          </div>

          <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Page Views</h3>
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-slate-900">12.4K</p>
            <p className="text-sm text-emerald-600 mt-1">+18% vs last month</p>
          </div>

          <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Content Items</h3>
              <FileText className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-3xl font-bold text-slate-900">64</p>
            <p className="text-sm text-slate-600 mt-1">3 pending review</p>
          </div>
        </div>

        {/* Admin Sections Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Admin Sections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {adminSections.map((section) => {
              const Icon = section.icon
              const colorClasses = {
                emerald: 'hover:border-emerald-300',
                blue: 'hover:border-blue-300',
                purple: 'hover:border-purple-300',
                orange: 'hover:border-orange-300'
              }
              const iconBgClasses = {
                emerald: 'bg-emerald-100',
                blue: 'bg-blue-100',
                purple: 'bg-purple-100',
                orange: 'bg-orange-100'
              }
              const iconColorClasses = {
                emerald: 'text-emerald-600',
                blue: 'text-blue-600',
                purple: 'text-purple-600',
                orange: 'text-orange-600'
              }
              
              return (
                <Link
                  key={section.href}
                  href={section.href}
                  className={`block p-6 bg-white border-2 border-slate-200 rounded-xl transition-all hover:shadow-lg ${
                    colorClasses[section.color as keyof typeof colorClasses]
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className={`w-14 h-14 rounded-xl ${
                        iconBgClasses[section.color as keyof typeof iconBgClasses]
                      } flex items-center justify-center`}>
                        <Icon className={`w-7 h-7 ${
                          iconColorClasses[section.color as keyof typeof iconColorClasses]
                        }`} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-slate-900">
                          {section.title}
                        </h3>
                        {section.stats && (
                          <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-700 rounded-full">
                            {section.stats}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 mb-3">
                        {section.description}
                      </p>
                      <div className={`text-sm font-semibold flex items-center gap-1 ${
                        iconColorClasses[section.color as keyof typeof iconColorClasses]
                      }`}>
                        Access Panel
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900">New submission received</p>
                <p className="text-sm text-slate-600">John Doe submitted the signup form</p>
                <p className="text-xs text-slate-500 mt-1">2 hours ago</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900">Email template updated</p>
                <p className="text-sm text-slate-600">Welcome email template was modified</p>
                <p className="text-xs text-slate-500 mt-1">5 hours ago</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900">Analytics spike detected</p>
                <p className="text-sm text-slate-600">Traffic increased by 45% today</p>
                <p className="text-xs text-slate-500 mt-1">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
