export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/admin-api-session";
import { api, getConvexClient } from "@/lib/convex";
import type { Id } from "@/lib/convex";

type InstructorQualification = {
  _id: string;
  userId: string;
  providerId: string;
  isBcba: boolean;
  isBcbaD: boolean;
  isPhDAba: boolean;
  certificationNumber?: string;
  certificationDate?: number;
  certificationExpiration?: number;
  cvUrl?: string;
  transcriptUrl?: string;
  certificationProofUrl?: string;
  qualificationPath?: string;
  expertiseBasis?: string;
  yearsExperienceInSubject?: number;
  yearsTeachingSubject?: number;
  verifiedBy?: string;
  verifiedAt?: number;
  isApproved: boolean;
  qualificationReviewNotes?: string;
  expertiseReviewNotes?: string;
  createdAt: number;
  updatedAt: number;
  user?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    bacbId?: string;
    credentialNumber?: string;
  } | null;
};

const validPaths = new Set([
  "active_bcba",
  "doctorate_behavior_analysis",
  "doctorate_with_coursework",
  "doctorate_with_mentorship",
  "doctorate_with_publications",
  "doctorate_with_postdoc_hours",
]);

const validExpertise = new Set([
  "five_years_practice",
  "three_years_teaching",
  "published_research",
]);

function optionalNumber(value: unknown) {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value === "number") return Number.isFinite(value) ? value : undefined;
  if (typeof value !== "string") return undefined;
  const asNumber = Number(value);
  if (Number.isFinite(asNumber)) return asNumber;
  const asDate = new Date(value).getTime();
  return Number.isFinite(asDate) ? asDate : undefined;
}

function optionalString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function isoDate(value?: number) {
  return typeof value === "number" && Number.isFinite(value)
    ? new Date(value).toISOString()
    : null;
}

function toInstructorRow(row: InstructorQualification | null) {
  if (!row) return null;
  return {
    id: row._id,
    user_id: row.userId,
    provider_id: row.providerId,
    is_bcba: row.isBcba,
    is_bcba_d: row.isBcbaD,
    is_phd_aba: row.isPhDAba,
    is_doctoral_student_ms_complete: false,
    certification_number: row.certificationNumber ?? null,
    certification_date: isoDate(row.certificationDate),
    certification_expiration: isoDate(row.certificationExpiration),
    cv_url: row.cvUrl ?? null,
    transcript_url: row.transcriptUrl ?? null,
    certification_proof_url: row.certificationProofUrl ?? null,
    qualification_path: row.qualificationPath ?? null,
    expertise_basis: row.expertiseBasis ?? null,
    years_experience_in_subject: row.yearsExperienceInSubject ?? null,
    years_teaching_subject: row.yearsTeachingSubject ?? null,
    verified_by: row.verifiedBy ?? null,
    verified_at: isoDate(row.verifiedAt),
    is_approved: row.isApproved,
    qualification_review_notes: row.qualificationReviewNotes ?? null,
    expertise_review_notes: row.expertiseReviewNotes ?? null,
    created_at: isoDate(row.createdAt),
    updated_at: isoDate(row.updatedAt),
    user: row.user
      ? {
          id: row.user._id,
          first_name: row.user.firstName,
          last_name: row.user.lastName,
          email: row.user.email,
          bacb_id: row.user.bacbId ?? row.user.credentialNumber ?? null,
        }
      : null,
  };
}

function getQualificationPath(value: unknown) {
  const path = optionalString(value);
  return path && validPaths.has(path) ? path : undefined;
}

function getExpertiseBasis(value: unknown) {
  const basis = optionalString(value);
  return basis && validExpertise.has(basis) ? basis : undefined;
}

// GET /api/admin/ace/instructors - List all instructor qualifications
export async function GET(request: NextRequest) {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;

  try {
    const { searchParams } = new URL(request.url);
    const providerId = searchParams.get("provider_id");

    const data = await getConvexClient().query(api.aceInstructors.getAll, {
      providerId: providerId ? (providerId as Id<"aceProviders">) : undefined,
    });

    return NextResponse.json(
      { success: true, data: data.map(toInstructorRow) },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching instructors:", error);
    return NextResponse.json({ error: "Failed to fetch instructors" }, { status: 500 });
  }
}

// POST /api/admin/ace/instructors - Add instructor qualification
export async function POST(request: NextRequest) {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();

    if (!body.user_id || !body.provider_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const qualificationPath = getQualificationPath(body.qualification_path);
    if (body.qualification_path && !qualificationPath) {
      return NextResponse.json({ error: "Invalid qualification path" }, { status: 400 });
    }

    const expertiseBasis = getExpertiseBasis(body.expertise_basis);
    if (body.expertise_basis && !expertiseBasis) {
      return NextResponse.json({ error: "Invalid expertise basis" }, { status: 400 });
    }

    const client = getConvexClient();
    const id = await client.mutation(api.aceInstructors.submit, {
      userId: body.user_id as Id<"aceUsers">,
      providerId: body.provider_id as Id<"aceProviders">,
      isBcba: body.is_bcba ?? false,
      isBcbaD: body.is_bcba_d ?? false,
      isPhDAba: body.is_phd_aba ?? false,
      certificationNumber: optionalString(body.certification_number),
      certificationDate: optionalNumber(body.certification_date),
      certificationExpiration: optionalNumber(body.certification_expiration),
      cvUrl: optionalString(body.cv_url),
      transcriptUrl: optionalString(body.transcript_url),
      certificationProofUrl: optionalString(body.certification_proof_url),
      qualificationPath,
      expertiseBasis,
      yearsExperienceInSubject: optionalNumber(body.years_experience_in_subject),
      yearsTeachingSubject: optionalNumber(body.years_teaching_subject),
    });

    const created = await client.query(api.aceInstructors.getById, { id });
    return NextResponse.json({ success: true, data: toInstructorRow(created) }, { status: 201 });
  } catch (error) {
    console.error("Error creating instructor qualification:", error);
    return NextResponse.json(
      { error: "Failed to create instructor qualification" },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/ace/instructors - Review/update instructor qualification
export async function PATCH(request: NextRequest) {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();

    if (!body.qualification_id) {
      return NextResponse.json({ error: "Missing qualification_id" }, { status: 400 });
    }

    const qualificationPath = getQualificationPath(body.qualification_path);
    if (body.qualification_path && !qualificationPath) {
      return NextResponse.json({ error: "Invalid qualification path" }, { status: 400 });
    }

    const expertiseBasis = getExpertiseBasis(body.expertise_basis);
    if (body.expertise_basis && !expertiseBasis) {
      return NextResponse.json({ error: "Invalid expertise basis" }, { status: 400 });
    }

    const data = await getConvexClient().mutation(api.aceInstructors.update, {
      id: body.qualification_id as Id<"aceInstructorQualifications">,
      isBcba: body.is_bcba,
      isBcbaD: body.is_bcba_d,
      isPhDAba: body.is_phd_aba,
      certificationNumber: optionalString(body.certification_number),
      certificationDate: optionalNumber(body.certification_date),
      certificationExpiration: optionalNumber(body.certification_expiration),
      cvUrl: optionalString(body.cv_url),
      transcriptUrl: optionalString(body.transcript_url),
      certificationProofUrl: optionalString(body.certification_proof_url),
      qualificationPath,
      expertiseBasis,
      yearsExperienceInSubject: optionalNumber(body.years_experience_in_subject),
      yearsTeachingSubject: optionalNumber(body.years_teaching_subject),
      isApproved: body.is_approved,
      verifiedAt: body.is_approved ? optionalNumber(body.verified_at) ?? Date.now() : undefined,
      qualificationReviewNotes: optionalString(body.qualification_review_notes),
      expertiseReviewNotes: optionalString(body.expertise_review_notes),
    });

    return NextResponse.json({ success: true, data: toInstructorRow(data) }, { status: 200 });
  } catch (error) {
    console.error("Error updating instructor qualification:", error);
    return NextResponse.json(
      { error: "Failed to update instructor qualification" },
      { status: 500 }
    );
  }
}
