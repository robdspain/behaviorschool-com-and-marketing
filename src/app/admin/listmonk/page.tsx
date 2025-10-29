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

type LMList = { id: number; name: string; type: string; optin: string; subscribers?: number }
type LMCampaign = { id: number; name: string; status: string; created_at?: string; subject?: string }
type LMTemplate = { id: number; name: string }

export default function ListmonkAdminPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [status, setStatus] = useState<StatusResponse | null>(null)
  const [statusLoading, setStatusLoading] = useState(true)
  const [lists, setLists] = useState<LMList[]>([])
  const [campaigns, setCampaigns] = useState<LMCampaign[]>([])
  const [serverCfg, setServerCfg] = useState<{ from_email?: string; messengers?: string[] }>({})
  const [form, setForm] = useState({ name: '', email: '', listIds: [] as number[], submitting: false, message: '' })
  const [templates, setTemplates] = useState<LMTemplate[]>([])
  const [tmplForm, setTmplForm] = useState({ name: '', body: '', submitting: false, message: '' })
  const [tmplEdit, setTmplEdit] = useState<{ open: boolean; id: number | null; loading: boolean; message: string; name: string; body: string }>({ open: false, id: null, loading: false, message: '', name: '', body: '' })
  const [campForm, setCampForm] = useState({ name: '', subject: '', listIds: [] as number[], templateId: 0, body: '', altbody: '', fromEmail: '', messenger: 'email', tags: '', headers: '', creating: false, message: '', createdId: 0, sendLater: false, sendAt: '' })
  const [testForm, setTestForm] = useState({ campaignId: 0, emails: '', sending: false, message: '' })
  const [preview, setPreview] = useState<{ open: boolean; html: string; title: string }>({ open: false, html: '', title: '' })
  const [edit, setEdit] = useState<{ open: boolean; id: number | null; loading: boolean; message: string }>({ open: false, id: null, loading: false, message: '' })
  const [editForm, setEditForm] = useState({ name: '', subject: '', listIds: [] as number[], templateId: 0, body: '', altbody: '', fromEmail: '', messenger: 'email', tags: '', headers: '' })
  const [analytics, setAnalytics] = useState<{ id: number | null; loading: boolean; data: { views: number | null; clicks: number | null; bounces: number | null; links: number | null }; linkTop: Array<{ url: string; clicks: number }> }>({ id: null, loading: false, data: { views: null, clicks: null, bounces: null, links: null }, linkTop: [] })

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

  useEffect(() => {
    const loadData = async () => {
      try {
        const [listsRes, campRes, tmplRes, cfgRes] = await Promise.all([
          fetch('/api/admin/listmonk/lists'),
          fetch('/api/admin/listmonk/campaigns'),
          fetch('/api/admin/listmonk/templates'),
          fetch('/api/admin/listmonk/config'),
        ])
        const [listsJson, campJson, tmplJson, cfgJson] = await Promise.all([listsRes.json(), campRes.json(), tmplRes.json(), cfgRes.json()])
        const ls: LMList[] = (listsJson?.data?.results || listsJson?.results || []).map((l: any) => ({
          id: l.id, name: l.name, type: l.type, optin: l.optin, subscribers: l.subscribers,
        }))
        const cs: LMCampaign[] = (campJson?.data?.results || campJson?.results || []).map((c: any) => ({
          id: c.id, name: c.name, status: c.status, created_at: c.created_at || c.createdAt, subject: c.subject,
        }))
        const ts: LMTemplate[] = (tmplJson?.data?.results || tmplJson?.results || []).map((t: any) => ({ id: t.id, name: t.name }))
        setLists(ls)
        setCampaigns(cs)
        setTemplates(ts)
        const cfgData = cfgJson?.data || cfgJson || {}
        setServerCfg({ from_email: cfgData.from_email || cfgData.fromEmail, messengers: cfgData.messengers || [] })
        // Prefill from_email if empty
        setCampForm(f => ({ ...f, fromEmail: f.fromEmail || cfgData.from_email || cfgData.fromEmail || '' }))
      } catch {}
    }
    if (status?.configured) loadData()
  }, [status?.configured])

  const submitSubscriber = async (e: React.FormEvent) => {
    e.preventDefault()
    setForm(f => ({ ...f, submitting: true, message: '' }))
    try {
      if (campForm.listIds.length === 0) {
        setCampForm(f => ({ ...f, creating: false, message: 'Select at least one list.' }))
        return
      }
      const res = await fetch('/api/admin/listmonk/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, name: form.name, lists: form.listIds, preconfirm: true })
      })
      if (res.ok) {
        setForm({ name: '', email: '', listIds: [], submitting: false, message: 'Subscriber saved.' })
      } else {
        const txt = await res.text()
        setForm(f => ({ ...f, submitting: false, message: `Failed: ${txt}` }))
      }
    } catch (err) {
      setForm(f => ({ ...f, submitting: false, message: 'Network error' }))
    }
  }

  const createTemplate = async (e: React.FormEvent) => {
    e.preventDefault()
    setTmplForm(f => ({ ...f, submitting: true, message: '' }))
    try {
      const res = await fetch('/api/admin/listmonk/templates', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: tmplForm.name, body: tmplForm.body })
      })
      if (res.ok) {
        setTmplForm({ name: '', body: '', submitting: false, message: 'Template created.' })
        // reload templates
        const tj = await (await fetch('/api/admin/listmonk/templates')).json()
        const ts: LMTemplate[] = (tj?.data?.results || tj?.results || []).map((t: any) => ({ id: t.id, name: t.name }))
        setTemplates(ts)
      } else {
        setTmplForm(f => ({ ...f, submitting: false, message: 'Failed to create template' }))
      }
    } catch {
      setTmplForm(f => ({ ...f, submitting: false, message: 'Network error' }))
    }
  }

  const createCampaign = async (e: React.FormEvent, sendNow = false) => {
    e.preventDefault()
    setCampForm(f => ({ ...f, creating: true, message: '' }))
    try {
      const payload: any = {
        name: campForm.name,
        subject: campForm.subject,
        lists: campForm.listIds,
        type: 'regular',
        template_id: campForm.templateId || undefined,
        body: campForm.body || undefined,
      }
      if (campForm.altbody) payload.altbody = campForm.altbody
      if (campForm.fromEmail) payload.from_email = campForm.fromEmail
      if (campForm.messenger) payload.messenger = campForm.messenger
      if (campForm.tags) payload.tags = campForm.tags.split(',').map(s => s.trim()).filter(Boolean)
      if (campForm.headers) {
        try {
          payload.headers = JSON.parse(campForm.headers)
        } catch {
          setCampForm(f => ({ ...f, creating: false, message: 'Headers JSON is invalid.' }))
          return
        }
      }
      if (campForm.sendLater && campForm.sendAt) {
        const dt = new Date(campForm.sendAt)
        if (isNaN(dt.getTime())) {
          setCampForm(f => ({ ...f, creating: false, message: 'Invalid schedule date/time.' }))
          return
        }
        payload.send_at = dt.toISOString()
      }
      const res = await fetch('/api/admin/listmonk/campaigns', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || !json?.id) {
        setCampForm(f => ({ ...f, creating: false, message: 'Failed to create campaign' }))
        return
      }
      const id = json.id as number
      if (sendNow) {
        await fetch(`/api/admin/listmonk/campaigns/${id}/status`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'running' }) })
      } else if (campForm.sendLater && campForm.sendAt) {
        await fetch(`/api/admin/listmonk/campaigns/${id}/status`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'scheduled' }) })
      }
      setCampForm({ name: '', subject: '', listIds: [], templateId: 0, body: '', altbody: '', fromEmail: '', messenger: 'email', tags: '', headers: '', creating: false, message: sendNow ? 'Campaign sent.' : (campForm.sendLater && campForm.sendAt ? 'Campaign scheduled.' : 'Campaign created.'), createdId: id, sendLater: false, sendAt: '' })
      // refresh campaigns
      const cj = await (await fetch('/api/admin/listmonk/campaigns')).json()
      const cs: LMCampaign[] = (cj?.data?.results || cj?.results || []).map((c: any) => ({ id: c.id, name: c.name, status: c.status, created_at: c.created_at || c.createdAt, subject: c.subject }))
      setCampaigns(cs)
    } catch {
      setCampForm(f => ({ ...f, creating: false, message: 'Network error' }))
    }
  }

  const sendTest = async (e: React.FormEvent) => {
    e.preventDefault()
    setTestForm(f => ({ ...f, sending: true, message: '' }))
    try {
      const id = testForm.campaignId || campForm.createdId
      if (!id) {
        setTestForm(f => ({ ...f, sending: false, message: 'Provide a campaign ID or create one first.' }))
        return
      }
      const emails = testForm.emails.split(',').map(s => s.trim()).filter(Boolean)
      if (emails.length === 0) {
        setTestForm(f => ({ ...f, sending: false, message: 'Enter at least one email.' }))
        return
      }
      const res = await fetch(`/api/admin/listmonk/campaigns/${id}/test`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subscribers: emails }) })
      if (res.ok) {
        setTestForm({ campaignId: id, emails: '', sending: false, message: 'Test email sent.' })
      } else {
        setTestForm(f => ({ ...f, sending: false, message: 'Failed to send test.' }))
      }
    } catch {
      setTestForm(f => ({ ...f, sending: false, message: 'Network error' }))
    }
  }

  const changeStatus = async (id: number, status: 'running' | 'paused' | 'draft' | 'scheduled') => {
    try {
      await fetch(`/api/admin/listmonk/campaigns/${id}/status`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
      const cj = await (await fetch('/api/admin/listmonk/campaigns')).json()
      const cs: LMCampaign[] = (cj?.data?.results || cj?.results || []).map((c: any) => ({ id: c.id, name: c.name, status: c.status, created_at: c.created_at || c.createdAt, subject: c.subject }))
      setCampaigns(cs)
    } catch {}
  }

  const openPreview = async (id: number, title: string) => {
    try {
      const res = await fetch(`/api/admin/listmonk/campaigns/${id}/preview`)
      const html = await res.text()
      setPreview({ open: true, html, title })
    } catch {
      setPreview({ open: true, html: '<p style="padding:16px;color:#ef4444;">Failed to load preview.</p>', title })
    }
  }

  const openEdit = async (id: number) => {
    setEdit({ open: true, id, loading: true, message: '' })
    try {
      const res = await fetch(`/api/admin/listmonk/campaigns/${id}`)
      const json = await res.json()
      const details = json
      const listsSelected: number[] = (details.lists || []).map((l: any) => l.id)
      const tags = Array.isArray(details.tags) ? details.tags.join(', ') : (details.tags || '')
      const headersStr = details.headers ? JSON.stringify(details.headers, null, 2) : ''
      setEditForm({ name: details.name || '', subject: details.subject || '', listIds: listsSelected, templateId: details.template_id || details.templateId || 0, body: details.body || '', altbody: details.altbody || '', fromEmail: details.from_email || details.fromEmail || '', messenger: details.messenger || 'email', tags, headers: headersStr })
      setEdit(e => ({ ...e, loading: false }))
    } catch {
      setEdit(e => ({ ...e, loading: false, message: 'Failed to load campaign.' }))
    }
  }

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!edit.id) return
    setEdit(s => ({ ...s, loading: true, message: '' }))
    try {
      const payload: any = {
        name: editForm.name,
        subject: editForm.subject,
        lists: editForm.listIds,
        template_id: editForm.templateId || undefined,
        body: editForm.body || undefined,
      }
      if (editForm.altbody) payload.altbody = editForm.altbody
      if (editForm.fromEmail) payload.from_email = editForm.fromEmail
      if (editForm.messenger) payload.messenger = editForm.messenger
      if (editForm.tags) payload.tags = editForm.tags.split(',').map(s => s.trim()).filter(Boolean)
      if (editForm.headers) {
        try { payload.headers = JSON.parse(editForm.headers) } catch { setEdit(s => ({ ...s, loading: false, message: 'Headers JSON invalid.' })); return }
      }
      const res = await fetch(`/api/admin/listmonk/campaigns/${edit.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) throw new Error('Update failed')
      // refresh campaigns
      const cj = await (await fetch('/api/admin/listmonk/campaigns')).json()
      const cs: LMCampaign[] = (cj?.data?.results || cj?.results || []).map((c: any) => ({ id: c.id, name: c.name, status: c.status, created_at: c.created_at || c.createdAt, subject: c.subject }))
      setCampaigns(cs)
      setEdit({ open: false, id: null, loading: false, message: '' })
    } catch {
      setEdit(s => ({ ...s, loading: false, message: 'Failed to save changes.' }))
    }
  }

  const deleteCampaign = async (id: number) => {
    if (!confirm('Delete this campaign?')) return
    try {
      const res = await fetch(`/api/admin/listmonk/campaigns/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      const cj = await (await fetch('/api/admin/listmonk/campaigns')).json()
      const cs: LMCampaign[] = (cj?.data?.results || cj?.results || []).map((c: any) => ({ id: c.id, name: c.name, status: c.status, created_at: c.created_at || c.createdAt, subject: c.subject }))
      setCampaigns(cs)
    } catch {}
  }

  const loadAnalytics = async (id: number) => {
    setAnalytics({ id, loading: true, data: { views: null, clicks: null, bounces: null, links: null }, linkTop: [] })
    try {
      const [res, linksRes] = await Promise.all([
        fetch(`/api/admin/listmonk/campaigns/${id}/analytics`),
        fetch(`/api/admin/listmonk/campaigns/${id}/links`),
      ])
      const [json, linksJson] = await Promise.all([res.json(), linksRes.json()])
      const results = linksJson?.data?.results || linksJson?.results || []
      // Map to {url, clicks}; Handle different shapes conservatively
      const top: Array<{ url: string; clicks: number }> = results.map((r: any) => ({
        url: r.url || r.link || r.target || '',
        clicks: r.count || r.clicks || r.total || 0,
      })).filter((r: any) => r.url).sort((a: any, b: any) => b.clicks - a.clicks).slice(0, 8)
      setAnalytics({ id, loading: false, data: json.metrics || { views: null, clicks: null, bounces: null, links: null }, linkTop: top })
    } catch {
      setAnalytics(a => ({ ...a, loading: false }))
    }
  }

  // If not configured, show setup instructions
  if (!status?.configured && !statusLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border-2 border-slate-200 rounded-xl p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Setup Listmonk</h1>
                <p className="text-slate-600">Follow the deployment guide to integrate Listmonk</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-3">Step 1: Deploy Listmonk Backend</h2>
                <p className="text-slate-700 mb-4">
                  Host the Listmonk server (Render, DO, etc.). The admin UI runs here; only the backend URL is required. See <code className="bg-slate-100 px-2 py-1 rounded">LISTMONK_RENDER_DEPLOYMENT.md</code> for one-click Render setup.
                </p>
                <a
                  href="https://dashboard.render.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  <ExternalLink className="w-5 h-5" />
                  Deploy on Render
                </a>
              </div>

              <div className="border-t-2 border-slate-200 pt-6">
                <h2 className="text-xl font-bold text-slate-900 mb-3">Step 2: Add Environment Variables</h2>
                <p className="text-slate-700 mb-4">
                  After deploying, add these to your Netlify environment variables:
                </p>
                <pre className="bg-slate-900 text-slate-100 rounded-lg p-4 overflow-x-auto text-sm">
{`# Listmonk backend URL (used server-side only)
LISTMONK_URL=https://your-listmonk.example.com
LISTMONK_USERNAME=admin
LISTMONK_PASSWORD=your-password`}
                </pre>
              </div>

              <div className="border-t-2 border-slate-200 pt-6">
                <h2 className="text-xl font-bold text-slate-900 mb-3">Step 3: Redeploy</h2>
                <p className="text-slate-700">
                  After adding environment variables, trigger a new Netlify deployment. The built-in newsletter UI will connect automatically.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Full-screen native integration
  return (
    <div className="fixed inset-0 bg-white overflow-auto">
      {/* Thin header bar */}
      <div className="h-14 bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-between px-6 border-b border-blue-700">
        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5 text-white" />
          <h1 className="text-lg font-bold text-white">Newsletter Management</h1>
        </div>
        <div className="flex items-center gap-2 text-sm text-blue-100">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          Connected
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border p-4">
            <div className="text-slate-500 text-sm">Lists</div>
            <div className="text-2xl font-bold">{String(status?.status?.lists ?? '-')}</div>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <div className="text-slate-500 text-sm">Subscribers</div>
            <div className="text-2xl font-bold">{String(status?.status?.subscribers ?? '-')}</div>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <div className="text-slate-500 text-sm">Campaigns</div>
            <div className="text-2xl font-bold">{String(status?.status?.campaigns ?? '-')}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create subscriber */}
          <div className="bg-white rounded-xl border p-6 lg:col-span-1">
            <h2 className="text-lg font-semibold mb-4">Add Subscriber</h2>
            <form onSubmit={submitSubscriber} className="space-y-3">
              <input
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <input
                type="email"
                placeholder="Email"
                required
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <div>
                <label className="block text-sm text-slate-600 mb-1">Lists</label>
                <div className="max-h-40 overflow-auto border rounded-lg divide-y">
                  {lists.map(l => (
                    <label key={l.id} className="flex items-center gap-2 px-3 py-2">
                      <input
                        type="checkbox"
                        checked={form.listIds.includes(l.id)}
                        onChange={e => {
                          setForm(f => ({
                            ...f,
                            listIds: e.target.checked
                              ? [...f.listIds, l.id]
                              : f.listIds.filter(id => id !== l.id)
                          }))
                        }}
                      />
                      <span className="text-sm">{l.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                disabled={form.submitting}
                className="w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 disabled:opacity-50"
              >
                {form.submitting ? 'Saving...' : 'Save Subscriber'}
              </button>
              {form.message && <div className="text-sm text-slate-600">{form.message}</div>}
            </form>
          </div>

          {/* Lists and campaigns */}
          <div className="bg-white rounded-xl border p-6 lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold mb-3">Lists</h2>
                <ul className="divide-y border rounded-lg">
                  {lists.map(l => (
                    <li key={l.id} className="px-3 py-2 text-sm flex items-center justify-between">
                      <span className="truncate">{l.name}</span>
                      <span className="text-slate-500">{l.subscribers ?? ''}</span>
                    </li>
                  ))}
                  {lists.length === 0 && <li className="px-3 py-2 text-sm text-slate-500">No lists found.</li>}
                </ul>
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-3">Recent Campaigns</h2>
                <ul className="divide-y border rounded-lg">
                  {campaigns.map(c => (
                    <li key={c.id} className="px-3 py-3 text-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="font-medium truncate">{c.name} <span className="text-slate-500">({c.subject || 'no subject'})</span></div>
                          <div className="text-xs text-slate-500 capitalize">{c.status}</div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button onClick={() => openPreview(c.id, c.name)} className="px-2 py-1 text-xs border rounded hover:bg-slate-50">Preview</button>
                          <button onClick={() => openEdit(c.id)} className="px-2 py-1 text-xs border rounded hover:bg-slate-50">Edit</button>
                          <button onClick={() => loadAnalytics(c.id)} className="px-2 py-1 text-xs border rounded hover:bg-slate-50">Analytics</button>
                          {c.status === 'draft' && (
                            <button onClick={() => changeStatus(c.id, 'running')} className="px-2 py-1 text-xs bg-emerald-600 text-white rounded hover:bg-emerald-700">Start</button>
                          )}
                          {c.status === 'scheduled' && (
                            <button onClick={() => changeStatus(c.id, 'draft')} className="px-2 py-1 text-xs bg-slate-700 text-white rounded hover:bg-slate-800">Unschedule</button>
                          )}
                          {c.status === 'running' && (
                            <button onClick={() => changeStatus(c.id, 'paused')} className="px-2 py-1 text-xs bg-orange-600 text-white rounded hover:bg-orange-700">Pause</button>
                          )}
                          {c.status === 'paused' && (
                            <button onClick={() => changeStatus(c.id, 'running')} className="px-2 py-1 text-xs bg-emerald-600 text-white rounded hover:bg-emerald-700">Resume</button>
                          )}
                          <button onClick={() => deleteCampaign(c.id)} className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
                        </div>
                      </div>
                    </li>
                  ))}
                  {campaigns.length === 0 && <li className="px-3 py-2 text-sm text-slate-500">No campaigns found.</li>}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Templates and Create Campaign */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Templates */}
          <div className="bg-white rounded-xl border p-6 lg:col-span-1">
            <h2 className="text-lg font-semibold mb-4">Templates</h2>
            <ul className="divide-y border rounded-lg mb-4 max-h-56 overflow-auto">
              {templates.map(t => (
                <li key={t.id} className="px-3 py-2 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate">{t.name}</span>
                    <div className="flex items-center gap-2">
                      <button onClick={async () => {
                        const res = await fetch(`/api/admin/listmonk/templates/${t.id}`)
                        const json = await res.json()
                        setTmplEdit({ open: true, id: t.id, loading: false, message: '', name: json.name || t.name, body: json.body || '' })
                      }} className="px-2 py-1 text-xs border rounded hover:bg-slate-50">Edit</button>
                      <button onClick={async () => {
                        if (!confirm('Delete this template?')) return
                        await fetch(`/api/admin/listmonk/templates/${t.id}`, { method: 'DELETE' })
                        const tj = await (await fetch('/api/admin/listmonk/templates')).json()
                        const ts: LMTemplate[] = (tj?.data?.results || tj?.results || []).map((tt: any) => ({ id: tt.id, name: tt.name }))
                        setTemplates(ts)
                      }} className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
                    </div>
                  </div>
                </li>
              ))}
              {templates.length === 0 && <li className="px-3 py-2 text-sm text-slate-500">No templates.</li>}
            </ul>
            <form onSubmit={createTemplate} className="space-y-3">
              <input type="text" placeholder="Template name" value={tmplForm.name} onChange={e => setTmplForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" required />
              <textarea placeholder="HTML body" value={tmplForm.body} onChange={e => setTmplForm(f => ({ ...f, body: e.target.value }))} className="w-full px-3 py-2 border rounded-lg h-32" required />
              <button type="submit" disabled={tmplForm.submitting} className="w-full bg-emerald-600 text-white rounded-lg py-2 hover:bg-emerald-700 disabled:opacity-50">{tmplForm.submitting ? 'Creating...' : 'Create Template'}</button>
              {tmplForm.message && <div className="text-sm text-slate-600">{tmplForm.message}</div>}
            </form>
          </div>

          {/* Create Campaign */}
          <div className="bg-white rounded-xl border p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4">Create Campaign</h2>
            <form onSubmit={(e) => createCampaign(e, false)} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input type="text" placeholder="Campaign name" value={campForm.name} onChange={e => setCampForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" required />
                <input type="text" placeholder="Subject" value={campForm.subject} onChange={e => setCampForm(f => ({ ...f, subject: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input type="email" placeholder="From email (optional)" value={campForm.fromEmail} onChange={e => setCampForm(f => ({ ...f, fromEmail: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" />
                {serverCfg.messengers && serverCfg.messengers.length > 0 ? (
                  <select value={campForm.messenger} onChange={e => setCampForm(f => ({ ...f, messenger: e.target.value }))} className="w-full px-3 py-2 border rounded-lg">
                    {['email', ...serverCfg.messengers].filter((v, i, a) => a.indexOf(v) === i).map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                ) : (
                  <input type="text" placeholder="Messenger (default: email)" value={campForm.messenger} onChange={e => setCampForm(f => ({ ...f, messenger: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" />
                )}
                <input type="text" placeholder="Tags (comma separated)" value={campForm.tags} onChange={e => setCampForm(f => ({ ...f, tags: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">Lists</label>
                <div className="max-h-32 overflow-auto border rounded-lg divide-y">
                  {lists.map(l => (
                    <label key={l.id} className="flex items-center gap-2 px-3 py-2">
                      <input type="checkbox" checked={campForm.listIds.includes(l.id)} onChange={e => setCampForm(f => ({ ...f, listIds: e.target.checked ? [...f.listIds, l.id] : f.listIds.filter(id => id !== l.id) }))} />
                      <span className="text-sm">{l.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Template</label>
                  <select value={campForm.templateId} onChange={e => setCampForm(f => ({ ...f, templateId: Number(e.target.value) }))} className="w-full px-3 py-2 border rounded-lg">
                    <option value={0}>No template</option>
                    {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Body (HTML)</label>
                  <textarea value={campForm.body} onChange={e => setCampForm(f => ({ ...f, body: e.target.value }))} className="w-full px-3 py-2 border rounded-lg h-24" placeholder="Optional if template covers content" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Alt Body (text)</label>
                  <textarea value={campForm.altbody} onChange={e => setCampForm(f => ({ ...f, altbody: e.target.value }))} className="w-full px-3 py-2 border rounded-lg h-20" placeholder="Plain-text alternative body (optional)" />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Headers (JSON)</label>
                  <textarea value={campForm.headers} onChange={e => setCampForm(f => ({ ...f, headers: e.target.value }))} className="w-full px-3 py-2 border rounded-lg h-20" placeholder='{"List-Unsubscribe":"<mailto:...>"}' />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={campForm.sendLater} onChange={e => setCampForm(f => ({ ...f, sendLater: e.target.checked }))} />
                  <span className="text-sm text-slate-700">Send later (schedule)</span>
                </label>
                <input type="datetime-local" value={campForm.sendAt} onChange={e => setCampForm(f => ({ ...f, sendAt: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" placeholder="YYYY-MM-DDTHH:mm" />
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={campForm.creating} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">{campForm.creating ? 'Creating...' : 'Create Draft'}</button>
                <button type="button" onClick={(e) => createCampaign(e as any, true)} disabled={campForm.creating} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50">{campForm.creating ? 'Sending...' : 'Create & Send'}</button>
                <button type="button" onClick={(e) => createCampaign(e as any, false)} disabled={campForm.creating || !campForm.sendLater || !campForm.sendAt} className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50">{campForm.creating ? 'Scheduling...' : 'Schedule'}</button>
              </div>
              {campForm.message && <div className="text-sm text-slate-600">{campForm.message}</div>}
            </form>

            <div className="mt-6 border-t pt-6">
              <h3 className="text-md font-semibold mb-2">Send Test Email</h3>
              <form onSubmit={sendTest} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input type="number" min={0} placeholder="Campaign ID (optional)" value={testForm.campaignId || ''} onChange={e => setTestForm(f => ({ ...f, campaignId: Number(e.target.value) }))} className="w-full px-3 py-2 border rounded-lg" />
                  <input type="text" placeholder="Emails (comma-separated)" value={testForm.emails} onChange={e => setTestForm(f => ({ ...f, emails: e.target.value }))} className="w-full px-3 py-2 border rounded-lg md:col-span-2" required />
                </div>
                <button type="submit" disabled={testForm.sending} className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50">{testForm.sending ? 'Sending...' : 'Send Test'}</button>
              {testForm.message && <div className="text-sm text-slate-600 mt-2">{testForm.message}</div>}
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* Preview Modal */}
      {preview.open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setPreview(p => ({ ...p, open: false }))}>
          <div className="bg-white rounded-xl w-full max-w-3xl h-[80vh] overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="font-semibold truncate">Preview: {preview.title}</div>
              <button onClick={() => setPreview(p => ({ ...p, open: false }))} className="text-slate-500 hover:text-slate-700">Close</button>
            </div>
            <iframe title="Preview" className="w-full h-full" srcDoc={preview.html} sandbox="allow-same-origin allow-scripts"></iframe>
          </div>
        </div>
      )}

      {/* Edit Template Modal */}
      {tmplEdit.open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setTmplEdit({ open: false, id: null, loading: false, message: '', name: '', body: '' })}>
          <div className="bg-white rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="font-semibold truncate">Edit Template #{tmplEdit.id}</div>
              <button onClick={() => setTmplEdit({ open: false, id: null, loading: false, message: '', name: '', body: '' })} className="text-slate-500 hover:text-slate-700">Close</button>
            </div>
            <div className="p-4">
              <form onSubmit={async (e) => { e.preventDefault(); if (!tmplEdit.id) return; setTmplEdit(s => ({ ...s, loading: true, message: '' })); try { const res = await fetch(`/api/admin/listmonk/templates/${tmplEdit.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: tmplEdit.name, body: tmplEdit.body }) }); if (!res.ok) throw new Error('Update failed'); const tj = await (await fetch('/api/admin/listmonk/templates')).json(); const ts: LMTemplate[] = (tj?.data?.results || tj?.results || []).map((tt: any) => ({ id: tt.id, name: tt.name })); setTemplates(ts); setTmplEdit({ open: false, id: null, loading: false, message: '', name: '', body: '' }); } catch { setTmplEdit(s => ({ ...s, loading: false, message: 'Failed to save template.' })) } }} className="space-y-3">
                <input type="text" placeholder="Template name" value={tmplEdit.name} onChange={e => setTmplEdit(s => ({ ...s, name: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" required />
                <textarea placeholder="HTML body" value={tmplEdit.body} onChange={e => setTmplEdit(s => ({ ...s, body: e.target.value }))} className="w-full px-3 py-2 border rounded-lg h-64" required />
                <button type="submit" disabled={tmplEdit.loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">{tmplEdit.loading ? 'Saving...' : 'Save Template'}</button>
                {tmplEdit.message && <div className="text-sm text-red-600">{tmplEdit.message}</div>}
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Campaign Modal */}
      {edit.open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setEdit({ open: false, id: null, loading: false, message: '' })}>
          <div className="bg-white rounded-xl w-full max-w-3xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="font-semibold truncate">Edit Campaign #{edit.id}</div>
              <button onClick={() => setEdit({ open: false, id: null, loading: false, message: '' })} className="text-slate-500 hover:text-slate-700">Close</button>
            </div>
            <div className="p-4">
              {edit.loading ? (
                <div className="text-slate-600">Loading...</div>
              ) : (
                <form onSubmit={saveEdit} className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input type="text" placeholder="Campaign name" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" required />
                    <input type="text" placeholder="Subject" value={editForm.subject} onChange={e => setEditForm(f => ({ ...f, subject: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" required />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input type="email" placeholder="From email (optional)" value={editForm.fromEmail} onChange={e => setEditForm(f => ({ ...f, fromEmail: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" />
                    <input type="text" placeholder="Messenger (default: email)" value={editForm.messenger} onChange={e => setEditForm(f => ({ ...f, messenger: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" />
                    <input type="text" placeholder="Tags (comma separated)" value={editForm.tags} onChange={e => setEditForm(f => ({ ...f, tags: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">Lists</label>
                    <div className="max-h-32 overflow-auto border rounded-lg divide-y">
                      {lists.map(l => (
                        <label key={l.id} className="flex items-center gap-2 px-3 py-2">
                          <input type="checkbox" checked={editForm.listIds.includes(l.id)} onChange={e => setEditForm(f => ({ ...f, listIds: e.target.checked ? [...f.listIds, l.id] : f.listIds.filter(id => id !== l.id) }))} />
                          <span className="text-sm">{l.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-slate-600 mb-1">Template</label>
                      <select value={editForm.templateId} onChange={e => setEditForm(f => ({ ...f, templateId: Number(e.target.value) }))} className="w-full px-3 py-2 border rounded-lg">
                        <option value={0}>No template</option>
                        {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-600 mb-1">Body (HTML)</label>
                      <textarea value={editForm.body} onChange={e => setEditForm(f => ({ ...f, body: e.target.value }))} className="w-full px-3 py-2 border rounded-lg h-24" placeholder="Optional if template covers content" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-slate-600 mb-1">Alt Body (text)</label>
                      <textarea value={editForm.altbody} onChange={e => setEditForm(f => ({ ...f, altbody: e.target.value }))} className="w-full px-3 py-2 border rounded-lg h-20" placeholder="Plain-text alternative body (optional)" />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-600 mb-1">Headers (JSON)</label>
                      <textarea value={editForm.headers} onChange={e => setEditForm(f => ({ ...f, headers: e.target.value }))} className="w-full px-3 py-2 border rounded-lg h-20" placeholder='{"List-Unsubscribe":"<mailto:...>"}' />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" disabled={edit.loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">{edit.loading ? 'Saving...' : 'Save Changes'}</button>
                  </div>
                  {edit.message && <div className="text-sm text-red-600">{edit.message}</div>}
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Analytics Strip */}
      {analytics.id && (
        <div className="fixed bottom-4 right-4 bg-white border rounded-xl shadow-lg p-4 text-sm">
          <div className="font-semibold mb-2">Analytics (Campaign #{analytics.id})</div>
          {analytics.loading ? (
            <div className="text-slate-500">Loading...</div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-4 gap-3">
                <div><div className="text-slate-500">Views</div><div className="font-bold">{analytics.data.views ?? '-'}</div></div>
                <div><div className="text-slate-500">Clicks</div><div className="font-bold">{analytics.data.clicks ?? '-'}</div></div>
                <div><div className="text-slate-500">Bounces</div><div className="font-bold">{analytics.data.bounces ?? '-'}</div></div>
                <div><div className="text-slate-500">Links</div><div className="font-bold">{analytics.data.links ?? '-'}</div></div>
              </div>
              <div>
                <div className="text-slate-500 mb-1">Top Links</div>
                <ul className="max-h-44 overflow-auto divide-y border rounded">
                  {analytics.linkTop.map((l, idx) => (
                    <li key={idx} className="px-3 py-2 flex items-center justify-between gap-3">
                      <a className="truncate text-sky-700 hover:underline" href={l.url} target="_blank" rel="noopener noreferrer">{l.url}</a>
                      <span className="text-slate-600">{l.clicks}</span>
                    </li>
                  ))}
                  {analytics.linkTop.length === 0 && <li className="px-3 py-2 text-slate-500">No link data.</li>}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
