import { NextRequest, NextResponse } from 'next/server';
import { getConvexClient, api } from '@/lib/convex';
import type { Id } from '../../../../../convex/_generated/dataModel';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const client = getConvexClient();
  const searchParams = request.nextUrl.searchParams;
  const providerId = searchParams.get('provider_id');
  const userId = searchParams.get('user_id');
  const status = searchParams.get('status'); // "approved", "pending", "rejected"

  try {
    let qualifications;

    if (userId) {
      qualifications = await client.query(api.aceInstructors.getByUser, {
        userId: userId as Id<"aceUsers">,
      });
    } else if (providerId && status === 'pending') {
      qualifications = await client.query(api.aceInstructors.getPending, {
        providerId: providerId as Id<"aceProviders">,
      });
    } else if (providerId) {
      qualifications = await client.query(api.aceInstructors.getByProvider, {
        providerId: providerId as Id<"aceProviders">,
      });

      // Filter by status if specified
      if (status === 'approved') {
        qualifications = qualifications.filter((q: any) => q.isApproved && q.verifiedAt);
      } else if (status === 'rejected') {
        qualifications = qualifications.filter((q: any) => !q.isApproved && q.verifiedAt);
      }
    } else {
      return NextResponse.json(
        { error: 'Please provide provider_id or user_id parameter' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      qualifications,
    });
  } catch (error) {
    console.error('Fetch instructor qualifications error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      // User fields (for get-or-create)
      firstName,
      lastName,
      email,
      bacbId,
      // Or pass userId directly
      userId: directUserId,
      // Qualification fields
      providerId,
      isBcba,
      isBcbaD,
      isPhDAba,
      certificationNumber,
      certificationDate,
      certificationExpiration,
      cvUrl,
      transcriptUrl,
      certificationProofUrl,
      qualificationPath,
      expertiseBasis,
      yearsExperienceInSubject,
      yearsTeachingSubject,
    } = body;

    // Validate required fields
    if (!providerId) {
      return NextResponse.json(
        { error: 'Missing required field: providerId' },
        { status: 400 }
      );
    }

    if (!directUserId && (!firstName || !lastName || !email)) {
      return NextResponse.json(
        { error: 'Missing required fields: provide userId, or firstName + lastName + email' },
        { status: 400 }
      );
    }

    const client = getConvexClient();

    // Get or create user if userId not provided directly
    let userId = directUserId as Id<"aceUsers">;
    if (!userId) {
      userId = await client.mutation(api.aceUsers.getOrCreate, {
        email,
        firstName,
        lastName,
        bacbId: bacbId || undefined,
      });
    }

    const qualificationId = await client.mutation(api.aceInstructors.submit, {
      userId,
      providerId: providerId as Id<"aceProviders">,
      isBcba: isBcba ?? false,
      isBcbaD: isBcbaD ?? false,
      isPhDAba: isPhDAba ?? false,
      certificationNumber,
      certificationDate: certificationDate ? Number(certificationDate) : undefined,
      certificationExpiration: certificationExpiration ? Number(certificationExpiration) : undefined,
      cvUrl,
      transcriptUrl,
      certificationProofUrl,
      qualificationPath,
      expertiseBasis,
      yearsExperienceInSubject: yearsExperienceInSubject ? Number(yearsExperienceInSubject) : undefined,
      yearsTeachingSubject: yearsTeachingSubject ? Number(yearsTeachingSubject) : undefined,
    });

    return NextResponse.json({
      success: true,
      qualification_id: qualificationId,
      user_id: userId,
    });
  } catch (error) {
    console.error('Submit instructor qualification error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
