import { NextRequest, NextResponse } from 'next/server';
import { getConvexClient, api } from '@/lib/convex';
import type { Id } from '../../../../../convex/_generated/dataModel';

export const dynamic = 'force-dynamic';

/**
 * GET /api/ace/providers
 * List all providers with optional filters: active, type
 */
export async function GET(request: NextRequest) {
  try {
    const client = getConvexClient();
    const searchParams = request.nextUrl.searchParams;

    const activeOnly = searchParams.get('active') === 'true';
    const type = searchParams.get('type') as 'individual' | 'organization' | null;

    const providers = await client.query(api.aceProviders.getAll, {
      activeOnly: activeOnly || undefined,
      type: type || undefined,
    });

    return NextResponse.json({
      success: true,
      providers,
    });
  } catch (error) {
    console.error('Error fetching providers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch providers' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/ace/providers
 * Create a new provider application
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      providerName,
      providerType,
      coordinatorId,
      coordinatorYearsCertified,
      primaryEmail,
      primaryPhone,
      website,
      addressLine1,
      addressLine2,
      city,
      state,
      zipCode,
      country,
      bacbProviderNumber,
    } = body;

    // Validate required fields
    if (!providerName || !providerType || !coordinatorId || !primaryEmail) {
      return NextResponse.json(
        {
          error:
            'Missing required fields: providerName, providerType, coordinatorId, primaryEmail',
        },
        { status: 400 }
      );
    }

    // Validate provider type
    if (!['individual', 'organization'].includes(providerType)) {
      return NextResponse.json(
        { error: 'providerType must be "individual" or "organization"' },
        { status: 400 }
      );
    }

    // Validate coordinator years
    if (
      coordinatorYearsCertified === undefined ||
      coordinatorYearsCertified < 0
    ) {
      return NextResponse.json(
        { error: 'coordinatorYearsCertified is required and must be >= 0' },
        { status: 400 }
      );
    }

    const client = getConvexClient();

    // Resolve coordinator: if coordinatorId looks like an email, find or create the user
    let resolvedCoordinatorId: Id<'aceUsers'> = coordinatorId as Id<'aceUsers'>;

    if (coordinatorId.includes('@')) {
      // Look up user by email
      const existingUser = await client.query(api.aceUsers.getByEmail, {
        email: coordinatorId.toLowerCase(),
      });

      if (existingUser) {
        resolvedCoordinatorId = existingUser._id;
      } else {
        // Extract name from additional body fields or default
        const coordFirstName = body.coordinatorName
          ? body.coordinatorName.split(' ')[0]
          : 'Coordinator';
        const coordLastName = body.coordinatorName
          ? body.coordinatorName.split(' ').slice(1).join(' ') || ''
          : '';

        resolvedCoordinatorId = await client.mutation(api.aceUsers.create, {
          email: coordinatorId.toLowerCase(),
          firstName: coordFirstName,
          lastName: coordLastName,
          role: 'ace_coordinator',
          bacbId: body.coordinatorBacbId || undefined,
          credentialType: 'bcba',
          isActive: true,
        });
      }
    }

    const providerId = await client.mutation(api.aceProviders.create, {
      providerName,
      providerType,
      coordinatorId: resolvedCoordinatorId,
      coordinatorYearsCertified: Number(coordinatorYearsCertified),
      primaryEmail,
      primaryPhone: primaryPhone || undefined,
      website: website || undefined,
      addressLine1: addressLine1 || undefined,
      addressLine2: addressLine2 || undefined,
      city: city || undefined,
      state: state || undefined,
      zipCode: zipCode || undefined,
      country: country || undefined,
      bacbProviderNumber: bacbProviderNumber || undefined,
    });

    // Fetch the created provider
    const provider = await client.query(api.aceProviders.getById, {
      id: providerId,
    });

    return NextResponse.json(
      {
        success: true,
        provider,
        message: 'Provider application submitted successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating provider:', error);
    return NextResponse.json(
      { error: 'Failed to create provider application' },
      { status: 500 }
    );
  }
}
