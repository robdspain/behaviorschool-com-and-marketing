import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const getSupabase = () => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE) {
    throw new Error('Supabase env vars missing');
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE
  );
};

export async function GET() {
  try {
    // If env vars are missing (e.g. build time), this will throw but catch block handles it
    // or we just return 500. This prevents module-level crash.
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.warn('Supabase URL missing in archived-activities route');
      return NextResponse.json({ success: true, activities: [] });
    }

    const supabase = getSupabase();
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
