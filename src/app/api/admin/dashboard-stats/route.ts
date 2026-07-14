import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { api, getConvexClient } from '@/lib/convex';

// Force dynamic - needs runtime env vars
export const dynamic = 'force-dynamic';

export async function GET() {
  const convex = getConvexClient();
  const templateStats = await convex
    .query(api.email.templateStats, {})
    .catch((error) => {
      console.error('Error fetching Convex template stats:', error);
      return { totalTemplates: 0, activeTemplates: 0, draftTemplates: 0 };
    });

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const submissionStats = await convex
    .query(api.submissions.submissionStats, {
      weekStartIso: oneWeekAgo.toISOString(),
    })
    .catch((error) => {
      console.error('Error fetching Convex submission stats:', error);
      return { totalSubmissions: 0, weekSubmissions: 0 };
    });

  // Return zeros if Supabase isn't configured
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url || !key) {
    return NextResponse.json({
      success: true,
      stats: {
        totalSubmissions: submissionStats.totalSubmissions,
        weekSubmissions: submissionStats.weekSubmissions,
        totalTemplates: templateStats.totalTemplates,
        activeTemplates: templateStats.activeTemplates,
        draftTemplates: templateStats.draftTemplates,
        totalDownloads: 0,
      }
    });
  }

  const supabase = createClient(url, key);
  
  try {
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
        totalSubmissions: submissionStats.totalSubmissions,
        weekSubmissions: submissionStats.weekSubmissions,
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
