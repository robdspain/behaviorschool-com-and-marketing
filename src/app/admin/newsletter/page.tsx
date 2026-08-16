'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CheckCircle2, FileText, Mail, RefreshCw, Send, ShieldCheck, Users, XCircle } from 'lucide-react'
import { hasAdminClientSession } from '@/lib/admin-client-session'

type Issue = {
  _id: string
  issueKey: string
  subject: string
  preheader?: string
  status: 'draft' | 'approved' | 'scheduled' | 'sent' | 'failed'
  archiveState?: 'not_requested' | 'publishing' | 'verified' | 'failed'
  archiveUrl?: string
  archiveVerificationError?: string
  generationError?: string
  schoolBcbaProblem?: string
  html?: string
  text?: string
  recipientSegment?: string
  ctaKind?: string
  ctaUrl?: string
  createdAt?: number
  sentAt?: number
  socialDraftCount?: number
  socialReviewedCount?: number
  socialPublishedCount?: number
}

type Article = {
  _id: string
  title?: string
  apaCitation?: string
  fullTextUrl?: string
  fullTextVerifiedAt?: number
  summary?: string
  schoolBcbaUse?: string
  tryThis?: string
}

type SocialPost = {
  _id: string
  platform: string
  body: string
  status: string
  archiveUrl?: string
  ctaUrl?: string
  publishedUrl?: string
}

type Workspace = {
  brand: 'robspain' | 'behaviorschool'
  label: string
  accountLabel: string
  apiKeyEnv: string
  apiKeyConfigured: boolean
  apiStatus: 'verified' | 'missing' | 'invalid'
  bufferAccountName?: string | null
  bufferAccountEmail?: string | null
  legacyApiKeyDetected: boolean
  channels: Array<{ platform: string; label: string; channelIdEnv: string; status: 'configured' | 'missing' | 'mismatch' }>
}

type Dashboard = {
  issues: Issue[]
  summary: {
    totalContacts: number
    safeWeeklyRecipients: number
    needsConsent: number
    excluded: number
    codexTests: number
    newsletterTagged: number
    confirmedNewsletter: number
    pendingNewsletter: number
  }
  audiences: Array<{ key: string; label: string; description: string; eligible: number }>
  ctas: Array<{ _id: string; label: string; kind: string; headline: string; active: boolean }>
  deliveryRecords: Array<{
    issueKey: string
    subject: string
    status: string
    scheduledFor: number | null
    sentAt: number | null
    recipientCount: number
    failed: number
    archiveUrl: string | null
  }>
}

type IssueDetail = { issue: Issue; articles: Article[]; socialPosts: SocialPost[] }
type PublishingIdentity = { site: 'robspain'; contentKey: string; contentHash: string; title: string; contentType: string; tier: 'A' }
type PublishingGate = { approved: boolean; reason: string; record: Record<string, unknown> | null }

async function jsonRequest<T>(url: string, init?: RequestInit) {
  const response = await fetch(url, { ...init, cache: 'no-store' })
  const body = await response.json().catch(() => ({})) as T & { error?: string }
  if (!response.ok) throw new Error(body.error || `Request failed with HTTP ${response.status}.`)
  return body
}

export default function NewsletterAdmin() {
  const [loading, setLoading] = useState(true)
  const [authRequired, setAuthRequired] = useState(false)
  const [dashboard, setDashboard] = useState<Dashboard | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selectedIdRef = useRef<string | null>(null)
  const [detail, setDetail] = useState<IssueDetail | null>(null)
  const [analytics, setAnalytics] = useState<Record<string, unknown> | null>(null)
  const [publishingIdentity, setPublishingIdentity] = useState<PublishingIdentity | null>(null)
  const [publishingGate, setPublishingGate] = useState<PublishingGate | null>(null)
  const [publishingApprovalUrl, setPublishingApprovalUrl] = useState('/admin/publishing-standards')
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)

  const load = useCallback(async (issueId?: string) => {
    setError(null)
    const [control, buffer] = await Promise.all([
      jsonRequest<Dashboard & { ok: boolean }>('/api/admin/newsletter/control'),
      jsonRequest<{ workspaces?: Workspace[] }>('/api/admin/buffer/workspaces'),
    ])
    setDashboard(control)
    setWorkspaces(buffer.workspaces || [])
    const nextId = issueId || selectedIdRef.current || control.issues[0]?._id
    if (nextId) {
      const selected = await jsonRequest<{ issue: IssueDetail; analytics: Record<string, unknown> | null; publishingIdentity: PublishingIdentity; publishingGate: PublishingGate; publishingApprovalUrl: string }>(`/api/admin/newsletter/control?issueId=${encodeURIComponent(nextId)}`)
      selectedIdRef.current = nextId
      setSelectedId(nextId)
      setDetail(selected.issue)
      setAnalytics(selected.analytics)
      setPublishingIdentity(selected.publishingIdentity)
      setPublishingGate(selected.publishingGate)
      setPublishingApprovalUrl(selected.publishingApprovalUrl)
    } else {
      selectedIdRef.current = null
      setSelectedId(null)
      setDetail(null)
      setAnalytics(null)
      setPublishingIdentity(null)
      setPublishingGate(null)
    }
  }, [])

  useEffect(() => {
    document.title = 'Weekly Research Brief | Admin'
    let cancelled = false

    const checkAuth = async () => {
      const authenticated = await hasAdminClientSession()
      if (cancelled) return

      if (!authenticated) {
        setAuthRequired(true)
        setLoading(false)
        return
      }

      try {
        await load()
      } catch (loadError) {
        if (cancelled) return
        setError(loadError instanceof Error ? loadError.message : 'The newsletter workspace could not load.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void checkAuth()

    return () => {
      cancelled = true
    }
  }, [load])

  const run = async (operation: string, args: Record<string, unknown> = {}, message: string) => {
    setBusy(operation)
    setError(null)
    setNotice(null)
    try {
      await jsonRequest('/api/admin/newsletter/control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operation, ...args }),
      })
      setNotice(message)
      await load(selectedId || undefined)
    } catch (runError) {
      setError(runError instanceof Error ? runError.message : 'The newsletter action failed.')
    } finally {
      setBusy(null)
    }
  }

  const selectedIssue = detail?.issue
  const allBufferConfigured = useMemo(() => workspaces.length === 2 && workspaces.every((workspace) => workspace.apiStatus === 'verified' && workspace.channels.every((channel) => channel.status === 'configured')), [workspaces])
  const editoriallyApproved = publishingGate?.approved === true
  const canSend = Boolean(selectedIssue && editoriallyApproved && ['approved', 'scheduled'].includes(selectedIssue.status) && selectedIssue.archiveState === 'verified')

  if (loading) {
    return <div className="min-h-screen bg-[#f5f8f6] flex items-center justify-center text-slate-600">Loading weekly research brief workspace…</div>
  }

  if (authRequired) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f5f8f6] px-5 text-[#17352d]">
        <section className="w-full max-w-md rounded-xl border border-[#d6e2dc] bg-white p-7 shadow-sm" aria-labelledby="newsletter-sign-in-heading">
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-[#e2f5ed] text-[#087f5b]"><ShieldCheck className="h-5 w-5" /></span>
          <h1 id="newsletter-sign-in-heading" className="mt-5 text-2xl font-bold text-[#102a23]">Sign in to continue</h1>
          <p className="mt-3 text-sm leading-6 text-[#536a62]">Your admin session has expired. Sign in with an approved Google account to open the newsletter workspace.</p>
          <a href="/api/admin/auth/google?returnTo=%2Fadmin%2Fnewsletter" className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-[#087f5b] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#066c4d] focus:outline-none focus:ring-2 focus:ring-[#087f5b] focus:ring-offset-2">Continue with Google</a>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#f5f8f6] text-[#17352d]">
      <header className="border-b border-[#d6e2dc] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-7 sm:px-8">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#e2f5ed] text-[#087f5b]"><Mail className="h-5 w-5" /></span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#087f5b]">BehaviorSchool.com admin</p>
                  <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#102a23]">School BCBA Research Brief</h1>
                </div>
              </div>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-[#536a62]">Convex is the source of truth for drafts, approvals, delivery readiness, feedback, and social follow-up. This workspace does not use the legacy Listmonk/Supabase manager.</p>
            </div>
            <button type="button" onClick={() => void load()} className="inline-flex items-center gap-2 rounded-lg border border-[#b6cfc4] bg-white px-4 py-2.5 text-sm font-semibold text-[#1c5547] hover:bg-[#f0f8f4]">
              <RefreshCw className="h-4 w-4" /> Refresh workspace
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-6 px-5 py-6 sm:px-8">
        {error && <div role="alert" className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"><XCircle className="mt-0.5 h-5 w-5 shrink-0" /><div><strong>Workspace needs attention.</strong><p className="mt-1">{error}</p></div></div>}
        {notice && <div role="status" className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" /><p>{notice}</p></div>}

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-5" aria-label="Newsletter readiness">
          {[
            ['Confirmed', dashboard?.summary.confirmedNewsletter ?? 0, 'bg-white'],
            ['Safe to send', dashboard?.summary.safeWeeklyRecipients ?? 0, 'bg-white'],
            ['Needs consent', dashboard?.summary.needsConsent ?? 0, 'bg-amber-50'],
            ['Excluded', dashboard?.summary.excluded ?? 0, 'bg-white'],
            ['Test contacts', dashboard?.summary.codexTests ?? 0, 'bg-white'],
          ].map(([label, value, tone]) => <div key={String(label)} className={`${tone} rounded-xl border border-[#d6e2dc] p-4`}><p className="text-xs font-semibold uppercase tracking-wide text-[#6b8178]">{label}</p><p className="mt-2 text-3xl font-bold text-[#17352d]">{String(value)}</p></div>)}
        </section>

        <section className="rounded-xl border border-[#d6e2dc] bg-white p-5" aria-labelledby="delivery-heading">
          <div className="flex flex-wrap items-start justify-between gap-4"><div><h2 id="delivery-heading" className="flex items-center gap-2 text-lg font-bold"><CheckCircle2 className="h-5 w-5 text-[#087f5b]" /> Scheduled delivery records</h2><p className="mt-1 text-sm text-[#5b7068]">The scheduled time and completed send time are read from the delivery system, not inferred from an email inbox.</p></div></div>
          <div className="mt-4 overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="border-b border-[#d6e2dc] text-xs uppercase tracking-wide text-[#6b8178]"><tr><th className="px-3 py-2">Issue</th><th className="px-3 py-2">Status</th><th className="px-3 py-2">Scheduled</th><th className="px-3 py-2">Completed</th><th className="px-3 py-2">Recipients</th><th className="px-3 py-2">Failures</th></tr></thead><tbody>{dashboard?.deliveryRecords.map((record) => <tr key={record.issueKey} className="border-b border-[#edf2ef] text-[#354d44]"><td className="px-3 py-3"><p className="font-semibold text-[#17352d]">{record.subject}</p>{record.archiveUrl && <a className="mt-1 inline-block text-xs font-semibold text-[#087f5b] underline" href={record.archiveUrl} target="_blank" rel="noreferrer">View published issue</a>}</td><td className="px-3 py-3 capitalize">{record.status}</td><td className="px-3 py-3 whitespace-nowrap">{record.scheduledFor ? new Date(record.scheduledFor).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }) : 'Not recorded'}</td><td className="px-3 py-3 whitespace-nowrap">{record.sentAt ? new Date(record.sentAt).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }) : 'Not recorded'}</td><td className="px-3 py-3">{record.recipientCount}</td><td className="px-3 py-3">{record.failed}</td></tr>)}{!dashboard?.deliveryRecords.length && <tr><td colSpan={6} className="px-3 py-5 text-[#6b8178]">No delivery records are available.</td></tr>}</tbody></table></div>
        </section>

        <section className="rounded-xl border border-[#d6e2dc] bg-white p-5" aria-labelledby="buffer-heading">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div><h2 id="buffer-heading" className="flex items-center gap-2 text-lg font-bold"><ShieldCheck className="h-5 w-5 text-[#087f5b]" /> Buffer account separation</h2><p className="mt-1 text-sm text-[#5b7068]">The two brands are owned by this admin but use separate Buffer API keys and channel registries.</p></div>
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${allBufferConfigured ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{allBufferConfigured ? 'Ready' : 'Configuration incomplete'}</span>
          </div>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {workspaces.map((workspace) => <div key={workspace.brand} className="rounded-lg border border-[#d6e2dc] bg-[#f8fbf9] p-4">
              <div className="flex items-start justify-between gap-3"><div><h3 className="font-bold">{workspace.label}</h3><p className="mt-1 text-xs text-[#6b8178]">{workspace.accountLabel}</p></div><span className={`rounded-full px-2 py-1 text-[11px] font-bold ${workspace.apiStatus === 'verified' ? 'bg-emerald-100 text-emerald-800' : workspace.apiStatus === 'invalid' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>{workspace.apiStatus === 'verified' ? 'API verified' : workspace.apiStatus === 'invalid' ? 'API invalid' : 'API key missing'}</span></div>
              <div className="mt-3 space-y-2">{workspace.channels.map((channel) => <div key={channel.platform} className="flex items-center justify-between gap-4 border-t border-[#e1ebe6] pt-2 text-sm"><span>{channel.label}</span><span className={`text-xs font-semibold ${channel.status === 'configured' ? 'text-emerald-700' : channel.status === 'mismatch' ? 'text-red-700' : 'text-amber-700'}`}>{channel.status === 'configured' ? 'Connected' : channel.status === 'mismatch' ? 'Mismatch' : 'Channel ID missing'}</span></div>)}</div>
            </div>)}
            {!workspaces.length && <p className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">Named Buffer configuration could not be read. No social post should be scheduled until this status is available.</p>}
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
          <section className="rounded-xl border border-[#d6e2dc] bg-white p-5" aria-labelledby="issues-heading">
            <div className="flex items-center justify-between gap-3"><div><h2 id="issues-heading" className="flex items-center gap-2 text-lg font-bold"><FileText className="h-5 w-5 text-[#087f5b]" /> Issues</h2><p className="mt-1 text-sm text-[#6b8178]">Draft, approve, verify, then send.</p></div><button type="button" disabled={busy !== null} onClick={() => void run('createDraft', { recipientSegment: 'all-confirmed', ctaKind: 'transformation' }, 'A new draft was created from the weekly research workflow.')} className="rounded-lg bg-[#087f5b] px-3 py-2 text-xs font-bold text-white disabled:opacity-50">New draft</button></div>
            <div className="mt-4 space-y-2">{dashboard?.issues.map((issue) => <button type="button" key={issue._id} onClick={() => void load(issue._id)} className={`w-full rounded-lg border p-3 text-left transition ${selectedId === issue._id ? 'border-[#087f5b] bg-[#effaf5]' : 'border-[#d6e2dc] hover:bg-[#f8fbf9]'}`}><div className="flex items-start justify-between gap-3"><span className="text-xs font-bold uppercase tracking-wide text-[#6b8178]">{issue.issueKey}</span><span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${issue.status === 'sent' ? 'bg-emerald-100 text-emerald-800' : issue.status === 'failed' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-700'}`}>{issue.status}</span></div><p className="mt-2 font-semibold leading-5">{issue.subject}</p><p className="mt-2 text-xs text-[#6b8178]">Social drafts: {issue.socialDraftCount ?? 0}</p></button>)}{!dashboard?.issues.length && <p className="rounded-lg bg-[#f8fbf9] p-4 text-sm text-[#63776f]">No newsletter issues yet. Create the first draft to begin.</p>}</div>
          </section>

          <section className="min-w-0 rounded-xl border border-[#d6e2dc] bg-white p-5" aria-labelledby="review-heading">
            {!selectedIssue ? <div className="grid min-h-[360px] place-items-center text-center text-[#6b8178]"><div><Users className="mx-auto h-9 w-9" /><p className="mt-3 font-semibold">Select an issue to review it.</p></div></div> : <>
              <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#087f5b]">{selectedIssue.issueKey}</p><h2 id="review-heading" className="mt-1 text-2xl font-bold">{selectedIssue.subject}</h2><p className="mt-2 text-sm text-[#5b7068]">{selectedIssue.schoolBcbaProblem || 'No school-BCBA problem has been recorded yet.'}</p></div><span className="rounded-full bg-[#eff4f1] px-3 py-1 text-xs font-bold text-[#1c5547]">{selectedIssue.archiveState || 'not_requested'}</span></div>
              {selectedIssue.generationError && <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{selectedIssue.generationError}</p>}
              <div className={`mt-5 rounded-xl border p-4 ${editoriallyApproved ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className={`mt-0.5 h-5 w-5 ${editoriallyApproved ? 'text-emerald-700' : 'text-amber-700'}`} />
                    <div>
                      <h3 className="font-bold text-[#17352d]">Editorial release lock</h3>
                      <p className="mt-1 text-sm leading-5 text-[#536a62]">{editoriallyApproved ? 'Rob approved this exact content fingerprint. Publishing actions are unlocked.' : 'Complete the authorship, evidence, and specificity review before this issue can be approved, published, or sent.'}</p>
                      {publishingIdentity && <p className="mt-2 font-mono text-[11px] text-[#6b8178]">SHA-256 {publishingIdentity.contentHash}</p>}
                    </div>
                  </div>
                  <a href={publishingApprovalUrl} className={`inline-flex rounded-lg px-3 py-2 text-sm font-bold ${editoriallyApproved ? 'border border-emerald-300 bg-white text-emerald-800' : 'bg-[#17352d] text-white'}`}>{editoriallyApproved ? 'Review approval' : 'Prepare approval'}</a>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <button type="button" disabled={busy !== null || selectedIssue.status === 'sent'} onClick={() => void run('sendPreview', { issueId: selectedIssue._id }, 'Preview sent to the configured review address.')} className="inline-flex items-center gap-2 rounded-lg border border-[#b6cfc4] px-3 py-2 text-sm font-semibold text-[#1c5547] disabled:opacity-50"><Send className="h-4 w-4" /> Send preview</button>
                <button type="button" disabled={busy !== null || selectedIssue.status === 'sent' || !editoriallyApproved} onClick={() => void run('approve', { issueId: selectedIssue._id }, 'Issue approved. Publish and verify its public page before sending.')} className="rounded-lg bg-[#17352d] px-3 py-2 text-sm font-semibold text-white disabled:opacity-50">Approve</button>
                <button type="button" disabled={busy !== null || !editoriallyApproved || !['approved', 'scheduled'].includes(selectedIssue.status)} onClick={() => void run('publishAndVerify', { issueId: selectedIssue._id }, 'Public RobSpain.com issue page verified.')} className="rounded-lg bg-[#f5c842] px-3 py-2 text-sm font-bold text-[#17352d] disabled:opacity-50">Publish and verify public page</button>
                <button type="button" disabled={busy !== null || !canSend} onClick={() => void run('sendApproved', { issueId: selectedIssue._id }, 'Newsletter delivery finished.')} className="rounded-lg bg-[#087f5b] px-3 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">Send to confirmed subscribers</button>
                <button type="button" disabled={busy !== null || selectedIssue.status === 'sent'} onClick={() => void run('generateSocial', { issueId: selectedIssue._id }, 'Social drafts generated for review.')} className="rounded-lg border border-[#b6cfc4] px-3 py-2 text-sm font-semibold text-[#1c5547] disabled:opacity-50">Prepare social drafts</button>
              </div>
              <p className="mt-3 text-xs text-[#6b8178]">Subscriber send stays unavailable until the exact issue fingerprint passes editorial review, the issue is approved, and the public page is verified successfully.</p>

              <div className="mt-6 grid gap-5 lg:grid-cols-2">
                <div><h3 className="font-bold">Research sources</h3><div className="mt-3 space-y-3">{detail?.articles.map((article, index) => <article key={article._id} className="rounded-lg border border-[#d6e2dc] bg-[#f8fbf9] p-4"><p className="text-xs font-bold uppercase tracking-wide text-[#087f5b]">Article {index + 1}</p><h4 className="mt-1 font-semibold">{article.title || article.apaCitation || 'Untitled source'}</h4><p className="mt-2 text-sm leading-6 text-[#536a62]">{article.summary || 'Summary not yet added.'}</p><div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-semibold"><span className={article.fullTextVerifiedAt ? 'text-emerald-700' : 'text-amber-700'}>{article.fullTextVerifiedAt ? 'Full text verified' : 'Full text needs verification'}</span>{article.fullTextUrl && <a className="text-[#087f5b] underline" href={article.fullTextUrl} target="_blank" rel="noreferrer">Open full text</a>}</div></article>)}</div></div>
                <div><h3 className="font-bold">Performance and social work</h3><div className="mt-3 rounded-lg border border-[#d6e2dc] bg-[#f8fbf9] p-4"><div className="grid grid-cols-2 gap-3 text-sm"><div><span className="block text-xs text-[#6b8178]">Delivered</span><strong>{String(analytics?.delivered ?? 0)}</strong></div><div><span className="block text-xs text-[#6b8178]">Opens</span><strong className="text-[#6b8178]">Tracking off</strong></div><div><span className="block text-xs text-[#6b8178]">Likely-human clicks</span><strong>{String(analytics?.likelyHumanClicked ?? 0)}</strong></div><div><span className="block text-xs text-[#6b8178]">Raw provider clicks</span><strong>{String(analytics?.rawClicked ?? 0)}</strong></div><div><span className="block text-xs text-[#6b8178]">Likely scanner clicks</span><strong>{String(analytics?.likelyBotClicked ?? 0)}</strong></div><div><span className="block text-xs text-[#6b8178]">Unclassified clicks</span><strong>{String(analytics?.unknownClicked ?? 0)}</strong></div><div><span className="block text-xs text-[#6b8178]">Archive views</span><strong>{String(analytics?.archiveViews ?? 0)}</strong></div><div><span className="block text-xs text-[#6b8178]">Feedback</span><strong>{String(analytics?.feedback ?? 0)}</strong></div></div><p className="mt-4 text-xs leading-5 text-[#6b8178]">Raw clicks can include email security scanners. Likely-human clicks exclude immediate and rapid multi-link activity; this is a directional heuristic. Open tracking is disabled.</p></div><div className="mt-3 space-y-2">{detail?.socialPosts.map((post) => <div key={post._id} className="rounded-lg border border-[#d6e2dc] p-3"><div className="flex items-center justify-between gap-3"><span className="text-sm font-bold capitalize">{post.platform}</span><span className="text-xs font-semibold text-[#6b8178]">{post.status}</span></div><p className="mt-2 line-clamp-3 whitespace-pre-wrap text-sm leading-5 text-[#536a62]">{post.body}</p></div>)}{!detail?.socialPosts.length && <p className="text-sm text-[#6b8178]">No social drafts yet.</p>}</div></div>
              </div>
              {selectedIssue.archiveUrl && <p className="mt-5 text-sm">Public issue: <a className="font-semibold text-[#087f5b] underline" href={selectedIssue.archiveUrl} target="_blank" rel="noreferrer">{selectedIssue.archiveUrl}</a></p>}
            </>}
          </section>
        </div>

        <section className="rounded-xl border border-[#d6e2dc] bg-white p-5" aria-labelledby="audience-heading"><h2 id="audience-heading" className="flex items-center gap-2 text-lg font-bold"><Users className="h-5 w-5 text-[#087f5b]" /> Audience segments</h2><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{dashboard?.audiences.map((audience) => <div key={audience.key} className="rounded-lg border border-[#d6e2dc] p-3"><div className="flex items-center justify-between gap-2"><span className="font-semibold">{audience.label}</span><strong className="text-[#087f5b]">{audience.eligible}</strong></div><p className="mt-1 text-xs leading-5 text-[#6b8178]">{audience.description}</p></div>)}</div></section>
      </div>
    </main>
  )
}
