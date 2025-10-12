'use client'

import Link from 'next/link'
import { Mail, FileText, LogOut, Users, TrendingUp } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function AdminDashboard() {
  const adminSections = [
    {
      title: 'Form Submissions',
      description: 'View and manage signup form submissions',
      href: '/admin/submissions',
      icon: Users,
      color: 'emerald'
    },
    {
      title: 'Email Templates',
      description: 'Create and edit automated email templates',
      href: '/admin/email-templates',
      icon: Mail,
      color: 'blue'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
              <p className="text-sm text-slate-600 mt-1">Behavior School Management</p>
            </div>
            <Link
              href="/auth/signout"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Message */}
        <div className="mb-8 bg-emerald-50 border border-emerald-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-emerald-900 mb-1">
                Welcome to Your Admin Panel
              </h2>
              <p className="text-sm text-emerald-700">
                Manage your site content, view submissions, and configure email templates from here.
              </p>
            </div>
          </div>
        </div>

        {/* Admin Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {adminSections.map((section) => {
            const Icon = section.icon
            const colorClasses = {
              emerald: 'bg-emerald-50 border-emerald-200 hover:border-emerald-300',
              blue: 'bg-blue-50 border-blue-200 hover:border-blue-300'
            }
            const iconColorClasses = {
              emerald: 'text-emerald-600',
              blue: 'text-blue-600'
            }
            
            return (
              <Link
                key={section.href}
                href={section.href}
                className={`block p-6 bg-white border-2 rounded-xl transition-all hover:shadow-lg ${
                  colorClasses[section.color as keyof typeof colorClasses]
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 rounded-xl ${
                      section.color === 'emerald' ? 'bg-emerald-100' : 'bg-blue-100'
                    } flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${
                        iconColorClasses[section.color as keyof typeof iconColorClasses]
                      }`} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">
                      {section.title}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {section.description}
                    </p>
                    <div className="mt-3 text-sm font-medium text-emerald-600 flex items-center gap-1">
                      Access Panel
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Access</h3>
          <div className="space-y-3">
            <Link 
              href="/admin/submissions"
              className="block p-3 rounded-lg hover:bg-slate-50 transition-colors border border-slate-200"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">View Latest Submissions</span>
                <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
            <Link 
              href="/admin/email-templates"
              className="block p-3 rounded-lg hover:bg-slate-50 transition-colors border border-slate-200"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">Manage Email Templates</span>
                <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
