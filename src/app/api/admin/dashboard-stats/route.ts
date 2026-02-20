import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Force dynamic - needs runtime env vars
export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE!
  );
  
  try {
    // Get total submissions count
    const { count: totalSubmissions, error: submissionsError } = await supabase
      .from('signup_submissions')
      .select('*', { count: 'exact', head: true });

    if (submissionsError) {
      console.error('Error fetching submissions count:', submissionsError);
    }

    // Get submissions from last week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const { count: weekSubmissions, error: weekError } = await supabase
      .from('signup_submissions')
      .select('*', { count: 'exact', head: true })
      .gte('submitted_at', oneWeekAgo.toISOString());

    if (weekError) {
      console.error('Error fetching week submissions:', weekError);
    }

    // Get email templates count
    const { count: totalTemplates, error: templatesError } = await supabase
      .from('email_templates')
      .select('*', { count: 'exact', head: true });

    if (templatesError) {
      console.error('Error fetching templates count:', templatesError);
    }

    // Get active templates count
    const { count: activeTemplates, error: activeError } = await supabase
      .from('email_templates')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    if (activeError) {
      console.error('Error fetching active templates:', activeError);
    }

    // Get draft templates count
    const draftTemplates = (totalTemplates || 0) - (activeTemplates || 0);

    // Get download submissions count
    const { count: downloadCount, error: downloadError } = await supabase
      .from('download_submissions')
      .select('*', { count: 'exact', head: true });

    if (downloadError) {
      console.error('Error fetching downloads:', downloadError);
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalSubmissions: totalSubmissions || 0,
        weekSubmissions: weekSubmissions || 0,
        totalTemplates: totalTemplates || 0,
        activeTemplates: activeTemplates || 0,
        draftTemplates: draftTemplates || 0,
        totalDownloads: downloadCount || 0,
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

