import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase-admin'
import { enqueueCampaignRecipients } from '@/lib/nm-mail'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const listmonkUrl = process.env.LISTMONK_URL;
    const listmonkUsername = process.env.LISTMONK_USERNAME;
    const listmonkPassword = process.env.LISTMONK_PASSWORD;

    if (!listmonkUrl || !listmonkUsername || !listmonkPassword) {
      return NextResponse.json({ error: 'Listmonk configuration missing' }, { status: 500 });
    }

    const { status } = await req.json();
    const authHeader = `Basic ${Buffer.from(`${listmonkUsername}:${listmonkPassword}`).toString('base64')}`;

    const response = await fetch(`${listmonkUrl}/api/campaigns/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: `Failed to update status: ${errorText}` }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ ok: true, enqueued: data.data }); // Returns number of subscribers enqueued

  } catch (error) {
    console.error('Error updating campaign status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
