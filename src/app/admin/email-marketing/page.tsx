'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Mail,
  RefreshCw,
  Send,
  Settings2,
  Users,
} from 'lucide-react';
import { emailProducts } from '@/lib/email-marketing-catalog';

type Overview = {
  fetchedAt: string;
  errors: string[];
  totals: {
    activeTemplates: number;
    sentLast30Days: number;
    failedLast30Days: number;
    queued: number;
  };
  templates: Array<{
    id: string;
    name: string;
    subject: string;
    category: string;
    active: boolean;
    delayMinutes: number;
    updatedAt: string;
  }>;
  recentLogs: Array<{
    id: string;
    templateName: string | null;
    recipientEmail: string;
    subject: string;
    status: string;
    sentAt: string;
  }>;
  transformation: {
    enrollments: Record<string, number>;
    emails: Record<string, number>;
  };
  study: null | {
    queue: number;
    candidates: number;
    paid: number;
    firstPractice: number;
    suppressed: number;
  };
  listmonk: {
    configured: boolean;
    healthy: boolean;
    subscribers: number | null;
    lists: number | null;
    campaigns: number | null;
  };
  providers: Record<string, boolean>;
};

const statusStyles = {
  live: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  shared: 'border-amber-200 bg-amber-50 text-amber-800',
  manual: 'border-blue-200 bg-blue-50 text-blue-800',
  planned: 'border-slate-200 bg-slate-100 text-slate-700',
};

function formatDelay(minutes: number) {
  if (minutes === 0) return 'Immediate';
  if (minutes < 60) return `${minutes} min`;
  if (minutes < 1440) return `${Math.round(minutes / 60)} hr`;
  return `Day ${Math.round(minutes / 1440)}`;
}

function Metric({ label, value, detail, tone }: { label: string; value: string; detail: string; tone: string }) {
  return (
    <div className={`min-h-28 border-l-4 bg-white px-5 py-4 ${tone}`}>
      <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-slate-950">{value}</p>
      <p className="mt-1 text-sm text-slate-600">{detail}</p>
    </div>
  );
}

export default function EmailMarketingPage() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [selectedId, setSelectedId] = useState(emailProducts[0].id);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOverview = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/communications-overview', {
        cache: 'no-store',
        credentials: 'same-origin',
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Unable to load email marketing data');
      setOverview(payload);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load email marketing data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Email Marketing | Behavior School Admin';
    loadOverview();
  }, []);

  const selected = useMemo(
    () => emailProducts.find((product) => product.id === selectedId) || emailProducts[0],
    [selectedId],
  );

  const relevantTemplates = useMemo(() => {
    if (!overview) return [];
    if (selected.id === 'transformation-program') {
      return overview.templates.filter((template) =>
        template.name.toLowerCase().includes('transformation') || template.category === 'payment');
    }
    if (selected.id === 'behavior-school-core') return overview.templates;
    return [];
  }, [overview, selected.id]);

  const operationalStats = useMemo(() => {
    if (!overview) return [];
    if (selected.id === 'behavior-study-tools' || selected.id === 'school-rbt') {
      return [
        ['Sendable now', String(overview.study?.queue ?? 0)],
        ['Candidates', String(overview.study?.candidates ?? 0)],
        ['First practice', String(overview.study?.firstPractice ?? 0)],
        ['Suppressed', String(overview.study?.suppressed ?? 0)],
      ];
    }
    if (selected.id === 'transformation-program') {
      return [
        ['Active leads', String(overview.transformation.enrollments.active || 0)],
        ['Queued', String(overview.transformation.emails.queued || 0)],
        ['Sent', String(overview.transformation.emails.sent || 0)],
        ['Failed', String(overview.transformation.emails.failed || 0)],
      ];
    }
    if (selected.id === 'newsletter') {
      return [
        ['Subscribers', String(overview.listmonk.subscribers ?? '—')],
        ['Lists', String(overview.listmonk.lists ?? '—')],
        ['Campaigns', String(overview.listmonk.campaigns ?? '—')],
        ['Connection', overview.listmonk.healthy ? 'Healthy' : 'Check'],
      ];
    }
    return [
      ['Templates', String(relevantTemplates.length)],
      ['Active', String(relevantTemplates.filter((template) => template.active).length)],
      ['Sent 30d', String(overview.totals.sentLast30Days)],
      ['Failed 30d', String(overview.totals.failedLast30Days)],
    ];
  }, [overview, relevantTemplates, selected.id]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <header className="border-b border-slate-200 bg-white px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
              <Mail className="h-4 w-4" /> Universal product email operations
            </div>
            <h1 className="mt-2 text-3xl font-bold">Email Marketing</h1>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">
              One place to review every product sequence, delivery system, queue, template, and coverage gap.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/email-templates"
              className="inline-flex h-10 items-center gap-2 border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              <Settings2 className="h-4 w-4" /> Templates
            </Link>
            <button
              type="button"
              onClick={loadOverview}
              disabled={loading}
              className="inline-flex h-10 items-center gap-2 bg-emerald-700 px-4 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
          </div>
        </div>
      </header>

      <main className="px-4 py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 flex items-start gap-3 border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <div><p className="font-bold">Email dashboard unavailable</p><p>{error}</p></div>
          </div>
        )}

        {overview?.errors.length ? (
          <div className="mb-6 flex items-start gap-3 border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <div><p className="font-bold">Some live sources need attention</p><p>{overview.errors.join(' · ')}</p></div>
          </div>
        ) : null}

        <section aria-label="Email marketing totals" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Metric label="Products covered" value={String(emailProducts.length)} detail="Live, shared, manual, and planned" tone="border-emerald-600" />
          <Metric label="Queued now" value={loading ? '…' : String(overview?.totals.queued ?? 0)} detail="Study and Transformation nurture" tone="border-amber-500" />
          <Metric label="Sent in 30 days" value={loading ? '…' : String(overview?.totals.sentLast30Days ?? 0)} detail="Behavior School delivery logs" tone="border-blue-600" />
          <Metric label="Failed in 30 days" value={loading ? '…' : String(overview?.totals.failedLast30Days ?? 0)} detail="Requires review before scaling" tone="border-red-500" />
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="border border-slate-200 bg-white" aria-label="Products">
            <div className="border-b border-slate-200 px-4 py-3">
              <h2 className="text-sm font-bold">Products and audiences</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {emailProducts.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => setSelectedId(product.id)}
                  className={`w-full px-4 py-4 text-left transition-colors ${selected.id === product.id ? 'bg-emerald-50' : 'bg-white hover:bg-slate-50'}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-bold text-slate-950">{product.name}</p>
                      <p className="mt-1 text-xs leading-5 text-slate-600">{product.audience}</p>
                    </div>
                    <span className={`shrink-0 border px-2 py-1 text-[10px] font-bold uppercase ${statusStyles[product.status]}`}>
                      {product.status}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          <div className="min-w-0 border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-2xl font-bold">{selected.name}</h2>
                    <span className={`border px-2 py-1 text-xs font-bold uppercase ${statusStyles[selected.status]}`}>
                      {selected.status}
                    </span>
                  </div>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{selected.description}</p>
                  <p className="mt-2 text-xs font-semibold text-slate-500">Delivery: {selected.provider}</p>
                </div>
                <Link
                  href={selected.managementHref}
                  className="inline-flex h-10 shrink-0 items-center gap-2 bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  {selected.managementLabel} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="grid border-b border-slate-200 sm:grid-cols-2 lg:grid-cols-4">
              {operationalStats.map(([label, value], index) => (
                <div key={label} className={`min-h-24 px-5 py-4 ${index ? 'border-t sm:border-l sm:border-t-0' : ''} border-slate-200`}>
                  <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
                  <p className="mt-2 text-2xl font-bold">{loading ? '…' : value}</p>
                </div>
              ))}
            </div>

            <div className="px-5 py-6 sm:px-6">
              {selected.sequence.length > 0 ? (
                <>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold">Sequence emails</h3>
                      <p className="mt-1 text-sm text-slate-600">Every message currently defined for this product journey.</p>
                    </div>
                    <span className="text-sm font-bold text-slate-500">{selected.sequence.length} emails</span>
                  </div>
                  <div className="mt-4 overflow-x-auto border border-slate-200">
                    <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                      <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                        <tr>
                          <th className="w-24 px-4 py-3">When</th>
                          <th className="px-4 py-3">Email</th>
                          <th className="px-4 py-3">Audience</th>
                          <th className="px-4 py-3">Purpose</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {selected.sequence.map((step) => (
                          <tr key={`${step.timing}-${step.subject}`} className="align-top">
                            <td className="px-4 py-4 font-bold text-emerald-800">{step.timing}</td>
                            <td className="px-4 py-4">
                              <p className="font-bold text-slate-950">{step.title}</p>
                              <p className="mt-1 leading-5 text-slate-600">{step.subject}</p>
                            </td>
                            <td className="px-4 py-4 leading-5 text-slate-700">{step.audience}</td>
                            <td className="px-4 py-4 leading-5 text-slate-700">{step.objective}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : relevantTemplates.length > 0 ? (
                <>
                  <div className="flex items-center justify-between gap-4">
                    <div><h3 className="text-lg font-bold">Managed templates</h3><p className="mt-1 text-sm text-slate-600">Templates available to this product workflow.</p></div>
                    <Link href="/admin/email-templates" className="text-sm font-bold text-emerald-700 hover:text-emerald-900">Edit templates</Link>
                  </div>
                  <div className="mt-4 divide-y divide-slate-200 border border-slate-200">
                    {relevantTemplates.map((template) => (
                      <div key={template.id} className="grid gap-3 px-4 py-4 lg:grid-cols-[120px_minmax(0,1fr)_120px] lg:items-center">
                        <span className="text-xs font-bold uppercase text-slate-500">{template.category}</span>
                        <div><p className="font-bold">{template.name}</p><p className="mt-1 text-sm text-slate-600">{template.subject}</p></div>
                        <div className="flex items-center gap-2 text-sm text-slate-600"><Clock3 className="h-4 w-4" /> {formatDelay(template.delayMinutes)}</div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="border border-amber-200 bg-amber-50 p-5">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
                    <div>
                      <h3 className="font-bold text-amber-950">Sequence coverage needs work</h3>
                      <p className="mt-1 text-sm leading-6 text-amber-900">
                        This product does not yet have a dedicated, reviewable sequence in the universal dashboard. Create product-specific templates before sending a launch or nurture campaign.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-5 py-4"><h2 className="font-bold">Delivery systems</h2></div>
            <div className="grid sm:grid-cols-2">
              {Object.entries(overview?.providers || {}).map(([provider, connected], index) => (
                <div key={provider} className={`flex min-h-20 items-center gap-3 px-5 py-4 ${index % 2 ? 'sm:border-l' : ''} ${index > 1 ? 'border-t' : ''} border-slate-200`}>
                  {connected ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <AlertCircle className="h-5 w-5 text-amber-600" />}
                  <div><p className="font-bold capitalize">{provider.replace(/([A-Z])/g, ' $1')}</p><p className="text-xs text-slate-500">{connected ? 'Configured' : 'Needs configuration'}</p></div>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h2 className="font-bold">Recent delivery activity</h2>
              <span className="text-xs font-semibold text-slate-500">Last 30 days</span>
            </div>
            <div className="max-h-80 divide-y divide-slate-200 overflow-y-auto">
              {overview?.recentLogs.length ? overview.recentLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 px-5 py-4">
                  <Send className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                  <div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{log.subject}</p><p className="mt-1 truncate text-xs text-slate-500">{log.recipientEmail} · {new Date(log.sentAt).toLocaleString()}</p></div>
                  <span className={`text-xs font-bold uppercase ${log.status === 'sent' ? 'text-emerald-700' : 'text-red-700'}`}>{log.status}</span>
                </div>
              )) : (
                <div className="flex min-h-32 items-center justify-center px-5 py-8 text-center text-sm text-slate-500">
                  <div><Users className="mx-auto mb-2 h-5 w-5" /><p>No delivery logs in this source yet.</p></div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
