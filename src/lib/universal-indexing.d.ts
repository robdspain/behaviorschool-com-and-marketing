export interface UniversalIndexingResult {
  success: boolean;
  indexnow: {
    success: boolean;
    results: Array<{
      endpoint: string;
      status: number;
      success: boolean;
      error?: string;
    }>;
    submittedUrls: string[];
    timestamp: string;
  };
  google?: {
    success: boolean;
    urls: string[];
    errors?: string[];
    timestamp: string;
  };
  aiOptimization: {
    robotsOptimized: boolean;
    sitemapUpdated: boolean;
    rssUpdated: boolean;
  };
  summary: {
    totalEndpoints: number;
    successfulSubmissions: number;
    failedSubmissions: number;
  };
  timestamp: string;
}

export declare function submitToAllIndexes(urls: string | string[]): Promise<UniversalIndexingResult>;
export declare function submitBlogPostUniversal(slug: string): Promise<UniversalIndexingResult>;
export declare function submitLandingPageUniversal(path: string): Promise<UniversalIndexingResult>;
export declare function submitPriorityUrlsUniversal(): Promise<UniversalIndexingResult>;
export declare function getIndexingCoverage(): {
  platforms: Array<{
    platform: string;
    status: 'active' | 'available' | 'not-configured';
    coverage: string;
    description: string;
  }>;
  totalCoverage: string;
};
export declare const UNIVERSAL_PRIORITY_URLS: string[];