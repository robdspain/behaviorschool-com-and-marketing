import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminSession } from '@/lib/admin-auth'
import { callNewsletterConvex, listRobSpainDeliveryRecords, newsletterErrorResponse } from '@/lib/newsletter-admin'

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
      return NextResponse.json({ ok: true, issue, analytics })
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

    const target = operations[operation]
    const value = await callNewsletterConvex(target.kind, target.path, args)
    return NextResponse.json({ ok: true, value })
  } catch (error) {
    return newsletterErrorResponse(error)
  }
}
