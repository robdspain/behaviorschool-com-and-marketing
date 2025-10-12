'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'
import { BarChart3, TrendingUp, Users, Download, Mail, Eye, ArrowUpRight, ArrowDownRight } from 'lucide-react'

interface AnalyticsData {
  totalSubmissions: number
  weekSubmissions: number
  totalDownloads: number
  weekDownloads: number
  totalTemplates: number
  activeTemplates: number
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [data, setData] = useState<AnalyticsData | null>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    // Set page title
    document.title = 'Analytics | Behavior School Admin'
    
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/admin/login')
      } else {
        setIsAuthenticated(true)
        fetchAnalytics()
      }
      setLoading(false)
    }

    checkAuth()
  }, [supabase, router])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/dashboard-stats')
      const result = await response.json()
      
      if (result.success) {
        setData({
          totalSubmissions: result.stats.totalSubmissions,
          weekSubmissions: result.stats.weekSubmissions,
          totalDownloads: result.stats.totalDownloads,
          weekDownloads: 0, // We'll need to add this to the API
          totalTemplates: result.stats.totalTemplates,
          activeTemplates: result.stats.activeTemplates,
        })
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return 0
    return Math.round(((current - previous) / previous) * 100)
  }

  const metrics = [
    {
      title: 'Total Submissions',
      value: data?.totalSubmissions || 0,
      change: data?.weekSubmissions || 0,
      changeLabel: 'this week',
      icon: Users,
      color: 'emerald',
      trend: (data?.weekSubmissions || 0) > 0 ? 'up' : 'neutral'
    },
    {
      title: 'Total Downloads',
      value: data?.totalDownloads || 0,
      change: data?.weekDownloads || 0,
      changeLabel: 'this week',
      icon: Download,
      color: 'blue',
      trend: (data?.weekDownloads || 0) > 0 ? 'up' : 'neutral'
    },
    {
      title: 'Active Templates',
      value: data?.activeTemplates || 0,
      change: data?.totalTemplates || 0,
      changeLabel: 'total templates',
      icon: Mail,
      color: 'purple',
      trend: 'neutral'
    },
    {
      title: 'Conversion Rate',
      value: '24%',
      change: '+5%',
      changeLabel: 'vs last month',
      icon: TrendingUp,
      color: 'orange',
      trend: 'up'
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b-2 border-slate-200">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
            <p className="text-base text-slate-600 mt-1">Track your site&apos;s performance and user engagement</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => {
            const Icon = metric.icon
            const colorClasses = {
              emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-200' },
              blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
              purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200' },
              orange: { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200' }
            }
            const colors = colorClasses[metric.color as keyof typeof colorClasses]

            return (
              <div key={index} className="bg-white border-2 border-slate-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${colors.text}`} />
                  </div>
                  {metric.trend === 'up' && (
                    <div className="flex items-center gap-1 text-emerald-600">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  )}
                  {metric.trend === 'down' && (
                    <div className="flex items-center gap-1 text-red-600">
                      <ArrowDownRight className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2">
                  {metric.title}
                </h3>
                <p className="text-3xl font-bold text-slate-900 mb-2">{metric.value}</p>
                <p className="text-sm text-slate-600">
                  <span className={metric.trend === 'up' ? 'text-emerald-600 font-semibold' : ''}>
                    {metric.change}
                  </span>{' '}
                  {metric.changeLabel}
                </p>
              </div>
            )
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Submissions Chart Placeholder */}
          <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">Submissions Over Time</h3>
              <BarChart3 className="w-5 h-5 text-slate-400" />
            </div>
            <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600 font-medium">Chart coming soon</p>
                <p className="text-sm text-slate-500 mt-1">Connect Google Analytics for detailed charts</p>
              </div>
            </div>
          </div>

          {/* Downloads Chart Placeholder */}
          <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">Resource Downloads</h3>
              <Download className="w-5 h-5 text-slate-400" />
            </div>
            <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
              <div className="text-center">
                <Download className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600 font-medium">Chart coming soon</p>
                <p className="text-sm text-slate-500 mt-1">Download trends and popular resources</p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Resources */}
        <div className="bg-white border-2 border-slate-200 rounded-xl p-6 mb-8">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Top Resources</h3>
          <div className="space-y-4">
            {[
              { name: 'IEP Behavior Goals Generator', views: 1240, downloads: 856 },
              { name: 'Behavior Plan Writer', views: 987, downloads: 654 },
              { name: 'School BCBA Hub', views: 743, downloads: 432 },
              { name: 'Free BCBA Practice Exam', views: 1532, downloads: 1203 }
            ].map((resource, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                    <Eye className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{resource.name}</p>
                    <p className="text-sm text-slate-600">{resource.views.toLocaleString()} views</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-emerald-600">{resource.downloads.toLocaleString()}</p>
                  <p className="text-sm text-slate-500">downloads</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-blue-900 mb-2">More Analytics Coming Soon</h3>
              <p className="text-blue-700 mb-4">
                We&apos;re working on advanced analytics features including real-time charts, user behavior tracking, 
                conversion funnels, and Google Analytics integration.
              </p>
              <ul className="space-y-2 text-sm text-blue-700">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  Real-time visitor tracking
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  Conversion funnel analysis
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  User journey mapping
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  Custom date ranges and exports
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

