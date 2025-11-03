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
  const [linkStats, setLinkStats] = useState({ internalOk: 0, internalTotal: 0, externalOk: 0, externalTotal: 0 })
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    document.title = 'Site Map | Behavior School Admin'

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

  // Compute and verify links once authenticated
  useEffect(() => {
    if (!isAuthenticated) return
    const internal = sections.flatMap(s => s.pages.filter(p => !p.external))
    const external = sections.flatMap(s => s.pages.filter(p => p.external))
    setLinkStats(ls => ({ ...ls, internalTotal: internal.length, externalTotal: external.length }))

    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://behaviorschool.com'
    const checks: Array<Promise<void>> = []
    const update = (key: 'internalOk' | 'externalOk') => setLinkStats(prev => ({ ...prev, [key]: prev[key] + 1 }))

    const ping = async (url: string, key: 'internalOk' | 'externalOk') => {
      try {
        const q = new URLSearchParams({ url })
        const res = await fetch(`/api/admin/links/check?${q.toString()}`)
        const json = await res.json().catch(() => ({}))
        if (json.ok || (json.status && Number(json.status) < 400)) update(key)
      } catch {}
    }

    for (const p of internal) {
      const u = p.path.startsWith('http') ? p.path : `${origin}${p.path}`
      checks.push(ping(u, 'internalOk'))
    }
    for (const p of external) {
      if (p.path.startsWith('http')) checks.push(ping(p.path, 'externalOk'))
    }
    Promise.allSettled(checks).catch(() => {})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])

  const sections: PageSection[] = [
    {
      title: 'Core Pages',
      icon: <LayoutDashboard className="w-6 h-6" />,
      pages: [
        {
          name: 'Homepage',
          path: '/',
          description: 'Main landing page for Behavior School'
        },
        {
          name: 'Products',
          path: '/products',
          description: 'Overview of all products and services'
        },
        {
          name: 'Community',
          path: '/community',
          description: 'Community and connection resources'
        },
        {
          name: 'About',
          path: '/about',
          description: 'About Behavior School and our mission'
        },
        {
          name: 'Contact',
          path: '/contact',
          description: 'Contact form and information'
        }
      ]
    },
    {
      title: 'BCBA Study & Exam Prep',
      icon: <BarChart3 className="w-6 h-6" />,
      pages: [
        {
          name: 'BCBA Exam Prep',
          path: '/bcba-exam-prep',
          description: 'Comprehensive BCBA exam preparation resources'
        },
        {
          name: 'BCBA Study Tools',
          path: '/bcba-study-tools',
          description: 'Study tools and resources for BCBA candidates'
        },
        {
          name: 'Behavior Study Tools',
          path: '/behavior-study-tools',
          description: 'Interactive study tools platform'
        },
        {
          name: 'BCBA Practice Exam',
          path: '/bcba-practice-exam',
          description: 'Full-length BCBA practice examination'
        },
        {
          name: 'Free BCBA Practice Exam',
          path: '/free-bcba-practice-exam',
          description: 'Free practice exam for BCBA candidates'
        },
        {
          name: 'BCBA Mock Practice Test',
          path: '/bcba-mock-practice-test',
          description: 'Realistic mock practice test'
        },
        {
          name: 'Free Mock Practice Test',
          path: '/free-bcba-mock-practice-test',
          description: 'Free mock practice test for BCBA exam'
        },
        {
          name: 'Study Platform',
          path: '/study',
          description: 'Main study platform and tools hub'
        }
      ]
    },
    {
      title: 'School-Based BCBA',
      icon: <Users className="w-6 h-6" />,
      pages: [
        {
          name: 'School BCBA Hub',
          path: '/school-bcba',
          description: 'Main hub for school-based BCBA resources'
        },
        {
          name: 'School BCBA vs School-Based BCBA',
          path: '/school-bcba/vs-school-based-bcba',
          description: 'Understanding the difference between roles'
        },
        {
          name: 'School BCBA Job Guide',
          path: '/school-bcba/job-guide',
          description: 'Complete guide to school BCBA positions'
        },
        {
          name: 'School BCBA Job Guide 2025',
          path: '/school-bcba/job-guide-2025',
          description: 'Updated 2025 school BCBA job guide'
        },
        {
          name: 'School BCBA Salary by State',
          path: '/school-bcba/salary-by-state',
          description: 'State-by-state salary information'
        },
        {
          name: 'How to Become a School BCBA',
          path: '/school-bcba/how-to-become',
          description: 'Step-by-step guide to becoming a school BCBA'
        },
        {
          name: 'School-Based BCBA',
          path: '/school-based-bcba',
          description: 'Resources for school-based BCBAs'
        },
        {
          name: 'School-Based Behavior Support',
          path: '/school-based-behavior-support',
          description: 'Behavior support strategies for schools'
        }
      ]
    },
    {
      title: 'IEP & Behavior Tools',
      icon: <FileText className="w-6 h-6" />,
      pages: [
        {
          name: 'IEP Goals',
          path: '/iep-goals',
          description: 'IEP goal writing tools and resources'
        },
        {
          name: 'IEP Behavior Goals',
          path: '/iep-behavior-goals',
          description: 'Behavior-specific IEP goal tools'
        },
        {
          name: 'IEP Goal Quality Checker',
          path: '/iep-goal-qualitychecker',
          description: 'Tool to check quality of IEP goals'
        },
        {
          name: 'Behavior Plans',
          path: '/behavior-plans',
          description: 'Behavior intervention plan resources'
        }
      ]
    },
    {
      title: 'ACT Matrix & Resources',
      icon: <Layers className="w-6 h-6" />,
      pages: [
        {
          name: 'ACT Matrix',
          path: '/act-matrix',
          description: 'ACT Matrix tool and resources'
        },
        {
          name: 'ACT Matrix Framework for BCBAs',
          path: '/the-act-matrix-a-framework-for-school-based-bcbas',
          description: 'Detailed framework guide for school-based BCBAs'
        },
        {
          name: 'ACT Matrix Schools Hub',
          path: '/act-matrix-schools-hub',
          description: 'Hub for school-focused ACT Matrix resources'
        },
        {
          name: 'ACT Activities for K-12',
          path: '/act-activities-k12-students',
          description: 'K-12 student ACT activities'
        },
        {
          name: 'ACT Implementation Challenges',
          path: '/act-implementation-challenges-solutions',
          description: 'Solutions to common implementation challenges'
        },
        {
          name: 'Age-Appropriate ACT Metaphors',
          path: '/age-appropriate-act-metaphors',
          description: 'Age-appropriate metaphors for ACT concepts'
        },
        {
          name: 'Resources',
          path: '/resources',
          description: 'General resources and downloads'
        }
      ]
    },
    {
      title: 'Programs & Content',
      icon: <Mail className="w-6 h-6" />,
      pages: [
        {
          name: 'Transformation Program',
          path: '/transformation-program',
          description: 'Professional transformation program'
        },
        {
          name: 'Supervisors',
          path: '/supervisors',
          description: 'BCBA supervision platform and tools'
        },
        {
          name: 'Blog',
          path: '/blog',
          description: 'Blog posts and articles'
        },
        {
          name: 'Signup',
          path: '/signup',
          description: 'Signup form for programs'
        },
        {
          name: 'Subscribe',
          path: '/subscribe',
          description: 'Newsletter subscription'
        }
      ]
    },
    {
      title: 'Legal & Policies',
      icon: <Lock className="w-6 h-6" />,
      pages: [
        {
          name: 'Privacy Policy',
          path: '/privacy',
          description: 'Privacy policy and data protection information'
        },
        {
          name: 'Terms of Service',
          path: '/terms',
          description: 'Terms of service and usage policies'
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
                Site Map
              </h1>
              <p className="text-base text-slate-600 mt-1">
                Quick access to all user-facing pages
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
                  {linkStats.internalOk}/{sections.reduce((acc, section) => acc + section.pages.filter(p => !p.external).length, 0)}
                </div>
                <div className="text-sm text-emerald-700">Internal Pages OK</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">
                  {linkStats.externalOk}/{sections.reduce((acc, section) => acc + section.pages.filter(p => p.external).length, 0)}
                </div>
                <div className="text-sm text-blue-700">External Links OK</div>
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
            <p className="mt-2 text-xs text-emerald-800">Counts reflect live HEAD checks via internal proxy (10s timeout). External sites must allow cross‑origin fetching.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
