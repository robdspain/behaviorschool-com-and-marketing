export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { api, getConvexClient } from '@/lib/convex';
import { getListmonkConfig, listmonkFetch } from '@/lib/listmonk';
import { isValidAdminSessionToken } from '@/lib/adminSession';

const DEFAULT_STUDY_SUMMARY_URL =
  'https://study.behaviorschool.com/.netlify/functions/signup-nurture-summary';

function countBy<T>(rows: T[], readStatus: (row: T) => string | undefined) {
  return rows.reduce<Record<string, number>>((counts, row) => {
    const status = readStatus(row) || 'unknown';
    counts[status] = (counts[status] || 0) + 1;
    return counts;
  }, {});
}

function extractTotal(payload: any): number | null {
  if (!payload) return null;
  if (Array.isArray(payload)) return payload.length;
  if (typeof payload.total === 'number') return payload.total;
  if (typeof payload.data?.total === 'number') return payload.data.total;
  if (Array.isArray(payload.data?.results)) return payload.data.results.length;
  if (Array.isArray(payload.results)) return payload.results.length;
  return null;
}

async function loadStudyLifecycle() {
  const summaryUrl = process.env.STUDY_NURTURE_SUMMARY_URL || DEFAULT_STUDY_SUMMARY_URL;
  const url = new URL(summaryUrl);
  url.searchParams.set('windowDays', '30');
  const secret = process.env.SIGNUP_NURTURE_SECRET;
  const response = await fetch(url, {
    cache: 'no-store',
    headers: secret ? { 'X-Signup-Nurture-Secret': secret } : undefined,
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error(`Study lifecycle returned ${response.status}`);
  return response.json();
}

async function loadListmonkStatus() {
  if (!getListmonkConfig()) {
    return { configured: false, healthy: false, subscribers: null, lists: null, campaigns: null };
  }

  const [listsResponse, subscribersResponse, campaignsResponse] = await Promise.all([
    listmonkFetch('/api/lists?per_page=1'),
    listmonkFetch('/api/subscribers?per_page=1'),
    listmonkFetch('/api/campaigns?per_page=1'),
  ]);
  const [lists, subscribers, campaigns] = await Promise.all([
    listsResponse.ok ? listsResponse.json() : null,
    subscribersResponse.ok ? subscribersResponse.json() : null,
    campaignsResponse.ok ? campaignsResponse.json() : null,
  ]);

  return {
    configured: true,
    healthy: listsResponse.ok && subscribersResponse.ok && campaignsResponse.ok,
    subscribers: subscribersResponse.ok ? extractTotal(subscribers) : null,
    lists: listsResponse.ok ? extractTotal(lists) : null,
    campaigns: campaignsResponse.ok ? extractTotal(campaigns) : null,
  };
}

export async function GET() {
  const cookieStore = await cookies();
  const sessionCandidates = cookieStore.getAll('bs_admin_auth');
  const authenticated = sessionCandidates.some((cookie) => isValidAdminSessionToken(cookie.value));
  if (!authenticated) {
    return NextResponse.json({
      error: 'Unauthorized',
      sessionCandidates: sessionCandidates.length,
    }, {
      status: 401,
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  }

  const client = getConvexClient();
  await client.mutation(api.email.ensureDefaultTemplates, {});

  const [templatesResult, logsResult, enrollmentsResult, nurtureEmailsResult, studyResult, listmonkResult] =
    await Promise.allSettled([
      client.query(api.email.listTemplates, { showArchived: false }),
      client.query(api.email.listEmailLogs, { limit: 500 }),
      client.query(api.transformationNurture.listEnrollments, { limit: 500 }),
      client.query(api.transformationNurture.listEmails, { limit: 500 }),
      loadStudyLifecycle(),
      loadListmonkStatus(),
    ]);

  const templates = templatesResult.status === 'fulfilled' ? templatesResult.value : [];
  const logs = logsResult.status === 'fulfilled' ? logsResult.value : [];
  const enrollments = enrollmentsResult.status === 'fulfilled' ? enrollmentsResult.value : [];
  const nurtureEmails = nurtureEmailsResult.status === 'fulfilled' ? nurtureEmailsResult.value : [];
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const recentLogs = logs.filter((log: any) => {
    const value = Date.parse(log.sentAt || log.createdAt || '');
    return Number.isFinite(value) && value >= thirtyDaysAgo;
  });

  const errors: string[] = [];
  if (templatesResult.status === 'rejected') errors.push('Product templates unavailable');
  if (logsResult.status === 'rejected') errors.push('Email delivery logs unavailable');
  if (enrollmentsResult.status === 'rejected' || nurtureEmailsResult.status === 'rejected') {
    errors.push('Transformation nurture data unavailable');
  }
  if (studyResult.status === 'rejected') errors.push('Study Tools lifecycle unavailable');
  if (listmonkResult.status === 'rejected') errors.push('Newsletter service unavailable');

  const study = studyResult.status === 'fulfilled' ? studyResult.value : null;
  const listmonk = listmonkResult.status === 'fulfilled'
    ? listmonkResult.value
    : { configured: Boolean(getListmonkConfig()), healthy: false, subscribers: null, lists: null, campaigns: null };

  return NextResponse.json({
    fetchedAt: new Date().toISOString(),
    errors,
    totals: {
      activeTemplates: templates.filter((template: any) => template.isActive).length,
      sentLast30Days: recentLogs.filter((log: any) => log.status === 'sent').length,
      failedLast30Days: recentLogs.filter((log: any) => log.status === 'failed').length,
      queued: nurtureEmails.filter((email: any) => email.status === 'queued').length
        + Number(study?.queue?.sendableCount || 0),
    },
    templates: templates.map((template: any) => ({
      id: template._id,
      name: template.name,
      subject: template.subject,
      category: template.category,
      active: template.isActive,
      delayMinutes: template.sendDelayMinutes,
      updatedAt: template.updatedAt,
    })),
    recentLogs: recentLogs.slice(0, 12).map((log: any) => ({
      id: log._id,
      templateName: log.templateName || null,
      recipientEmail: log.recipientEmail,
      subject: log.subject,
      status: log.status,
      sentAt: log.sentAt || log.createdAt,
    })),
    transformation: {
      enrollments: countBy(enrollments, (row: any) => row.status),
      emails: countBy(nurtureEmails, (row: any) => row.status),
    },
    study: study ? {
      queue: Number(study.queue?.sendableCount || 0),
      candidates: Number(study.queue?.candidateCount || 0),
      paid: Number(study.conversionEvents?.paid || 0),
      firstPractice: Number(study.conversionEvents?.first_practice || 0),
      suppressed: Number(study.suppression?.suppressedProfiles || 0),
    } : null,
    listmonk,
    providers: {
      resend: Boolean(process.env.RESEND_API_KEY),
      mailgun: Boolean(process.env.MAILGUN_API_KEY && process.env.MAILGUN_DOMAIN),
      listmonk: Boolean(getListmonkConfig()),
      studyNurture: Boolean(process.env.SIGNUP_NURTURE_SECRET),
    },
  }, {
    headers: { 'Cache-Control': 'no-store, max-age=0' },
  });
}
