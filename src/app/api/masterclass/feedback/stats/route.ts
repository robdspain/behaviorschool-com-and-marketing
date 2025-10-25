import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

/**
 * GET /api/masterclass/feedback/stats
 * Get aggregated feedback statistics (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check if user is admin
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get stats from view
    const { data: stats, error } = await supabase
      .from('masterclass_feedback_stats')
      .select('*')
      .single();

    if (error) {
      console.error('Error fetching feedback stats:', error);
      return NextResponse.json(
        { error: 'Failed to fetch feedback statistics' },
        { status: 500 }
      );
    }

    // Get rating distribution
    const { data: allFeedback, error: feedbackError } = await supabase
      .from('masterclass_feedback')
      .select('overall_satisfaction, would_recommend');

    if (feedbackError) {
      console.error('Error fetching feedback for distribution:', feedbackError);
    }

    // Calculate distributions
    const satisfactionDistribution = [0, 0, 0, 0, 0];
    const recommendDistribution = [0, 0, 0, 0, 0];

    allFeedback?.forEach((fb) => {
      if (fb.overall_satisfaction) {
        satisfactionDistribution[fb.overall_satisfaction - 1]++;
      }
      if (fb.would_recommend) {
        recommendDistribution[fb.would_recommend - 1]++;
      }
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          ...stats,
          satisfaction_distribution: satisfactionDistribution,
          recommend_distribution: recommendDistribution,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in feedback stats:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching statistics' },
      { status: 500 }
    );
  }
}
