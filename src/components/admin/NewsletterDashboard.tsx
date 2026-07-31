import { useEffect, useMemo, useState } from "react";
import { useAction, useMutation, useQuery } from "convex/react";
import Link from "next/link";
import {
  BadgeCheck,
  FilePlus2,
  Globe2,
  MailCheck,
  Radar,
  Send,
  ShieldCheck,
} from "lucide-react";
import { api } from "../../../convex/_generated/api";

type Readiness = {
  totalContacts: number;
  safeWeeklyRecipients: number;
  needsConsent: number;
  excluded: number;
  codexTests: number;
  newsletterTagged: number;
  confirmedNewsletter: number;
  pendingNewsletter: number;
};

type NewsletterIssue = {
  _id: string;
  issueKey: string;
  subject: string;
  preheader?: string;
  status: "draft" | "approved" | "scheduled" | "sent" | "failed";
  recipientSegment: string;
  topicTitle?: string;
  topicRationale?: string;
  ctaKind?: string;
  ctaUrl?: string;
  generationError?: string;
  previewSentAt?: number;
  approvedAt?: number;
  sentAt?: number;
  recipientCount?: number;
  socialDraftCount?: number;
  socialReviewedCount?: number;
  socialPublishedCount?: number;
  archiveBuildTriggeredAt?: number;
  archiveVerifiedAt?: number;
  archiveVerificationError?: string;
  createdAt: number;
};

type ArticleSelection = {
  _id: string;
  title?: string;
  authors?: string;
  year?: string;
  journal?: string;
  summary: string;
  schoolBcbaUse: string;
  tryThis: string;
  paperUrl?: string;
  sourcePdf?: string;
  fullTextUrl?: string;
  apaCitation?: string;
};

type IssueBundle = {
  issue: NewsletterIssue & { html: string; text: string };
  articles: ArticleSelection[];
};

type TopicRecommendation = {
  _id: string;
  topic: string;
  searchQuery: string;
  rationale: string;
  schoolBcbaProblem: string;
  ctaKind?: string;
  score: number;
  signalCount: number;
  status: "draft" | "selected" | "used";
};

type TopicSignal = {
  _id: string;
  source: string;
  sourceName: string;
  sourceUrl?: string;
  title: string;
  excerpt: string;
  theme: string;
  weight: number;
  capturedAt: number;
};

type NewsletterCta = {
  _id: string;
  label: string;
  kind: string;
  headline: string;
  url: string;
  active: boolean;
  priority: number;
};

type NewsletterFeedbackSummary = {
  total: number;
  averageRating: number | null;
  ratings: Array<{ rating: number; count: number }>;
  suggestions: string[];
  recent: Array<{
    _id: string;
    issueKey: string;
    rating: number;
    mostUseful?: string;
    improvement?: string;
    topicSuggestion?: string;
    createdAt: number;
  }>;
};

type AudienceSegment = {
  key: string;
  label: string;
  description: string;
  eligible: number;
};

type NewsletterSocialPost = {
  _id: string;
  platform: "linkedin" | "instagram" | "facebook";
  body: string;
  archiveUrl: string;
  ctaUrl?: string;
  status: "draft" | "reviewed" | "needs_review" | "needs_media" | "ready" | "queued" | "published" | "metrics_due";
  publishedUrl?: string;
  mediaUrl?: string;
  mediaAltText?: string;
  mediaBrief?: string;
  generatedAt: number;
  reviewedAt?: number;
  publishedAt?: number;
  impressions?: number;
  reactions?: number;
  comments?: number;
  shares?: number;
  linkClicks?: number;
  updatedAt: number;
};

type OptimizationBrief = {
  sentIssues: number;
  delivered: number;
  opened: number;
  clicked: number;
  openRate: number | null;
  clickRate: number | null;
  averageRating: number | null;
  publishedPosts: number;
  socialMetricsCaptured: number;
  totalImpressions: number;
  totalEngagements: number;
  totalSocialClicks: number;
  recommendations: string[];
};

type OperationalHealth = { healthy: boolean; alerts: Array<{ level: "attention" | "blocked"; message: string }> };
type ChannelReadiness = { channel: "linkedin" | "instagram" | "youtube"; apiKeyConfigured: boolean; channelConfigured: boolean; connection: "unverified" | "missing_configuration"; publishing: "text_draft" | "media_required" | "shorts_comments_only"; ready: boolean };

type YouTubeEpisode = {
  _id: string;
  title: string;
  description: string;
  outline: string;
  thumbnailBrief: string;
  ctaUrl: string;
  studioUrl?: string;
  videoUrl?: string;
  youtubeVideoId?: string;
  status: "needs_review" | "ready_for_studio" | "uploaded" | "published" | "metrics_due";
  shortClipConcepts: Array<{ title: string; hook: string; durationSeconds: number }>;
};

const newsletterApi = (api as any).weeklyNewsletter;
const topicApi = (api as any).weeklyTopicRecommendations;
const revenueApi = (api as any).contentRevenue;
const bufferApi = (api as any).bufferSocial;

function formatDate(value?: number) {
  if (!value) return "Not yet";
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function statusClasses(status: NewsletterIssue["status"]) {
  switch (status) {
    case "approved":
    case "scheduled":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    case "sent":
      return "bg-blue-50 text-blue-700 ring-blue-200";
    case "failed":
      return "bg-red-50 text-red-700 ring-red-200";
    default:
      return "bg-amber-50 text-amber-700 ring-amber-200";
  }
}

function AdminStat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow p-5">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
      {hint && <p className="mt-1 text-sm text-slate-500">{hint}</p>}
    </div>
  );
}

export function AdminNewsletterPage() {
  const [selectedIssueId, setSelectedIssueId] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [busyAction, setBusyAction] = useState<string>("");
  const [editor, setEditor] = useState({ subject: "", preheader: "", html: "", text: "", ctaKind: "", ctaUrl: "" });
  const [scheduleAt, setScheduleAt] = useState("");
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [recipientSegment, setRecipientSegment] = useState("all-confirmed");
  const [healthCheckAt] = useState(() => Date.now());
  const [articleEdits, setArticleEdits] = useState<Record<string, { apaCitation: string; fullTextUrl: string; summary: string; schoolBcbaUse: string; tryThis: string }>>({});
  const [socialEdits, setSocialEdits] = useState<Record<string, { body: string; archiveUrl: string; ctaUrl: string; mediaUrl: string; mediaAltText: string; status: NewsletterSocialPost["status"]; publishedUrl: string; impressions: string; reactions: string; comments: string; shares: string; linkClicks: string }>>({});

  const readiness = useQuery(newsletterApi.subscriberReadiness, {}) as
    | Readiness
    | undefined;
  const issues = useQuery(newsletterApi.listIssues, { limit: 12 }) as
    | NewsletterIssue[]
    | undefined;
  const issueBundle = useQuery(
    newsletterApi.getIssue,
    selectedIssueId ? { issueId: selectedIssueId as any } : "skip"
  ) as IssueBundle | undefined | null;
  const recommendations = useQuery(topicApi.listRecommendations, {
    limit: 8,
  }) as TopicRecommendation[] | undefined;
  const signals = useQuery(topicApi.listSignals, { limit: 30 }) as
    | TopicSignal[]
    | undefined;
  const ctas = useQuery(newsletterApi.listCtas, { activeOnly: true }) as
    | NewsletterCta[]
    | undefined;
  const feedback = useQuery(newsletterApi.feedbackSummary, { limit: 40 }) as
    | NewsletterFeedbackSummary
    | undefined;
  const analytics = useQuery(newsletterApi.issueAnalytics, selectedIssueId ? { issueId: selectedIssueId as any } : "skip") as any;
  const optimization = useQuery(newsletterApi.optimizationBrief, {}) as OptimizationBrief | undefined;
  const operationalHealth = useQuery(newsletterApi.operationalHealth, { now: healthCheckAt }) as OperationalHealth | undefined;
  const channelReadiness = useQuery(bufferApi.channelReadinessFromAdmin, {}) as ChannelReadiness[] | undefined;
  const audience = useQuery(newsletterApi.audienceSummary, {}) as AudienceSegment[] | undefined;
  const socialPosts = (useQuery(
    newsletterApi.listSocialPostsForIssue,
    selectedIssueId ? { issueId: selectedIssueId as any } : "skip"
  ) as NewsletterSocialPost[] | undefined) ?? [];
  const episode = (useQuery(
    revenueApi.getVideoForIssueFromAdmin,
    selectedIssueId ? { issueId: selectedIssueId as any } : "skip"
  ) as YouTubeEpisode | null | undefined) ?? null;

  const generateRadar = useAction(topicApi.generateWeeklyRecommendationsFromAdmin);
  const selectRecommendation = useMutation(topicApi.selectRecommendationFromAdmin);
  const createDraft = useAction(newsletterApi.createWeeklyDraftFromAdmin);
  const sendPreview = useAction(newsletterApi.sendPreviewFromAdmin);
  const approveIssue = useMutation(newsletterApi.approveIssueFromAdmin);
  const updateIssue = useMutation(newsletterApi.updateIssueFromAdmin);
  const updateArticle = useMutation(newsletterApi.updateArticleFromAdmin);
  const sendApprovedIssue = useAction(newsletterApi.sendApprovedIssueFromAdmin);
  const publishAndVerifyArchive = useAction(newsletterApi.publishAndVerifyArchiveFromAdmin);
  const updateSocialPost = useMutation(newsletterApi.updateSocialPostFromAdmin);
  const createYouTubeEpisode = useAction(revenueApi.createEpisodeForIssueFromAdmin);
  const updateYouTubeEpisode = useMutation(revenueApi.updateVideoFromAdmin);
  const selectedIssue = issueBundle?.issue;

  useEffect(() => {
    if (!selectedIssueId && issues?.length) {
      setSelectedIssueId(issues[0]._id);
    }
  }, [issues, selectedIssueId]);

  useEffect(() => {
    if (selectedIssue) {
      setEditor({ subject: selectedIssue.subject, preheader: selectedIssue.preheader ?? "", html: selectedIssue.html, text: selectedIssue.text, ctaKind: selectedIssue.ctaKind ?? "", ctaUrl: selectedIssue.ctaUrl ?? "" });
    }
  }, [selectedIssueId, selectedIssue]);

  useEffect(() => {
    if (!socialPosts) return;
    setSocialEdits(
      Object.fromEntries(
        socialPosts.map((post) => [post._id, {
          body: post.body,
          archiveUrl: post.archiveUrl,
          ctaUrl: post.ctaUrl ?? "",
          mediaUrl: post.mediaUrl ?? "",
          mediaAltText: post.mediaAltText ?? "",
          status: post.status,
          publishedUrl: post.publishedUrl ?? "",
          impressions: post.impressions?.toString() ?? "",
          reactions: post.reactions?.toString() ?? "",
          comments: post.comments?.toString() ?? "",
          shares: post.shares?.toString() ?? "",
          linkClicks: post.linkClicks?.toString() ?? "",
        }])
      )
    );
  }, [selectedIssueId, socialPosts]);

  const selectedRecommendation = useMemo(
    () => recommendations?.find((item) => item.status === "selected") ?? recommendations?.[0],
    [recommendations]
  );
  const activeCtaLabel = useMemo(() => {
    if (!selectedIssue?.ctaKind) return ctas?.[0]?.label ?? "Default CTA";
    return ctas?.find((cta) => cta.kind === selectedIssue.ctaKind)?.label ?? selectedIssue.ctaKind;
  }, [ctas, selectedIssue?.ctaKind]);

  const runAction = async (label: string, action: () => Promise<unknown>) => {
    setBusyAction(label);
    setMessage("");
    try {
      const result = await action();
      setMessage(`${label} completed.`);
      return result;
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      setMessage(`${label} failed: ${detail}`);
      return null;
    } finally {
      setBusyAction("");
    }
  };

  const handleGenerateRadar = async () => {
    await runAction("Topic radar", () =>
      generateRadar({ includePublicForums: true })
    );
  };

  const handleCreateDraft = async () => {
    const result = (await runAction("Draft generation", () =>
      createDraft({
        recipientSegment,
        ctaKind: selectedRecommendation?.ctaKind,
      })
    )) as { issueId?: string } | null;
    if (result?.issueId) setSelectedIssueId(result.issueId);
  };

  const handleSendPreview = async () => {
    if (!selectedIssueId) return;
    await runAction("Preview send", () =>
      sendPreview({ issueId: selectedIssueId as any })
    );
  };

  const handleApprove = async () => {
    if (!selectedIssueId) return;
    const scheduledFor = scheduleAt ? new Date(scheduleAt).getTime() : undefined;
    if (scheduledFor && (Number.isNaN(scheduledFor) || scheduledFor <= Date.now())) {
      setMessage("Choose a future Pacific send time.");
      return;
    }
    await runAction(scheduledFor ? "Schedule" : "Approval", () => approveIssue({ issueId: selectedIssueId as any, scheduledFor }));
  };

  const handleSaveDraft = async () => {
    if (!selectedIssueId) return;
    await runAction("Draft save", () => updateIssue({ issueId: selectedIssueId as any, ...editor }));
  };

  const handleSaveArticle = async (article: ArticleSelection) => {
    const edit = articleEdits[article._id] ?? { apaCitation: article.apaCitation ?? "", fullTextUrl: article.fullTextUrl ?? article.paperUrl ?? article.sourcePdf ?? "", summary: article.summary, schoolBcbaUse: article.schoolBcbaUse, tryThis: article.tryThis };
    await runAction("Research source save", () => updateArticle({ articleId: article._id as any, ...edit }));
  };

  const handleSendApproved = async () => {
    if (!selectedIssueId || !selectedIssue) return;
    const recipients = audience?.find((segment) => segment.key === selectedIssue.recipientSegment)?.eligible ?? 0;
    const confirmed = window.confirm(
      `Send "${selectedIssue.subject}" to ${recipients} confirmed newsletter recipient${recipients === 1 ? "" : "s"}?`
    );
    if (!confirmed) return;
    await runAction("Newsletter send", () =>
      sendApprovedIssue({ issueId: selectedIssueId as any })
    );
  };

  const handlePublishArchive = async () => {
    if (!selectedIssueId) return;
    await runAction("Publish and verify public page", () =>
      publishAndVerifyArchive({ issueId: selectedIssueId as any })
    );
  };

  const handleSaveSocialPost = async (post: NewsletterSocialPost) => {
    const edit = socialEdits[post._id] ?? {
      body: post.body,
      archiveUrl: post.archiveUrl,
      ctaUrl: post.ctaUrl ?? "",
      mediaUrl: post.mediaUrl ?? "",
      mediaAltText: post.mediaAltText ?? "",
      status: post.status,
      publishedUrl: post.publishedUrl ?? "",
      impressions: post.impressions?.toString() ?? "",
      reactions: post.reactions?.toString() ?? "",
      comments: post.comments?.toString() ?? "",
      shares: post.shares?.toString() ?? "",
      linkClicks: post.linkClicks?.toString() ?? "",
    };
    await runAction(`${post.platform} social draft save`, () =>
      updateSocialPost({
        postId: post._id as any,
        body: edit.body,
        archiveUrl: edit.archiveUrl,
        ctaUrl: edit.ctaUrl || undefined,
        mediaUrl: edit.mediaUrl || undefined,
        mediaAltText: edit.mediaAltText || undefined,
        status: edit.status,
        publishedUrl: edit.publishedUrl || undefined,
        impressions: edit.impressions === "" ? undefined : Number(edit.impressions),
        reactions: edit.reactions === "" ? undefined : Number(edit.reactions),
        comments: edit.comments === "" ? undefined : Number(edit.comments),
        shares: edit.shares === "" ? undefined : Number(edit.shares),
        linkClicks: edit.linkClicks === "" ? undefined : Number(edit.linkClicks),
      })
    );
  };

  const handleCreateYouTubeEpisode = async () => {
    if (!selectedIssueId) return;
    await runAction("YouTube episode package", () => createYouTubeEpisode({ issueId: selectedIssueId as any }));
  };

  const handleReadyYouTubeEpisode = async () => {
    if (!episode) return;
    await runAction("YouTube Studio handoff", () => updateYouTubeEpisode({
      videoId: episode._id as any,
      title: episode.title,
      description: episode.description,
      outline: episode.outline,
      thumbnailBrief: episode.thumbnailBrief,
      ctaUrl: episode.ctaUrl,
      studioUrl: episode.studioUrl || "https://studio.youtube.com/",
      videoUrl: episode.videoUrl,
      youtubeVideoId: episode.youtubeVideoId,
      status: "ready_for_studio",
    }));
  };

  const isLoading =
    readiness === undefined ||
    issues === undefined ||
    recommendations === undefined ||
    signals === undefined ||
    ctas === undefined ||
    feedback === undefined ||
    optimization === undefined ||
    operationalHealth === undefined ||
    channelReadiness === undefined ||
    audience === undefined;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading newsletter controls...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">
                Newsletter workspace
              </p>
              <p className="truncate text-xs text-slate-500">Behavior School</p>
            </div>
          </div>
          <Link
            href="/admin"
            className="inline-flex h-9 items-center rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Admin dashboard
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Newsletter QC
            </h1>
            <p className="text-slate-600">
              Review Tuesday topic radar, draft the weekly research email, send a preview, then approve the final send.
            </p>
          </div>
        </div>

        <nav
          aria-label="Newsletter workspace sections"
          className="sticky top-0 z-20 -mx-4 mb-6 overflow-x-auto border-y border-slate-200 bg-white/95 px-4 shadow-sm backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
        >
          <div className="mx-auto flex h-12 max-w-7xl min-w-max items-center gap-1">
            {[
              ["Workflow", "#workflow"],
              ["Topic radar", "#topic-radar"],
              ["Draft and issues", "#draft"],
              ["Audience", "#audience"],
              ["Performance", "#performance"],
              ["Distribution", "#distribution"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950"
              >
                {label}
              </a>
            ))}
          </div>
        </nav>

        {message && (
          <div className="mb-6 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 mb-6">
          <AdminStat
            label="Confirmed Recipients"
            value={readiness.safeWeeklyRecipients}
            hint={`${readiness.confirmedNewsletter} confirmed, ${readiness.pendingNewsletter} pending`}
          />
          <AdminStat
            label="Needs Consent"
            value={readiness.needsConsent}
            hint={`${readiness.newsletterTagged} newsletter-tagged contacts`}
          />
          <AdminStat
            label="Latest Issue"
            value={issues[0]?.status ?? "None"}
            hint={issues[0]?.subject ?? "No draft has been created yet"}
          />
          <AdminStat
            label="Active CTAs"
            value={ctas.length}
            hint={ctas[0]?.headline ?? "Seed CTAs before first send"}
          />
        </div>

        <div id="performance" className="scroll-mt-16 bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Next-Issue Performance Brief</h2>
              <p className="mt-1 text-sm text-slate-600">The next draft uses this evidence when there is enough delivery data. Social totals are entered after manual publishing.</p>
            </div>
            <p className="text-sm text-slate-600">{optimization.sentIssues} sent issue{optimization.sentIssues === 1 ? "" : "s"} analyzed</p>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            <div className="rounded-md bg-slate-50 p-3"><p className="text-slate-500">Open rate</p><p className="font-semibold">{optimization.openRate === null ? "--" : `${(optimization.openRate * 100).toFixed(1)}%`}</p></div>
            <div className="rounded-md bg-slate-50 p-3"><p className="text-slate-500">Click rate</p><p className="font-semibold">{optimization.clickRate === null ? "--" : `${(optimization.clickRate * 100).toFixed(1)}%`}</p></div>
            <div className="rounded-md bg-slate-50 p-3"><p className="text-slate-500">Social reach</p><p className="font-semibold">{optimization.totalImpressions || "--"}</p></div>
            <div className="rounded-md bg-slate-50 p-3"><p className="text-slate-500">Social link clicks</p><p className="font-semibold">{optimization.totalSocialClicks || "--"}</p></div>
          </div>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            {optimization.recommendations.map((recommendation) => <li key={recommendation} className="rounded-md border border-slate-200 px-3 py-2">{recommendation}</li>)}
          </ul>
        </div>

        {operationalHealth && !operationalHealth.healthy && (
          <section className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <h2 className="text-sm font-semibold text-amber-950">Weekly operations need attention</h2>
            <ul className="mt-2 space-y-1 text-sm text-amber-900">{operationalHealth.alerts.map((alert) => <li key={alert.message}>{alert.level === "blocked" ? "Blocked: " : "Attention: "}{alert.message}</li>)}</ul>
          </section>
        )}

        <section id="distribution" className="scroll-mt-16 mb-6 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-slate-900">Distribution channels</h2>
          <p className="mt-1 text-sm text-slate-600">Connection configuration is separate from approval. No channel is automatically ready to publish.</p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {channelReadiness.map((channel) => <div key={channel.channel} className="rounded-md border border-slate-200 p-3"><p className="font-medium capitalize text-slate-900">{channel.channel}</p><p className="mt-1 text-xs text-slate-600">{channel.publishing.replace(/_/g, " ")}</p><p className={`mt-2 text-xs font-medium ${channel.connection === "missing_configuration" ? "text-red-700" : "text-amber-700"}`}>{channel.connection === "missing_configuration" ? "Configuration missing" : "Connection needs verification"}</p><p className="mt-1 text-xs text-slate-500">{channel.channel === "linkedin" ? "Requires reviewed copy before a Buffer draft." : channel.channel === "instagram" ? "Requires approved media and alt text before Buffer." : "Long-form upload stays in YouTube Studio."}</p></div>)}
          </div>
        </section>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Reader Feedback</h2>
              <p className="mt-1 text-sm text-slate-600">
                Review this before creating the next draft. Suggestions are based on issue-specific responses.
              </p>
            </div>
            <div className="text-sm text-slate-600">
              {feedback.total === 0
                ? "No responses yet"
                : `${feedback.total} response${feedback.total === 1 ? "" : "s"} · ${feedback.averageRating}/5 average`}
            </div>
          </div>

          {feedback.total > 0 && (
            <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold text-slate-800">Suggested adjustments</h3>
                <ul className="mt-2 space-y-2 text-sm text-slate-700">
                  {feedback.suggestions.map((suggestion) => (
                    <li key={suggestion} className="rounded-md bg-slate-50 px-3 py-2">{suggestion}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-800">Rating distribution</h3>
                <div className="mt-3 flex gap-2">
                  {feedback.ratings.map((item) => (
                    <div key={item.rating} className="min-w-12 rounded-md border border-slate-200 px-2 py-2 text-center">
                      <p className="text-sm font-semibold text-slate-900">{item.rating}/5</p>
                      <p className="text-xs text-slate-500">{item.count}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {feedback.recent.length > 0 && (
            <div className="mt-5 border-t border-slate-100 pt-5">
              <h3 className="text-sm font-semibold text-slate-800">Recent responses</h3>
              <div className="mt-3 space-y-3">
                {feedback.recent.map((item) => (
                  <div key={item._id} className="rounded-md border border-slate-200 p-3 text-sm text-slate-700">
                    <p className="font-medium text-slate-900">{item.issueKey} · {item.rating}/5</p>
                    {item.mostUseful && <p className="mt-1"><span className="font-medium">Useful:</span> {item.mostUseful}</p>}
                    {item.improvement && <p className="mt-1"><span className="font-medium">Change:</span> {item.improvement}</p>}
                    {item.topicSuggestion && <p className="mt-1"><span className="font-medium">Topic:</span> {item.topicSuggestion}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div id="audience" className="scroll-mt-16 bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Audience</h2>
              <p className="mt-1 text-sm text-slate-600">Only contacts with confirmed newsletter consent are eligible. District addresses and test contacts remain excluded.</p>
            </div>
            <label className="text-sm font-medium text-slate-700">Draft audience<select value={recipientSegment} onChange={(event) => setRecipientSegment(event.target.value)} className="ml-2 rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm"><option value="all-confirmed">All confirmed</option>{audience.filter((segment) => segment.key !== "all-confirmed").map((segment) => <option key={segment.key} value={segment.key}>{segment.label}</option>)}</select></label>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {audience.map((segment) => <div key={segment.key} className={`rounded-md border p-3 ${recipientSegment === segment.key ? "border-primary bg-primary/5" : "border-slate-200"}`}><p className="text-sm font-semibold text-slate-900">{segment.label}</p><p className="mt-1 text-2xl font-bold text-slate-900">{segment.eligible}</p><p className="mt-1 text-xs text-slate-500">{segment.description}</p></div>)}
          </div>
        </div>

        <div id="workflow" className="scroll-mt-16 bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Weekly Workflow
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Tuesday automation can generate the draft, but the send stays under human review.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleGenerateRadar}
                disabled={Boolean(busyAction)}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
              >
                <Radar className="h-4 w-4" aria-hidden="true" />
                Generate Radar
              </button>
              <button
                onClick={handleCreateDraft}
                disabled={Boolean(busyAction)}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
              >
                <FilePlus2 className="h-4 w-4" aria-hidden="true" />
                Create Draft
              </button>
              <button
                onClick={handleSendPreview}
                disabled={Boolean(busyAction) || !selectedIssueId}
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                <MailCheck className="h-4 w-4" aria-hidden="true" />
                Send Preview
              </button>
              <button
                onClick={handleApprove}
                disabled={Boolean(busyAction) || !selectedIssueId || selectedIssue?.status === "sent"}
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-emerald-300 bg-emerald-50 px-4 text-sm font-medium text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"
              >
                <BadgeCheck className="h-4 w-4" aria-hidden="true" />
                Approve
              </button>
              <button
                onClick={handlePublishArchive}
                disabled={Boolean(busyAction) || !selectedIssueId || !selectedIssue || !["approved", "scheduled", "sent"].includes(selectedIssue.status)}
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-sky-300 bg-sky-50 px-4 text-sm font-medium text-sky-800 hover:bg-sky-100 disabled:opacity-50"
              >
                <Globe2 className="h-4 w-4" aria-hidden="true" />
                Publish & Verify Page
              </button>
              <button
                onClick={handleSendApproved}
                disabled={
                  Boolean(busyAction) ||
                  !selectedIssueId ||
                  !selectedIssue ||
                  !["approved", "scheduled"].includes(selectedIssue.status) ||
                  !selectedIssue.archiveVerifiedAt ||
                  (audience?.find((segment) => segment.key === selectedIssue.recipientSegment)?.eligible ?? 0) < 1
                }
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
                Send Approved
              </button>
            </div>
          </div>
          {busyAction && (
            <p className="mt-4 text-sm text-slate-500">{busyAction} is running...</p>
          )}
          {selectedIssue && ["approved", "scheduled"].includes(selectedIssue.status) && (
            <p className={`mt-3 text-sm ${selectedIssue.archiveVerifiedAt ? "text-emerald-700" : selectedIssue.archiveVerificationError ? "text-red-700" : "text-slate-600"}`}>
              {selectedIssue.archiveVerifiedAt
                ? `Public issue verified ${formatDate(selectedIssue.archiveVerifiedAt)}. Subscriber delivery is enabled.`
                : selectedIssue.archiveVerificationError
                  ? `Public issue needs attention: ${selectedIssue.archiveVerificationError}`
                  : selectedIssue.archiveBuildTriggeredAt
                    ? "Public issue is publishing. Delivery remains blocked until the exact RobSpain page verifies."
                    : "Publish and verify the public issue before subscriber delivery."}
            </p>
          )}
        </div>

        <div id="topic-radar" className="scroll-mt-16 grid grid-cols-1 gap-6 xl:grid-cols-3 mb-6">
          <div className="xl:col-span-2 bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900">
                Topic Radar
              </h2>
              <span className="text-sm text-slate-500">
                {recommendations.length} recommendations
              </span>
            </div>
            <div className="space-y-3">
              {recommendations.length === 0 && (
                <p className="text-sm text-slate-500">
                  Generate the radar to pull current school BCBA topic signals.
                </p>
              )}
              {recommendations.map((item) => (
                <div
                  key={item._id}
                  className="rounded-lg border border-slate-200 p-4"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-slate-900">{item.topic}</h3>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                          score {item.score}
                        </span>
                        {item.status === "selected" && (
                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                            selected
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-sm text-slate-600">{item.schoolBcbaProblem}</p>
                      <p className="mt-2 text-xs text-slate-500">{item.rationale}</p>
                      <p className="mt-2 text-xs font-medium text-slate-500">
                        Research query: {item.searchQuery}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        runAction("Topic selection", () =>
                          selectRecommendation({ recommendationId: item._id as any })
                        )
                      }
                      disabled={Boolean(busyAction) || item.status === "selected"}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                    >
                      Select
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Source Signals
            </h2>
            <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
              {signals.length === 0 && (
                <p className="text-sm text-slate-500">
                  No source signals captured for this week yet.
                </p>
              )}
              {signals.map((signal) => (
                <div key={signal._id} className="border-b border-slate-100 pb-3 last:border-0">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {signal.sourceName}
                    </p>
                    <span className="text-xs text-slate-400">weight {signal.weight}</span>
                  </div>
                  {signal.sourceUrl ? (
                    <a
                      href={signal.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 block text-sm font-medium text-primary hover:underline"
                    >
                      {signal.title}
                    </a>
                  ) : (
                    <p className="mt-1 text-sm font-medium text-slate-800">{signal.title}</p>
                  )}
                  <p className="mt-1 text-xs text-slate-500 line-clamp-3">{signal.excerpt}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div id="draft" className="scroll-mt-16 grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Recent Issues
            </h2>
            <div className="space-y-2">
              {issues.length === 0 && (
                <p className="text-sm text-slate-500">No newsletter issues yet.</p>
              )}
              {issues.map((issue) => (
                <button
                  key={issue._id}
                  onClick={() => setSelectedIssueId(issue._id)}
                  className={`w-full rounded-lg border p-3 text-left transition-colors ${
                    selectedIssueId === issue._id
                      ? "border-primary bg-primary/5"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-slate-900 line-clamp-1">
                      {issue.subject}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusClasses(issue.status)}`}>
                      {issue.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {issue.issueKey} • {formatDate(issue.createdAt)}
                  </p>
                  {issue.status === "sent" && (
                    <p className="mt-1 text-xs text-slate-500">
                      Social: {issue.socialPublishedCount ? `${issue.socialPublishedCount}/2 published` : issue.socialDraftCount ? `${issue.socialDraftCount}/2 drafts ready` : "preparing drafts"}
                    </p>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="xl:col-span-2 bg-white rounded-lg shadow p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Draft Preview
                </h2>
                {selectedIssue && (
                  <p className="mt-1 text-sm text-slate-600">
                    {selectedIssue.subject}
                  </p>
                )}
              </div>
              {selectedIssue && (
                <span className={`self-start rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusClasses(selectedIssue.status)}`}>
                  {selectedIssue.status}
                </span>
              )}
            </div>

            {!selectedIssue && (
              <p className="text-sm text-slate-500">
                Select an issue or create a new draft to preview it here.
              </p>
            )}

            {selectedIssue && (
              <>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3 mb-4 text-sm">
                  <div>
                    <p className="text-slate-500">Topic</p>
                    <p className="font-medium text-slate-900">{selectedIssue.topicTitle ?? "Fallback topic"}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">CTA</p>
                    <p className="font-medium text-slate-900">{activeCtaLabel}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Preview Sent</p>
                    <p className="font-medium text-slate-900">{formatDate(selectedIssue.previewSentAt)}</p>
                  </div>
                </div>

                {selectedIssue.generationError && (
                  <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {selectedIssue.generationError}
                  </div>
                )}

                {analytics && <div className="mb-5 grid grid-cols-2 gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm sm:grid-cols-5"><div><p className="text-slate-500">Sent</p><p className="font-semibold">{analytics.sent}</p></div><div><p className="text-slate-500">Delivered</p><p className="font-semibold">{analytics.delivered}</p></div><div><p className="text-slate-500">Opened</p><p className="font-semibold">{analytics.opened}</p></div><div><p className="text-slate-500">Clicked</p><p className="font-semibold">{analytics.clicked}</p></div><div><p className="text-slate-500">Bounced</p><p className="font-semibold">{analytics.bounced}</p></div><div><p className="text-slate-500">Complaints</p><p className="font-semibold">{analytics.complained}</p></div><div><p className="text-slate-500">Unsubscribed</p><p className="font-semibold">{analytics.unsubscribed}</p></div><div><p className="text-slate-500">Feedback</p><p className="font-semibold">{analytics.feedback}</p></div><div><p className="text-slate-500">Rating</p><p className="font-semibold">{analytics.averageRating ? `${analytics.averageRating.toFixed(1)}/5` : "--"}</p></div><div><p className="text-slate-500">Archive views</p><p className="font-semibold">{analytics.archiveViews}</p></div><div><p className="text-slate-500">Issue shares</p><p className="font-semibold">{analytics.archiveShares}</p></div><div><p className="text-slate-500">Archive signups</p><p className="font-semibold">{analytics.archiveSignups}</p></div><div><p className="text-slate-500">Archive CTA clicks</p><p className="font-semibold">{analytics.archiveCtaClicks}</p></div><p className="col-span-full text-xs text-slate-500">{analytics.note}</p></div>}

                {selectedIssue.status === "sent" && (
                  <section className="mb-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900">Social drafts</h3>
                        <p className="mt-1 text-xs text-slate-600">LinkedIn is ready for a reviewed text post. Instagram needs an approved image or Reel asset and is completed manually in Buffer. This dashboard never publishes automatically.</p>
                      </div>
                      <span className="text-xs font-medium text-slate-500">{socialPosts?.length ?? 0}/2 ready</span>
                    </div>
                    {!socialPosts?.length ? (
                      <p className="mt-4 text-sm text-slate-600">Drafts are being prepared. You will receive an email when both are ready.</p>
                    ) : (
                      <div className="mt-4 space-y-4">
                        {socialPosts.map((post) => {
                          const edit = socialEdits[post._id] ?? { body: post.body, archiveUrl: post.archiveUrl, ctaUrl: post.ctaUrl ?? "", mediaUrl: post.mediaUrl ?? "", mediaAltText: post.mediaAltText ?? "", status: post.status, publishedUrl: post.publishedUrl ?? "", impressions: post.impressions?.toString() ?? "", reactions: post.reactions?.toString() ?? "", comments: post.comments?.toString() ?? "", shares: post.shares?.toString() ?? "", linkClicks: post.linkClicks?.toString() ?? "" };
                          return <div key={post._id} className="rounded-md border border-slate-200 bg-white p-3">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <p className="text-sm font-semibold capitalize text-slate-900">{post.platform}</p>
                              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">{post.status}</span>
                            </div>
                            <label className="mt-3 block text-xs font-medium text-slate-600">Post copy<textarea value={edit.body} onChange={(event) => setSocialEdits({ ...socialEdits, [post._id]: { ...edit, body: event.target.value } })} rows={9} className="mt-1 w-full rounded border border-slate-300 px-2 py-2 text-sm" /></label>
                            <div className="mt-3 grid gap-3 sm:grid-cols-2">
                              <label className="block text-xs font-medium text-slate-600">Tracked issue URL<input value={edit.archiveUrl} onChange={(event) => setSocialEdits({ ...socialEdits, [post._id]: { ...edit, archiveUrl: event.target.value } })} className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-xs" /></label>
                              <label className="block text-xs font-medium text-slate-600">Tracked CTA URL<input value={edit.ctaUrl} onChange={(event) => setSocialEdits({ ...socialEdits, [post._id]: { ...edit, ctaUrl: event.target.value } })} className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-xs" /></label>
                              <label className="block text-xs font-medium text-slate-600">Status<select value={edit.status} onChange={(event) => setSocialEdits({ ...socialEdits, [post._id]: { ...edit, status: event.target.value as NewsletterSocialPost["status"] } })} className="mt-1 w-full rounded border border-slate-300 bg-white px-2 py-1.5 text-xs"><option value="needs_review">Needs review</option><option value="needs_media">Needs media</option><option value="ready">Ready</option><option value="queued">Queued in Buffer</option><option value="published">Published</option><option value="metrics_due">Metrics due</option></select></label>
                              <label className="block text-xs font-medium text-slate-600">Published post URL{edit.status === "published" ? " (required)" : ""}<input value={edit.publishedUrl} onChange={(event) => setSocialEdits({ ...socialEdits, [post._id]: { ...edit, publishedUrl: event.target.value } })} placeholder="Paste after manual publishing" className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-xs" /></label>
                            </div>
                            {post.platform === "instagram" && <div className="mt-3 rounded border border-amber-200 bg-amber-50 p-3"><p className="text-xs text-amber-900">{post.mediaBrief ?? "Instagram requires a reviewed media asset before it can be queued."}</p><div className="mt-2 grid gap-3 sm:grid-cols-2"><label className="block text-xs font-medium text-slate-700">Approved media URL<input value={edit.mediaUrl} onChange={(event) => setSocialEdits({ ...socialEdits, [post._id]: { ...edit, mediaUrl: event.target.value } })} placeholder="https://..." className="mt-1 w-full rounded border border-amber-300 bg-white px-2 py-1.5 text-xs" /></label><label className="block text-xs font-medium text-slate-700">Alt text<input value={edit.mediaAltText} onChange={(event) => setSocialEdits({ ...socialEdits, [post._id]: { ...edit, mediaAltText: event.target.value } })} className="mt-1 w-full rounded border border-amber-300 bg-white px-2 py-1.5 text-xs" /></label></div></div>}
                            {edit.status === "published" && <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5">
                              {[['impressions', 'Reach'], ['reactions', 'Reactions'], ['comments', 'Comments'], ['shares', 'Shares'], ['linkClicks', 'Link clicks']].map(([key, label]) => <label key={key} className="block text-xs font-medium text-slate-600">{label}<input type="number" min="0" value={edit[key as keyof typeof edit] as string} onChange={(event) => setSocialEdits({ ...socialEdits, [post._id]: { ...edit, [key]: event.target.value } })} className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-xs" /></label>)}
                            </div>}
                            <button onClick={() => handleSaveSocialPost(post)} disabled={Boolean(busyAction)} className="mt-3 rounded border border-primary px-3 py-1.5 text-xs font-medium text-primary disabled:opacity-50">Save {post.platform} draft</button>
                          </div>;
                        })}
                      </div>
                    )}
                  </section>
                )}

                {selectedIssue.status === "sent" && (
                  <section className="mb-5 rounded-lg border border-red-100 bg-red-50/40 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900">Weekly YouTube episode</h3>
                        <p className="mt-1 text-xs text-slate-600">One 20-minute research-to-practice package per issue. Long-form upload stays in YouTube Studio; Buffer is used only for comment review and eligible Shorts.</p>
                      </div>
                      {!episode && <button onClick={handleCreateYouTubeEpisode} disabled={Boolean(busyAction)} className="rounded-md border border-red-300 bg-white px-3 py-2 text-xs font-medium text-red-800 disabled:opacity-50">Create episode package</button>}
                      {episode && <button onClick={handleReadyYouTubeEpisode} disabled={Boolean(busyAction)} className="rounded-md border border-red-300 bg-white px-3 py-2 text-xs font-medium text-red-800 disabled:opacity-50">Mark ready for Studio</button>}
                    </div>
                    {episode && <div className="mt-3 rounded-md border border-red-100 bg-white p-3 text-sm"><div className="flex flex-wrap items-center justify-between gap-2"><p className="font-medium text-slate-900">{episode.title}</p><span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-800">{episode.status.replace(/_/g, " ")}</span></div><p className="mt-2 whitespace-pre-wrap text-xs leading-5 text-slate-700">{episode.thumbnailBrief}</p><p className="mt-2 text-xs font-medium text-slate-700">Short clips</p><ul className="mt-1 space-y-1 text-xs text-slate-600">{episode.shortClipConcepts.map((clip) => <li key={clip.title}>{clip.title}: {clip.hook}</li>)}</ul>{episode.studioUrl && <a className="mt-3 inline-block text-xs font-medium text-primary underline" href={episode.studioUrl} target="_blank" rel="noreferrer">Open in YouTube Studio</a>}</div>}
                  </section>
                )}

                {selectedIssue.status !== "sent" && (
                  <div className="mb-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <h3 className="text-sm font-semibold text-slate-900">Edit draft</h3>
                      <button onClick={handleSaveDraft} disabled={Boolean(busyAction)} className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-white disabled:opacity-50">Save draft</button>
                    </div>
                    <label className="block text-xs font-medium text-slate-600">Subject<input value={editor.subject} onChange={(event) => setEditor({ ...editor, subject: event.target.value })} className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm" /></label>
                    <label className="mt-3 block text-xs font-medium text-slate-600">Preheader<input value={editor.preheader} onChange={(event) => setEditor({ ...editor, preheader: event.target.value })} className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm" /></label>
                    <label className="mt-3 block text-xs font-medium text-slate-600">HTML email body<textarea value={editor.html} onChange={(event) => setEditor({ ...editor, html: event.target.value })} rows={12} className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-mono text-xs" /></label>
                    <label className="mt-3 block text-xs font-medium text-slate-600">Plain-text email body<textarea value={editor.text} onChange={(event) => setEditor({ ...editor, text: event.target.value })} rows={8} className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm" /></label>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2"><label className="block text-xs font-medium text-slate-600">CTA type<input value={editor.ctaKind} onChange={(event) => setEditor({ ...editor, ctaKind: event.target.value })} placeholder="booking, webinar, other" className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm" /></label><label className="block text-xs font-medium text-slate-600">CTA URL<input value={editor.ctaUrl} onChange={(event) => setEditor({ ...editor, ctaUrl: event.target.value })} type="url" placeholder="https://..." className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm" /></label></div>
                  </div>
                )}

                {selectedIssue.status !== "sent" && (
                  <div className="mb-5 flex flex-col gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-4 sm:flex-row sm:items-end">
                    <label className="flex-1 text-xs font-medium text-emerald-900">Optional send time (Pacific)<input type="datetime-local" value={scheduleAt} onChange={(event) => setScheduleAt(event.target.value)} className="mt-1 w-full rounded-md border border-emerald-300 bg-white px-3 py-2 text-sm text-slate-900" /></label>
                    <p className="text-xs text-emerald-800">Save the draft, then approve to send now or schedule. Scheduled sends run within five minutes of this time.</p>
                  </div>
                )}

                {issueBundle?.articles?.length > 0 && (
                  <div className="mb-4 rounded-lg border border-slate-200 p-4">
                    <h3 className="text-sm font-semibold text-slate-900 mb-3">
                      Research Included
                    </h3>
                    <div className="space-y-3">
                      {issueBundle.articles.map((article) => {
                        const edit = articleEdits[article._id] ?? { apaCitation: article.apaCitation ?? "", fullTextUrl: article.fullTextUrl ?? article.paperUrl ?? article.sourcePdf ?? "", summary: article.summary, schoolBcbaUse: article.schoolBcbaUse, tryThis: article.tryThis };
                        return <div key={article._id} className="rounded-md border border-slate-200 p-3">
                          <p className="text-sm font-medium text-slate-900">
                            {article.title ?? "Untitled research source"}
                          </p>
                          <p className="text-xs text-slate-500">
                            {[article.authors, article.year, article.journal].filter(Boolean).join(" • ")}
                          </p>
                          {selectedIssue.status === "sent" ? <p className="mt-1 text-sm text-slate-600">{article.schoolBcbaUse}</p> : <div className="mt-3 space-y-2"><label className="block text-xs font-medium text-slate-600">APA citation<textarea value={edit.apaCitation} onChange={(event) => setArticleEdits({ ...articleEdits, [article._id]: { ...edit, apaCitation: event.target.value } })} rows={2} className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-xs" /></label><label className="block text-xs font-medium text-slate-600">Open full-text URL<input value={edit.fullTextUrl} onChange={(event) => setArticleEdits({ ...articleEdits, [article._id]: { ...edit, fullTextUrl: event.target.value } })} className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-xs" /></label><label className="block text-xs font-medium text-slate-600">School BCBA takeaway<textarea value={edit.schoolBcbaUse} onChange={(event) => setArticleEdits({ ...articleEdits, [article._id]: { ...edit, schoolBcbaUse: event.target.value } })} rows={2} className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-xs" /></label><button onClick={() => handleSaveArticle(article)} disabled={Boolean(busyAction)} className="rounded border border-primary px-2 py-1 text-xs font-medium text-primary disabled:opacity-50">Save source</button></div>}
                        </div>;
                      })}
                    </div>
                  </div>
                )}

                <div className="mb-3 flex gap-2"><button onClick={() => setPreviewMode("desktop")} className={`rounded px-3 py-1 text-xs font-medium ${previewMode === "desktop" ? "bg-slate-900 text-white" : "border border-slate-300 text-slate-700"}`}>Desktop</button><button onClick={() => setPreviewMode("mobile")} className={`rounded px-3 py-1 text-xs font-medium ${previewMode === "mobile" ? "bg-slate-900 text-white" : "border border-slate-300 text-slate-700"}`}>Mobile</button></div>
                <iframe
                  title="Newsletter HTML preview"
                  srcDoc={selectedIssue.html}
                  className={`h-[700px] rounded-lg border border-slate-200 bg-white ${previewMode === "mobile" ? "mx-auto w-[375px] max-w-full" : "w-full"}`}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
