import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing database connection...');
    const supabase = createSupabaseAdminClient();
    
    // Test basic connection
    const { data: testQuery, error: testError } = await supabase
      .from('signup_submissions')
      .select('count(*)')
      .limit(1);

    if (testError) {
      console.error('Database test error:', testError);
      return NextResponse.json({
        success: false,
        message: 'Database connection failed',
        error: testError.message,
        details: testError
      });
    }

    // Try to get actual data
    const { data: signups, error } = await supabase
      .from('signup_submissions')
      .select('*')
      .order('submitted_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json({
        success: false,
        message: 'Failed to query signup submissions',
        error: error.message,
        details: error
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      count: signups?.length || 0,
      data: signups || [],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Test endpoint error:', error);
    return NextResponse.json({
      success: false,
      message: 'Test endpoint failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
