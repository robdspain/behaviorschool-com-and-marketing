export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = 'bs_admin_session';
const SESSION_MAX_AGE = 60 * 60 * 24;
const DEFAULT_SUMMARY_URL =
  'https://study.behaviorschool.com/.netlify/functions/signup-nurture-summary';

function isValidToken(token: string): boolean {
  const [tsPart] = token.split('.');
  if (!tsPart) return false;
  const ts = parseInt(tsPart, 36);
  if (Number.isNaN(ts)) return false;
  return Date.now() - ts < SESSION_MAX_AGE * 1000;
}

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token || !isValidToken(token)) {
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
