export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { 
  submitToIndexNow,
  validateIndexNowKey 
} from '@/lib/indexnow';
import { submitPriorityUrlsUniversal } from '@/lib/universal-indexing';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { urls, action } = body;

    // Validate request
    if (!urls && !action) {
      return NextResponse.json(
        { error: 'Either urls array or action is required' },
        { status: 400 }
      );
    }

    let result;

    // Handle different actions
    switch (action) {
      case 'priority':
        result = await submitPriorityUrlsUniversal();
        break;
      case 'validate':
        const isValid = await validateIndexNowKey();
        return NextResponse.json({ valid: isValid, key: isValid ? 'accessible' : 'not accessible' });
      default:
        if (urls && Array.isArray(urls)) {
          result = await submitToIndexNow(urls);
        } else {
          return NextResponse.json(
            { error: 'Invalid request format' },
            { status: 400 }
          );
        }
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('IndexNow API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  try {
    switch (action) {
      case 'validate':
        const isValid = await validateIndexNowKey();
        return NextResponse.json({ 
          valid: isValid, 
          key: isValid ? 'accessible' : 'not accessible',
          keyUrl: 'https://behaviorschool.com/a07fc6c7-3148-489c-85e2-5d82ab778569.txt'
        });
      
      case 'status':
        return NextResponse.json({
          service: 'IndexNow API',
          status: 'operational',
          endpoints: [
            'https://api.indexnow.org/indexnow',
            'https://bing.com/indexnow',
            'https://yandex.com/indexnow'
          ],
          keyId: 'a07fc6c7-3148-489c-85e2-5d82ab778569',
          timestamp: new Date().toISOString()
        });
      
      default:
        return NextResponse.json({
          error: 'Invalid action',
          availableActions: ['validate', 'status'],
          usage: {
            GET: 'Use ?action=validate or ?action=status',
            POST: 'Send { urls: [...] } or { action: "priority" }'
          }
        }, { status: 400 });
    }
  } catch (error) {
    console.error('IndexNow API GET error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

