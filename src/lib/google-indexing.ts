/**
 * Google Indexing API Integration
 * 
 * This provides faster Google indexing than waiting for crawling.
 * Requires Google Cloud Service Account setup.
 */
import * as jwt from 'jsonwebtoken';

export interface GoogleIndexingResult {
  success: boolean;
  urls: string[];
  errors?: string[];
  timestamp: string;
}

// Google Indexing API endpoint
const GOOGLE_INDEXING_API = 'https://indexing.googleapis.com/v3/urlNotifications:publish';

/**
 * Submit URLs to Google Indexing API
 * Note: Requires GOOGLE_SERVICE_ACCOUNT_KEY environment variable
 */
export async function submitToGoogleIndexing(urls: string | string[]): Promise<GoogleIndexingResult> {
  const urlList = Array.isArray(urls) ? urls : [urls];
  const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  
  if (!serviceAccountKey) {
    console.log('ℹ️  Google Indexing API not configured - skipping Google submission');
    return {
      success: false,
      urls: urlList,
      errors: ['Google Service Account key not configured'],
      timestamp: new Date().toISOString()
    };
  }

  const results = [];
  const errors = [];

  try {
    // Get access token (in a real implementation, you'd cache this)
    const accessToken = await getGoogleAccessToken(serviceAccountKey);
    
    for (const url of urlList) {
      try {
        const absoluteUrl = url.startsWith('/') ? `https://behaviorschool.com${url}` : url;
        
        const response = await fetch(GOOGLE_INDEXING_API, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: absoluteUrl,
            type: 'URL_UPDATED'
          })
        });

        if (response.ok) {
          results.push(absoluteUrl);
          console.log(`✅ Google Indexing API: ${absoluteUrl}`);
        } else {
          const errorText = await response.text();
          errors.push(`${absoluteUrl}: HTTP ${response.status} - ${errorText}`);
          console.log(`❌ Google Indexing API failed: ${absoluteUrl} - ${response.status}`);
        }
      } catch (error) {
        const errorMsg = `${url}: ${error instanceof Error ? error.message : 'Unknown error'}`;
        errors.push(errorMsg);
      }
    }

    return {
      success: results.length > 0,
      urls: results,
      errors: errors.length > 0 ? errors : undefined,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    return {
      success: false,
      urls: [],
      errors: [error instanceof Error ? error.message : 'Unknown error'],
      timestamp: new Date().toISOString()
    };
  }
}

async function getGoogleAccessToken(serviceAccountKey: string): Promise<string> {
  const key = JSON.parse(serviceAccountKey);
  const token = jwt.sign(
    {
      iss: key.client_email,
      scope: 'https://www.googleapis.com/auth/indexing',
      aud: 'https://oauth2.googleapis.com/token',
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000),
    },
    key.private_key,
    { algorithm: 'RS256' }
  );

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: token,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Failed to fetch access token: ${data.error_description}`);
  }
  return data.access_token;
}

/**
 * Setup instructions for Google Indexing API
 */
export const GOOGLE_INDEXING_SETUP = `
🔧 Google Indexing API Setup Instructions:

1. Go to Google Cloud Console (https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Indexing API
4. Create a Service Account:
   - Go to IAM & Admin > Service Accounts
   - Click "Create Service Account"
   - Download the JSON key file
5. Add the service account to Google Search Console as an owner
6. Set environment variable: GOOGLE_SERVICE_ACCOUNT_KEY=<base64 encoded key>

Alternative: Use Google Search Console URL inspection for manual submissions
`;