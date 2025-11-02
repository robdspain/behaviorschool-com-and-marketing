'use client'

import Link from 'next/link'
import { Mail, Users, TrendingUp, BarChart3, FileText, ArrowRight, Archive, ArchiveX } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'

export const dynamic = 'force-dynamic'

interface DashboardStats {
  totalSubmissions: number
  weekSubmissions: number
  totalTemplates: number
  activeTemplates: number
  draftTemplates: number
  totalDownloads: number
}

interface Activity {
  id?: string
  type: 'submission' | 'template' | 'download'
  title: string
  description: string
  timestamp: string
  activity_type?: string
  activity_id?: string
  original_timestamp?: string
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [activities, setActivities] = useState<Activity[]>([])
  const [activitiesLoading, setActivitiesLoading] = useState(true)
  const [archivedActivities, setArchivedActivities] = useState<Activity[]>([])
  const [archivedLoading, setArchivedLoading] = useState(false)
  const [showArchived, setShowArchived] = useState(false)
  const [nlSummary, setNlSummary] = useState<{ totals: { opens: number; clicks: number }; daily: Array<{ date: string; opens: number; clicks: number }> } | null>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    // Set page title
    document.title = 'Dashboard | Behavior School Admin'
    
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      console.log('[Admin Dashboard] Session check:', session ? 'authenticated' : 'not authenticated')
      
      if (!session) {
        console.log('[Admin Dashboard] No session, redirecting to login')
        router.push('/admin/login')
      } else {
        setIsAuthenticated(true)
        // Fetch dashboard stats
        fetchStats()
      }
      setLoading(false)
    }

    checkAuth()
  }, [supabase, router])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/dashboard-stats')
      const data = await response.json()
      
      if (data.success) {
        setStats(data.stats)
      } else {
        console.error('Failed to fetch stats:', data.error)
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setStatsLoading(false)
    }
  }

  const fetchActivity = async () => {
    try {
      const response = await fetch('/api/admin/recent-activity')
      const data = await response.json()
      
      if (data.success) {
        setActivities(data.activities)
      } else {
        console.error('Failed to fetch activity:', data.error)
      }
    } catch (error) {
      console.error('Error fetching recent activity:', error)
    } finally {
      setActivitiesLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchActivity()
    }
  }, [isAuthenticated])

  useEffect(() => {
    const fetchNewsletterSummary = async () => {
      try {
        const res = await fetch('/api/nm/analytics/summary')
        const data = await res.json()
        if (data?.ok) setNlSummary({ totals: data.totals, daily: data.daily })
      } catch {}
    }
    if (isAuthenticated) fetchNewsletterSummary()
  }, [isAuthenticated])

  const fetchArchivedActivity = async () => {
    setArchivedLoading(true)
    try {
      const response = await fetch('/api/admin/archived-activities')
      const data = await response.json()

      if (data.success) {
        setArchivedActivities(data.activities)
      } else {
        console.error('Failed to fetch archived activity:', data.error)
      }
    } catch (error) {
      console.error('Error fetching archived activity:', error)
    } finally {
      setArchivedLoading(false)
    }
  }

  const handleArchive = async (activity: Activity, index: number) => {
    try {
      const activityId = `${activity.type}:${index}`

      const response = await fetch('/api/admin/archive-activity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          activityType: activity.type,
          activityId: activityId,
          title: activity.title,
          description: activity.description,
          timestamp: activity.timestamp,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Remove from current activities
        setActivities(activities.filter((_, i) => i !== index))
        // Refresh archived list if showing
        if (showArchived) {
          fetchArchivedActivity()
        }
      } else {
        console.error('Failed to archive activity:', data.error)
        alert('Failed to archive activity')
      }
    } catch (error) {
      console.error('Error archiving activity:', error)
      alert('Failed to archive activity')
    }
  }

  const handleUnarchive = async (activityId: string) => {
    try {
      const response = await fetch(`/api/admin/archive-activity?id=${activityId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        // Remove from archived list
        setArchivedActivities(archivedActivities.filter(a => a.id !== activityId))
        // Refresh main activities
        fetchActivity()
      } else {
        console.error('Failed to unarchive activity:', data.error)
        alert('Failed to unarchive activity')
      }
    } catch (error) {
      console.error('Error unarchiving activity:', error)
      alert('Failed to unarchive activity')
    }
  }

  useEffect(() => {
    if (showArchived && archivedActivities.length === 0) {
      fetchArchivedActivity()
    }
  }, [showArchived])

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

  const getTimeAgo = (timestamp: string) => {
    const now = new Date()
    const then = new Date(timestamp)
    const diffMs = now.getTime() - then.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  }

  const adminSections = [
    {
      title: 'Form Submissions',
      description: 'View and manage signup form submissions',
      href: '/admin/submissions',
      icon: Users,
      color: 'emerald',
      stats: statsLoading ? '...' : `${stats?.totalSubmissions || 0} total`
    },
    {
      title: 'Email Templates',
      description: 'Create and edit automated email templates',
      href: '/admin/email-templates',
      icon: Mail,
      color: 'blue',
      stats: statsLoading ? '...' : `${stats?.activeTemplates || 0} active`
    },
    {
      title: 'Newsletter',
      description: 'Manage newsletter campaigns and subscribers',
      href: '/admin/listmonk',
      icon: Mail,
      color: 'blue',
      stats: 'Listmonk'
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
            {statsLoading ? (
              <div className="h-12 bg-slate-100 rounded animate-pulse"></div>
            ) : (
              <>
                <p className="text-3xl font-bold text-slate-900">{stats?.totalSubmissions || 0}</p>
                <p className="text-sm text-emerald-600 mt-1">+{stats?.weekSubmissions || 0} this week</p>
              </>
            )}
          </div>

          <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Active Templates</h3>
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            {statsLoading ? (
              <div className="h-12 bg-slate-100 rounded animate-pulse"></div>
            ) : (
              <>
                <p className="text-3xl font-bold text-slate-900">{stats?.activeTemplates || 0}</p>
                <p className="text-sm text-slate-600 mt-1">{stats?.draftTemplates || 0} draft</p>
              </>
            )}
          </div>

          <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Downloads</h3>
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            {statsLoading ? (
              <div className="h-12 bg-slate-100 rounded animate-pulse"></div>
            ) : (
              <>
                <p className="text-3xl font-bold text-slate-900">{stats?.totalDownloads || 0}</p>
                <p className="text-sm text-slate-600 mt-1">Lead magnets</p>
              </>
            )}
          </div>

          <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Total Templates</h3>
              <FileText className="w-5 h-5 text-orange-600" />
            </div>
            {statsLoading ? (
              <div className="h-12 bg-slate-100 rounded animate-pulse"></div>
            ) : (
              <>
                <p className="text-3xl font-bold text-slate-900">{stats?.totalTemplates || 0}</p>
                <p className="text-sm text-slate-600 mt-1">Email templates</p>
              </>
            )}
          </div>
        </div>

        {/* Newsletter Performance (30d) */}
        <div className="bg-white border-2 border-slate-200 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Newsletter Performance (30d)</h3>
              <div className="text-slate-900 text-xl font-bold mt-1">Opens {nlSummary?.totals?.opens ?? 0} · Clicks {nlSummary?.totals?.clicks ?? 0}</div>
            </div>
            <Link href="/admin/newsletter" className="px-3 py-2 text-sm border rounded-lg hover:bg-slate-50">View newsletter</Link>
          </div>
          <div className="flex items-end gap-1 h-24 border border-slate-200 rounded-lg p-2">
            {(() => {
              const daily = nlSummary?.daily || []
              if (!daily.length) return <div className="text-slate-500 text-sm">No recent events</div>
              const max = Math.max(1, ...daily.map(d => Math.max(d.opens, d.clicks)))
              return daily.slice(-30).map(d => (
                <div key={d.date} className="flex flex-col items-center w-4">
                  <div className="w-3 bg-emerald-500" style={{ height: `${(d.opens / max) * 100}%` }} title={`Opens ${d.opens}`}></div>
                  <div className="w-3 bg-blue-500 mt-1" style={{ height: `${(d.clicks / max) * 100}%` }} title={`Clicks ${d.clicks}`}></div>
                </div>
              ))
            })()}
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
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900">Recent Activity</h3>
            <button
              onClick={() => setShowArchived(!showArchived)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                showArchived
                  ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Archive className="w-4 h-4" />
              {showArchived ? 'Hide Archived' : 'View Archived'}
            </button>
          </div>

          {showArchived ? (
            // Archived Activities View
            archivedLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-4 p-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-slate-100 rounded-full animate-pulse"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-100 rounded animate-pulse w-3/4"></div>
                      <div className="h-3 bg-slate-100 rounded animate-pulse w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : archivedActivities.length > 0 ? (
              <div className="space-y-4">
                {archivedActivities.map((activity) => {
                  const getIconConfig = (type: string) => {
                    switch (type) {
                      case 'submission':
                        return { icon: Users, bg: 'bg-emerald-100', color: 'text-emerald-600' }
                      case 'template':
                        return { icon: Mail, bg: 'bg-blue-100', color: 'text-blue-600' }
                      case 'download':
                        return { icon: TrendingUp, bg: 'bg-purple-100', color: 'text-purple-600' }
                      default:
                        return { icon: FileText, bg: 'bg-slate-100', color: 'text-slate-600' }
                    }
                  }

                  const iconConfig = getIconConfig(activity.activity_type || activity.type)
                  const Icon = iconConfig.icon
                  const timeAgo = getTimeAgo(activity.original_timestamp || activity.timestamp)

                  return (
                    <div key={activity.id} className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200">
                      <div className={`flex-shrink-0 w-10 h-10 ${iconConfig.bg} rounded-full flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${iconConfig.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900">{activity.title}</p>
                        <p className="text-sm text-slate-600">{activity.description}</p>
                        <p className="text-xs text-slate-500 mt-1">{timeAgo}</p>
                      </div>
                      <button
                        onClick={() => handleUnarchive(activity.id!)}
                        className="flex-shrink-0 p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Unarchive"
                      >
                        <ArchiveX className="w-5 h-5" />
                      </button>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <Archive className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No archived activities</p>
              </div>
            )
          ) : (
            // Current Activities View
            activitiesLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-4 p-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-slate-100 rounded-full animate-pulse"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-100 rounded animate-pulse w-3/4"></div>
                      <div className="h-3 bg-slate-100 rounded animate-pulse w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : activities.length > 0 ? (
              <div className="space-y-4">
                {activities.map((activity, index) => {
                  const getIconConfig = (type: string) => {
                    switch (type) {
                      case 'submission':
                        return { icon: Users, bg: 'bg-emerald-100', color: 'text-emerald-600' }
                      case 'template':
                        return { icon: Mail, bg: 'bg-blue-100', color: 'text-blue-600' }
                      case 'download':
                        return { icon: TrendingUp, bg: 'bg-purple-100', color: 'text-purple-600' }
                      default:
                        return { icon: FileText, bg: 'bg-slate-100', color: 'text-slate-600' }
                    }
                  }

                  const iconConfig = getIconConfig(activity.type)
                  const Icon = iconConfig.icon
                  const timeAgo = getTimeAgo(activity.timestamp)

                  return (
                    <div key={index} className="flex items-start gap-4 p-4 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className={`flex-shrink-0 w-10 h-10 ${iconConfig.bg} rounded-full flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${iconConfig.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900">{activity.title}</p>
                        <p className="text-sm text-slate-600">{activity.description}</p>
                        <p className="text-xs text-slate-500 mt-1">{timeAgo}</p>
                      </div>
                      <button
                        onClick={() => handleArchive(activity, index)}
                        className="flex-shrink-0 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Archive"
                      >
                        <Archive className="w-5 h-5" />
                      </button>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <p>No recent activity</p>
              </div>
            )
          )}
        </div>
      </main>
    </div>
  )
}
