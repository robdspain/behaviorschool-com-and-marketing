export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { completeMultipartUpload } from '@/lib/r2';

export async function POST(request: NextRequest) {
  try {
    const { key, uploadId, parts } = await request.json();

    if (!key || !uploadId || !parts?.length) {
      return NextResponse.json(
        { error: 'key, uploadId, and parts are required' },
        { status: 400 }
      );
    }

    const result = await completeMultipartUpload(key, uploadId, parts);

    return NextResponse.json(result);
  } catch (error) {
    console.error('R2 multipart complete error:', error);
    return NextResponse.json(
      { error: 'Failed to complete multipart upload' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
