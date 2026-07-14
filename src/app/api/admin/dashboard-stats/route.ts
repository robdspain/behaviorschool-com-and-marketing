import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { api, getConvexClient } from '@/lib/convex';

// Force dynamic - needs runtime env vars
export const dynamic = 'force-dynamic';

export async function GET() {
  const templateStats = await getConvexClient()
    .query(api.email.templateStats, {})
    .catch((error) => {
      console.error('Error fetching Convex template stats:', error);
      return { totalTemplates: 0, activeTemplates: 0, draftTemplates: 0 };
    });

  // Return zeros if Supabase isn't configured
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE;
  
  if (!url || !key) {
    return NextResponse.json({
      success: true,
      stats: {
        totalSubmissions: 0,
        weekSubmissions: 0,
        totalTemplates: templateStats.totalTemplates,
        activeTemplates: templateStats.activeTemplates,
        draftTemplates: templateStats.draftTemplates,
        totalDownloads: 0,
      }
    });
  }

  const supabase = createClient(url, key);
  
  try {
    // Get total submissions count
    const { count: totalSubmissions, error: submissionsError } = await supabase
      .from('signup_submissions')
      .select('*', { count: 'exact', head: true });

    if (submissionsError) {
      console.error('Error fetching submissions count:', submissionsError);
    }

    // Get submissions from last week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const { count: weekSubmissions, error: weekError } = await supabase
      .from('signup_submissions')
      .select('*', { count: 'exact', head: true })
      .gte('submitted_at', oneWeekAgo.toISOString());

    if (weekError) {
      console.error('Error fetching week submissions:', weekError);
    }

    // Get download submissions count
    const { count: downloadCount, error: downloadError } = await supabase
      .from('download_submissions')
      .select('*', { count: 'exact', head: true });

    if (downloadError) {
      console.error('Error fetching downloads:', downloadError);
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalSubmissions: totalSubmissions || 0,
        weekSubmissions: weekSubmissions || 0,
        totalTemplates: templateStats.totalTemplates,
        activeTemplates: templateStats.activeTemplates,
        draftTemplates: templateStats.draftTemplates,
        totalDownloads: downloadCount || 0,
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
