import { NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase-admin'
import { renderCampaignHTML } from '@/lib/nm-mail'

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

    const response = await fetch(`${listmonkUrl}/api/campaigns/${id}/preview`, {
      headers: {
        'Authorization': authHeader
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: `Failed to fetch preview: ${errorText}` }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ html: data.data }); // listmonk returns raw html in data field usually

  } catch (error) {
    console.error('Error fetching campaign preview:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

