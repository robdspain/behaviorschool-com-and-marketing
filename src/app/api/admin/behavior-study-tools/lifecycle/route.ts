export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { isValidAdminSessionToken } from '@/lib/adminSession';

const COOKIE_NAME = 'bs_admin_auth';
const DEFAULT_SUMMARY_URL =
  'https://study.behaviorschool.com/.netlify/functions/signup-nurture-summary';
const DEFAULT_NURTURE_URL =
  'https://study.behaviorschool.com/.netlify/functions/signup-nurture';
const MAX_MANUAL_SEND_LIMIT = 5;

async function isAuthenticatedAdmin() {
  const cookieStore = await cookies();
  return cookieStore
    .getAll(COOKIE_NAME)
    .some((cookie) => isValidAdminSessionToken(cookie.value));
}

export async function GET(request: NextRequest) {
  if (!(await isAuthenticatedAdmin())) {
    return NextResponse.json({ error: 'Admin authentication required' }, { status: 401 });
  }

  const windowDays = request.nextUrl.searchParams.get('windowDays') || '14';
  const summaryUrl = process.env.STUDY_NURTURE_SUMMARY_URL || DEFAULT_SUMMARY_URL;
  const nurtureSecret = process.env.SIGNUP_NURTURE_SECRET;
  const url = new URL(summaryUrl);
  url.searchParams.set('windowDays', windowDays);

  try {
    const response = await fetch(url.toString(), {
      cache: 'no-store',
      headers: nurtureSecret ? { 'X-Signup-Nurture-Secret': nurtureSecret } : undefined,
    });
    const text = await response.text();
    let payload: unknown;
    try {
      payload = text ? JSON.parse(text) : {};
    } catch {
      return NextResponse.json(
        {
          error: 'Behavior Study Tools lifecycle source returned non-JSON',
          status: response.status,
        },
        { status: 502 },
      );
    }

    return NextResponse.json(payload, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Unable to load Behavior Study Tools lifecycle data',
        detail: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 502 },
    );
  }
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticatedAdmin())) {
    return NextResponse.json({ error: 'Admin authentication required' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  if (body.action !== 'send_nurture_batch') {
    return NextResponse.json({ error: 'Unsupported Behavior Study Tools action' }, { status: 400 });
  }

  if (body.confirm !== 'SEND_REAL_NURTURE') {
    return NextResponse.json({ error: 'Manual confirmation is required before sending nurture emails' }, { status: 400 });
  }

  const nurtureSecret = process.env.SIGNUP_NURTURE_SECRET;
  if (!nurtureSecret) {
    return NextResponse.json({ error: 'SIGNUP_NURTURE_SECRET is not configured' }, { status: 500 });
  }

  const limit = clamp(Number(body.limit || 1), 1, MAX_MANUAL_SEND_LIMIT);
  const windowDays = clamp(Number(body.windowDays || 14), 1, 90);
  const nurtureUrl = process.env.STUDY_NURTURE_SEND_URL || DEFAULT_NURTURE_URL;

  try {
    const response = await fetch(nurtureUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Signup-Nurture-Secret': nurtureSecret,
      },
      body: JSON.stringify({
        send: true,
        limit,
        windowDays,
        source: 'behaviorschool-admin',
      }),
    });
    const text = await response.text();
    const payload = parseJson(text);
    if (payload === null) {
      return NextResponse.json(
        { error: 'Behavior Study Tools nurture sender returned non-JSON', status: response.status },
        { status: 502 },
      );
    }

    return NextResponse.json(payload, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Unable to send Behavior Study Tools nurture batch',
        detail: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 502 },
    );
  }
}

function parseJson(value: string) {
  try {
    return JSON.parse(value || '{}');
  } catch {
    return null;
  }
}

function clamp(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, value));
}
