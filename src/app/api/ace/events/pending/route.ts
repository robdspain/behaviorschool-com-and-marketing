import { NextRequest, NextResponse } from 'next/server';
import { getConvexClient, api } from '@/lib/convex';
import type { Id } from '@/lib/convex';

export const dynamic = 'force-dynamic';

/**
 * GET /api/ace/events/pending
 * Get events with status "pending_approval" for the provider
 */
export async function GET(request: NextRequest) {
  try {
    const client = getConvexClient();
    const { searchParams } = new URL(request.url);
    const providerId = searchParams.get('provider_id');

    if (!providerId) {
      return NextResponse.json(
        { error: 'Missing required parameter: provider_id' },
        { status: 400 }
      );
    }

    const typedProviderId = providerId as Id<'aceProviders'>;

    // Get all events for the provider
    const events = await client.query(api.aceEvents.getByProvider, {
      providerId: typedProviderId,
    });

    // Filter for pending_approval status
    const pendingEvents = events
      .filter((e: any) => e.status === 'pending_approval')
      .sort((a: any, b: any) => a.startDate - b.startDate);

    // Get instructor details for each event
    const eventsWithInstructors = await Promise.all(
      pendingEvents.map(async (event: any) => {
        let instructors: any[] = [];
        try {
          if ((api as any).aceEventInstructors?.getByEvent) {
            const eventInstructors = await client.query(
              (api as any).aceEventInstructors.getByEvent,
              { eventId: event._id }
            );
            instructors = eventInstructors || [];
          }
        } catch {
          instructors = [];
        }

        return {
          ...event,
          instructors,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: eventsWithInstructors,
      total: eventsWithInstructors.length,
    });
  } catch (error) {
    console.error('Error fetching pending events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pending events' },
      { status: 500 }
    );
  }
}
