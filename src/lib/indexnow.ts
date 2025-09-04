/**
 * IndexNow utility for instant search engine indexing
 * Supports Bing, Yandex, and other IndexNow-compatible search engines
 */

export interface IndexNowResult {
  success: boolean;
  results: Array<{
    endpoint: string;
    status: number;
    success: boolean;
    message: string;
  }>;
  submittedUrls: string[];
  timestamp: string;
}

export interface IndexNowOptions {
  host?: string;
  apiEndpoint?: string;
}

/**
 * Submit URLs to IndexNow for instant indexing
 * @param urls - Array of URLs to submit (can be relative or absolute)
 * @param options - Optional configuration
 * @returns Promise with submission results
 */
export async function submitToIndexNow(
  urls: string[],
  options: IndexNowOptions = {}
): Promise<IndexNowResult> {
  const { host = 'behaviorschool.com', apiEndpoint = '/api/indexnow' } = options;

  try {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        urls,
        host
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('IndexNow submission failed:', error);
    throw error;
  }
}

/**
 * Submit a single URL to IndexNow
 * @param url - URL to submit
 * @param options - Optional configuration
 * @returns Promise with submission results
 */
export async function submitUrlToIndexNow(
  url: string,
  options: IndexNowOptions = {}
): Promise<IndexNowResult> {
  return submitToIndexNow([url], options);
}

/**
 * Submit multiple URLs in batches (IndexNow supports up to 10,000 URLs per request)
 * @param urls - Array of URLs to submit
 * @param batchSize - Number of URLs per batch (default: 1000)
 * @param options - Optional configuration
 * @returns Promise with all submission results
 */
export async function submitUrlsInBatches(
  urls: string[],
  batchSize: number = 1000,
  options: IndexNowOptions = {}
): Promise<IndexNowResult[]> {
  const results: IndexNowResult[] = [];
  
  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    try {
      const result = await submitToIndexNow(batch, options);
      results.push(result);
    } catch (error) {
      console.error(`Batch ${Math.floor(i / batchSize) + 1} failed:`, error);
      // Continue with next batch even if one fails
    }
  }
  
  return results;
}

/**
 * Common URL patterns for your site
 */
export const COMMON_URLS = {
  homepage: '/',
  iepGoals: '/iep-goals',
  transformationProgram: '/transformation-program',
  behaviorStudyTools: '/behavior-study-tools',
  bcbaExamPrep: '/bcba-exam-prep',
  supervisors: '/supervisors',
  behaviorPlans: '/behavior-plans',
  blog: '/blog',
  about: '/about',
  contact: '/contact',
  privacy: '/privacy',
  terms: '/terms'
} as const;

/**
 * Submit all common pages to IndexNow
 * @param options - Optional configuration
 * @returns Promise with submission results
 */
export async function submitCommonPages(
  options: IndexNowOptions = {}
): Promise<IndexNowResult> {
  const urls = Object.values(COMMON_URLS);
  return submitToIndexNow(urls, options);
}

/**
 * Submit blog post URLs (useful for new blog posts)
 * @param postSlugs - Array of blog post slugs
 * @param options - Optional configuration
 * @returns Promise with submission results
 */
export async function submitBlogPosts(
  postSlugs: string[],
  options: IndexNowOptions = {}
): Promise<IndexNowResult> {
  const urls = postSlugs.map(slug => `/blog/${slug}`);
  return submitToIndexNow(urls, options);
}
