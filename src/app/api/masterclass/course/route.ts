import { NextResponse } from 'next/server';
import {
  getActiveSections,
  getAllActiveQuestions,
} from '@/lib/masterclass/admin-queries';
import { dbSectionToCourseSection } from '@/lib/masterclass/admin-types';

/**
 * GET /api/masterclass/course
 * Get full course content (sections + quizzes) for display
 */
export async function GET() {
  try {
    // Fetch active sections and questions
    const [sections, questions] = await Promise.all([
      getActiveSections(),
      getAllActiveQuestions(),
    ]);

    // Convert database format to course format
    const courseSections = sections.map(section =>
      dbSectionToCourseSection(section, questions)
    );

    return NextResponse.json({
      success: true,
      data: {
        sections: courseSections,
      },
    });
  } catch (error) {
    console.error('Course GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch course content' },
      { status: 500 }
    );
  }
}
