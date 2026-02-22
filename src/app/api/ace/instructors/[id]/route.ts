import { NextRequest, NextResponse } from 'next/server';
import { getConvexClient, api } from '@/lib/convex';
import type { Id } from '../../../../../../convex/_generated/dataModel';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const client = getConvexClient();
    const qualification = await client.query(api.aceInstructors.getById, {
      id: params.id as Id<"aceInstructorQualifications">,
    });

    if (!qualification) {
      return NextResponse.json(
        { error: 'Instructor qualification not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      qualification,
    });
  } catch (error) {
    console.error('Fetch instructor qualification error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const {
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

    const client = getConvexClient();

    // Check if qualification exists
    const existing = await client.query(api.aceInstructors.getById, {
      id: params.id as Id<"aceInstructorQualifications">,
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Instructor qualification not found' },
        { status: 404 }
      );
    }

    await client.mutation(api.aceInstructors.update, {
      id: params.id as Id<"aceInstructorQualifications">,
      isBcba,
      isBcbaD,
      isPhDAba,
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
      message: 'Instructor qualification updated',
    });
  } catch (error) {
    console.error('Update instructor qualification error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
