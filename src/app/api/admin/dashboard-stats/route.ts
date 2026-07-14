import { NextResponse } from 'next/server';
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
  const downloadStats = await convex
    .query(api.downloads.downloadStats, {})
    .catch((error) => {
      console.error('Error fetching Convex download stats:', error);
      return { totalDownloads: 0 };
    });
  
  try {
    return NextResponse.json({
      success: true,
      stats: {
        totalSubmissions: submissionStats.totalSubmissions,
        weekSubmissions: submissionStats.weekSubmissions,
        totalTemplates: templateStats.totalTemplates,
        activeTemplates: templateStats.activeTemplates,
        draftTemplates: templateStats.draftTemplates,
        totalDownloads: downloadStats.totalDownloads,
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
