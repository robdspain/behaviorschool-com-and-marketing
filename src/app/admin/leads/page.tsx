"use client";

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { Loader2, Download, Inbox, Search } from 'lucide-react'
import { motion } from 'framer-motion'

type DownloadRow = {
  id: string
  email: string
  name?: string | null
  resource: string
  source?: string | null
  created_at: string
}

type SubscriberRow = {
  id: string
  email: string
  name?: string | null
  status?: string | null
  source?: string | null
  tags?: string[] | null
  subscribed_at: string
}

export default function AdminLeadsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [downloads, setDownloads] = useState<DownloadRow[]>([])
  const [subscribers, setSubscribers] = useState<SubscriberRow[]>([])
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState<'downloads' | 'subscribers'>('downloads')

  useEffect(() => {
    const supabase = createClient()
    const fetchLeads = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        const token = session?.access_token
        const res = await fetch('/api/admin/leads', {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          credentials: 'include',
        })
        if (!res.ok) throw new Error('Failed to fetch leads')
        const json = await res.json()
        setDownloads(json.downloads || [])
        setSubscribers(json.subscribers || [])
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Failed to load leads')
      } finally {
        setLoading(false)
      }
    }
    fetchLeads()
  }, [])

  const filteredDownloads = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return downloads
    return downloads.filter(d =>
      d.email?.toLowerCase().includes(q) ||
      d.resource?.toLowerCase().includes(q) ||
      d.source?.toLowerCase().includes(q)
    )
  }, [downloads, query])

  const filteredSubscribers = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return subscribers
    return subscribers.filter(s =>
      s.email?.toLowerCase().includes(q) ||
      (s.name || '').toLowerCase().includes(q) ||
      (s.source || '').toLowerCase().includes(q) ||
      (Array.isArray(s.tags) ? s.tags.join(',') : '').toLowerCase().includes(q)
    )
  }, [subscribers, query])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Lead Magnets & Email Captures</h1>
        <p className="text-slate-600">View all lead magnet downloads and newsletter/email captures</p>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="inline-flex rounded-lg border border-slate-200 overflow-hidden">
          <button
            onClick={() => setTab('downloads')}
            className={`px-4 py-2 text-sm font-medium ${tab==='downloads' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
          >
            Downloads ({downloads.length})
          </button>
          <button
            onClick={() => setTab('subscribers')}
            className={`px-4 py-2 text-sm font-medium border-l border-slate-200 ${tab==='subscribers' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
          >
            Subscribers ({subscribers.length})
          </button>
        </div>

        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by email, resource, tag..."
            className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm"
          />
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && tab === 'downloads' && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {filteredDownloads.length === 0 ? (
            <div className="p-12 text-center">
              <Download className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No download leads yet</h3>
              <p className="text-slate-600">Leads will appear here as users access lead magnets.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Resource</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Source Page</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {filteredDownloads.map((d, index) => (
                    <motion.tr
                      key={d.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className="hover:bg-slate-50"
                    >
                      <td className="px-6 py-3 text-sm text-slate-800">{d.email}</td>
                      <td className="px-6 py-3 text-sm text-slate-600">{d.resource}</td>
                      <td className="px-6 py-3 text-sm text-slate-600">{d.source || '-'}</td>
                      <td className="px-6 py-3 text-sm text-slate-600">{new Date(d.created_at).toLocaleString()}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {!loading && !error && tab === 'subscribers' && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {filteredSubscribers.length === 0 ? (
            <div className="p-12 text-center">
              <Inbox className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No subscribers found</h3>
              <p className="text-slate-600">Newsletter/email captures will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Source</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tags</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Subscribed</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {filteredSubscribers.map((s, index) => (
                    <motion.tr
                      key={s.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className="hover:bg-slate-50"
                    >
                      <td className="px-6 py-3 text-sm text-slate-800">{s.email}</td>
                      <td className="px-6 py-3 text-sm text-slate-600">{s.name || '-'}</td>
                      <td className="px-6 py-3 text-sm text-slate-600">{s.status || '-'}</td>
                      <td className="px-6 py-3 text-sm text-slate-600">{s.source || '-'}</td>
                      <td className="px-6 py-3 text-sm text-slate-600">{Array.isArray(s.tags) ? s.tags.join(', ') : '-'}</td>
                      <td className="px-6 py-3 text-sm text-slate-600">{new Date(s.subscribed_at).toLocaleString()}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
