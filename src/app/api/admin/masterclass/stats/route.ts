import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

/**
 * GET /api/admin/masterclass/stats
 * Get masterclass statistics for admin dashboard
 */
export async function GET() {
  try {
    const supabase = createClient();

    // Get enrollment stats
    const { data: enrollments, error: enrollError } = await supabase
      .from('masterclass_enrollments')
      .select('id, created_at, completed_at, certificate_issued');

    if (enrollError) throw enrollError;

    const totalEnrollments = enrollments?.length || 0;
    const completedEnrollments = enrollments?.filter(e => e.completed_at)?.length || 0;
    const certificatesIssued = enrollments?.filter(e => e.certificate_issued)?.length || 0;

    // Get enrollments in last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentEnrollments = enrollments?.filter(
      e => new Date(e.created_at) >= sevenDaysAgo
    )?.length || 0;

    // Get completion rate
    const completionRate = totalEnrollments > 0
      ? Math.round((completedEnrollments / totalEnrollments) * 100)
      : 0;

    // Get section count
    const { data: sections, error: sectionError } = await supabase
      .from('masterclass_course_sections')
      .select('id')
      .eq('is_active', true);

    if (sectionError) throw sectionError;

    const totalSections = sections?.length || 0;

    // Get question count
    const { data: questions, error: questionError } = await supabase
      .from('masterclass_quiz_questions')
      .select('id')
      .eq('is_active', true);

    if (questionError) throw questionError;

    const totalQuestions = questions?.length || 0;

    return NextResponse.json({
      success: true,
      data: {
        totalEnrollments,
        completedEnrollments,
        certificatesIssued,
        recentEnrollments,
        completionRate,
        totalSections,
        totalQuestions,
      },
    });
  } catch (error) {
    console.error('Stats GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
