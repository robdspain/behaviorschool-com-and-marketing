"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.GOOGLE_INDEXING_SETUP = void 0;
exports.submitToGoogleIndexing = submitToGoogleIndexing;
/**
 * Google Indexing API Integration
 *
 * This provides faster Google indexing than waiting for crawling.
 * Requires Google Cloud Service Account setup.
 */
const jwt = __importStar(require("jsonwebtoken"));
// Google Indexing API endpoint
const GOOGLE_INDEXING_API = 'https://indexing.googleapis.com/v3/urlNotifications:publish';
/**
 * Submit URLs to Google Indexing API
 * Note: Requires GOOGLE_SERVICE_ACCOUNT_KEY environment variable
 */
async function submitToGoogleIndexing(urls) {
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
                }
                else {
                    const errorText = await response.text();
                    errors.push(`${absoluteUrl}: HTTP ${response.status} - ${errorText}`);
                    console.log(`❌ Google Indexing API failed: ${absoluteUrl} - ${response.status}`);
                }
            }
            catch (error) {
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
    }
    catch (error) {
        return {
            success: false,
            urls: [],
            errors: [error instanceof Error ? error.message : 'Unknown error'],
            timestamp: new Date().toISOString()
        };
    }
}
async function getGoogleAccessToken(serviceAccountKey) {
    const key = JSON.parse(serviceAccountKey);
    const token = jwt.sign({
        iss: key.client_email,
        scope: 'https://www.googleapis.com/auth/indexing',
        aud: 'https://oauth2.googleapis.com/token',
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000),
    }, key.private_key, { algorithm: 'RS256' });
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
exports.GOOGLE_INDEXING_SETUP = `
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
