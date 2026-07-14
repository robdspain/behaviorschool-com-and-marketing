export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminSession } from '@/lib/admin-auth'
import { api, getConvexClient } from '@/lib/convex'

function toSubmissionRow(submission: any) {
  return {
    id: submission._id,
    first_name: submission.firstName,
    last_name: submission.lastName,
    email: submission.email,
    phone: submission.phone ?? null,
    organization: submission.organization ?? null,
    role: submission.role,
    caseload_size: submission.caseloadSize ?? null,
    current_challenges: submission.currentChallenges ?? null,
    bcba_cert_number: submission.bcbaCertNumber ?? null,
    status: submission.status,
    submitted_at: submission.submittedAt,
    archived: submission.archived,
    archived_at: submission.archivedAt ?? null,
    archived_by: submission.archivedBy ?? null,
    created_at: submission.createdAt,
    updated_at: submission.updatedAt,
  }
}

export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdminSession()
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const showArchived = searchParams.get('show_archived') === 'true'

    const submissions = await getConvexClient().query(api.submissions.listSignupSubmissions, {
      showArchived,
    })

    return NextResponse.json({ submissions: (submissions || []).map(toSubmissionRow) })
  } catch (err) {
    console.error('Error fetching submissions:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const admin = await verifyAdminSession()
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, archived, status } = body

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const submission = await getConvexClient().mutation(api.submissions.updateSignupSubmission, {
      id,
      archived: archived === undefined ? undefined : Boolean(archived),
      status: status === undefined ? undefined : String(status),
      archivedBy: admin.email || admin.id || 'Admin',
    })

    return NextResponse.json({ success: true, submission: toSubmissionRow(submission) })
  } catch (err) {
    console.error('Error updating submission:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
