import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get date range from query params (default to last 30 days)
    const searchParams = request.nextUrl.searchParams;
    const daysAgo = parseInt(searchParams.get('days') || '30');
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);

    // Calculate previous period for trend comparison
    const previousStartDate = new Date();
    previousStartDate.setDate(previousStartDate.getDate() - (daysAgo * 2));
    const previousEndDate = startDate;

    // Fetch analytics events from the database
    const { data: currentEvents, error: currentError } = await supabase
      .from('analytics_events')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });

    if (currentError) {
      console.error('Error fetching current events:', currentError);
      return NextResponse.json(
        { error: 'Failed to fetch analytics data' },
        { status: 500 }
      );
    }

    // Fetch previous period events for trend calculation
    const { data: previousEvents, error: previousError } = await supabase
      .from('analytics_events')
      .select('*')
      .gte('created_at', previousStartDate.toISOString())
      .lt('created_at', previousEndDate.toISOString());

    if (previousError) {
      console.error('Error fetching previous events:', previousError);
    }

    // Calculate metrics for current period
    const emailSignups = currentEvents?.filter(e => e.event_type === 'email_signup').length || 0;
    const downloads = currentEvents?.filter(e => e.event_type === 'download').length || 0;
    const courseInquiries = currentEvents?.filter(e => e.event_type === 'course_inquiry').length || 0;
    const studyAppSignups = currentEvents?.filter(e => e.event_type === 'study_app_signup').length || 0;
    const toolUsage = currentEvents?.filter(e => e.event_type === 'tool_usage').length || 0;
    const totalConversions = currentEvents?.length || 0;

    // Calculate total value
    const totalValue = currentEvents?.reduce((sum, event) => {
      return sum + (parseFloat(event.value) || 0);
    }, 0) || 0;

    // Calculate metrics for previous period
    const prevEmailSignups = previousEvents?.filter(e => e.event_type === 'email_signup').length || 0;
    const prevDownloads = previousEvents?.filter(e => e.event_type === 'download').length || 0;
    const prevCourseInquiries = previousEvents?.filter(e => e.event_type === 'course_inquiry').length || 0;
    const prevStudyAppSignups = previousEvents?.filter(e => e.event_type === 'study_app_signup').length || 0;

    // Calculate trends (percentage change)
    const calculateTrend = (current: number, previous: number): number => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    // Calculate conversion rate (assuming we have page views tracked somewhere)
    // For now, using a placeholder. You can integrate with GA4 API for real data
    const conversionRate = totalConversions > 0 ? 24 : 0;

    // Prepare conversion data
    const conversionData = {
      totalConversions,
      emailSignups,
      downloads,
      courseInquiries,
      studyAppSignups,
      toolUsage,
      conversionRate,
      totalValue: parseFloat(totalValue.toFixed(2)),
      period: `Last ${daysAgo} days`,
      trends: {
        emailSignups: calculateTrend(emailSignups, prevEmailSignups),
        downloads: calculateTrend(downloads, prevDownloads),
        courseInquiries: calculateTrend(courseInquiries, prevCourseInquiries),
        studyAppSignups: calculateTrend(studyAppSignups, prevStudyAppSignups),
      }
    };

    // Get recent events (last 10)
    const recentEvents = currentEvents?.slice(0, 10).map(event => ({
      id: event.id,
      event_type: event.event_type,
      event_name: event.event_name,
      source_page: event.source_page,
      user_email: event.user_email,
      resource_name: event.resource_name,
      value: parseFloat(event.value) || 0,
      timestamp: event.created_at,
      additional_data: event.additional_data,
    })) || [];

    return NextResponse.json({
      conversionData,
      recentEvents,
    });

  } catch (error) {
    console.error('Error in analytics/conversions API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST endpoint to track new conversion events
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();

    // Parse request body
    const body = await request.json();
    const {
      event_type,
      event_name,
      source_page,
      user_email,
      resource_name,
      value,
      additional_data
    } = body;

    // Validate required fields
    if (!event_type || !event_name || !source_page) {
      return NextResponse.json(
        { error: 'Missing required fields: event_type, event_name, source_page' },
        { status: 400 }
      );
    }

    // Get user agent and IP from headers
    const user_agent = request.headers.get('user-agent') || '';
    const forwarded = request.headers.get('x-forwarded-for');
    const ip_address = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || '';

    // Insert event into database
    const { data, error } = await supabase
      .from('analytics_events')
      .insert({
        event_type,
        event_name,
        source_page,
        user_email,
        resource_name,
        value: value || 0,
        additional_data,
        user_agent,
        ip_address,
      })
      .select()
      .single();

    if (error) {
      console.error('Error inserting analytics event:', error);
      return NextResponse.json(
        { error: 'Failed to save analytics event' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      event: data,
    });

  } catch (error) {
    console.error('Error in analytics/conversions POST:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

