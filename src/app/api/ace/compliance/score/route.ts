import { NextRequest, NextResponse } from 'next/server';
import { getConvexClient, api } from '@/lib/convex';
import type { Id } from '@/lib/convex';

export const dynamic = 'force-dynamic';

/**
 * GET /api/ace/compliance/score
 * Calculate and return compliance score for a provider
 */
export async function GET(request: NextRequest) {
  try {
    const client = getConvexClient();
    const { searchParams } = new URL(request.url);
    const providerId = searchParams.get('provider_id');

    if (!providerId) {
      return NextResponse.json(
        { error: 'Missing required parameter: provider_id' },
        { status: 400 }
      );
    }

    const typedProviderId = providerId as Id<'aceProviders'>;

    const complianceScore = await client.query(
      api.aceCompliance.getComplianceScore,
      { providerId: typedProviderId }
    );

    return NextResponse.json({
      success: true,
      data: {
        score: complianceScore.score,
        deductions: complianceScore.deductions,
        level: complianceScore.level,
        calculatedAt: complianceScore.calculatedAt,
      },
    });
  } catch (error) {
    console.error('Error calculating compliance score:', error);
    const message =
      error instanceof Error
        ? error.message
        : 'Failed to calculate compliance score';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
