export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() { return createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!
); }

export async function GET() {
  try {
    // Get download counts grouped by resource/source
    const { data: downloads, error: downloadError } = await getSupabase()
      .from('download_submissions')
      .select('resource, source');

    if (downloadError) {
      console.error('Error fetching downloads:', downloadError);
      return NextResponse.json({ 
        success: false, 
        error: downloadError.message 
      }, { status: 500 });
    }

    // Count downloads per resource/source
    const resourceStats: Record<string, { downloads: number, views: number }> = {};

    downloads?.forEach((download) => {
      const key = download.resource || download.source;
      if (key) {
        if (!resourceStats[key]) {
          resourceStats[key] = { downloads: 0, views: 0 };
        }
        resourceStats[key].downloads += 1;
        // Estimate views as downloads * 1.5 (conversion rate)
        resourceStats[key].views = Math.round(resourceStats[key].downloads * 1.5);
      }
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
    const topResources = Object.entries(resourceStats)
      .map(([key, stats]) => ({
        name: resourceNameMap[key] || key.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' '),
        views: stats.views,
        downloads: stats.downloads,
        originalKey: key
      }))
      .sort((a, b) => b.downloads - a.downloads)
      .slice(0, 10); // Top 10 resources

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

