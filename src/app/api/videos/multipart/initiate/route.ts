import { NextRequest, NextResponse } from 'next/server';
import { initiateMultipartUpload } from '@/lib/r2';

export async function POST(request: NextRequest) {
  try {
    const { fileName, contentType, size } = await request.json();

    if (!fileName || !contentType || !size) {
      return NextResponse.json(
        { error: 'fileName, contentType, and size are required' },
        { status: 400 }
      );
    }

    const result = await initiateMultipartUpload(fileName, contentType, size);

    return NextResponse.json(result);
  } catch (error) {
    console.error('R2 multipart initiate error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to initiate multipart upload' },
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
