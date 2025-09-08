'use client';

import { useState } from 'react';
import { submitToIndexNow } from '@/lib/indexnow';
import { submitPriorityUrlsUniversal, UNIVERSAL_PRIORITY_URLS } from '@/lib/universal-indexing';
import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input'; // Not used
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2, ExternalLink } from 'lucide-react';

export default function IndexNowAdminPage() {
  const [urls, setUrls] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<{
    success: boolean;
    results: Array<{
      endpoint: string;
      status: number;
      success: boolean;
      message: string;
    }>;
    submittedUrls: string[];
    timestamp: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!urls.trim()) {
      setError('Please enter at least one URL');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setResults(null);

    try {
      const urlList = urls
        .split('\n')
        .map(url => url.trim())
        .filter(url => url.length > 0);

      const result = await submitToIndexNow(urlList);
      setResults({
        success: result.success,
        results: result.results.map(r => ({
          endpoint: r.endpoint,
          status: r.status,
          success: r.success,
          message: r.success ? 'Success' : (r.error || 'Failed')
        })),
        submittedUrls: result.submittedUrls,
        timestamp: result.timestamp
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitCommonPages = async () => {
    setIsSubmitting(true);
    setError(null);
    setResults(null);

    try {
      const result = await submitPriorityUrlsUniversal();
      setResults({
        success: result.success,
        results: result.indexnow.results.map(r => ({
          endpoint: r.endpoint,
          status: r.status,
          success: r.success,
          message: r.success ? 'Success' : (r.error || 'Failed')
        })),
        submittedUrls: result.indexnow.submittedUrls,
        timestamp: result.timestamp
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitSingleUrl = async (url: string) => {
    setIsSubmitting(true);
    setError(null);
    setResults(null);

    try {
      const result = await submitToIndexNow([url]);
      setResults({
        success: result.success,
        results: result.results.map(r => ({
          endpoint: r.endpoint,
          status: r.status,
          success: r.success,
          message: r.success ? 'Success' : (r.error || 'Failed')
        })),
        submittedUrls: result.submittedUrls,
        timestamp: result.timestamp
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">IndexNow Admin</h1>
          <p className="text-slate-600 mt-2">
            Submit URLs to IndexNow for instant indexing in Bing, Yandex, and other search engines.
          </p>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Submit common pages or individual URLs with one click
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleSubmitCommonPages}
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ExternalLink className="mr-2 h-4 w-4" />
              )}
              Submit All Common Pages
            </Button>

            <div className="grid grid-cols-2 gap-2">
              {UNIVERSAL_PRIORITY_URLS.map((url, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSubmitSingleUrl(url)}
                  disabled={isSubmitting}
                >
                  {url}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Custom URL Submission */}
        <Card>
          <CardHeader>
            <CardTitle>Custom URL Submission</CardTitle>
            <CardDescription>
              Enter URLs to submit (one per line)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Enter URLs here, one per line:&#10;/new-page&#10;/blog/new-post&#10;https://behaviorschool.com/specific-page"
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              rows={6}
              className="font-mono text-sm"
            />
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting || !urls.trim()}
              className="w-full"
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ExternalLink className="mr-2 h-4 w-4" />
              )}
              Submit URLs
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 text-red-800">
                <XCircle className="h-5 w-5" />
                <span className="font-medium">Error</span>
              </div>
              <p className="text-red-700 mt-2">{error}</p>
            </CardContent>
          </Card>
        )}

        {results && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-green-800">
                <CheckCircle className="h-5 w-5" />
                <span>Submission Results</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Overall Success:</span>
                  <span className={`ml-2 ${results.success ? 'text-green-600' : 'text-red-600'}`}>
                    {results.success ? 'Yes' : 'No'}
                  </span>
                </div>
                <div>
                  <span className="font-medium">URLs Submitted:</span>
                  <span className="ml-2">{results.submittedUrls.length}</span>
                </div>
                <div>
                  <span className="font-medium">Timestamp:</span>
                  <span className="ml-2">{new Date(results.timestamp).toLocaleString()}</span>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Endpoint Results:</h4>
                <div className="space-y-2">
                  {results.results.map((result, index: number) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                      <span className="font-mono text-sm">{result.endpoint}</span>
                      <div className="flex items-center space-x-2">
                        {result.success ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span className="text-sm">{result.message}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Submitted URLs:</h4>
                <div className="bg-white p-3 rounded border max-h-40 overflow-y-auto">
                  {results.submittedUrls.map((url: string, index: number) => (
                    <div key={index} className="text-sm font-mono text-slate-600">
                      {url}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Information */}
        <Card>
          <CardHeader>
            <CardTitle>About IndexNow</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600">
            <p>
              IndexNow is a protocol that allows you to instantly inform search engines 
              about the latest content changes on your website.
            </p>
            <p>
              <strong>Supported Search Engines:</strong> Bing, Yandex, and other IndexNow-compatible engines
            </p>
            <p>
              <strong>Benefits:</strong> Faster indexing, better SEO performance, immediate visibility of new content
            </p>
            <p>
              <strong>Key File:</strong> Your IndexNow key is available at{' '}
              <code className="bg-slate-100 px-1 rounded">https://behaviorschool.com/D6F638D35C42D071C62B47907C2CD0CC.txt</code>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
