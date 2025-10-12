import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!
);

interface Activity {
  type: string
  title: string
  description: string
  timestamp: string
}

export async function GET() {
  try {
    const activities: Activity[] = [];

    // Get recent submissions (last 10)
    const { data: submissions, error: submissionsError } = await supabase
      .from('signup_submissions')
      .select('first_name, last_name, submitted_at')
      .order('submitted_at', { ascending: false })
      .limit(5);

    if (!submissionsError && submissions) {
      submissions.forEach(sub => {
        activities.push({
          type: 'submission',
          title: 'New submission received',
          description: `${sub.first_name} ${sub.last_name} submitted the signup form`,
          timestamp: sub.submitted_at,
        });
      });
    }

    // Get recent email template updates (last 5)
    const { data: templates, error: templatesError } = await supabase
      .from('email_templates')
      .select('name, updated_at')
      .order('updated_at', { ascending: false })
      .limit(3);

    if (!templatesError && templates) {
      templates.forEach(template => {
        activities.push({
          type: 'template',
          title: 'Email template updated',
          description: `${template.name} template was modified`,
          timestamp: template.updated_at,
        });
      });
    }

    // Get recent downloads (last 5)
    const { data: downloads, error: downloadsError } = await supabase
      .from('download_submissions')
      .select('resource, created_at')
      .order('created_at', { ascending: false })
      .limit(3);

    if (!downloadsError && downloads) {
      downloads.forEach(download => {
        activities.push({
          type: 'download',
          title: 'Resource downloaded',
          description: `${download.resource} was downloaded`,
          timestamp: download.created_at,
        });
      });
    }

    // Sort all activities by timestamp (most recent first)
    activities.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Take top 10
    const recentActivities = activities.slice(0, 10);

    return NextResponse.json({
      success: true,
      activities: recentActivities
    });
  } catch (error) {
    console.error('Recent activity error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch recent activity' },
      { status: 500 }
    );
  }
}

