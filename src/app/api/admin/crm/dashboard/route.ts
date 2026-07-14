export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { api, getConvexClient } from "@/lib/convex";

export async function GET() {
  try {
    const dashboard = await getConvexClient().query(api.crm.dashboard, {});
    return NextResponse.json({
      totalContacts: dashboard.totalContacts,
      activeDeals: dashboard.activeDeals,
      totalPipelineValue: dashboard.totalPipelineValue,
      pendingTasks: dashboard.pendingTasks,
      contactsByStatus: dashboard.contactsByStatus,
      dealsByStage: dashboard.dealsByStage,
      recentActivities: dashboard.recentActivities.map((activity: any) => ({
        ...activity,
        id: activity._id,
        activity_type: activity.activityType,
        activity_date: activity.activityDate,
        contact_name: activity.contactName,
      })),
      upcomingTasks: dashboard.upcomingTasks.map((task: any) => ({
        ...task,
        id: task._id,
        due_date: task.dueDate,
        contact_name: task.contactName,
      })),
      discovery: dashboard.discovery,
    });
  } catch (error) {
    console.error("Error fetching CRM dashboard data:", error);
    return NextResponse.json(
      {
        totalContacts: 0,
        activeDeals: 0,
        totalPipelineValue: 0,
        pendingTasks: 0,
        contactsByStatus: {},
        dealsByStage: {},
        recentActivities: [],
        upcomingTasks: [],
        discovery: {
          callsToday: 0,
          followUpNotSent: 0,
          followUpSent: 0,
          checkoutOpened: 0,
          checkoutStarted: 0,
          paidEnrolled: 0,
          overdueFollowUps: 0,
        },
      },
      { status: 200 }
    );
  }
}
