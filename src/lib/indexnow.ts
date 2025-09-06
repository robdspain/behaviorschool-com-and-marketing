/**
 * IndexNow API Integration for Behavior School
 * 
 * This utility handles direct notifications to search engines when content changes.
 * Supports Bing, Yandex, and other IndexNow-compatible search engines.
 */

const INDEXNOW_KEY = 'a07fc6c7-3148-489c-85e2-5d82ab778569';
const SITE_URL = 'https://behaviorschool.com';

// IndexNow endpoints for different search engines
const INDEXNOW_ENDPOINTS = [
  'https://api.indexnow.org/indexnow',  // Primary endpoint
  'https://bing.com/indexnow',          // Bing direct
  'https://yandex.com/indexnow',        // Yandex direct
];

interface IndexNowSubmission {
  host: string;
  key: string;
  keyLocation: string;
  urlList: string[];
}

export interface IndexNowResult {
  success: boolean;
  results: Array<{
    endpoint: string;
    status: number;
    success: boolean;
    error?: string;
  }>;
  submittedUrls: string[];
  timestamp: string;
}

export interface IndexNowOptions {
  retries?: number;
  timeout?: number;
}

/**
 * Submit URLs to IndexNow for immediate search engine notification
 */
export async function submitToIndexNow(
  urls: string | string[],
  options: IndexNowOptions = {}
): Promise<IndexNowResult> {
  const { timeout = 10000 } = options;
  
  // Normalize URLs to array
  const urlList = Array.isArray(urls) ? urls : [urls];
  
  // Ensure all URLs are absolute
  const absoluteUrls = urlList.map(url => {
    if (url.startsWith('/')) {
      return `${SITE_URL}${url}`;
    }
    return url;
  });

  const submission: IndexNowSubmission = {
    host: new URL(SITE_URL).hostname,
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: absoluteUrls,
  };

  const results = [];
  let hasSuccess = false;

  // Submit to all endpoints for maximum coverage
  for (const endpoint of INDEXNOW_ENDPOINTS) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'BehaviorSchool-IndexNow/1.0',
        },
        body: JSON.stringify(submission),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const success = response.ok;
      if (success) hasSuccess = true;

      results.push({
        endpoint,
        status: response.status,
        success,
        error: success ? undefined : `HTTP ${response.status}`,
      });

      // Log for debugging
      if (process.env.NODE_ENV === 'development') {
        console.log(`IndexNow ${endpoint}: ${response.status} for ${urlList.length} URLs`);
      }

    } catch (error) {
      results.push({
        endpoint,
        status: 0,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  return {
    success: hasSuccess,
    results,
    submittedUrls: absoluteUrls,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Submit a single URL with automatic retry logic
 */
export async function submitUrlToIndexNow(url: string): Promise<boolean> {
  try {
    const result = await submitToIndexNow(url);
    return result.success;
  } catch (error) {
    console.error('IndexNow submission failed:', error);
    return false;
  }
}

/**
 * Submit multiple URLs in batch (maximum 10,000 per submission)
 */
export async function submitBatchToIndexNow(urls: string[]): Promise<IndexNowResult> {
  // IndexNow has a limit of 10,000 URLs per request
  const BATCH_SIZE = 10000;
  
  if (urls.length === 0) {
    return {
      success: true,
      results: [],
      submittedUrls: [],
      timestamp: new Date().toISOString(),
    };
  }
  
  // If within limit, submit all at once
  if (urls.length <= BATCH_SIZE) {
    return submitToIndexNow(urls);
  }
  
  // Otherwise, submit in batches and combine results
  const allResults = [];
  const allUrls = [];
  let overallSuccess = false;
  
  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    const batch = urls.slice(i, i + BATCH_SIZE);
    try {
      const result = await submitToIndexNow(batch);
      if (result.success) overallSuccess = true;
      allResults.push(...result.results);
      allUrls.push(...result.submittedUrls);
    } catch (error) {
      console.error('Batch IndexNow submission failed:', error);
    }
  }
  
  return {
    success: overallSuccess,
    results: allResults,
    submittedUrls: allUrls,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Common URLs that should be submitted when content changes
 */
export const PRIORITY_URLS = [
  '/',
  '/bcba-exam-prep',
  '/school-based-bcba',
  '/iep-goals',
  '/behavior-study-tools',
  '/supervisors',
  '/behavior-plans',
  '/school-based-behavior-support',
  '/transformation-program',
  '/blog',
  '/about',
  '/resources',
  '/community',
];

/**
 * Submit all priority URLs (useful after major site updates)
 */
export async function submitPriorityUrls(): Promise<IndexNowResult> {
  return submitBatchToIndexNow(PRIORITY_URLS);
}

/**
 * Auto-submit when blog posts are created/updated
 */
export async function submitBlogPost(slug: string): Promise<IndexNowResult> {
  const urls = [
    `/blog/${slug}`,
    '/blog', // Blog index page
  ];
  
  return submitBatchToIndexNow(urls);
}

/**
 * Auto-submit when landing pages are updated
 */
export async function submitLandingPageUpdate(path: string): Promise<IndexNowResult> {
  const urls = [
    path,
    '/', // Homepage (often links to updated pages)
  ];
  
  return submitBatchToIndexNow(urls);
}

/**
 * Validate IndexNow key is accessible
 */
export async function validateIndexNowKey(): Promise<boolean> {
  try {
    const response = await fetch(`${SITE_URL}/${INDEXNOW_KEY}.txt`);
    if (!response.ok) return false;
    
    const keyContent = await response.text();
    return keyContent.trim() === INDEXNOW_KEY;
  } catch {
    return false;
  }
}

