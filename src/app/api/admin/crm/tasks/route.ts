import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase-admin';

// GET - Fetch all tasks
export async function GET() {
  try {
    const supabase = createSupabaseAdminClient();

    const { data, error } = await supabase
      .from('crm_tasks')
      .select('*')
      .eq('is_archived', false)
      .order('due_date', { ascending: true });

    if (error) {
      console.error('Error fetching tasks:', error);
      return NextResponse.json(
        { message: 'Failed to fetch tasks' },
        { status: 500 }
      );
    }

    return NextResponse.json(data || [], { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new task
export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseAdminClient();
    const body = await request.json();

    const {
      title,
      description,
      contactId,
      dueDate,
      priority = 'medium',
      taskType = 'follow_up'
    } = body;

    if (!title || !contactId || !dueDate) {
      return NextResponse.json(
        { message: 'Title, contact, and due date are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('crm_tasks')
      .insert({
        title,
        description: description || null,
        contact_id: contactId,
        due_date: dueDate,
        priority,
        task_type: taskType,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating task:', error);
      return NextResponse.json(
        { message: error.message || 'Failed to create task' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
