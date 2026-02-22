import { NextRequest, NextResponse } from 'next/server';
import { getConvexClient, api } from '@/lib/convex';
import type { Id } from '../../../../../../convex/_generated/dataModel';

export const dynamic = 'force-dynamic';

type ReportType =
  | 'attendance'
  | 'qualifications'
  | 'feedback'
  | 'certificates'
  | 'complaints'
  | 'full_audit';

/**
 * POST /api/ace/compliance/export
 * Generate audit report data
 */
export async function POST(request: NextRequest) {
  try {
    const client = getConvexClient();
    const body = await request.json();
    const {
      provider_id,
      report_type,
      date_range_start,
      date_range_end,
    } = body;

    if (!provider_id) {
      return NextResponse.json(
        { error: 'Missing required field: provider_id' },
        { status: 400 }
      );
    }

    if (!report_type) {
      return NextResponse.json(
        { error: 'Missing required field: report_type' },
        { status: 400 }
      );
    }

    const validTypes: ReportType[] = [
      'attendance',
      'qualifications',
      'feedback',
      'certificates',
      'complaints',
      'full_audit',
    ];

    if (!validTypes.includes(report_type)) {
      return NextResponse.json(
        {
          error: `Invalid report_type. Must be one of: ${validTypes.join(', ')}`,
        },
        { status: 400 }
      );
    }

    const typedProviderId = provider_id as Id<'aceProviders'>;

    // Get full audit summary
    const auditSummary = await client.query(
      api.aceCompliance.getAuditSummary,
      {
        providerId: typedProviderId,
        dateRangeStart: date_range_start || undefined,
        dateRangeEnd: date_range_end || undefined,
      }
    );

    // Get compliance score
    const complianceScore = await client.query(
      api.aceCompliance.getComplianceScore,
      { providerId: typedProviderId }
    );

    // Build report based on type
    let reportData: Record<string, unknown> = {};
    let findings: string[] = [];
    let recommendations: string[] = [];

    const baseReport = {
      reportType: report_type,
      provider: auditSummary.provider,
      complianceScore: {
        score: complianceScore.score,
        level: complianceScore.level,
        deductions: complianceScore.deductions,
      },
      dateRange: auditSummary.dateRange,
      generatedAt: auditSummary.generatedAt,
    };

    switch (report_type as ReportType) {
      case 'attendance': {
        reportData = {
          ...baseReport,
          attendanceData: auditSummary.attendanceData,
          summary: {
            totalEvents: auditSummary.summary.totalEvents,
            totalAttendanceRecords: auditSummary.attendanceData.reduce(
              (sum: number, d: any) => sum + d.totalAttendanceRecords,
              0
            ),
            totalVerified: auditSummary.attendanceData.reduce(
              (sum: number, d: any) => sum + d.verifiedAttendance,
              0
            ),
          },
        };

        // Generate findings
        for (const event of auditSummary.attendanceData) {
          if (event.totalAttendanceRecords === 0 && event.totalRegistrations > 0) {
            findings.push(
              `Event "${event.eventTitle}" has ${event.totalRegistrations} registrations but no attendance records.`
            );
          }
          if (
            event.verifiedAttendance < event.totalAttendanceRecords &&
            event.totalAttendanceRecords > 0
          ) {
            findings.push(
              `Event "${event.eventTitle}" has ${event.totalAttendanceRecords - event.verifiedAttendance} unverified attendance records.`
            );
          }
        }

        if (findings.length === 0) {
          findings.push('All attendance records are properly documented and verified.');
        }

        recommendations.push(
          'Ensure all attendance records are verified before issuing certificates.'
        );
        recommendations.push(
          'Implement timestamped sign-in/sign-out for all synchronous events.'
        );
        break;
      }

      case 'qualifications': {
        reportData = {
          ...baseReport,
          qualificationsData: auditSummary.qualificationsData,
          summary: {
            totalInstructors: auditSummary.summary.totalInstructors,
            approvedInstructors: auditSummary.summary.approvedInstructors,
            pendingApproval:
              auditSummary.summary.totalInstructors -
              auditSummary.summary.approvedInstructors,
          },
        };

        const unapprovedCount =
          auditSummary.summary.totalInstructors -
          auditSummary.summary.approvedInstructors;

        if (unapprovedCount > 0) {
          findings.push(
            `${unapprovedCount} instructor(s) have pending qualification approval.`
          );
        }

        // Check for expiring certifications
        const now = Date.now();
        const ninetyDays = 90 * 24 * 60 * 60 * 1000;
        for (const qual of auditSummary.qualificationsData) {
          if (
            qual.certificationExpiration &&
            qual.certificationExpiration < now + ninetyDays
          ) {
            findings.push(
              `Instructor "${qual.instructorName}" has a certification expiring soon.`
            );
          }
        }

        if (findings.length === 0) {
          findings.push('All instructor qualifications are current and approved.');
        }

        recommendations.push(
          'Review and approve all pending instructor qualifications promptly.'
        );
        recommendations.push(
          'Set up reminders for certification renewals.'
        );
        break;
      }

      case 'feedback': {
        reportData = {
          ...baseReport,
          feedbackData: auditSummary.feedbackData,
          summary: {
            totalEvents: auditSummary.feedbackData.length,
            totalFeedback: auditSummary.feedbackData.reduce(
              (sum: number, d: any) => sum + d.totalFeedback,
              0
            ),
            averageRating:
              auditSummary.feedbackData.length > 0
                ? Math.round(
                    (auditSummary.feedbackData.reduce(
                      (sum: number, d: any) => sum + d.averageRating,
                      0
                    ) /
                      auditSummary.feedbackData.filter(
                        (d: any) => d.totalFeedback > 0
                      ).length) *
                      10
                  ) / 10
                : 0,
          },
        };

        for (const event of auditSummary.feedbackData) {
          if (event.totalFeedback === 0) {
            findings.push(
              `Event "${event.eventTitle}" has no feedback responses.`
            );
          }
          if (event.averageRating > 0 && event.averageRating < 3) {
            findings.push(
              `Event "${event.eventTitle}" has a low average rating of ${event.averageRating}/5.`
            );
          }
        }

        if (findings.length === 0) {
          findings.push('All events have adequate feedback with acceptable ratings.');
        }

        recommendations.push(
          'Review all feedback within 45 days of event completion per BACB requirements.'
        );
        recommendations.push(
          'Use feedback data to improve future event quality.'
        );
        break;
      }

      case 'certificates': {
        reportData = {
          ...baseReport,
          certificateData: auditSummary.certificateData,
          summary: {
            totalCertificates: auditSummary.summary.totalCertificates,
            issuedCertificates: auditSummary.summary.issuedCertificates,
            pendingCertificates:
              auditSummary.summary.totalCertificates -
              auditSummary.summary.issuedCertificates,
            totalCEUsIssued: auditSummary.summary.totalCEUsIssued,
          },
        };

        for (const event of auditSummary.certificateData) {
          if (event.pending > 0) {
            findings.push(
              `Event "${event.eventTitle}" has ${event.pending} pending certificate(s).`
            );
          }
          if (event.revoked > 0) {
            findings.push(
              `Event "${event.eventTitle}" has ${event.revoked} revoked certificate(s).`
            );
          }
        }

        if (findings.length === 0) {
          findings.push('All certificates are issued in a timely manner.');
        }

        recommendations.push(
          'Issue all certificates within 45 days of event completion per BACB requirements.'
        );
        recommendations.push(
          'Verify all eligibility requirements before issuing certificates.'
        );
        break;
      }

      case 'complaints': {
        reportData = {
          ...baseReport,
          complaintData: auditSummary.complaintData,
          summary: {
            totalComplaints: auditSummary.summary.totalComplaints,
            resolvedComplaints: auditSummary.summary.resolvedComplaints,
            openComplaints:
              auditSummary.summary.totalComplaints -
              auditSummary.summary.resolvedComplaints,
          },
        };

        const openCount =
          auditSummary.summary.totalComplaints -
          auditSummary.summary.resolvedComplaints;

        if (openCount > 0) {
          findings.push(
            `${openCount} complaint(s) are still open/unresolved.`
          );
        }

        // Check for overdue complaints
        const overdue = auditSummary.complaintData.filter((c: any) => {
          if (c.status === 'resolved' || c.status === 'escalated_to_bacb')
            return false;
          const deadline =
            c.submittedAt + 45 * 24 * 60 * 60 * 1000;
          return Date.now() > deadline;
        });

        if (overdue.length > 0) {
          findings.push(
            `${overdue.length} complaint(s) are past the 45-day response deadline.`
          );
        }

        if (findings.length === 0) {
          findings.push('All complaints have been addressed in a timely manner.');
        }

        recommendations.push(
          'Respond to all complaints within 45 days per BACB requirements.'
        );
        recommendations.push(
          'Document all complaint resolutions thoroughly.'
        );
        break;
      }

      case 'full_audit': {
        reportData = {
          ...baseReport,
          summary: auditSummary.summary,
          attendanceData: auditSummary.attendanceData,
          feedbackData: auditSummary.feedbackData,
          certificateData: auditSummary.certificateData,
          qualificationsData: auditSummary.qualificationsData,
          complaintData: auditSummary.complaintData,
        };

        // Comprehensive findings
        if (complianceScore.deductions.length > 0) {
          for (const deduction of complianceScore.deductions) {
            findings.push(
              `${deduction.reason}: -${deduction.points} points x ${deduction.count} = -${deduction.points * deduction.count} total`
            );
          }
        }

        if (complianceScore.score < 70) {
          recommendations.push(
            'URGENT: Compliance score is below 70. Immediate action required to address all deduction items.'
          );
        } else if (complianceScore.score < 85) {
          recommendations.push(
            'Compliance score needs improvement. Review and address deduction items.'
          );
        }

        recommendations.push(
          'Maintain all records for a minimum of 3 years per BACB retention requirements.'
        );
        recommendations.push(
          'Ensure timely issuance of certificates within 45 days of event completion.'
        );
        recommendations.push(
          'Review and respond to all feedback and complaints within required timeframes.'
        );
        recommendations.push(
          'Keep all instructor qualifications current and properly documented.'
        );
        break;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        ...reportData,
        findings,
        recommendations,
      },
    });
  } catch (error) {
    console.error('Error generating audit report:', error);
    const message =
      error instanceof Error
        ? error.message
        : 'Failed to generate audit report';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
