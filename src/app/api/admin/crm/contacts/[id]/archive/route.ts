import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase-admin';

// POST - Archive a contact (soft delete)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createSupabaseAdminClient();
    const { id } = params;

    const { data, error } = await supabase
      .from('crm_contacts')
      .update({
        is_archived: true,
        archived_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error archiving contact:', error);
      return NextResponse.json(
        { message: 'Failed to archive contact' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Contact archived successfully', data },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
