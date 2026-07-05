'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ExternalLink,
  Mail,
  RefreshCw,
  Target,
  TrendingDown,
  Users,
} from 'lucide-react';

type LifecycleStage = {
  label: string;
  count: number;
  conversion: number;
  signal: string;
};

type LifecycleDropoff = {
  stage: string;
  count: number;
  nextAction: string;
};

type NurtureCandidate = {
  email: string;
  campaign_step: string;
  subject: string;
  age_days: number;
};

type AudienceSummary = {
  totalProfiles: number;
  includedProfiles: number;
  excludedProfiles: number;
  exclusionReasons: Record<string, number>;
};

type NurtureSummary = {
  fetchedAt: string;
  windowDays: number;
  lifecycle: {
    stages: LifecycleStage[];
    dropoffs: LifecycleDropoff[];
  };
  audience?: AudienceSummary;
  queue: {
    candidateCount: number;
    sendableCount: number;
    audience?: AudienceSummary | null;
    candidates: NurtureCandidate[];
  };
  events: {
    total: number;
    counts: Record<string, number>;
  };
  feedback: {
    total: number;
    reasonCounts: Record<string, number>;
  };
};

const sequenceEmails = [
  {
    day: 'Day 0',
    title: 'Finish Setup',
    subject: 'Your BCBA study plan is ready to set up',
    segment: 'New signup, free plan, onboarding incomplete',
    objective: 'Move the user from registered to activated.',
  },
  {
    day: 'Day 1',
    title: 'Baseline Diagnostic',
    subject: 'Find your highest-priority BCBA study area',
    segment: 'No diagnostic, no quiz, or onboarding incomplete',
    objective: 'Create the first useful product moment.',
  },
  {
    day: 'Day 3',
    title: 'Study Rhythm',
    subject: 'Try a 10-question BCBA study sprint today',
    segment: 'Free users with low question activity',
    objective: 'Start a repeatable habit loop.',
  },
  {
    day: 'Day 5',
    title: 'Show Value',
    subject: 'What Behavior Study Tools changes after your first sessions',
    segment: 'One practice action, no purchase',
    objective: 'Connect practice data to a useful study map.',
  },
  {
    day: 'Day 7',
    title: 'Upgrade Moment',
    subject: 'Ready for unlimited BCBA practice?',
    segment: 'Engaged free users with repeated product actions',
    objective: 'Convert only after value is clear.',
  },
];

const researchBackbone = [
  'Avoid heavy upfront tutorials; push the next useful action.',
  'Use contextual help and progressive disclosure instead of long tours.',
  'Sequence emails around Quick Win, Hook, and Conversion moments.',
  'Use spaced practice reminders to create a repeatable study habit.',
  'Measure dropoffs daily and adjust the next message or CTA.',
];

export default function BehaviorStudyToolsAdminPage() {
  const router = useRouter();
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [windowDays, setWindowDays] = useState(14);
  const [summary, setSummary] = useState<NurtureSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loadSummary = async (days = windowDays) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/.netlify/functions/behavior-study-tools-lifecycle?windowDays=${days}`);
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Unable to load lifecycle data');
      setSummary(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load lifecycle data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/auth');
        const payload = await response.json();
        if (!payload.authenticated) {
          router.push('/admin/login');
          return;
        }
        await loadSummary(windowDays);
      } finally {
        setLoadingAuth(false);
      }
    };

    void checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  useEffect(() => {
    if (!loadingAuth) void loadSummary(windowDays);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [windowDays]);

  const feedbackReasons = useMemo(
    () => Object.entries(summary?.feedback.reasonCounts || {}).sort((a, b) => b[1] - a[1]),
    [summary?.feedback.reasonCounts],
  );
  const exclusionReasons = useMemo(
    () => Object.entries(summary?.audience?.exclusionReasons || {}).sort((a, b) => b[1] - a[1]),
    [summary?.audience?.exclusionReasons],
  );

  if (loadingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">
            Behavior Study Tools
          </p>
          <h1 className="mt-1 text-3xl font-bold text-slate-950">
            Onboarding and nurture dashboard
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Daily view of signup activation, nurture queue, email sequence, and where users stall
            before purchase.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href="https://learning.behaviorschool.com/admin/behavior-study-tools"
            className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            target="_blank"
            rel="noreferrer"
          >
            Open detailed dashboard
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
          <a
            href="https://study.behaviorschool.com/auth?redirect=/onboarding/welcome"
            className="inline-flex items-center rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
            target="_blank"
            rel="noreferrer"
          >
            Test signup path
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard icon={Mail} label="Nurture emails" value="5" detail="Signup to purchase" />
        <MetricCard icon={Users} label="New registrations" value={String(summary?.lifecycle.stages?.[0]?.count ?? '...')} detail={`${windowDays}-day window`} />
        <MetricCard icon={Target} label="Queued candidates" value={String(summary?.queue.candidateCount ?? '...')} detail="Real users only" />
        <MetricCard icon={Users} label="Excluded QA/internal" value={String(summary?.audience?.excludedProfiles ?? '...')} detail="Removed from nurture" />
        <MetricCard icon={BarChart3} label="Feedback captured" value={String(summary?.feedback.total ?? '...')} detail="Why users stall" />
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-emerald-700" />
              <h2 className="text-lg font-semibold text-slate-950">Live lifecycle funnel</h2>
            </div>
            <p className="mt-1 text-sm text-slate-600">
              Last refresh: {summary?.fetchedAt ? new Date(summary.fetchedAt).toLocaleString() : 'Loading'}
            </p>
            {summary?.audience ? (
              <p className="mt-1 text-sm text-slate-600">
                Showing {summary.audience.includedProfiles} real profiles from {summary.audience.totalProfiles} loaded;
                {' '}{summary.audience.excludedProfiles} QA/internal profiles are excluded from nurture metrics.
              </p>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            {[7, 14, 30].map((days) => (
              <button
                key={days}
                type="button"
                onClick={() => setWindowDays(days)}
                className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                  windowDays === days
                    ? 'bg-emerald-700 text-white'
                    : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {days} days
              </button>
            ))}
            <button
              type="button"
              onClick={() => void loadSummary()}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {error ? (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-6">
          {(summary?.lifecycle.stages || []).map((stage) => (
            <div key={stage.label} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{stage.label}</p>
              <p className="mt-2 text-3xl font-bold text-slate-950">{stage.count}</p>
              <p className="mt-1 text-sm font-semibold text-emerald-700">{stage.conversion}% conversion</p>
              <p className="mt-2 text-xs leading-5 text-slate-600">{stage.signal}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-orange-600" />
            <h2 className="text-lg font-semibold text-slate-950">Dropoff diagnosis</h2>
          </div>
          <div className="mt-4 space-y-3">
            {(summary?.lifecycle.dropoffs || []).map((dropoff) => (
              <div key={dropoff.stage} className="rounded-lg border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-slate-950">{dropoff.stage}</h3>
                    <p className="mt-1 text-sm text-slate-600">{dropoff.nextAction}</p>
                  </div>
                  <span className="rounded-full bg-orange-50 px-3 py-1 text-sm font-bold text-orange-700">
                    {dropoff.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-emerald-700" />
            <h2 className="text-lg font-semibold text-slate-950">Nurture queue</h2>
          </div>
          <p className="mt-2 text-sm text-slate-600">
            {summary?.queue.sendableCount ?? 0} real users are currently sendable in dry-run mode.
          </p>
          <div className="mt-4 space-y-3">
            {(summary?.queue.candidates || []).slice(0, 8).map((candidate) => (
              <div key={`${candidate.email}-${candidate.campaign_step}`} className="rounded-lg bg-slate-50 p-3">
                <p className="text-sm font-semibold text-slate-950">{candidate.subject}</p>
                <p className="mt-1 text-xs text-slate-600">
                  {candidate.email} • {candidate.campaign_step} • {candidate.age_days}d old
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {exclusionReasons.length > 0 ? (
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-slate-600" />
            <h2 className="text-lg font-semibold text-slate-950">Audience quality guardrail</h2>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            QA, App Review, and internal accounts are removed before funnel, dropoff, and nurture
            queue calculations. This keeps daily adjustments focused on actual learners.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {exclusionReasons.map(([reason, count]) => (
              <div key={reason} className="rounded-lg bg-slate-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {reason.replaceAll('_', ' ')}
                </p>
                <p className="mt-1 text-2xl font-bold text-slate-950">{count}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-700" />
          <h2 className="text-lg font-semibold text-slate-950">Email sequence</h2>
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-5">
          {sequenceEmails.map((email) => (
            <div key={email.day} className="rounded-lg border border-slate-200 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">{email.day}</p>
              <h3 className="mt-2 font-semibold text-slate-950">{email.title}</h3>
              <p className="mt-2 text-sm font-medium text-slate-700">{email.subject}</p>
              <p className="mt-3 text-xs leading-5 text-slate-600">{email.segment}</p>
              <p className="mt-3 text-xs leading-5 text-slate-500">{email.objective}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Why users say they stall</h2>
          <div className="mt-4 space-y-2">
            {feedbackReasons.length > 0 ? feedbackReasons.map(([reason, count]) => (
              <div key={reason} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
                <span className="font-medium text-slate-700">{reason.replaceAll('_', ' ')}</span>
                <span className="font-bold text-slate-950">{count}</span>
              </div>
            )) : (
              <p className="text-sm text-slate-600">No feedback has been captured yet.</p>
            )}
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Daily operating loop</h2>
          <ul className="mt-4 space-y-2">
            {researchBackbone.map((item) => (
              <li key={item} className="flex gap-2 text-sm leading-6 text-slate-700">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-700" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <Icon className="h-5 w-5 text-emerald-700" />
        <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
          Live
        </span>
      </div>
      <p className="mt-4 text-sm font-medium text-slate-600">{label}</p>
      <p className="mt-1 text-3xl font-bold text-slate-950">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{detail}</p>
    </div>
  );
}
