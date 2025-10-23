import { NextRequest, NextResponse } from 'next/server';
import { createAceProvider, getAllAceProviders } from '@/lib/ace/queries';
import type { AceProviderFormData } from '@/lib/ace/types';

/**
 * GET /api/ace/providers
 * Get all providers
 */
export async function GET() {
  try {
    const providers = await getAllAceProviders();

    return NextResponse.json({
      success: true,
      data: providers,
    });
  } catch (error) {
    console.error('Providers GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch providers' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/ace/providers
 * Create new provider
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as AceProviderFormData;

    const provider = await createAceProvider(body);

    return NextResponse.json({
      success: true,
      data: provider,
      message: 'Provider created successfully',
    });
  } catch (error) {
    console.error('Provider POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create provider' },
      { status: 500 }
    );
  }
}
