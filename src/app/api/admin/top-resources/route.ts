export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { api, getConvexClient } from '@/lib/convex';

export async function GET() {
  try {
    const resources = await getConvexClient().query(api.downloads.topResources, {
      limit: 10,
    });

    // Create a mapping of resource identifiers to display names
    const resourceNameMap: Record<string, string> = {
      'iep-behavior-goals': 'IEP Behavior Goals Generator',
      'iep-goals': 'IEP Behavior Goals Generator',
      'behavior-plans': 'Behavior Plan Writer',
      'behavior-plan': 'Behavior Plan Writer',
      'school-bcba': 'School BCBA Hub',
      'bcba-practice-exam': 'Free BCBA Practice Exam',
      'free-bcba-practice-exam': 'Free BCBA Practice Exam',
      'practice-exam': 'Free BCBA Practice Exam',
      'act-matrix': 'ACT Matrix Guide',
      'transformation-program': 'Transformation Program',
      'study-tools': 'BCBA Study Tools',
    };

    // Convert to array and map to friendly names
    const topResources = (resources || [])
      .map((resource: { key: string; downloads: number }) => ({
        name: resourceNameMap[resource.key] || resource.key.split('-').map(word =>
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' '),
        views: null,
        downloads: resource.downloads,
        originalKey: resource.key
      }));

    return NextResponse.json({
      success: true,
      resources: topResources
    });
  } catch (error) {
    console.error('Top resources error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch top resources' },
      { status: 500 }
    );
  }
}
