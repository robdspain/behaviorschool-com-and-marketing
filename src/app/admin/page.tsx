"use client";

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CalendarDays,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LifeBuoy,
  Mail,
  Megaphone,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export const dynamic = "force-dynamic";

type DashboardStats = {
  weekSubmissions: number;
  activeTemplates: number;
  totalDownloads: number;
};

type AdminLink = {
  label: string;
  description: string;
  href: string;
  icon: typeof LayoutDashboard;
};

type AdminGroup = {
  title: string;
  description: string;
  links: AdminLink[];
};

const nextActions: AdminLink[] = [
  {
    label: "Review discovery calls",
    description: "Work the next follow-up in the Transformation pipeline.",
    href: "/admin/crm/discovery-calls",
    icon: ClipboardList,
  },
  {
    label: "Check support inbox",
    description: "Resolve customer questions, feedback, and bugs.",
    href: "/admin/support",
    icon: LifeBuoy,
  },
  {
    label: "Plan Study content",
    description: "Choose the next funnel link and social slot.",
    href: "/admin/behavior-study-tools-marketing",
    icon: Megaphone,
  },
];

const adminGroups: AdminGroup[] = [
  {
    title: "Study",
    description: "Behavior Study Tools, nurture, and research distribution.",
    links: [
      {
        label: "Study marketing",
        description: "Funnel links, tracking snapshot, and this week’s social slot.",
        href: "/admin/behavior-study-tools-marketing",
        icon: Megaphone,
      },
      {
        label: "Study tools nurture",
        description: "Review the Behavior Study Tools email sequence.",
        href: "/admin/behavior-study-tools",
        icon: BookOpen,
      },
      {
        label: "Weekly Research Brief",
        description: "Manage drafts, subscribers, delivery, and follow-up.",
        href: "/admin/newsletter",
        icon: Mail,
      },
    ],
  },
  {
    title: "Transformation",
    description: "Applications, sales pipeline, calls, and access.",
    links: [
      {
        label: "Transformation funnel",
        description: "Review documented consent, audience readiness, and pipeline.",
        href: "/admin/transformation-marketing",
        icon: BarChart3,
      },
      {
        label: "CRM",
        description: "Manage contacts, deals, and tasks.",
        href: "/admin/crm",
        icon: Users,
      },
      {
        label: "Discovery calls",
        description: "Schedule and complete follow-up work.",
        href: "/admin/crm/discovery-calls",
        icon: ClipboardList,
      },
      {
        label: "Checkout access",
        description: "Manage invitation and checkout access records.",
        href: "/admin/checkout-access",
        icon: ShieldCheck,
      },
      {
        label: "Submissions",
        description: "Review incoming forms and applications.",
        href: "/admin/submissions",
        icon: FileText,
      },
      {
        label: "School BCBA survey",
        description: "Review the current survey response workspace.",
        href: "/admin/school-bcba-survey",
        icon: Search,
      },
    ],
  },
  {
    title: "Content",
    description: "Plan, publish, and maintain public content.",
    links: [
      {
        label: "Blog",
        description: "Edit Ghost posts and review the public content queue.",
        href: "/admin/content",
        icon: FileText,
      },
      {
        label: "Content calendar",
        description: "Plan social posts and content work.",
        href: "/admin/content-calendar",
        icon: CalendarDays,
      },
      {
        label: "Email marketing",
        description: "Manage product sequences, templates, and queues.",
        href: "/admin/email-marketing",
        icon: Mail,
      },
      {
        label: "Videos",
        description: "Review and organize video content.",
        href: "/admin/videos",
        icon: BookOpen,
      },
      {
        label: "Presentations",
        description: "Create and manage presentation drafts.",
        href: "/admin/presentations",
        icon: LayoutDashboard,
      },
      {
        label: "Publishing standards",
        description: "Check evidence, claims, and release readiness.",
        href: "/admin/publishing-standards",
        icon: ShieldCheck,
      },
    ],
  },
  {
    title: "Support",
    description: "Keep customer requests visible and moving.",
    links: [
      {
        label: "Support inbox",
        description: "Review feedback, bugs, and customer questions.",
        href: "/admin/support",
        icon: LifeBuoy,
      },
    ],
  },
  {
    title: "Ops",
    description: "Operational tools and specialized workspaces.",
    links: [
      {
        label: "ACE",
        description: "Manage continuing education events and providers.",
        href: "/admin/ace",
        icon: ClipboardList,
      },
      {
        label: "Masterclass",
        description: "Manage course sections, questions, and resources.",
        href: "/admin/masterclass",
        icon: BookOpen,
      },
      {
        label: "Sitemap",
        description: "Review indexable routes and sitemap controls.",
        href: "/admin/sitemap",
        icon: Settings,
      },
    ],
  },
];

function Metric({
  label,
  value,
  detail,
}: {
  label: string;
  value: number;
  detail: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <p className="text-sm font-medium text-slate-600">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-slate-950">
        {value.toLocaleString()}
      </p>
      <p className="mt-2 text-xs leading-5 text-slate-500">{detail}</p>
    </div>
  );
}

function LinkCard({ item }: { item: AdminLink }) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className="group flex min-h-24 items-start gap-3 rounded-lg border border-slate-200 bg-white p-4 transition hover:border-emerald-300 hover:shadow-sm"
    >
      <span className="flex h-9 w-9 flex-none items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2 text-sm font-semibold text-slate-900">
          {item.label}
          <ArrowRight className="h-4 w-4 flex-none text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-emerald-700" />
        </span>
        <span className="mt-1 block text-xs leading-5 text-slate-600">
          {item.description}
        </span>
      </span>
    </Link>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStats = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/dashboard-stats", {
        cache: "no-store",
        credentials: "same-origin",
      });
      const payload = (await response.json()) as {
        success?: boolean;
        stats?: DashboardStats;
      };

      if (!response.ok || payload.success !== true || !payload.stats) {
        throw new Error("Metrics are temporarily unavailable.");
      }

      setStats(payload.stats);
    } catch {
      setStats(null);
      setError("Metrics are temporarily unavailable. The workspaces remain available below.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = "Admin | Behavior School";
    void loadStats();
  }, [loadStats]);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="border-b border-slate-200 pb-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-800">
            Behavior School operations
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950">Admin home</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Start with the next action, then open the workspace that owns the work.
          </p>
        </header>

        <section className="mt-8" aria-labelledby="next-actions-heading">
          <div className="mb-4">
            <h2 id="next-actions-heading" className="text-lg font-semibold text-slate-950">
              Next actions
            </h2>
            <p className="mt-1 text-sm text-slate-600">The shortest path to today’s operator work.</p>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {nextActions.map((item) => (
              <LinkCard key={item.href} item={item} />
            ))}
          </div>
        </section>

        <section className="mt-8" aria-labelledby="metrics-heading">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="metrics-heading" className="text-lg font-semibold text-slate-950">
                Working signals
              </h2>
              <p className="mt-1 text-sm text-slate-600">Current totals from the admin reporting API.</p>
            </div>
            <button
              type="button"
              onClick={() => void loadStats()}
              disabled={loading}
              className="inline-flex min-h-10 items-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-wait disabled:opacity-60"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-3" aria-busy="true">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-32 animate-pulse rounded-lg border border-slate-200 bg-white" />
              ))}
            </div>
          ) : stats ? (
            <div className="grid gap-4 sm:grid-cols-3">
              <Metric label="Submissions this week" value={stats.weekSubmissions} detail="New form submissions in the last seven days." />
              <Metric label="Active email templates" value={stats.activeTemplates} detail="Templates currently available to the email system." />
              <Metric label="Lead-magnet downloads" value={stats.totalDownloads} detail="All-time downloads reported by Convex." />
            </div>
          ) : (
            <p className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600" role="status">
              {error}
            </p>
          )}
        </section>

        <div className="mt-10 space-y-10">
          {adminGroups.map((group) => (
            <section key={group.title} aria-labelledby={`${group.title.toLowerCase()}-heading`}>
              <div className="mb-4">
                <h2 id={`${group.title.toLowerCase()}-heading`} className="text-lg font-semibold text-slate-950">
                  {group.title}
                </h2>
                <p className="mt-1 text-sm text-slate-600">{group.description}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {group.links.map((item) => (
                  <LinkCard key={item.href} item={item} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
