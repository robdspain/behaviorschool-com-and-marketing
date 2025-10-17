import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!
);

export async function GET() {
  try {
    const { data: archivedActivities, error } = await supabase
      .from('archived_activities')
      .select('*')
      .order('archived_at', { ascending: false });

    if (error) {
      console.error('Fetch archived activities error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch archived activities' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      activities: archivedActivities || []
    });
  } catch (error) {
    console.error('Fetch archived activities error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch archived activities' },
      { status: 500 }
    );
  }
}
