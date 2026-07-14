export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { api, getConvexClient } from '@/lib/convex';

interface Activity {
  type: string
  title: string
  description: string
  timestamp: string
}

export async function GET() {
  const convex = getConvexClient();
  const convexTemplateActivities = await convex
    .query(api.email.recentTemplateActivity, { limit: 5 })
    .catch((error) => {
      console.error('Error fetching Convex template activity:', error);
      return [];
    });
  const convexSignupActivities = await convex
    .query(api.submissions.recentSignupActivity, { limit: 10 })
    .catch((error) => {
      console.error('Error fetching Convex signup activity:', error);
      return [];
    });
  const convexDownloadActivities = await convex
    .query(api.downloads.recentDownloads, { limit: 5 })
    .catch((error) => {
      console.error('Error fetching Convex download activity:', error);
      return [];
    });
  const archivedActivities = await convex
    .query(api.activityArchive.listArchivedActivities, {})
    .catch((error) => {
      console.error('Error fetching Convex archived activity:', error);
      return [];
    });
  
  try {
    const activities: Activity[] = [];

    const archivedSet = new Set(
      archivedActivities.map((activity: any) => `${activity.activity_type}:${activity.activity_id}`)
    );

    // Get recent submissions from Convex.
    convexSignupActivities.forEach((submission: any) => {
      const activityId = `submission:${submission._id}`;
      if (!archivedSet.has(activityId)) {
        activities.push({
          type: 'submission',
          title: 'New submission received',
          description: `${submission.firstName} ${submission.lastName} submitted the signup form`,
          timestamp: submission.submittedAt,
        });
      }
    });

    // Get recent email template updates (last 5) from Convex
    convexTemplateActivities.forEach((template: any) => {
      const activityId = `template:${template._id}`;
      if (!archivedSet.has(activityId)) {
        activities.push({
          type: 'template',
          title: 'Email template updated',
          description: `${template.name} template was modified`,
          timestamp: template.updatedAt,
        });
      }
    });

    convexDownloadActivities.forEach((download: any) => {
      const activityId = `download:${download._id}`;
      if (!archivedSet.has(activityId)) {
        activities.push({
          type: 'download',
          title: 'Resource downloaded',
          description: `${download.resource} was downloaded`,
          timestamp: download.createdAt,
        });
      }
    });

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
