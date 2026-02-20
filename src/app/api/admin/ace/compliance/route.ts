import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

// GET /api/admin/ace/compliance - Get compliance dashboard data
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const providerId = searchParams.get('provider_id');

    // Get overdue certificates (45-day rule)
    const { count: overdueCertificates } = await supabase
      .from('ace_certificates')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')
      .lt('must_be_issued_by', new Date().toISOString().split('T')[0]);

    // Get overdue feedback reviews (45-day rule)
    const { count: overdueFeedbackReviews } = await supabase
      .from('ace_feedback_responses')
      .select('*', { count: 'exact', head: true })
      .is('coordinator_reviewed_at', null)
      .lt('coordinator_review_due_date', new Date().toISOString().split('T')[0]);

    // Get overdue complaints (45-day rule)
    const { count: overdueComplaints } = await supabase
      .from('ace_complaints')
      .select('*', { count: 'exact', head: true })
      .is('resolved_at', null)
      .lt('response_due_date', new Date().toISOString().split('T')[0]);

    // Get coordinator certifications expiring within 90 days
    const ninetyDaysFromNow = new Date();
    ninetyDaysFromNow.setDate(ninetyDaysFromNow.getDate() + 90);
    
    const { count: coordinatorCertExpiringSoon } = await supabase
      .from('ace_providers')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
      .lt('coordinator_certification_expires', ninetyDaysFromNow.toISOString().split('T')[0]);

    // Get lapsed providers
    const { count: providersLapsed } = await supabase
      .from('ace_providers')
      .select('*', { count: 'exact', head: true })
      .eq('can_publish_events', false);

    // Get organizations missing legal verification
    const { count: missingLegalVerification } = await supabase
      .from('ace_providers')
      .select('*', { count: 'exact', head: true })
      .eq('provider_type', 'organization')
      .eq('legal_entity_verified', false);

    // Calculate compliance score
    let score = 100;
    score -= (overdueCertificates || 0) * 5;
    score -= (overdueFeedbackReviews || 0) * 3;
    score -= (overdueComplaints || 0) * 10;
    score -= (coordinatorCertExpiringSoon || 0) * 5;
    score -= (providersLapsed || 0) * 20;
    score -= (missingLegalVerification || 0) * 5;
    score = Math.max(0, Math.min(100, score));

    // Build audit items
    const auditItems: Array<{
      type: string;
      id: string;
      title: string;
      severity: 'critical' | 'warning' | 'info';
      daysOverdue?: number;
      action: string;
    }> = [];

    // Get specific overdue items
    const { data: overdueCerts } = await supabase
      .from('ace_certificates')
      .select('id, participant_name, event_title, must_be_issued_by')
      .eq('status', 'pending')
      .lt('must_be_issued_by', new Date().toISOString().split('T')[0])
      .limit(10);

    overdueCerts?.forEach(cert => {
      const daysOverdue = Math.ceil((new Date().getTime() - new Date(cert.must_be_issued_by!).getTime()) / (1000 * 60 * 60 * 24));
      auditItems.push({
        type: 'certificate',
        id: cert.id,
        title: `Certificate for ${cert.participant_name} - ${cert.event_title}`,
        severity: daysOverdue > 7 ? 'critical' : 'warning',
        daysOverdue,
        action: 'Issue certificate immediately',
      });
    });

    const { data: overdueReviews } = await supabase
      .from('ace_feedback_responses')
      .select('id, event_id, coordinator_review_due_date')
      .is('coordinator_reviewed_at', null)
      .lt('coordinator_review_due_date', new Date().toISOString().split('T')[0])
      .limit(10);

    overdueReviews?.forEach(fb => {
      const daysOverdue = Math.ceil((new Date().getTime() - new Date(fb.coordinator_review_due_date!).getTime()) / (1000 * 60 * 60 * 24));
      auditItems.push({
        type: 'feedback',
        id: fb.id,
        title: 'Feedback pending coordinator review',
        severity: daysOverdue > 7 ? 'critical' : 'warning',
        daysOverdue,
        action: 'Review feedback and document findings',
      });
    });

    const { data: overdueComplaintsData } = await supabase
      .from('ace_complaints')
      .select('id, submitter_name, response_due_date')
      .is('resolved_at', null)
      .lt('response_due_date', new Date().toISOString().split('T')[0])
      .limit(10);

    overdueComplaintsData?.forEach(complaint => {
      const daysOverdue = Math.ceil((new Date().getTime() - new Date(complaint.response_due_date!).getTime()) / (1000 * 60 * 60 * 24));
      auditItems.push({
        type: 'complaint',
        id: complaint.id,
        title: `Complaint from ${complaint.submitter_name}`,
        severity: 'critical',
        daysOverdue,
        action: 'Provide written response immediately',
      });
    });

    const metrics = {
      overdueCertificates: overdueCertificates || 0,
      overdueFeedbackReviews: overdueFeedbackReviews || 0,
      overdueComplaints: overdueComplaints || 0,
      coordinatorCertExpiringSoon: coordinatorCertExpiringSoon || 0,
      providersLapsed: providersLapsed || 0,
      missingLegalVerification: missingLegalVerification || 0,
      complianceScore: score,
    };

    return NextResponse.json({ 
      success: true, 
      metrics,
      auditItems,
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching compliance data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch compliance data' },
      { status: 500 }
    );
  }
}
