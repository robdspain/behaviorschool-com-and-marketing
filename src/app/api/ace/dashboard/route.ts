import { NextRequest, NextResponse } from 'next/server';
import { getConvexClient, api } from '@/lib/convex';
import type { Id } from '../../../../../convex/_generated/dataModel';

export const dynamic = 'force-dynamic';

// Compliance score deduction constants
const LATE_CERTIFICATE_PENALTY = 5;
const OVERDUE_FEEDBACK_PENALTY = 3;
const OVERDUE_COMPLAINT_PENALTY = 10;
const MISSING_DOCUMENTATION_PENALTY = 5;
const EXPIRED_CREDENTIALS_PENALTY = 20;

// Deadline constants (in milliseconds)
const FORTY_FIVE_DAYS_MS = 45 * 24 * 60 * 60 * 1000;

/**
 * GET /api/ace/dashboard
 * Returns comprehensive coordinator dashboard data
 */
export async function GET(request: NextRequest) {
  try {
    const client = getConvexClient();
    const { searchParams } = new URL(request.url);
    const providerId = searchParams.get('provider_id');

    if (!providerId) {
      return NextResponse.json(
        { error: 'Missing required parameter: provider_id' },
        { status: 400 }
      );
    }

    const typedProviderId = providerId as Id<'aceProviders'>;

    // Fetch all data in parallel
    const [providerDashboard, events, certificates] =
      await Promise.all([
        client.query(api.aceProviders.getDashboard, {
          providerId: typedProviderId,
        }),
        client.query(api.aceEvents.getByProvider, {
          providerId: typedProviderId,
        }),
        client.query(api.aceCertificates.getByProvider, {
          providerId: typedProviderId,
        }),
      ]);

    // Fetch complaints separately with fallback (module may not exist yet)
    let complaints: any[] = [];
    try {
      if ((api as any).aceComplaints?.getByProvider) {
        complaints = await client.query(
          (api as any).aceComplaints.getByProvider,
          { providerId: typedProviderId }
        );
      }
    } catch {
      complaints = [];
    }

    if (!providerDashboard) {
      return NextResponse.json(
        { error: 'Provider not found' },
        { status: 404 }
      );
    }

    const now = Date.now();
    const provider = providerDashboard.provider;
    const coordinator = provider.coordinator;

    // -- Coordinator Certification Status --
    const coordinatorCertExpires = provider.coordinatorCertificationExpires;
    const daysUntilCertExpiration = coordinatorCertExpires
      ? Math.ceil((coordinatorCertExpires - now) / (1000 * 60 * 60 * 24))
      : null;

    const certificationStatus = {
      coordinatorName: coordinator
        ? `${coordinator.firstName} ${coordinator.lastName}`
        : 'Unknown',
      credentialType: coordinator?.credentialType || 'bcba',
      credentialNumber: coordinator?.credentialNumber || provider.bacbProviderNumber,
      certificationExpires: coordinatorCertExpires || null,
      daysUntilExpiration: daysUntilCertExpiration,
      isVerified: provider.coordinatorCertificationVerified || false,
      severity:
        daysUntilCertExpiration === null
          ? 'info'
          : daysUntilCertExpiration <= 0
            ? 'critical'
            : daysUntilCertExpiration < 30
              ? 'critical'
              : daysUntilCertExpiration <= 90
                ? 'warning'
                : 'safe',
    };

    // -- Provider Status --
    let providerStatus: 'Active' | 'Grace Period' | 'Lapsed' = 'Active';
    if (!provider.isActive) {
      providerStatus = 'Lapsed';
    } else if (
      provider.gracePeriodEndDate &&
      now <= provider.gracePeriodEndDate
    ) {
      providerStatus = 'Grace Period';
    }

    const daysUntilRenewal = provider.expirationDate
      ? Math.ceil((provider.expirationDate - now) / (1000 * 60 * 60 * 24))
      : null;

    const providerInfo = {
      id: provider._id,
      name: provider.providerName,
      type: provider.providerType,
      bacbNumber: provider.bacbProviderNumber,
      status: providerStatus,
      isActive: provider.isActive,
      expirationDate: provider.expirationDate,
      daysUntilRenewal,
      canRenew: daysUntilRenewal !== null && daysUntilRenewal <= 45,
      canPublishEvents: provider.canPublishEvents !== false,
      canIssueCertificates: provider.canIssueCertificates !== false,
    };

    // -- Pending Events --
    const pendingEvents = events
      .filter((e: any) => e.status === 'pending_approval')
      .map((e: any) => ({
        _id: e._id,
        title: e.title,
        description: e.description,
        startDate: e.startDate,
        endDate: e.endDate,
        totalCeus: e.totalCeus,
        ceCategory: e.ceCategory,
        modality: e.modality,
        eventType: e.eventType,
        learningObjectives: e.learningObjectives,
        instructorQualificationsSummary: e.instructorQualificationsSummary,
        instructorAffiliations: e.instructorAffiliations,
        conflictsOfInterest: e.conflictsOfInterest,
        maxParticipants: e.maxParticipants,
        fee: e.fee,
        location: e.location,
      }));

    // -- Overdue Certificates (past 45-day issuance deadline) --
    const completedEvents = events.filter(
      (e: any) => e.status === 'completed'
    );
    const overdueCertificates: any[] = [];

    for (const event of completedEvents) {
      const eventEndDate = event.endDate || event.startDate;
      const deadline = eventEndDate + FORTY_FIVE_DAYS_MS;
      if (now > deadline) {
        // Check if all certificates have been issued for this event
        const eventCerts = certificates.filter(
          (c: any) => c.eventId === event._id
        );
        const pendingCerts = eventCerts.filter(
          (c: any) => c.status === 'pending'
        );
        if (pendingCerts.length > 0) {
          const daysOverdue = Math.ceil(
            (now - deadline) / (1000 * 60 * 60 * 24)
          );
          overdueCertificates.push({
            eventId: event._id,
            eventTitle: event.title,
            eventDate: event.startDate,
            pendingCount: pendingCerts.length,
            deadline,
            daysOverdue,
          });
        }
      }
    }

    // -- Overdue Feedback Reviews (past 45-day review deadline) --
    // Feedback that has been submitted but not reviewed by coordinator
    const overdueFeedbackReviews: any[] = [];
    // We look for events completed more than 45 days ago that may have unreviewed feedback
    for (const event of completedEvents) {
      const eventEndDate = event.endDate || event.startDate;
      const reviewDeadline = eventEndDate + FORTY_FIVE_DAYS_MS;
      if (now > reviewDeadline) {
        const daysOverdue = Math.ceil(
          (now - reviewDeadline) / (1000 * 60 * 60 * 24)
        );
        overdueFeedbackReviews.push({
          eventId: event._id,
          eventTitle: event.title,
          eventDate: event.startDate,
          deadline: reviewDeadline,
          daysOverdue,
        });
      }
    }

    // -- Overdue Complaint Responses (past 45-day response deadline) --
    const complaintsArray = Array.isArray(complaints) ? complaints : [];
    const overdueComplaints = complaintsArray
      .filter((c: any) => {
        if (c.status === 'resolved' || c.status === 'escalated_to_bacb')
          return false;
        const responseDeadline = c.submittedAt + FORTY_FIVE_DAYS_MS;
        return now > responseDeadline;
      })
      .map((c: any) => {
        const responseDeadline = c.submittedAt + FORTY_FIVE_DAYS_MS;
        return {
          complaintId: c._id,
          submitterName: c.submitterName,
          submittedAt: c.submittedAt,
          status: c.status,
          deadline: responseDeadline,
          daysOverdue: Math.ceil(
            (now - responseDeadline) / (1000 * 60 * 60 * 24)
          ),
        };
      });

    // -- Calculate Compliance Score --
    let complianceScore = 100;
    const deductions: Array<{
      reason: string;
      points: number;
      count: number;
    }> = [];

    // Late certificates
    if (overdueCertificates.length > 0) {
      const totalPenalty =
        overdueCertificates.length * LATE_CERTIFICATE_PENALTY;
      complianceScore -= totalPenalty;
      deductions.push({
        reason: 'Late certificate issuance',
        points: LATE_CERTIFICATE_PENALTY,
        count: overdueCertificates.length,
      });
    }

    // Overdue feedback reviews
    if (overdueFeedbackReviews.length > 0) {
      const totalPenalty =
        overdueFeedbackReviews.length * OVERDUE_FEEDBACK_PENALTY;
      complianceScore -= totalPenalty;
      deductions.push({
        reason: 'Overdue feedback review',
        points: OVERDUE_FEEDBACK_PENALTY,
        count: overdueFeedbackReviews.length,
      });
    }

    // Overdue complaints
    if (overdueComplaints.length > 0) {
      const totalPenalty =
        overdueComplaints.length * OVERDUE_COMPLAINT_PENALTY;
      complianceScore -= totalPenalty;
      deductions.push({
        reason: 'Overdue complaint response',
        points: OVERDUE_COMPLAINT_PENALTY,
        count: overdueComplaints.length,
      });
    }

    // Missing documentation (check for required fields)
    let missingDocs = 0;
    if (
      provider.providerType === 'organization' &&
      !provider.legalEntityVerified
    ) {
      missingDocs++;
    }
    if (
      provider.providerType === 'organization' &&
      !provider.leadershipAttestationUrl
    ) {
      missingDocs++;
    }
    if (missingDocs > 0) {
      const totalPenalty = missingDocs * MISSING_DOCUMENTATION_PENALTY;
      complianceScore -= totalPenalty;
      deductions.push({
        reason: 'Missing required documentation',
        points: MISSING_DOCUMENTATION_PENALTY,
        count: missingDocs,
      });
    }

    // Expired credentials
    if (daysUntilCertExpiration !== null && daysUntilCertExpiration <= 0) {
      complianceScore -= EXPIRED_CREDENTIALS_PENALTY;
      deductions.push({
        reason: 'Expired coordinator credentials',
        points: EXPIRED_CREDENTIALS_PENALTY,
        count: 1,
      });
    }

    complianceScore = Math.max(0, complianceScore);

    // -- Recent Activity --
    // Combine recent registrations, certificates, and quiz completions
    const recentCertificates = certificates
      .filter((c: any) => c.status === 'issued' && c.issuedAt)
      .sort((a: any, b: any) => (b.issuedAt || 0) - (a.issuedAt || 0))
      .slice(0, 10)
      .map((c: any) => ({
        type: 'certificate_issued' as const,
        title: `Certificate issued to ${c.participantName}`,
        subtitle: c.eventTitle,
        timestamp: c.issuedAt,
      }));

    const recentActivity = recentCertificates.slice(0, 10);

    // -- Summary Statistics --
    const stats = providerDashboard.stats;

    const dashboardData = {
      certificationStatus,
      providerInfo,
      pendingEvents,
      complianceScore: {
        score: complianceScore,
        deductions,
      },
      overdueItems: {
        certificates: overdueCertificates,
        feedbackReviews: overdueFeedbackReviews,
        complaints: overdueComplaints,
        totalOverdue:
          overdueCertificates.length +
          overdueFeedbackReviews.length +
          overdueComplaints.length,
      },
      recentActivity,
      stats: {
        totalEvents: stats.totalEvents,
        activeEvents: stats.activeEvents,
        totalRegistrations: stats.totalRegistrations,
        totalCertificates: stats.totalCertificates,
        totalCEUsIssued: stats.totalCEUsIssued,
        pendingApprovals: pendingEvents.length,
      },
    };

    return NextResponse.json({ success: true, data: dashboardData });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
