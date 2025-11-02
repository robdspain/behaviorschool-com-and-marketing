import { NextResponse } from 'next/server';
import {
  getActiveSections,
  getAllActiveQuestions,
  getResourcesBySectionIds,
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

    // Fetch resources for these sections
    const sectionIds = sections.map(s => s.id);
    const resources = await getResourcesBySectionIds(sectionIds);

    // Convert database format to course format
    const courseSections = sections.map(section => {
      const base = dbSectionToCourseSection(section, questions);
      const sectionResources = resources
        .filter(r => r.section_id === section.id)
        .map(r => ({
          id: r.id,
          name: r.name,
          url: r.url,
          fileType: r.file_type,
        }));
      return { ...base, resources: sectionResources };
    });

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
