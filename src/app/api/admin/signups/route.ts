import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase-server';
// import { verifyAdminSession } from '@/lib/admin-auth'; // TODO: Re-enable when cookie auth is fixed

export async function GET() {
  try {
    const supabase = createSupabaseAdminClient();
    
    // TODO: Re-enable authentication once cookie handling is fixed
    // Verify admin authentication
    // const adminUser = await verifyAdminSession(request);
    // if (!adminUser) {
    //   return NextResponse.json(
    //     { success: false, message: 'Unauthorized access' },
    //     { status: 401 }
    //   );
    // }
    
    const { data: signups, error } = await supabase
      .from('signup_submissions')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to fetch signup submissions' },
        { status: 500 }
      );
    }

    // Transform the data to match the frontend expectations
    const transformedSignups = signups?.map(signup => ({
      id: signup.id,
      firstName: signup.first_name,
      lastName: signup.last_name,
      email: signup.email,
      phone: signup.phone,
      organization: signup.organization,
      role: signup.role,
      caseloadSize: signup.caseload_size,
      currentChallenges: signup.current_challenges,
      status: signup.status,
      submittedAt: signup.submitted_at,
      notes: signup.notes
    })) || [];

    return NextResponse.json({
      success: true,
      data: transformedSignups
    });

  } catch (error) {
    console.error('Error fetching signups:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch signup submissions' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createSupabaseAdminClient();
    
    // TODO: Re-enable authentication once cookie handling is fixed
    // Verify admin authentication
    // const adminUser = await verifyAdminSession(request);
    // if (!adminUser) {
    //   return NextResponse.json(
    //     { success: false, message: 'Unauthorized access' },
    //     { status: 401 }
    //   );
    // }
    const body = await request.json();
    const { id, status, notes } = body;

    const { data: updatedSignup, error } = await supabase
      .from('signup_submissions')
      .update({
        status: status,
        notes: notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to update signup submission' },
        { status: 500 }
      );
    }

    if (!updatedSignup) {
      return NextResponse.json(
        { success: false, message: 'Signup submission not found' },
        { status: 404 }
      );
    }

    // Transform the response
    const transformedSignup = {
      id: updatedSignup.id,
      firstName: updatedSignup.first_name,
      lastName: updatedSignup.last_name,
      email: updatedSignup.email,
      phone: updatedSignup.phone,
      organization: updatedSignup.organization,
      role: updatedSignup.role,
      caseloadSize: updatedSignup.caseload_size,
      currentChallenges: updatedSignup.current_challenges,
      status: updatedSignup.status,
      submittedAt: updatedSignup.submitted_at,
      notes: updatedSignup.notes
    };

    return NextResponse.json({
      success: true,
      data: transformedSignup
    });

  } catch (error) {
    console.error('Error updating signup:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update signup submission' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createSupabaseAdminClient();
    
    // TODO: Re-enable authentication once cookie handling is fixed
    // Verify admin authentication
    // const adminUser = await verifyAdminSession(request);
    // if (!adminUser) {
    //   return NextResponse.json(
    //     { success: false, message: 'Unauthorized access' },
    //     { status: 401 }
    //   );
    // }
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Signup ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('signup_submissions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to delete signup submission' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Signup submission deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting signup:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete signup submission' },
      { status: 500 }
    );
  }
}
