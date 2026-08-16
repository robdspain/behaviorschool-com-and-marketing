'use client'

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Check, CheckCircle2, Clipboard, FileKey2, Plus, RefreshCw, ShieldCheck, Trash2, XCircle } from 'lucide-react'
import { hasAdminClientSession } from '@/lib/admin-client-session'

type Site = 'behaviorschool' | 'robspain'
type Tier = 'A' | 'B' | 'C' | 'social-derivative'
type Status = 'draft' | 'approved' | 'stale' | 'revoked'
type Anchor = { type: string; detail: string; verifiedByRob: boolean }

type RecordForm = {
  id?: string
  site: Site
  contentKey: string
  title: string
  contentType: string
  tier: Tier
  contentHash: string
  approvalStatus: Status
  audienceNeed: string
  firstPartyInputReference: string
  distinctiveThesis: string
  specificityAnchors: Anchor[]
  evidenceInterpretationSeparated: boolean
  informationGain: string
  disclosureDecision: 'site-standard' | 'page-specific' | 'not-needed'
  detectorOptimizationUsed: boolean
  claimsReviewed: boolean
  canonicalSource?: string
  sourceApprovalReference?: string
  notes?: string
  approvedBy?: string
  approvedAt?: string
  updatedAt?: string
}

const emptyRecord = (): RecordForm => ({
  site: 'behaviorschool', contentKey: '', title: '', contentType: 'blog-article', tier: 'A', contentHash: '', approvalStatus: 'draft',
  audienceNeed: '', firstPartyInputReference: '', distinctiveThesis: '', specificityAnchors: [{ type: '', detail: '', verifiedByRob: false }],
  evidenceInterpretationSeparated: false, informationGain: '', disclosureDecision: 'site-standard', detectorOptimizationUsed: false,
  claimsReviewed: false, canonicalSource: '', sourceApprovalReference: '', notes: '',
})

async function apiRequest<T>(init?: RequestInit) {
  const response = await fetch('/api/admin/publishing-standards', { ...init, cache: 'no-store' })
  const body = await response.json().catch(() => ({})) as T & { error?: string }
  if (!response.ok) throw new Error(body.error || `Request failed with HTTP ${response.status}.`)
  return body
}

function failures(record: RecordForm) {
  const items: string[] = []
  const requiredAnchors = record.tier === 'A' ? 2 : record.tier === 'social-derivative' ? 0 : 1
  const anchors = record.specificityAnchors.filter((anchor) => anchor.type.trim() && anchor.detail.trim() && anchor.verifiedByRob).length
  if (!record.title.trim()) items.push('Working title')
  if (!record.contentKey.trim()) items.push('Stable content key')
  if (!/^[a-f0-9]{64}$/i.test(record.contentHash.trim())) items.push('Valid SHA-256 fingerprint')
  if (!record.audienceNeed.trim()) items.push('Specific audience need')
  if (!record.firstPartyInputReference.trim()) items.push('Rob’s first-party input')
  if (!record.distinctiveThesis.trim()) items.push('Distinctive thesis')
  if (!record.informationGain.trim()) items.push('Information gain')
  if (!record.evidenceInterpretationSeparated) items.push('Evidence/interpretation separation')
  if (!record.claimsReviewed) items.push('Claims review')
  if (record.detectorOptimizationUsed) items.push('Remove detector-targeted tactics')
  if (anchors < requiredAnchors) items.push(`${requiredAnchors} verified specificity anchor${requiredAnchors === 1 ? '' : 's'}`)
  if (record.tier === 'social-derivative' && !record.canonicalSource?.trim()) items.push('Approved canonical source')
  if (record.tier === 'social-derivative' && !record.sourceApprovalReference?.trim()) items.push('Source approval reference')
  return items
}

function statusStyle(status: Status) {
  if (status === 'approved') return 'bg-emerald-100 text-emerald-800 border-emerald-200'
  if (status === 'stale') return 'bg-amber-100 text-amber-900 border-amber-200'
  if (status === 'revoked') return 'bg-red-100 text-red-800 border-red-200'
  return 'bg-slate-100 text-slate-700 border-slate-200'
}

function PublishingStandardsContent() {
  const searchParams = useSearchParams()
  const [records, setRecords] = useState<RecordForm[]>([])
  const [record, setRecord] = useState<RecordForm>(emptyRecord)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const load = useCallback(async () => {
    setError(null)
    const data = await apiRequest<{ records: RecordForm[] }>()
    setRecords(data.records || [])
    return data.records || []
  }, [])

  useEffect(() => {
    document.title = 'Publishing Standards | Behavior School Admin'
    let cancelled = false
    void (async () => {
      try {
        if (!await hasAdminClientSession()) {
          window.location.href = '/admin/login?returnTo=%2Fadmin%2Fpublishing-standards'
          return
        }
        const loaded = await load()
        if (cancelled) return
        const contentKey = searchParams.get('contentKey') || ''
        const site = (searchParams.get('site') || 'behaviorschool') as Site
        const existing = loaded.find((item) => item.site === site && item.contentKey === contentKey)
        if (existing) setRecord(existing)
        else if (contentKey) setRecord({
          ...emptyRecord(), site, contentKey,
          contentHash: searchParams.get('contentHash') || '',
          title: searchParams.get('title') || '',
          contentType: searchParams.get('contentType') || 'blog-article',
          tier: (searchParams.get('tier') || 'A') as Tier,
          specificityAnchors: [{ type: '', detail: '', verifiedByRob: false }, { type: '', detail: '', verifiedByRob: false }],
        })
      } catch (loadError) {
        if (!cancelled) setError(loadError instanceof Error ? loadError.message : 'Publishing records could not be loaded.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [load, searchParams])

  const missing = useMemo(() => failures(record), [record])
  const counts = useMemo(() => ({
    approved: records.filter((item) => item.approvalStatus === 'approved').length,
    needsReview: records.filter((item) => item.approvalStatus === 'draft').length,
    stale: records.filter((item) => item.approvalStatus === 'stale').length,
    blocked: records.filter((item) => item.approvalStatus === 'revoked').length,
  }), [records])

  const mutate = async (operation: 'upsert' | 'approve' | 'revoke') => {
    setBusy(operation); setError(null); setNotice(null)
    try {
      const payload = operation === 'upsert'
        ? { operation, record: {
          site: record.site, contentKey: record.contentKey, title: record.title, contentType: record.contentType,
          tier: record.tier, contentHash: record.contentHash, audienceNeed: record.audienceNeed,
          firstPartyInputReference: record.firstPartyInputReference, distinctiveThesis: record.distinctiveThesis,
          specificityAnchors: record.specificityAnchors, evidenceInterpretationSeparated: record.evidenceInterpretationSeparated,
          informationGain: record.informationGain, disclosureDecision: record.disclosureDecision,
          detectorOptimizationUsed: record.detectorOptimizationUsed, claimsReviewed: record.claimsReviewed,
          canonicalSource: record.canonicalSource || undefined, sourceApprovalReference: record.sourceApprovalReference || undefined,
          notes: record.notes || undefined,
        } }
        : { operation, id: record.id }
      const result = await apiRequest<{ record: RecordForm }>({ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      setRecord(result.record)
      await load()
      setNotice(operation === 'upsert' ? 'Review record saved. Content changes automatically invalidate an earlier approval.' : operation === 'approve' ? 'Exact content fingerprint approved for release.' : 'Publishing approval revoked.')
    } catch (mutationError) {
      setError(mutationError instanceof Error ? mutationError.message : 'The publishing record could not be updated.')
    } finally { setBusy(null) }
  }

  const updateAnchor = (index: number, patch: Partial<Anchor>) => setRecord((current) => ({
    ...current, specificityAnchors: current.specificityAnchors.map((anchor, position) => position === index ? { ...anchor, ...patch } : anchor),
  }))

  const copyRelease = async () => {
    await navigator.clipboard.writeText(JSON.stringify({
      site: record.site, contentKey: record.contentKey, contentHash: record.contentHash,
      approvalStatus: record.approvalStatus, approvedBy: record.approvedBy, approvedAt: record.approvedAt,
    }, null, 2))
    setNotice('Release record copied.')
  }

  if (loading) return <main className="grid min-h-screen place-items-center bg-[#f5f8f6] text-[#536a62]">Loading publishing controls…</main>

  const fieldClass = 'mt-1.5 w-full rounded-lg border border-[#c9d9d1] bg-white px-3 py-2.5 text-sm text-[#17352d] outline-none focus:border-[#087f5b] focus:ring-2 focus:ring-[#087f5b]/15'
  const labelClass = 'text-xs font-bold uppercase tracking-[0.08em] text-[#536a62]'

  return <main className="min-h-screen bg-[#f5f8f6] text-[#17352d]">
    <header className="border-b border-[#d6e2dc] bg-[#102a23] text-white">
      <div className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8ee0bd]">Editorial release system</p><h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Publishing standards control room</h1><p className="mt-3 max-w-3xl text-sm leading-6 text-[#c8dbd3]">Protect reputation and discoverability by requiring first-party judgment, verified specificity, clear evidence boundaries, and useful original contribution. The system never optimizes copy to fool AI detectors.</p></div>
          <button type="button" onClick={() => { setRecord(emptyRecord()); setNotice(null); setError(null) }} className="inline-flex items-center gap-2 rounded-lg bg-[#f5c842] px-4 py-2.5 text-sm font-bold text-[#17352d]"><Plus className="h-4 w-4" /> New review</button>
        </div>
      </div>
    </header>

    <div className="mx-auto max-w-[1500px] space-y-6 px-5 py-6 sm:px-8">
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Publishing status summary">
        {[["Approved", counts.approved, 'text-emerald-700'], ["Needs review", counts.needsReview, 'text-slate-800'], ["Stale", counts.stale, 'text-amber-700'], ["Revoked", counts.blocked, 'text-red-700']].map(([label, value, tone]) => <div key={String(label)} className="rounded-xl border border-[#d6e2dc] bg-white p-4"><p className="text-xs font-bold uppercase tracking-wide text-[#6b8178]">{label}</p><p className={`mt-2 text-3xl font-bold ${tone}`}>{value}</p></div>)}
      </section>

      {error && <div role="alert" className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"><XCircle className="h-5 w-5 shrink-0" /><p>{error}</p></div>}
      {notice && <div role="status" className="flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"><CheckCircle2 className="h-5 w-5 shrink-0" /><p>{notice}</p></div>}

      <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="self-start rounded-xl border border-[#d6e2dc] bg-white p-4 xl:sticky xl:top-5">
          <div className="flex items-center justify-between"><div><h2 className="font-bold">Release records</h2><p className="mt-1 text-xs text-[#6b8178]">Newest activity first</p></div><button onClick={() => void load()} title="Refresh records" className="rounded-lg border border-[#d6e2dc] p-2 text-[#087f5b]"><RefreshCw className="h-4 w-4" /></button></div>
          <div className="mt-4 max-h-[70vh] space-y-2 overflow-y-auto pr-1">
            {records.map((item) => <button key={`${item.site}:${item.contentKey}`} onClick={() => { setRecord(item); setError(null); setNotice(null) }} className={`w-full rounded-lg border p-3 text-left ${record.id === item.id ? 'border-[#087f5b] bg-[#effaf5]' : 'border-[#d6e2dc] hover:bg-[#f8fbf9]'}`}><div className="flex items-start justify-between gap-2"><span className="text-[10px] font-bold uppercase tracking-wide text-[#087f5b]">{item.site} · Tier {item.tier}</span><span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${statusStyle(item.approvalStatus)}`}>{item.approvalStatus}</span></div><p className="mt-2 line-clamp-2 text-sm font-bold">{item.title}</p><p className="mt-1 truncate font-mono text-[10px] text-[#71837c]">{item.contentKey}</p></button>)}
            {!records.length && <p className="rounded-lg bg-[#f5f8f6] p-4 text-sm text-[#6b8178]">No release records yet. Open a newsletter or blog draft and choose “Prepare approval.”</p>}
          </div>
        </aside>

        <div className="space-y-6">
          <section className={`rounded-xl border-2 p-5 ${record.approvalStatus === 'approved' ? 'border-emerald-200 bg-emerald-50' : missing.length ? 'border-amber-200 bg-amber-50' : 'border-[#b6cfc4] bg-white'}`}>
            <div className="flex flex-wrap items-start justify-between gap-4"><div className="flex gap-3"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-[#087f5b]"><FileKey2 className="h-5 w-5" /></span><div><p className="text-xs font-bold uppercase tracking-wide text-[#087f5b]">Exact-hash release</p><h2 className="mt-1 text-xl font-bold">{record.approvalStatus === 'approved' ? 'Approved for publication' : missing.length ? `${missing.length} requirement${missing.length === 1 ? '' : 's'} remaining` : 'Ready for Rob’s approval'}</h2><p className="mt-1 text-sm text-[#536a62]">Any content change produces a new fingerprint and makes the approval stale.</p></div></div><span className={`rounded-full border px-3 py-1 text-xs font-bold uppercase ${statusStyle(record.approvalStatus)}`}>{record.approvalStatus}</span></div>
            {missing.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{missing.map((item) => <span key={item} className="rounded-full border border-amber-200 bg-white px-2.5 py-1 text-xs font-semibold text-amber-900">{item}</span>)}</div>}
          </section>

          <section className="rounded-xl border border-[#d6e2dc] bg-white p-5 sm:p-6">
            <div className="grid gap-5 md:grid-cols-2">
              <label><span className={labelClass}>Site</span><select className={fieldClass} value={record.site} onChange={(event) => setRecord({ ...record, site: event.target.value as Site })}><option value="behaviorschool">BehaviorSchool.com</option><option value="robspain">RobSpain.com</option></select></label>
              <label><span className={labelClass}>Review tier</span><select className={fieldClass} value={record.tier} onChange={(event) => setRecord({ ...record, tier: event.target.value as Tier })}><option value="A">Tier A — flagship/reputation</option><option value="B">Tier B — supporting article</option><option value="C">Tier C — utility/update</option><option value="social-derivative">Social derivative</option></select></label>
              <label className="md:col-span-2"><span className={labelClass}>Working title</span><input className={fieldClass} value={record.title} onChange={(event) => setRecord({ ...record, title: event.target.value })} /></label>
              <label><span className={labelClass}>Content key</span><input className={`${fieldClass} font-mono`} value={record.contentKey} onChange={(event) => setRecord({ ...record, contentKey: event.target.value })} placeholder="blog:article-slug" /></label>
              <label><span className={labelClass}>Content type</span><input className={fieldClass} value={record.contentType} onChange={(event) => setRecord({ ...record, contentType: event.target.value })} /></label>
              <label className="md:col-span-2"><span className={labelClass}>SHA-256 content fingerprint</span><input className={`${fieldClass} font-mono text-xs`} value={record.contentHash} onChange={(event) => setRecord({ ...record, contentHash: event.target.value.trim() })} placeholder="64-character fingerprint supplied by the publishing workflow" /></label>
            </div>
          </section>

          <section className="rounded-xl border border-[#d6e2dc] bg-white p-5 sm:p-6">
            <div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 text-[#087f5b]" /><div><h2 className="text-lg font-bold">Authorship and information gain</h2><p className="mt-1 text-sm text-[#6b8178]">Capture the judgment and usefulness that generic synthesis cannot supply.</p></div></div>
            <div className="mt-5 grid gap-5">
              <label><span className={labelClass}>Specific audience need or decision</span><textarea rows={3} className={fieldClass} value={record.audienceNeed} onChange={(event) => setRecord({ ...record, audienceNeed: event.target.value })} /></label>
              <label><span className={labelClass}>Rob’s first-party input or review source</span><textarea rows={3} className={fieldClass} value={record.firstPartyInputReference} onChange={(event) => setRecord({ ...record, firstPartyInputReference: event.target.value })} placeholder="Interview note, field observation, approved voice note, case pattern, or direct review." /></label>
              <label><span className={labelClass}>Distinctive thesis</span><textarea rows={3} className={fieldClass} value={record.distinctiveThesis} onChange={(event) => setRecord({ ...record, distinctiveThesis: event.target.value })} /></label>
              <label><span className={labelClass}>Information gain</span><textarea rows={3} className={fieldClass} value={record.informationGain} onChange={(event) => setRecord({ ...record, informationGain: event.target.value })} placeholder="What will the reader understand, decide, or do that competing pages do not provide?" /></label>
            </div>
          </section>

          <section className="rounded-xl border border-[#d6e2dc] bg-white p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-bold">Verified specificity anchors</h2><p className="mt-1 text-sm text-[#6b8178]">Tier A requires two; Tiers B and C require one.</p></div><button type="button" onClick={() => setRecord({ ...record, specificityAnchors: [...record.specificityAnchors, { type: '', detail: '', verifiedByRob: false }] })} className="inline-flex items-center gap-2 rounded-lg border border-[#b6cfc4] px-3 py-2 text-sm font-bold text-[#087f5b]"><Plus className="h-4 w-4" /> Add anchor</button></div>
            <div className="mt-4 space-y-3">{record.specificityAnchors.map((anchor, index) => <div key={index} className="grid gap-3 rounded-lg border border-[#d6e2dc] bg-[#f8fbf9] p-4 md:grid-cols-[180px_minmax(0,1fr)_auto]"><input aria-label={`Anchor ${index + 1} type`} className={fieldClass} value={anchor.type} onChange={(event) => updateAnchor(index, { type: event.target.value })} placeholder="Example / observation" /><input aria-label={`Anchor ${index + 1} detail`} className={fieldClass} value={anchor.detail} onChange={(event) => updateAnchor(index, { detail: event.target.value })} placeholder="The concrete, sourceable detail" /><div className="flex items-end gap-2"><label className="flex min-h-10 items-center gap-2 rounded-lg border border-[#c9d9d1] bg-white px-3 text-xs font-bold"><input type="checkbox" checked={anchor.verifiedByRob} onChange={(event) => updateAnchor(index, { verifiedByRob: event.target.checked })} /> Verified</label><button type="button" aria-label={`Remove anchor ${index + 1}`} onClick={() => setRecord({ ...record, specificityAnchors: record.specificityAnchors.filter((_, position) => position !== index) })} className="grid h-10 w-10 place-items-center rounded-lg border border-red-200 bg-white text-red-700"><Trash2 className="h-4 w-4" /></button></div></div>)}</div>
          </section>

          {record.tier === 'social-derivative' && <section className="rounded-xl border border-[#d6e2dc] bg-white p-5 sm:p-6"><h2 className="text-lg font-bold">Canonical source lock</h2><div className="mt-4 grid gap-4 md:grid-cols-2"><label><span className={labelClass}>Canonical source URL/key</span><input className={fieldClass} value={record.canonicalSource || ''} onChange={(event) => setRecord({ ...record, canonicalSource: event.target.value })} /></label><label><span className={labelClass}>Source approval reference</span><input className={fieldClass} value={record.sourceApprovalReference || ''} onChange={(event) => setRecord({ ...record, sourceApprovalReference: event.target.value })} /></label></div></section>}

          <section className="rounded-xl border border-[#d6e2dc] bg-white p-5 sm:p-6">
            <h2 className="text-lg font-bold">Final integrity checks</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <label className="flex items-start gap-3 rounded-lg border border-[#d6e2dc] p-4"><input className="mt-1" type="checkbox" checked={record.evidenceInterpretationSeparated} onChange={(event) => setRecord({ ...record, evidenceInterpretationSeparated: event.target.checked })} /><span><strong className="block text-sm">Evidence is separated from interpretation</strong><span className="mt-1 block text-xs leading-5 text-[#6b8178]">Sources support factual claims; Rob’s judgment is labeled as judgment.</span></span></label>
              <label className="flex items-start gap-3 rounded-lg border border-[#d6e2dc] p-4"><input className="mt-1" type="checkbox" checked={record.claimsReviewed} onChange={(event) => setRecord({ ...record, claimsReviewed: event.target.checked })} /><span><strong className="block text-sm">Claims and links are reviewed</strong><span className="mt-1 block text-xs leading-5 text-[#6b8178]">No invented facts, sources, outcomes, quotes, or unsupported certainty.</span></span></label>
              <label className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 md:col-span-2"><input className="mt-1" type="checkbox" checked={record.detectorOptimizationUsed} onChange={(event) => setRecord({ ...record, detectorOptimizationUsed: event.target.checked })} /><span><strong className="block text-sm text-red-900">Detector-targeted wording was used</strong><span className="mt-1 block text-xs leading-5 text-red-800">This must remain unchecked. We improve provenance and reader value; we do not disguise authorship or game detection systems.</span></span></label>
              <label><span className={labelClass}>Disclosure decision</span><select className={fieldClass} value={record.disclosureDecision} onChange={(event) => setRecord({ ...record, disclosureDecision: event.target.value as RecordForm['disclosureDecision'] })}><option value="site-standard">Covered by site-wide standard</option><option value="page-specific">Page-specific disclosure included</option><option value="not-needed">No additional disclosure needed</option></select></label>
              <label><span className={labelClass}>Review notes</span><textarea rows={2} className={fieldClass} value={record.notes || ''} onChange={(event) => setRecord({ ...record, notes: event.target.value })} /></label>
            </div>
          </section>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#d6e2dc] bg-white p-4">
            <div className="flex flex-wrap gap-2"><button type="button" disabled={busy !== null} onClick={() => void mutate('upsert')} className="rounded-lg border border-[#b6cfc4] px-4 py-2.5 text-sm font-bold text-[#1c5547] disabled:opacity-50">{busy === 'upsert' ? 'Saving…' : 'Save review'}</button>{record.id && record.approvalStatus !== 'approved' && <button type="button" disabled={busy !== null || missing.length > 0} onClick={() => void mutate('approve')} className="inline-flex items-center gap-2 rounded-lg bg-[#087f5b] px-4 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"><Check className="h-4 w-4" /> Approve exact version</button>}{record.id && record.approvalStatus === 'approved' && <button type="button" disabled={busy !== null} onClick={() => void mutate('revoke')} className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-bold text-red-700">Revoke</button>}</div>
            {record.id && <button type="button" onClick={() => void copyRelease()} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-[#536a62] hover:bg-[#f5f8f6]"><Clipboard className="h-4 w-4" /> Copy release record</button>}
          </div>
        </div>
      </div>
    </div>
  </main>
}

export default function PublishingStandardsPage() {
  return <Suspense fallback={<main className="grid min-h-screen place-items-center bg-[#f5f8f6] text-[#536a62]">Loading publishing controls…</main>}><PublishingStandardsContent /></Suspense>
}
