"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, BarChart3, Check, Clipboard, ExternalLink, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { behaviorStudyToolsMarketing } from "@/data/behaviorStudyToolsMarketing";

type Lifecycle = {
  signups: number;
  freeTrialStarts: number;
  paidConversions: number;
};

type MarketingSummary = Lifecycle & {
  totalEvents: number;
  pageViews: number;
  ctaClicks: number;
  appStarts: number;
};

type SocialPost = {
  id: string;
  postDate: string;
  platform: string;
  status: string;
  hook: string;
  ctaLabel: string | null;
  ctaUrl: string | null;
};

type RecordValue = Record<string, unknown>;

const dayOrder = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const pricingHref = "https://study.behaviorschool.com/pricing/";

function isRecord(value: unknown): value is RecordValue {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function numberValue(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function parseSummary(payload: unknown): MarketingSummary | null {
  if (!isRecord(payload) || !isRecord(payload.summary)) return null;
  const summary = payload.summary;
  const lifecycle = isRecord(summary.lifecycle) ? summary.lifecycle : {};

  return {
    totalEvents: numberValue(summary.totalEvents),
    pageViews: numberValue(summary.pageViews),
    ctaClicks: numberValue(summary.ctaClicks),
    appStarts: numberValue(summary.appStarts),
    signups: numberValue(lifecycle.signups),
    freeTrialStarts: numberValue(lifecycle.freeTrialStarts),
    paidConversions: numberValue(lifecycle.paidConversions),
  };
}

function hasUsefulSummary(summary: MarketingSummary) {
  return [
    summary.totalEvents,
    summary.pageViews,
    summary.ctaClicks,
    summary.appStarts,
    summary.signups,
    summary.freeTrialStarts,
    summary.paidConversions,
  ].some((value) => value > 0);
}

function parseSocialPosts(payload: unknown): SocialPost[] {
  if (!isRecord(payload) || !Array.isArray(payload.posts)) return [];

  return payload.posts.flatMap((value): SocialPost[] => {
    if (!isRecord(value) || typeof value.id !== "string" || typeof value.hook !== "string") return [];
    return [{
      id: value.id,
      postDate: typeof value.postDate === "string" ? value.postDate : "",
      platform: typeof value.platform === "string" ? value.platform : "Social",
      status: typeof value.status === "string" ? value.status : "queued",
      hook: value.hook,
      ctaLabel: typeof value.ctaLabel === "string" ? value.ctaLabel : null,
      ctaUrl: typeof value.ctaUrl === "string" ? value.ctaUrl : null,
    }];
  });
}

async function fetchJson(url: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(url, {
      credentials: "include",
      signal: controller.signal,
    });
    if (!response.ok) throw new Error("Request unavailable.");
    return (await response.json()) as unknown;
  } finally {
    clearTimeout(timeout);
  }
}

function Metric({ label, value, detail }: { label: string; value: number; detail: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <p className="text-sm font-medium text-slate-600">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-slate-950">{value.toLocaleString()}</p>
      <p className="mt-2 text-xs leading-5 text-slate-500">{detail}</p>
    </div>
  );
}

function FunnelLink({ label, href, primary = false }: { label: string; href: string; primary?: boolean }) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      className={`inline-flex items-center justify-between gap-3 rounded-md border px-4 py-3 text-sm font-semibold transition ${
        primary
          ? "border-[#1f4d3f] bg-[#1f4d3f] text-white hover:bg-[#173c31]"
          : "border-slate-200 bg-white text-slate-800 hover:border-[#1f4d3f]/40 hover:bg-slate-50"
      }`}
    >
      {label}
      <ArrowUpRight className="h-4 w-4 flex-none" />
    </a>
  );
}

export default function BehaviorStudyToolsMarketingPage() {
  const router = useRouter();
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [summary, setSummary] = useState<MarketingSummary | null>(null);
  const [reportMessage, setReportMessage] = useState("");
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([]);
  const [socialReady, setSocialReady] = useState(false);
  const [socialMessage, setSocialMessage] = useState("");
  const [copyState, setCopyState] = useState("");

  const todayPlan = behaviorStudyToolsMarketing.postPlan.find(
    (post) => post.day === dayOrder[new Date().getDay()],
  ) || behaviorStudyToolsMarketing.postPlan[0];

  useEffect(() => {
    document.title = "Behavior Study Tools Marketing | Behavior School Admin";
    let active = true;

    async function checkAuth() {
      try {
        const payload = await fetchJson("/api/admin/access-check");
        if (!active) return;
        if (!isRecord(payload) || payload.authenticated !== true) {
          router.push("/admin/login");
          return;
        }
        setIsAuthenticated(true);
      } catch {
        if (active) router.push("/admin/login");
      } finally {
        if (active) setAuthLoading(false);
      }
    }

    void checkAuth();
    return () => {
      active = false;
    };
  }, [router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    let active = true;

    async function loadData() {
      const [reportResult, socialResult] = await Promise.allSettled([
        fetchJson("/api/admin/behavior-study-tools/marketing-report"),
        fetchJson("/api/admin/behavior-study-tools/social-posts?limit=7"),
      ]);

      if (!active) return;

      if (reportResult.status === "fulfilled") {
        const parsed = parseSummary(reportResult.value);
        if (parsed && hasUsefulSummary(parsed)) {
          setSummary(parsed);
          setReportMessage("");
        } else {
          setSummary(null);
          setReportMessage("No recent tracking data; the snapshot is hidden.");
        }
      } else {
        setSummary(null);
        setReportMessage("Snapshot data is temporarily unavailable.");
      }

      if (socialResult.status === "fulfilled") {
        setSocialPosts(parseSocialPosts(socialResult.value));
        setSocialMessage("");
      } else {
        setSocialPosts([]);
        setSocialMessage("Social queue unavailable; showing today’s planned slot.");
      }
      setSocialReady(true);
    }

    void loadData();
    return () => {
      active = false;
    };
  }, [isAuthenticated]);

  async function copyPrimaryLink() {
    try {
      await navigator.clipboard.writeText(behaviorStudyToolsMarketing.primaryCta.href);
      setCopyState("Copied");
    } catch {
      setCopyState("Copy unavailable");
    }
  }

  if (authLoading) {
    return <main className="min-h-screen bg-slate-50" aria-busy="true" />;
  }

  if (!isAuthenticated) return null;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#1f4d3f]">
              Behavior Study Tools
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950">Marketing hub</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Keep the study funnel visible, choose one useful content slot, and move on.
            </p>
          </div>
          <a
            href="/admin/behavior-study-tools"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Open study tools admin
            <ExternalLink className="h-4 w-4" />
          </a>
        </header>

        <section className="mt-8 rounded-lg border border-[#1f4d3f]/20 bg-[#f7f3ee] p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-[#1f4d3f]">Primary funnel</p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-950">
                {behaviorStudyToolsMarketing.primaryMessage}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Use one clear destination for each campaign and check the next step in the web app.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <FunnelLink
                label="Free practice / mini mock"
                href={behaviorStudyToolsMarketing.primaryCta.href}
                primary
              />
              <FunnelLink label="Free full mock" href={behaviorStudyToolsMarketing.fullMockCta.href} />
            </div>
          </div>
        </section>

        {summary && (
          <section className="mt-8">
            <div className="mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-[#1f4d3f]" />
              <h2 className="text-lg font-semibold text-slate-950">Snapshot</h2>
              <span className="text-xs text-slate-500">Last 30 days</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <Metric label="Signups" value={summary.signups} detail="Tracked study accounts" />
              <Metric label="Free trials" value={summary.freeTrialStarts} detail="Trial-start events" />
              <Metric label="Paid conversions" value={summary.paidConversions} detail="Paid events" />
              <Metric label="App starts" value={summary.appStarts} detail={`${summary.ctaClicks.toLocaleString()} CTA clicks`} />
              <Metric label="Page views" value={summary.pageViews} detail={`${summary.totalEvents.toLocaleString()} total events`} />
            </div>
          </section>
        )}

        {reportMessage && (
          <p className="mt-4 text-sm text-slate-500" role="status">
            {reportMessage}
          </p>
        )}

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-950">Funnel links</h2>
            <p className="mt-1 text-sm text-slate-600">Open the destinations used in current Study campaigns.</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <FunnelLink label="Free practice" href={behaviorStudyToolsMarketing.primaryCta.href} />
              <FunnelLink label="Free full mock" href={behaviorStudyToolsMarketing.fullMockCta.href} />
              <FunnelLink label="Pricing" href={pricingHref} />
              <FunnelLink label="Public landing page" href={behaviorStudyToolsMarketing.secondaryCta.href} />
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-950">Quick actions</h2>
            <p className="mt-1 text-sm text-slate-600">Shortcuts for the next marketing check.</p>
            <div className="mt-5 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => void copyPrimaryLink()}
                className="inline-flex items-center justify-between gap-3 rounded-md border border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                <span>{copyState || "Copy primary Study link"}</span>
                {copyState === "Copied" ? <Check className="h-4 w-4 text-emerald-700" /> : <Clipboard className="h-4 w-4" />}
              </button>
              <a
                href="https://buffer.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-between gap-3 rounded-md border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                Open Buffer
                <ExternalLink className="h-4 w-4" />
              </a>
              <a
                href="/admin/behavior-study-tools"
                className="inline-flex items-center justify-between gap-3 rounded-md border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                Review study admin
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        {socialReady && (
          <section className="mt-8 rounded-lg border border-slate-200 bg-white p-6">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">This week’s social/content</h2>
                <p className="mt-1 text-sm text-slate-600">Keep the next post focused on one Study CTA.</p>
              </div>
              <a
                href="https://buffer.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-sm font-semibold text-[#1f4d3f] hover:underline"
              >
                Open Buffer
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            {socialMessage && <p className="mt-4 text-xs text-slate-500">{socialMessage}</p>}
            {socialPosts.length > 0 ? (
              <div className="mt-5 divide-y divide-slate-100">
                {socialPosts.slice(0, 5).map((post) => (
                  <div key={post.id} className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#1f4d3f]">
                        {post.platform} · {post.status}
                      </p>
                      <p className="mt-1 text-sm font-medium leading-6 text-slate-800">{post.hook}</p>
                    </div>
                    {post.ctaUrl && (
                      <a href={post.ctaUrl} target="_blank" rel="noreferrer" className="text-sm font-semibold text-[#1f4d3f] hover:underline">
                        {post.ctaLabel || "Open CTA"}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-md border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#1f4d3f]">
                  Today · {todayPlan.platform}
                </p>
                <p className="mt-1 text-sm font-medium text-slate-800">{todayPlan.hook}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {todayPlan.ctaLabel}. Use the primary Study link and keep the post to one clear next step.
                </p>
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
