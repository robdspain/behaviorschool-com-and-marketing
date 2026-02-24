export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase-admin';

export async function GET() {
  try {
    const supabase = createSupabaseAdminClient();

    // Fetch contacts count and status breakdown
    const { data: contacts, error: contactsError } = await supabase
      .from('crm_contacts')
      .select('id, status')
      .eq('is_archived', false);

    if (contactsError) throw contactsError;

    // Fetch active deals count and total value
    const { data: deals, error: dealsError } = await supabase
      .from('crm_deals')
      .select('id, stage, value')
      .not('stage', 'in', '(closed_won,closed_lost)');

    if (dealsError) throw dealsError;

    // Fetch pending tasks count
    const { data: tasks, error: tasksError } = await supabase
      .from('crm_tasks')
      .select('id, title, contact_id, priority, due_date')
      .eq('status', 'pending')
      .order('due_date', { ascending: true })
      .limit(10);

    if (tasksError) throw tasksError;

    // Fetch recent activities with contact names
    const { data: activities, error: activitiesError } = await supabase
      .from('crm_activities')
      .select(`
        id,
        activity_type,
        subject,
        activity_date,
        contact_id,
        crm_contacts (first_name, last_name)
      `)
      .order('activity_date', { ascending: false })
      .limit(10);

    if (activitiesError) throw activitiesError;

    // Calculate stats
    const totalContacts = contacts?.length || 0;
    const activeDeals = deals?.length || 0;
    const totalPipelineValue = deals?.reduce((sum, deal) => sum + (Number(deal.value) || 0), 0) || 0;
    const pendingTasks = tasks?.length || 0;

    // Group contacts by status
    const contactsByStatus: { [key: string]: number } = {};
    contacts?.forEach((contact) => {
      const status = contact.status || 'unknown';
      contactsByStatus[status] = (contactsByStatus[status] || 0) + 1;
    });

    // Group deals by stage
    const dealsByStage: { [key: string]: number } = {};
    deals?.forEach((deal) => {
      const stage = deal.stage || 'unknown';
      dealsByStage[stage] = (dealsByStage[stage] || 0) + 1;
    });

    // Format activities with contact names
    const recentActivities = activities?.map((activity: any) => ({
      ...activity,
      contact_name: activity.crm_contacts
        ? `${activity.crm_contacts.first_name} ${activity.crm_contacts.last_name}`
        : 'Unknown Contact'
    })) || [];

    // Get contact names for tasks
    const taskContactIds = tasks?.map(t => t.contact_id).filter(Boolean) || [];
    const { data: taskContacts } = await supabase
      .from('crm_contacts')
      .select('id, first_name, last_name')
      .in('id', taskContactIds);

    const contactMap = new Map(
      taskContacts?.map(c => [c.id, `${c.first_name} ${c.last_name}`]) || []
    );

    const upcomingTasks = tasks?.map(task => ({
      ...task,
      contact_name: task.contact_id ? contactMap.get(task.contact_id) : 'No Contact'
    })) || [];

    return NextResponse.json({
      totalContacts,
      activeDeals,
      totalPipelineValue,
      pendingTasks,
      contactsByStatus,
      dealsByStage,
      recentActivities,
      upcomingTasks
    });
  } catch (error) {
    console.error('Error fetching CRM dashboard data:', error);
    return NextResponse.json(
      {
        totalContacts: 0,
        activeDeals: 0,
        totalPipelineValue: 0,
        pendingTasks: 0,
        contactsByStatus: {},
        dealsByStage: {},
        recentActivities: [],
        upcomingTasks: []
      },
      { status: 200 } // Return empty data instead of error
    );
  }
}
