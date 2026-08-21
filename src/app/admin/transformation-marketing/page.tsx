"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, RefreshCw, Target, Users } from "lucide-react";
import { TRANSFORMATION_PROGRAM } from "@/lib/transformation-program";

type Overview = {
  crm: {
    truncated: boolean;
    contacts: {
      active: number;
      optedIn: number;
      consentNotRequested: number;
      unknownConsent: number;
      unsubscribed: number;
      knownRole: number;
      knownOrganization: number;
      neverContacted: number;
      schoolBcbaSignals: number;
      transformationSignals: number;
      qualified: number;
      customers: number;
    };
    pipeline: {
      activeDeals: number;
      activeDealValue: number;
      pendingFollowUps: number;
      overdueFollowUps: number;
      strongFitCalls: number;
      applications: number;
    };
  };
  newsletter: {
    confirmedRecipients: number;
    safeRecipientCount: number;
    source: string;
    available: boolean;
  };
};

function Metric({ label, value, hint }: { label: string; value: string | number; hint: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <p className="text-sm font-medium text-slate-600">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-slate-950">{value}</p>
      <p className="mt-2 text-xs leading-5 text-slate-500">{hint}</p>
    </div>
  );
}

export default function TransformationMarketingPage() {
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/transformation-marketing/overview", { credentials: "include" });
      if (!response.ok) throw new Error("Unable to load funnel data.");
      setData(await response.json());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load funnel data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const contacts = data?.crm.contacts;
  const pipeline = data?.crm.pipeline;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#1f4d3f]">Transformation Program</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950">Marketing readiness</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Work only from documented consent and clear program interest. This dashboard does not send email.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void load()}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>

        {error && <p className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}

        {data && contacts && pipeline && (
          <>
            <section className="mt-8 rounded-lg border border-[#1f4d3f]/15 bg-[#f7f3ee] p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#1f4d3f]">Current offer</p>
                  <h2 className="mt-1 text-xl font-semibold text-slate-950">{TRANSFORMATION_PROGRAM.cohort.label}</h2>
                  <p className="mt-1 text-sm text-slate-600">{TRANSFORMATION_PROGRAM.cohort.dateRange}. {TRANSFORMATION_PROGRAM.pricing.payInFull} in full or {TRANSFORMATION_PROGRAM.pricing.installmentCount} payments of {TRANSFORMATION_PROGRAM.pricing.installment}.</p>
                </div>
                <a className="inline-flex items-center gap-2 text-sm font-semibold text-[#1f4d3f] hover:underline" href="/transformation-program" target="_blank" rel="noreferrer">
                  Review public page <Target className="h-4 w-4" />
                </a>
              </div>
            </section>

            <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <Metric label="Confirmed email audience" value={data.newsletter.safeRecipientCount} hint={data.newsletter.available ? data.newsletter.source : "Newsletter source is unavailable."} />
              <Metric label="Explicit program opt-ins" value={contacts.optedIn} hint="Collected through the current Program application." />
              <Metric label="Strong-fit calls" value={pipeline.strongFitCalls} hint="Discovery calls currently recorded as strong or perfect fit." />
              <Metric label="Open applications" value={pipeline.applications} hint="Transformation applications awaiting an outcome." />
            </section>

            <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-lg border border-slate-200 bg-white p-6">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#1f4d3f]" />
                  <h2 className="text-lg font-semibold text-slate-950">Contact readiness</h2>
                </div>
                <dl className="mt-5 grid gap-x-6 gap-y-4 sm:grid-cols-2">
                  {[
                    ["Active CRM contacts", contacts.active],
                    ["Known role", contacts.knownRole],
                    ["Known organization", contacts.knownOrganization],
                    ["School BCBA signals", contacts.schoolBcbaSignals],
                    ["Transformation signals", contacts.transformationSignals],
                    ["Consent not requested", contacts.consentNotRequested + contacts.unknownConsent],
                    ["Never contacted", contacts.neverContacted],
                    ["Unsubscribed", contacts.unsubscribed],
                  ].map(([label, value]) => (
                    <div key={String(label)} className="flex items-baseline justify-between gap-3 border-b border-slate-100 pb-3">
                      <dt className="text-sm text-slate-600">{label}</dt>
                      <dd className="text-lg font-semibold text-slate-900">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-6">
                <h2 className="text-lg font-semibold text-slate-950">Work queue</h2>
                <div className="mt-5 space-y-4 text-sm leading-6 text-slate-700">
                  <p className="flex gap-3"><AlertTriangle className="mt-1 h-4 w-4 flex-none text-amber-600" />Do not create a campaign from CRM contacts whose permission is unknown. Use a separate reconfirmation flow first.</p>
                  <p className="flex gap-3"><CheckCircle2 className="mt-1 h-4 w-4 flex-none text-[#1f4d3f]" />Follow up on {pipeline.overdueFollowUps} overdue task{pipeline.overdueFollowUps === 1 ? "" : "s"} and {pipeline.pendingFollowUps} pending task{pipeline.pendingFollowUps === 1 ? "" : "s"} before broader outreach.</p>
                  <p className="flex gap-3"><CheckCircle2 className="mt-1 h-4 w-4 flex-none text-[#1f4d3f]" />Build the next audience from confirmed newsletter subscribers plus new applicants who explicitly opt in.</p>
                  <p className="text-xs text-slate-500">Active pipeline value: ${pipeline.activeDealValue.toLocaleString("en-US")}. {data.crm.truncated ? "Counts are capped at the configured reporting limit." : "All current CRM rows are included."}</p>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
