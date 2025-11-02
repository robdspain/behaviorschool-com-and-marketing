'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { Mail, BarChart3 } from 'lucide-react'
import { RichTextEditor } from '@/components/RichTextEditor'

type NMStatus = {
  ok: boolean
  configured: boolean
  status?: { subscribers: number; lists: number; campaigns: number }
  error?: string
}

type NMSubscriber = {
  id: string
  email: string
  name?: string | null
  status: string
  created_at: string
}

export default function NewsletterAdminSupabase() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [status, setStatus] = useState<NMStatus | null>(null)
  const [subs, setSubs] = useState<NMSubscriber[]>([])
  const [subsLoading, setSubsLoading] = useState(true)
  const [lists, setLists] = useState<any[]>([])
  const [templates, setTemplates] = useState<any[]>([])
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [campSeries, setCampSeries] = useState<Record<number, { daily: Array<{ date: string; opens: number; clicks: number }>, totals: { opens: number; clicks: number } }>>({})
  const [listForm, setListForm] = useState({ name: '', visibility: 'public', optin: 'single', description: '' })
  const [tmplForm, setTmplForm] = useState({ name: '', body_html: '<div>{{content}}</div>', body_text: '' })
  const [campForm, setCampForm] = useState({ name: '', subject: '', body_html: '<p>Hello {{name}}</p>', body_text: '', template_id: 0, list_ids: [] as number[], schedule_at: '' })
  const [importStatus, setImportStatus] = useState<string>('')
  const [analytics, setAnalytics] = useState<{ open: boolean; loading: boolean; title: string; data: any } | null>({ open: false, loading: false, title: '', data: null })

  useEffect(() => {
    document.title = 'Newsletter | Admin'
    const checkAuth = async () => {
      const sup = createClient()
      const { data: { session } } = await sup.auth.getSession()
      if (!session) {
        router.push('/admin/login')
        setLoading(false)
        return
      }
      setIsAuthenticated(true)
      setLoading(false)
    }
    checkAuth()
  }, [router])

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/nm/status')
        const json = await res.json()
        setStatus(json)
      } catch (e) {
        setStatus({ ok: false, configured: false, error: 'Failed to load status' })
      }
    }

    const fetchSubs = async () => {
      setSubsLoading(true)
      try {
        const res = await fetch('/api/nm/subscribers')
        const json = await res.json()
        setSubs(json?.data || [])
      } catch (e) {
        // ignore, UI will show empty
      } finally {
        setSubsLoading(false)
      }
    }

    const fetchLists = async () => {
      const l = await (await fetch('/api/nm/lists')).json()
      setLists(l?.data || [])
    }

    const fetchTemplates = async () => {
      const t = await (await fetch('/api/nm/templates')).json()
      setTemplates(t?.data || [])
    }

    const fetchCampaigns = async () => {
      const c = await (await fetch('/api/nm/campaigns')).json()
      setCampaigns(c?.data || [])
    }

    if (isAuthenticated) {
      fetchStatus()
      fetchSubs()
      fetchLists()
      fetchTemplates()
      fetchCampaigns()
    }
  }, [isAuthenticated])

  // Load inline analytics per campaign (lightweight)
  useEffect(() => {
    const load = async () => {
      const toFetch = campaigns.filter((c) => !campSeries[c.id]).slice(0, 10) // limit concurrent
      await Promise.all(toFetch.map(async (c) => {
        try {
          const j = await (await fetch(`/api/nm/campaigns/${c.id}/analytics`)).json()
          setCampSeries(prev => ({ ...prev, [c.id]: { daily: j.daily || [], totals: j.totals || { opens: 0, clicks: 0 } } }))
        } catch {}
      }))
    }
    if (campaigns.length) load()
  }, [campaigns])

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading Newsletter admin...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b-2 border-slate-200">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600"><Mail className="w-6 h-6" /></div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Newsletter (Supabase)</h1>
              <p className="text-slate-600">Manage subscribers stored in Supabase.</p>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Status cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="text-slate-500 text-sm">Subscribers</div>
            <div className="text-2xl font-bold">{status?.status?.subscribers ?? '—'}</div>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="text-slate-500 text-sm">Lists</div>
            <div className="text-2xl font-bold">{status?.status?.lists ?? '—'}</div>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="text-slate-500 text-sm">Campaigns</div>
            <div className="text-2xl font-bold">{status?.status?.campaigns ?? '—'}</div>
          </div>
        </div>

        {/* Manage lists, templates, campaigns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Lists */}
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <h2 className="text-lg font-semibold text-slate-900 mb-3">Lists</h2>
            <form className="space-y-2 mb-4" onSubmit={async (e) => {
              e.preventDefault()
              await fetch('/api/nm/lists', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(listForm) })
              setListForm({ name: '', visibility: 'public', optin: 'single', description: '' })
              const l = await (await fetch('/api/nm/lists')).json(); setLists(l?.data || [])
            }}>
              <input value={listForm.name} onChange={e => setListForm({ ...listForm, name: e.target.value })} placeholder="List name" className="w-full border rounded px-3 py-2 text-sm" />
              <button className="px-3 py-2 bg-emerald-600 text-white rounded text-sm">Create List</button>
            </form>
            <ul className="divide-y divide-slate-100 max-h-64 overflow-auto">
              {lists.map((l) => (
                <li key={l.id} className="py-2 text-sm flex items-center justify-between">
                  <span className="text-slate-700">{l.name}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Templates */}
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <h2 className="text-lg font-semibold text-slate-900 mb-3">Templates</h2>
            <form className="space-y-2 mb-4" onSubmit={async (e) => {
              e.preventDefault()
              await fetch('/api/nm/templates', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(tmplForm) })
              setTmplForm({ name: '', body_html: '<div>{{content}}</div>', body_text: '' })
              const t = await (await fetch('/api/nm/templates')).json(); setTemplates(t?.data || [])
            }}>
              <input value={tmplForm.name} onChange={e => setTmplForm({ ...tmplForm, name: e.target.value })} placeholder="Template name" className="w-full border rounded px-3 py-2 text-sm" />
              <div className="border rounded">
                <RichTextEditor content={tmplForm.body_html} onChange={(html) => setTmplForm({ ...tmplForm, body_html: html })} placeholder="Template HTML (include {{content}})" />
              </div>
              <button className="px-3 py-2 bg-emerald-600 text-white rounded text-sm">Create Template</button>
            </form>
            <ul className="divide-y divide-slate-100 max-h-64 overflow-auto">
              {templates.map((t) => (
                <li key={t.id} className="py-2 text-sm text-slate-700">{t.name}</li>
              ))}
            </ul>
          </div>

          {/* Campaigns */}
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <h2 className="text-lg font-semibold text-slate-900 mb-3">Create Campaign</h2>
            <form className="space-y-2 mb-4" onSubmit={async (e) => {
              e.preventDefault()
              const payload = { ...campForm, template_id: campForm.template_id || undefined, list_ids: campForm.list_ids }
              await fetch('/api/nm/campaigns', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
              setCampForm({ name: '', subject: '', body_html: '<p>Hello {{name}}</p>', body_text: '', template_id: 0, list_ids: [], schedule_at: '' })
              const c = await (await fetch('/api/nm/campaigns')).json(); setCampaigns(c?.data || [])
            }}>
              <input value={campForm.name} onChange={e => setCampForm({ ...campForm, name: e.target.value })} placeholder="Campaign name" className="w-full border rounded px-3 py-2 text-sm" />
              <input value={campForm.subject} onChange={e => setCampForm({ ...campForm, subject: e.target.value })} placeholder="Subject" className="w-full border rounded px-3 py-2 text-sm" />
              <select value={campForm.template_id} onChange={e => setCampForm({ ...campForm, template_id: Number(e.target.value) })} className="w-full border rounded px-3 py-2 text-sm">
                <option value={0}>No template</option>
                {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
              <div className="border rounded">
                <RichTextEditor content={campForm.body_html} onChange={(html) => setCampForm({ ...campForm, body_html: html })} placeholder="Body HTML" />
              </div>
              <div>
                <div className="text-sm text-slate-600 mb-1">Select lists</div>
                <div className="flex flex-wrap gap-2">
                  {lists.map(l => (
                    <label key={l.id} className="inline-flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={campForm.list_ids.includes(l.id)} onChange={e => {
                        setCampForm(cf => ({ ...cf, list_ids: e.target.checked ? [...cf.list_ids, l.id] : cf.list_ids.filter(id => id !== l.id) }))
                      }} />
                      <span>{l.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-2 bg-emerald-600 text-white rounded text-sm" type="submit">Save Draft</button>
              </div>
            </form>

            <h3 className="font-medium text-slate-900 mb-2">Recent Campaigns</h3>
            <ul className="divide-y divide-slate-100 max-h-64 overflow-auto">
              {campaigns.map((c) => (
                <li key={c.id} className="py-2 text-sm flex items-center justify-between">
                  <div>
                    <div className="text-slate-800">{c.name}</div>
                    <div className="text-slate-500 text-xs">{c.status}</div>
                    <div className="mt-1">
                      {(() => {
                        const s = campSeries[c.id]
                        if (!s) return <div className="h-8 text-slate-400">loading…</div>
                        const max = Math.max(1, ...s.daily.map(d => Math.max(d.opens, d.clicks)))
                        return (
                          <div className="flex items-end gap-0.5 h-8">
                            {s.daily.slice(-20).map(d => (
                              <div key={d.date} className="flex flex-col items-center w-3">
                                <div className="w-2 bg-emerald-500" style={{ height: `${(d.opens / max) * 100}%` }} title={`Opens ${d.opens}`}></div>
                                <div className="w-2 bg-blue-500 mt-0.5" style={{ height: `${(d.clicks / max) * 100}%` }} title={`Clicks ${d.clicks}`}></div>
                              </div>
                            ))}
                          </div>
                        )
                      })()}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-2 py-1 border rounded text-xs" onClick={async () => {
                      await fetch(`/api/nm/campaigns/${c.id}/status`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'running' }) })
                    }}>Send now</button>
                    <button className="px-2 py-1 border rounded text-xs" onClick={async () => {
                      await fetch(`/api/nm/campaigns/${c.id}/test`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ emails: prompt('Test emails (comma separated)') || '' }) })
                    }}>Send test</button>
                    <button className="px-2 py-1 border rounded text-xs flex items-center gap-1" onClick={async () => {
                      setAnalytics({ open: true, loading: true, title: c.name, data: null })
                      const j = await (await fetch(`/api/nm/campaigns/${c.id}/analytics`)).json().catch(() => null)
                      setAnalytics({ open: true, loading: false, title: c.name, data: j })
                    }}><BarChart3 className="w-3 h-3"/> Analytics</button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-3">
              <button className="px-3 py-2 bg-slate-800 text-white rounded text-sm" onClick={async () => {
                await fetch('/api/nm/worker/process', { method: 'POST', headers: { 'x-nm-worker-secret': (process.env.NM_WORKER_SECRET as any) || '' } })
                alert('Worker triggered')
              }}>Run Worker</button>
            </div>
          </div>
        </div>

        {/* Subscribers table */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Recent Subscribers</h2>
              <p className="text-slate-600 text-sm">Most recent 200 subscribers</p>
            </div>
            <div className="flex gap-2">
              <a className="px-3 py-2 border rounded text-sm" href="/api/nm/export/subscribers" target="_blank" rel="noopener noreferrer">Export subscribers CSV</a>
              <a className="px-3 py-2 border rounded text-sm" href="/api/nm/export/subscriber_lists" target="_blank" rel="noopener noreferrer">Export memberships CSV</a>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-slate-600">
                  <th className="px-4 py-2 font-medium">Email</th>
                  <th className="px-4 py-2 font-medium">Name</th>
                  <th className="px-4 py-2 font-medium">Status</th>
                  <th className="px-4 py-2 font-medium">Subscribed</th>
                </tr>
              </thead>
              <tbody>
                {subsLoading && (
                  <tr><td colSpan={4} className="px-4 py-6 text-center text-slate-500">Loading...</td></tr>
                )}
                {!subsLoading && subs.length === 0 && (
                  <tr><td colSpan={4} className="px-4 py-6 text-center text-slate-500">No subscribers found.</td></tr>
                )}
                {!subsLoading && subs.map(s => (
                  <tr key={s.id} className="border-t border-slate-100">
                    <td className="px-4 py-2 text-slate-900">{s.email}</td>
                    <td className="px-4 py-2 text-slate-700">{s.name || '—'}</td>
                    <td className="px-4 py-2"><span className="px-2 py-1 text-xs rounded bg-emerald-50 text-emerald-700 border border-emerald-200">{s.status}</span></td>
                    <td className="px-4 py-2 text-slate-600">{new Date(s.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Import section */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 mt-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">Import CSV</h2>
          <p className="text-slate-600 text-sm mb-3">Upload CSV to import subscribers and list memberships. Subscribers CSV columns: email,name,status,lists (semicolon-separated list names). Memberships CSV columns: subscriber_id,list_id,status.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium mb-1">Import subscribers</div>
              <input type="file" accept=".csv,text/csv" onChange={async (e) => {
                const file = e.target.files?.[0]
                if (!file) return
                const text = await file.text()
                setImportStatus('Importing subscribers...')
                const res = await fetch('/api/nm/import/subscribers', { method: 'POST', headers: { 'Content-Type': 'text/csv' }, body: text })
                const json = await res.json().catch(() => ({}))
                setImportStatus(`Subscribers import: ${res.ok ? 'ok' : 'error'} ${JSON.stringify(json)}`)
              }} />
            </div>
            <div>
              <div className="text-sm font-medium mb-1">Import memberships</div>
              <input type="file" accept=".csv,text/csv" onChange={async (e) => {
                const file = e.target.files?.[0]
                if (!file) return
                const text = await file.text()
                setImportStatus('Importing memberships...')
                const res = await fetch('/api/nm/import/subscriber_lists', { method: 'POST', headers: { 'Content-Type': 'text/csv' }, body: text })
                const json = await res.json().catch(() => ({}))
                setImportStatus(`Memberships import: ${res.ok ? 'ok' : 'error'} ${JSON.stringify(json)}`)
              }} />
            </div>
          </div>
          {importStatus && <div className="mt-3 text-sm text-slate-700">{importStatus}</div>}
        </div>

        {/* Analytics drawer */}
        {analytics?.open && (
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setAnalytics(null)}></div>
        )}
        {analytics?.open && (
          <div className="fixed right-0 top-0 bottom-0 w-full sm:w-[520px] bg-white z-50 shadow-xl border-l border-slate-200 flex flex-col">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold">Campaign Analytics</div>
                <div className="text-slate-600 text-sm">{analytics?.title}</div>
              </div>
              <button className="px-2 py-1 border rounded text-sm" onClick={() => setAnalytics(null)}>Close</button>
            </div>
            <div className="p-4 overflow-auto space-y-6">
              {analytics?.loading && <div className="text-slate-600">Loading...</div>}
              {!analytics?.loading && analytics?.data && (
                <div className="space-y-6">
                  <div>
                    <div className="text-sm text-slate-600 mb-2">Totals</div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="border rounded p-3"><div className="text-slate-500 text-xs">Opens</div><div className="text-2xl font-bold">{analytics.data.totals?.opens ?? 0}</div></div>
                      <div className="border rounded p-3"><div className="text-slate-500 text-xs">Clicks</div><div className="text-2xl font-bold">{analytics.data.totals?.clicks ?? 0}</div></div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600 mb-2">Daily (last 30 days)</div>
                    <div className="flex items-end gap-1 h-32 border rounded p-2">
                      {(() => {
                        const daily = analytics.data.daily || []
                        const max = Math.max(1, ...daily.map((d: any) => Math.max(d.opens, d.clicks)))
                        return daily.map((d: any) => (
                          <div key={d.date} className="flex flex-col items-center w-5">
                            <div className="w-3 bg-emerald-500" style={{ height: `${(d.opens / max) * 100}%` }} title={`Opens ${d.opens}`}></div>
                            <div className="w-3 bg-blue-500 mt-1" style={{ height: `${(d.clicks / max) * 100}%` }} title={`Clicks ${d.clicks}`}></div>
                            <div className="text-[10px] text-slate-500 mt-1 rotate-45 origin-top-left">{d.date.slice(5)}</div>
                          </div>
                        ))
                      })()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600 mb-2">Top Links</div>
                    <ul className="space-y-2 text-sm">
                      {(analytics.data.linkTop || []).map((l: any) => (
                        <li key={l.url} className="flex items-center justify-between gap-3">
                          <div className="truncate text-slate-700" title={l.url}>{l.url}</div>
                          <div className="text-slate-900 font-medium">{l.clicks}</div>
                        </li>
                      ))}
                      {(!analytics.data.linkTop || analytics.data.linkTop.length === 0) && (
                        <li className="text-slate-500">No clicks recorded</li>
                      )}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
