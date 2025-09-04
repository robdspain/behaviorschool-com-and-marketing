import { NextRequest, NextResponse } from 'next/server';

const INDEXNOW_API_KEY = 'D6F638D35C42D071C62B47907C2CD0CC';
const INDEXNOW_ENDPOINTS = [
  'https://api.indexnow.org/indexnow',
  'https://www.bing.com/indexnow',
  'https://yandex.com/indexnow'
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { urls, host } = body;

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { error: 'URLs array is required' },
        { status: 400 }
      );
    }

    const payload = {
      host: host || 'behaviorschool.com',
      key: INDEXNOW_API_KEY,
      keyLocation: `https://behaviorschool.com/${INDEXNOW_API_KEY}.txt`,
      urlList: urls.map(url => {
        // Ensure URLs are absolute
        if (url.startsWith('/')) {
          return `https://behaviorschool.com${url}`;
        }
        if (!url.startsWith('http')) {
          return `https://behaviorschool.com/${url}`;
        }
        return url;
      })
    };

    const results = [];

    // Submit to multiple IndexNow endpoints for better coverage
    for (const endpoint of INDEXNOW_ENDPOINTS) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });

        results.push({
          endpoint,
          status: response.status,
          success: response.ok,
          message: response.ok ? 'Success' : `HTTP ${response.status}`
        });
      } catch (error) {
        results.push({
          endpoint,
          status: 0,
          success: false,
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return NextResponse.json({
      success: results.some(r => r.success),
      results,
      submittedUrls: payload.urlList,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('IndexNow API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint for testing
export async function GET() {
  return NextResponse.json({
    message: 'IndexNow API endpoint is active',
    key: INDEXNOW_API_KEY,
    keyLocation: `https://behaviorschool.com/${INDEXNOW_API_KEY}.txt`,
    endpoints: INDEXNOW_ENDPOINTS,
    usage: {
      method: 'POST',
      body: {
        urls: ['array of URLs to submit'],
        host: 'optional host override'
      }
    }
  });
}
