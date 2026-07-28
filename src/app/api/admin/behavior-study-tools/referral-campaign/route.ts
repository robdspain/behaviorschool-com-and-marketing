import { NextResponse } from 'next/server'
import { requireAdminApiSession } from '@/lib/admin-api-session'
import { api, getConvexClient } from '@/lib/convex'
import {
  analyzeBaeSigReferralAudience,
  bstSupervisorReferralCampaign,
  maskEmail,
  type ReferralContact,
} from '@/lib/bst-referral-campaign'

export const dynamic = 'force-dynamic'

export async function GET() {
  const unauthorized = await requireAdminApiSession()
  if (unauthorized) return unauthorized

  try {
    const contacts = await getConvexClient().query(api.crm.listContacts, { includeArchived: false })
    const audience = analyzeBaeSigReferralAudience(contacts as ReferralContact[])

    return NextResponse.json({
      success: true,
      campaign: bstSupervisorReferralCampaign,
      audience: {
        totalContacts: audience.totalContacts,
        uniqueContacts: audience.uniqueContacts,
        baeSigContacts: audience.baeSigContacts,
        eligibleContacts: audience.eligibleContacts,
        supervisorSignals: audience.supervisorSignals,
        suppressions: audience.suppressions,
        pilotSize: audience.pilot.length,
        pilotPreview: audience.pilot.map((contact) => ({
          id: contact.id,
          name: [contact.firstName, contact.lastName].filter(Boolean).join(' ') || 'Unnamed contact',
          email: maskEmail(contact.email),
          organization: contact.organization || null,
          supervisorSignal: /\b(supervisor|supervision|supervisee|fieldwork coordinator|clinical director)\b/i.test(
            [contact.role, contact.notes, ...(contact.tags || [])].filter(Boolean).join(' '),
          ),
        })),
      },
      approval: {
        required: true,
        message: 'This endpoint is preview-only. No email is sent without review and explicit approval.',
      },
    })
  } catch (error) {
    console.error('Behavior Study Tools referral campaign read failed:', error)
    return NextResponse.json(
      { success: false, error: 'Referral campaign could not be loaded.' },
      { status: 500 },
    )
  }
}
