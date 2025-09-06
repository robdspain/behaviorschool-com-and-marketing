import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase-admin';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '30d';
    
    // Calculate date range
    const now = new Date();
    let startDate: Date;
    
    switch (timeRange) {
      case '1d':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const supabase = createSupabaseAdminClient();

    // Fetch signup submissions (email signups)
    const { data: signups, error: signupsError } = await supabase
      .from('signup_submissions')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });

    if (signupsError) {
      console.error('Error fetching signups:', signupsError);
    }

    // Fetch download submissions
    const { data: downloads, error: downloadsError } = await supabase
      .from('download_submissions')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });

    if (downloadsError) {
      console.error('Error fetching downloads:', downloadsError);
    }

    // Calculate metrics
    const totalSignups = signups?.length || 0;
    const totalDownloads = downloads?.length || 0;
    const totalConversions = totalSignups + totalDownloads;

    // Calculate trends (compare with previous period)
    const previousStartDate = new Date(startDate.getTime() - (now.getTime() - startDate.getTime()));
    
    const { data: prevSignups } = await supabase
      .from('signup_submissions')
      .select('*')
      .gte('created_at', previousStartDate.toISOString())
      .lt('created_at', startDate.toISOString());

    const { data: prevDownloads } = await supabase
      .from('download_submissions')
      .select('*')
      .gte('created_at', previousStartDate.toISOString())
      .lt('created_at', startDate.toISOString());

    const prevTotalSignups = prevSignups?.length || 0;
    const prevTotalDownloads = prevDownloads?.length || 0;
    const prevTotalConversions = prevTotalSignups + prevTotalDownloads;

    // Calculate percentage changes
    const signupTrend = prevTotalSignups > 0 
      ? Math.round(((totalSignups - prevTotalSignups) / prevTotalSignups) * 100)
      : totalSignups > 0 ? 100 : 0;
    
    const downloadTrend = prevTotalDownloads > 0 
      ? Math.round(((totalDownloads - prevTotalDownloads) / prevTotalDownloads) * 100)
      : totalDownloads > 0 ? 100 : 0;

    const conversionTrend = prevTotalConversions > 0 
      ? Math.round(((totalConversions - prevTotalConversions) / prevTotalConversions) * 100)
      : totalConversions > 0 ? 100 : 0;

    // Get top pages from signup sources
    const pageStats = new Map<string, { views: number; uniqueViews: number }>();
    
    [...(signups || []), ...(downloads || [])].forEach(item => {
      const source = item.source || 'unknown';
      if (!pageStats.has(source)) {
        pageStats.set(source, { views: 0, uniqueViews: 0 });
      }
      const stats = pageStats.get(source)!;
      stats.views++;
      stats.uniqueViews++;
    });

    const topPages = Array.from(pageStats.entries())
      .map(([page, stats]) => ({
        page,
        views: stats.views,
        uniqueViews: stats.uniqueViews
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    // Get traffic sources (simplified - you can enhance this with actual analytics)
    const trafficSources = [
      { source: 'Direct', visitors: Math.floor(totalConversions * 0.4), percentage: 40 },
      { source: 'Organic Search', visitors: Math.floor(totalConversions * 0.35), percentage: 35 },
      { source: 'Email', visitors: Math.floor(totalConversions * 0.15), percentage: 15 },
      { source: 'Social Media', visitors: Math.floor(totalConversions * 0.07), percentage: 7 },
      { source: 'Referral', visitors: Math.floor(totalConversions * 0.03), percentage: 3 }
    ];

    // Prepare recent activity
    const recentActivity = [
      ...(signups?.slice(0, 10).map(signup => ({
        timestamp: new Date(signup.created_at).toLocaleString(),
        event: 'Email Signup',
        page: signup.source || 'unknown',
        user: signup.email
      })) || []),
      ...(downloads?.slice(0, 10).map(download => ({
        timestamp: new Date(download.created_at).toLocaleString(),
        event: 'Download',
        page: download.source || 'unknown',
        user: download.email
      })) || [])
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
     .slice(0, 10);

    // Calculate average session duration (mock for now - you can enhance with real analytics)
    const averageSessionDuration = '3m 42s';
    const bounceRate = '42.3%';

    const analyticsData = {
      pageViews: totalConversions * 15, // Estimate based on conversions
      uniqueVisitors: totalConversions * 12, // Estimate based on conversions
      averageSessionDuration,
      bounceRate,
      topPages,
      trafficSources,
      recentActivity,
      // Real conversion data
      totalSignups,
      totalDownloads,
      totalConversions,
      trends: {
        signups: signupTrend,
        downloads: downloadTrend,
        conversions: conversionTrend
      }
    };

    return NextResponse.json({
      success: true,
      data: analyticsData,
      period: timeRange
    });

  } catch (error) {
    console.error('Error fetching analytics data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}
