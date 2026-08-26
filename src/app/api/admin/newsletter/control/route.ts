import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminSession } from '@/lib/admin-auth'
import {
  callNewsletterConvex,
  callRobSpainNewsletterConvex,
  getRobSpainNewsletterDashboard,
  newsletterErrorResponse,
  robSpainDeliveryRecordsFromDashboard,
} from '@/lib/newsletter-admin'
import { newsletterSourceReviewProgress, summarizeNewsletterAcquisition } from '@/lib/newsletter-acquisition'
import type { NewsletterSubscriberRecord } from '@/lib/newsletter-acquisition'
import { checkPublishingRelease, newsletterPublishingIdentity, publishingApprovalUrl } from '@/lib/publishing-standard'

export const dynamic = 'force-dynamic'

async function requireAdmin() {
  const user = await verifyAdminSession()
  if (!user) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  return user
}

export async function GET(request: NextRequest) {
  const user = await requireAdmin()
  if (user instanceof NextResponse) return user

  try {
    const deliveryIssueId = request.nextUrl.searchParams.get('deliveryIssueId')
    if (deliveryIssueId) {
      const dashboard = await getRobSpainNewsletterDashboard(deliveryIssueId)
      return NextResponse.json({ ok: true, ...dashboard })
    }

    const issueId = request.nextUrl.searchParams.get('issueId')
    if (issueId) {
      const [issue, analytics] = await Promise.all([
        callNewsletterConvex('query', 'weeklyNewsletter:getIssueForAdmin', { issueId }),
        callNewsletterConvex('query', 'weeklyNewsletter:issueAnalyticsForAdmin', { issueId }),
      ])
      const identity = newsletterPublishingIdentity(issue)
      const publishingGate = await checkPublishingRelease(identity)
      return NextResponse.json({
        ok: true,
        issue,
        analytics,
        publishingGate,
        publishingIdentity: identity,
        publishingApprovalUrl: publishingApprovalUrl(identity),
      })
    }

    const [issues, legacySummary, audiences, ctas, deliveryDashboard] = await Promise.all([
      callNewsletterConvex<Array<Record<string, unknown>>>('query', 'weeklyNewsletter:listIssuesForAdmin', { limit: 30 }),
      callNewsletterConvex('query', 'weeklyNewsletter:subscriberReadinessForAdmin'),
      callNewsletterConvex('query', 'weeklyNewsletter:audienceSummaryForAdmin'),
      callNewsletterConvex('query', 'weeklyNewsletter:listCtasForAdmin', { activeOnly: false }),
      getRobSpainNewsletterDashboard(),
    ])
    const deliveryRecords = robSpainDeliveryRecordsFromDashboard(deliveryDashboard)
    const reviewProgress = newsletterSourceReviewProgress(deliveryRecords)
    const confirmedTotal = Number(deliveryDashboard.audience.subscribed ?? 0)
    let acquisition
    try {
      const [confirmedContacts, pendingContacts] = await Promise.all([
        callRobSpainNewsletterConvex<NewsletterSubscriberRecord[]>('query', 'newsletter:exportSubscribers', { status: 'subscribed', limit: 5000 }),
        callRobSpainNewsletterConvex<NewsletterSubscriberRecord[]>('query', 'newsletter:exportSubscribers', { status: 'pending', limit: 5000 }),
      ])
      acquisition = {
        ...summarizeNewsletterAcquisition(confirmedTotal, confirmedContacts, pendingContacts),
        ...reviewProgress,
      }
    } catch (sourceError) {
      console.error('Newsletter acquisition source report unavailable:', sourceError)
      acquisition = {
        available: false,
        launchAt: Date.parse('2026-08-19T00:47:08Z'),
        targetConfirmed: 50,
        confirmedTotal,
        confirmedSinceLaunch: null,
        remainingToTarget: Math.max(0, 50 - confirmedTotal),
        pendingSinceLaunch: null,
        sources: [],
        allSources: [],
        ...reviewProgress,
      }
    }
    const deliveryByIssueKey = new Map(
      deliveryRecords.map((record) => [record.issueKey, record]),
    )
    const issuesWithDelivery = issues.map((issue) => {
      const issueKey = String(issue.issueKey ?? '')
      const delivery = deliveryByIssueKey.get(issueKey)
      return {
        ...issue,
        emailDelivery: delivery
          ? {
              state: delivery.sentAt ? 'sent' : 'not_sent',
              status: delivery.status,
              sentAt: delivery.sentAt,
              scheduledFor: delivery.scheduledFor,
              recipientCount: delivery.recipientCount,
              failed: delivery.failed,
            }
          : {
              state: 'not_recorded',
              status: 'not_recorded',
              sentAt: null,
              scheduledFor: null,
              recipientCount: 0,
              failed: 0,
            },
        // Absence of a delivery record is not proof that an issue was never
        // sent. Only an existing record with no completed send is recyclable.
        recyclableForNextIssue: Boolean(delivery && !delivery.sentAt),
      }
    })
    const deliveryAudience = {
      confirmed: Number(deliveryDashboard.audience.subscribed ?? 0),
      pending: Number(deliveryDashboard.audience.pending ?? 0),
      unsubscribed: Number(deliveryDashboard.audience.unsubscribed ?? 0),
      bounced: Number(deliveryDashboard.audience.bounced ?? 0),
      complained: Number(deliveryDashboard.audience.complained ?? 0),
      suppressed: Number(deliveryDashboard.audience.suppressed ?? 0),
    }
    const warmContacts = {
      needsConsent: Number((legacySummary as Record<string, unknown>)?.needsConsent ?? 0),
      excluded: Number((legacySummary as Record<string, unknown>)?.excluded ?? 0),
      testContacts: Number((legacySummary as Record<string, unknown>)?.codexTests ?? 0),
      source: 'Behavior School contact store',
      landingUrl: 'https://robspain.com/newsletter/?utm_source=behaviorschool_warm_contacts&utm_medium=email&utm_campaign=weekly_research_brief_permission&utm_content=one_time_invitation#subscribe',
    }
    return NextResponse.json({
      ok: true,
      issues: issuesWithDelivery,
      summary: legacySummary,
      audiences,
      ctas,
      deliveryRecords,
      deliveryAudience,
      warmContacts,
      acquisition,
    })
  } catch (error) {
    return newsletterErrorResponse(error)
  }
}

export async function POST(request: NextRequest) {
  const user = await requireAdmin()
  if (user instanceof NextResponse) return user

  try {
    const payload = await request.json() as { operation?: string; [key: string]: unknown }
    const operation = payload.operation
    const { operation: _operation, ...args } = payload

    const deliveryOperations: Record<string, { kind: 'query' | 'mutation' | 'action'; path: string }> = {
      deliverySaveDraft: { kind: 'mutation', path: 'newsletter:upsertDraft' },
      deliveryReplaceSources: { kind: 'mutation', path: 'newsletter:replaceSources' },
      deliveryPreview: { kind: 'action', path: 'newsletterActions:previewIssue' },
      deliveryApprove: { kind: 'mutation', path: 'newsletter:approveIssue' },
      deliveryPreflight: { kind: 'action', path: 'newsletterActions:fullPreflight' },
      deliveryVerifyArchive: { kind: 'action', path: 'newsletterActions:verifyArchivePublication' },
      deliverySend: { kind: 'action', path: 'newsletterActions:sendApprovedIssue' },
    }

    if (operation && deliveryOperations[operation]) {
      const issueId = typeof args.issueId === 'string' ? args.issueId : ''
      if (!issueId && operation !== 'deliverySaveDraft') {
        return NextResponse.json({ ok: false, error: 'A delivery issue is required.' }, { status: 400 })
      }
      if (operation === 'deliveryApprove') args.approvedBy = user.email
      if (operation === 'deliveryVerifyArchive') {
        const dashboard = await getRobSpainNewsletterDashboard(issueId)
        const issueKey = String(dashboard.selected?.issue?.issueKey ?? '')
        if (!issueKey) return NextResponse.json({ ok: false, error: 'The delivery issue could not be loaded.' }, { status: 404 })
        args.archiveUrl = `https://robspain.com/newsletter/${encodeURIComponent(issueKey)}/`
      }
      if (operation === 'deliverySend') {
        const dashboard = await getRobSpainNewsletterDashboard(issueId)
        const issue = dashboard.selected?.issue
        if (!issue) return NextResponse.json({ ok: false, error: 'The delivery issue could not be loaded.' }, { status: 404 })
        if (issue.status === 'sent' || issue.sentAt) {
          return NextResponse.json({ ok: false, error: 'This newsletter issue has already been sent.' }, { status: 409 })
        }
      }
      const target = deliveryOperations[operation]
      const value = await callRobSpainNewsletterConvex(target.kind, target.path, args)
      return NextResponse.json({ ok: true, value })
    }

    const operations: Record<string, { kind: 'query' | 'mutation' | 'action'; path: string }> = {
      createDraft: { kind: 'action', path: 'weeklyNewsletter:createWeeklyDraft' },
      approve: { kind: 'mutation', path: 'weeklyNewsletter:approveIssue' },
      updateIssue: { kind: 'mutation', path: 'weeklyNewsletter:updateIssueWithToken' },
      updateArticle: { kind: 'mutation', path: 'weeklyNewsletter:updateArticleWithToken' },
      sendPreview: { kind: 'action', path: 'weeklyNewsletter:sendPreview' },
      publishAndVerify: { kind: 'action', path: 'weeklyNewsletter:publishAndVerifyArchive' },
      sendApproved: { kind: 'action', path: 'weeklyNewsletter:sendApprovedIssue' },
      generateSocial: { kind: 'action', path: 'weeklyNewsletter:generateSocialDraftsForIssueWithToken' },
      updateSocial: { kind: 'mutation', path: 'weeklyNewsletter:updateSocialPostWithToken' },
      seedCtas: { kind: 'mutation', path: 'weeklyNewsletter:seedDefaultCtas' },
      tagCodexTests: { kind: 'mutation', path: 'weeklyNewsletter:tagCodexTestContacts' },
    }
    if (!operation || !operations[operation]) {
      return NextResponse.json({ ok: false, error: 'Unknown newsletter operation.' }, { status: 400 })
    }

    if (['approve', 'publishAndVerify', 'sendApproved'].includes(operation)) {
      const issueId = typeof args.issueId === 'string' ? args.issueId : ''
      if (!issueId) {
        return NextResponse.json({ ok: false, error: 'An issue is required for this publishing action.' }, { status: 400 })
      }
      const issue = await callNewsletterConvex('query', 'weeklyNewsletter:getIssueForAdmin', { issueId })
      const identity = newsletterPublishingIdentity(issue)
      const publishingGate = await checkPublishingRelease(identity)
      if (!publishingGate.approved) {
        return NextResponse.json({
          ok: false,
          error: 'Publishing blocked: this exact newsletter version needs editorial approval.',
          publishingGate,
          publishingIdentity: identity,
          publishingApprovalUrl: publishingApprovalUrl(identity),
        }, { status: 409 })
      }
    }

    const target = operations[operation]
    const value = await callNewsletterConvex(target.kind, target.path, args)
    return NextResponse.json({ ok: true, value })
  } catch (error) {
    return newsletterErrorResponse(error)
  }
}
