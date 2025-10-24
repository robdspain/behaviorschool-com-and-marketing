import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { getCurrentUserProviderId } from '@/lib/ace/queries';

/**
 * GET /api/ace/providers/stats
 * Get dashboard statistics for the current user's provider
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the provider ID for the current user
    const providerId = await getCurrentUserProviderId();

    if (!providerId) {
      return NextResponse.json(
        { error: 'No provider found for current user' },
        { status: 404 }
      );
    }

    // Get total events count
    const { count: totalEvents, error: eventsError } = await supabase
      .from('ace_events')
      .select('*', { count: 'exact', head: true })
      .eq('provider_id', providerId);

    if (eventsError) throw eventsError;

    // Get active events count (approved or in_progress)
    const { count: activeEvents, error: activeError } = await supabase
      .from('ace_events')
      .select('*', { count: 'exact', head: true })
      .eq('provider_id', providerId)
      .in('status', ['approved', 'in_progress']);

    if (activeError) throw activeError;

    // Get total registrations count
    const { count: totalRegistrations, error: regError } = await supabase
      .from('ace_registrations')
      .select('event_id, ace_events!inner(provider_id)', { count: 'exact', head: true })
      .eq('ace_events.provider_id', providerId);

    if (regError) throw regError;

    // Get total certificates issued
    const { count: totalCertificatesIssued, error: certError } = await supabase
      .from('ace_certificates')
      .select('event_id, ace_events!inner(provider_id)', { count: 'exact', head: true })
      .eq('ace_events.provider_id', providerId)
      .eq('status', 'issued');

    if (certError) throw certError;

    const stats = {
      total_events: totalEvents || 0,
      active_events: activeEvents || 0,
      total_registrations: totalRegistrations || 0,
      total_certificates_issued: totalCertificatesIssued || 0,
    };

    return NextResponse.json({ success: true, data: stats }, { status: 200 });
  } catch (error) {
    console.error('Error fetching provider stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch provider statistics' },
      { status: 500 }
    );
  }
}
