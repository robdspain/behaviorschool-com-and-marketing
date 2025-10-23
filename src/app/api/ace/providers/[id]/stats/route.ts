import { NextRequest, NextResponse } from 'next/server';
import { getProviderDashboardStats } from '@/lib/ace/queries';

/**
 * GET /api/ace/providers/[id]/stats
 * Get provider dashboard statistics
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const stats = await getProviderDashboardStats(id);

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Provider stats GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch provider stats' },
      { status: 500 }
    );
  }
}
