'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { Mail, ExternalLink, AlertTriangle } from 'lucide-react'

type StatusResponse = {
  success: boolean
  configured: boolean
  endpoint?: string
  status?: {
    lists: number | string
    subscribers: number | string
    campaigns: number | string
  }
  error?: string
  message?: string
}

const PUBLIC_EMBED_URL = process.env.NEXT_PUBLIC_LISTMONK_EMBED_URL

export default function ListmonkAdminPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [status, setStatus] = useState<StatusResponse | null>(null)
  const [statusLoading, setStatusLoading] = useState(true)

  useEffect(() => {
    document.title = 'Newsletter (Listmonk) | Admin'

    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/admin/login')
        setLoading(false)
        return
      }
      setIsAuthenticated(true)
      setLoading(false)
    }

    checkAuth()
  }, [supabase, router])

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/admin/listmonk/status')
        const json = await res.json()
        setStatus(json)
      } catch (e) {
        setStatus({ success: false, configured: false, error: 'Failed to load status' })
      } finally {
        setStatusLoading(false)
      }
    }
    if (isAuthenticated) fetchStatus()
  }, [isAuthenticated])

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading Listmonk admin...</p>
        </div>
      </div>
    )
  }

  const openUrl = (url?: string) => {
    if (!url) return
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const resolvedEmbedUrl = PUBLIC_EMBED_URL || status?.endpoint

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b-2 border-slate-200">
        <div className="px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Newsletter (Listmonk)</h1>
              <p className="text-slate-600">Manage newsletter lists and campaigns</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-blue-200 text-blue-700 hover:bg-blue-50"
              onClick={() => openUrl(resolvedEmbedUrl)}
              disabled={!resolvedEmbedUrl}
              title={resolvedEmbedUrl ? 'Open Listmonk' : 'Configure Listmonk URL first'}
            >
              <ExternalLink className="w-4 h-4" />
              Open Listmonk
            </button>
          </div>
        </div>
      </header>

      <main className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Status */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Connection Status</h2>
          <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
            {statusLoading ? (
              <div className="h-6 bg-slate-100 rounded animate-pulse w-1/3"></div>
            ) : status?.configured ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-slate-600">Server</p>
                  <p className="text-base font-semibold text-slate-900 break-words">{status?.endpoint}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Lists</p>
                  <p className="text-2xl font-bold text-slate-900">{status?.status?.lists ?? '—'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Subscribers</p>
                  <p className="text-2xl font-bold text-slate-900">{status?.status?.subscribers ?? '—'}</p>
                </div>
                <div className="sm:col-span-3">
                  <p className="text-sm text-slate-600">Campaigns</p>
                  <p className="text-2xl font-bold text-slate-900">{status?.status?.campaigns ?? '—'}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-1" />
                <div>
                  <p className="font-semibold text-slate-900 mb-1">Listmonk is not configured</p>
                  <p className="text-slate-700 mb-3">Add these environment variables and redeploy:</p>
                  <pre className="bg-slate-50 border border-slate-200 rounded p-3 text-sm text-slate-800 overflow-x-auto">
LISTMONK_URL=https://newsletter.example.com
LISTMONK_USERNAME=admin
LISTMONK_PASSWORD=your-strong-password
NEXT_PUBLIC_LISTMONK_EMBED_URL=https://newsletter.example.com
                  </pre>
                  <p className="text-slate-600 mt-3">Set the public embed URL if you want to open or embed the Listmonk UI from this admin.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Optional iframe embed */}
        {resolvedEmbedUrl && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Listmonk UI (Embed)</h2>
            <div className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden">
              <div className="p-3 border-b border-slate-200 text-sm text-slate-600">
                If the server disallows embedding (X-Frame-Options), use the button above to open Listmonk in a new tab.
              </div>
              <iframe
                src={resolvedEmbedUrl}
                className="w-full h-[75vh]"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

