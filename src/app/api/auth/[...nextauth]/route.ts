// NextAuth temporarily disabled to avoid conflicts with Supabase auth
// export const runtime = "nodejs";
// import { handlers } from "@/auth";
// export const GET = handlers.GET;
// export const POST = handlers.POST;

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'NextAuth is temporarily disabled' }, { status: 404 });
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ message: 'NextAuth is temporarily disabled' }, { status: 404 });
}


