export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/admin-auth';
import { api, getConvexClient } from '@/lib/convex';

function parseDays(value: string | null) {
  const days = parseInt(value || '30', 10);
  if (!Number.isFinite(days) || days <= 0) return 30;
  return Math.min(days, 365);
}

function numberValue(value: unknown) {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdminSession();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const daysAgo = parseDays(searchParams.get('days'));

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);

    const previousStartDate = new Date();
    previousStartDate.setDate(previousStartDate.getDate() - (daysAgo * 2));

    const data = await getConvexClient().query(api.analytics.conversionSummary, {
      days: daysAgo,
      startDateIso: startDate.toISOString(),
      previousStartDateIso: previousStartDate.toISOString(),
      previousEndDateIso: startDate.toISOString(),
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in analytics/conversions API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Public conversion tracking endpoint used by lead-generation pages.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      event_type,
      event_name,
      source_page,
      user_email,
      resource_name,
      value,
      additional_data,
    } = body;

    if (!event_type || !event_name || !source_page) {
      return NextResponse.json(
        { error: 'Missing required fields: event_type, event_name, source_page' },
        { status: 400 }
      );
    }

    const userAgent = request.headers.get('user-agent') || undefined;
    const forwarded = request.headers.get('x-forwarded-for');
    const ipAddress = forwarded
      ? forwarded.split(',')[0]?.trim()
      : request.headers.get('x-real-ip') || undefined;

    const event = await getConvexClient().mutation(api.analytics.createConversionEvent, {
      eventType: String(event_type),
      eventName: String(event_name),
      sourcePage: String(source_page),
      userEmail: user_email ? String(user_email) : undefined,
      resourceName: resource_name ? String(resource_name) : undefined,
      value: numberValue(value),
      additionalData: additional_data,
      userAgent,
      ipAddress,
    });

    return NextResponse.json({
      success: true,
      event,
    });
  } catch (error) {
    console.error('Error in analytics/conversions POST:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
