import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase-admin';

export async function GET(request: NextRequest) {
  try {
    // Check authentication (you can add your admin auth logic here)
    // const isAuthenticated = await checkAdminAuth(request);
    // if (!isAuthenticated) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const supabase = createSupabaseAdminClient();

    // Get conversion data from the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Fetch signup submissions (email signups)
    const { data: signups, error: signupsError } = await supabase
      .from('signup_submissions')
      .select('*')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: false });

    if (signupsError) {
      console.error('Error fetching signups:', signupsError);
    }

    // Fetch download submissions
    const { data: downloads, error: downloadsError } = await supabase
      .from('download_submissions')
      .select('*')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: false });

    if (downloadsError) {
      console.error('Error fetching downloads:', downloadsError);
    }

    // Calculate conversion metrics
    const emailSignups = signups?.length || 0;
    const downloadCount = downloads?.length || 0;
    const totalConversions = emailSignups + downloadCount;

    // Calculate trends (compare with previous 30 days)
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const { data: prevSignups } = await supabase
      .from('signup_submissions')
      .select('*')
      .gte('created_at', sixtyDaysAgo.toISOString())
      .lt('created_at', thirtyDaysAgo.toISOString());

    const { data: prevDownloads } = await supabase
      .from('download_submissions')
      .select('*')
      .gte('created_at', sixtyDaysAgo.toISOString())
      .lt('created_at', thirtyDaysAgo.toISOString());

    const prevEmailSignups = prevSignups?.length || 0;
    const prevDownloadCount = prevDownloads?.length || 0;

    // Calculate percentage changes
    const emailSignupTrend = prevEmailSignups > 0 
      ? Math.round(((emailSignups - prevEmailSignups) / prevEmailSignups) * 100)
      : 0;
    
    const downloadTrend = prevDownloadCount > 0 
      ? Math.round(((downloadCount - prevDownloadCount) / prevDownloadCount) * 100)
      : 0;

    // Calculate total value (using the values from GA4 config)
    const totalValue = (emailSignups * 5) + (downloadCount * 10);

    // Prepare recent events
    const recentEvents = [
      ...(signups?.slice(0, 10).map(signup => ({
        id: signup.id,
        event_type: 'email_signup',
        event_name: 'email_signup',
        source_page: signup.source || 'unknown',
        user_email: signup.email,
        value: 5,
        timestamp: signup.created_at,
        additional_data: {
          name: signup.name,
          source: signup.source
        }
      })) || []),
      ...(downloads?.slice(0, 10).map(download => ({
        id: download.id,
        event_type: 'download',
        event_name: 'file_download',
        source_page: download.source || 'unknown',
        user_email: download.email,
        resource_name: download.resource,
        value: 10,
        timestamp: download.created_at,
        additional_data: {
          resource: download.resource,
          source: download.source
        }
      })) || [])
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
     .slice(0, 20);

    const conversionData = {
      totalConversions,
      emailSignups,
      downloads: downloadCount,
      courseInquiries: 0, // Placeholder - you can add this table later
      studyAppSignups: 0, // Placeholder - you can add this table later
      toolUsage: 0, // Placeholder - you can add this table later
      conversionRate: 0, // You'll need page view data to calculate this
      totalValue,
      period: 'Last 30 days',
      trends: {
        emailSignups: emailSignupTrend,
        downloads: downloadTrend,
        courseInquiries: 0,
        studyAppSignups: 0
      }
    };

    return NextResponse.json({
      success: true,
      conversionData,
      recentEvents
    });

  } catch (error) {
    console.error('Error fetching conversion data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversion data' },
      { status: 500 }
    );
  }
}
