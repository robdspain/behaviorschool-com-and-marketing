import { NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase-admin'

type Daily = { date: string; opens: number; clicks: number }

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const listmonkUrl = process.env.LISTMONK_URL;
    const listmonkUsername = process.env.LISTMONK_USERNAME;
    const listmonkPassword = process.env.LISTMONK_PASSWORD;

    if (!listmonkUrl || !listmonkUsername || !listmonkPassword) {
      return NextResponse.json({ error: 'Listmonk configuration missing' }, { status: 500 });
    }

    const authHeader = `Basic ${Buffer.from(`${listmonkUsername}:${listmonkPassword}`).toString('base64')}`;

    // Get campaign stats
    const campaignResponse = await fetch(`${listmonkUrl}/api/campaigns/${id}`, {
      headers: { 'Authorization': authHeader }
    });

    if (!campaignResponse.ok) {
      const errorText = await campaignResponse.text();
      return NextResponse.json({ error: `Failed to fetch campaign: ${errorText}` }, { status: campaignResponse.status });
    }

    const campaignData = await campaignResponse.json();
    const stats = campaignData.data.stats || {};

    // Get analytics data (opens, clicks over time) - Listmonk API structure might vary, adapting to common
    const analyticsResponse = await fetch(`${listmonkUrl}/api/campaigns/${id}/stats`, {
      headers: { 'Authorization': authHeader }
    });
    
    // Fallback if stats endpoint fails or structure differs
    let dailyStats = [];
    if (analyticsResponse.ok) {
        const analyticsData = await analyticsResponse.json();
        dailyStats = analyticsData.data || [];
    }

    // Since Listmonk might not give per-link stats easily without queries, we'll try best effort
    // For now, return what we have
    return NextResponse.json({
        ok: true,
        totals: {
            opens: stats.views || 0,
            clicks: stats.clicks || 0
        },
        daily: dailyStats,
        linkTop: [] // Placeholder until we implement link tracking query
    });

  } catch (error) {
    console.error('Error fetching campaign analytics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

