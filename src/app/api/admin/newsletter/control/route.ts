import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminSession } from '@/lib/admin-auth'
import { callNewsletterConvex, listRobSpainDeliveryRecords, newsletterErrorResponse } from '@/lib/newsletter-admin'
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

    const [issues, summary, audiences, ctas, deliveryRecords] = await Promise.all([
      callNewsletterConvex('query', 'weeklyNewsletter:listIssuesForAdmin', { limit: 30 }),
      callNewsletterConvex('query', 'weeklyNewsletter:subscriberReadinessForAdmin'),
      callNewsletterConvex('query', 'weeklyNewsletter:audienceSummaryForAdmin'),
      callNewsletterConvex('query', 'weeklyNewsletter:listCtasForAdmin', { activeOnly: false }),
      listRobSpainDeliveryRecords(),
    ])
    return NextResponse.json({ ok: true, issues, summary, audiences, ctas, deliveryRecords })
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
