import { NextResponse } from 'next/server';
import { requireAdminApiSession } from '@/lib/admin-api-session';
import { api, getConvexClient } from '@/lib/convex';

// Force dynamic - needs runtime env vars
export const dynamic = 'force-dynamic';

export async function GET() {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;

  try {
    const convex = getConvexClient();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const [templateStats, submissionStats, downloadStats] = await Promise.all([
      convex.query(api.email.templateStats, {}),
      convex.query(api.submissions.submissionStats, {
        weekStartIso: oneWeekAgo.toISOString(),
      }),
      convex.query(api.downloads.downloadStats, {}),
    ]);

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
      { success: false, error: 'Dashboard metrics are temporarily unavailable' },
      { status: 503 }
    );
  }
}
