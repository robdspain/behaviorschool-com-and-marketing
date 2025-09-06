'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Users, TrendingUp, Globe, Eye, MousePointer, Clock } from 'lucide-react';

interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  averageSessionDuration: string;
  bounceRate: string;
  topPages: Array<{
    page: string;
    views: number;
    uniqueViews: number;
  }>;
  trafficSources: Array<{
    source: string;
    visitors: number;
    percentage: number;
  }>;
  recentActivity: Array<{
    timestamp: string;
    event: string;
    page: string;
    user: string;
  }>;
}

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    // Simulate analytics data (replace with real analytics API)
    const mockAnalytics: AnalyticsData = {
      pageViews: 12847,
      uniqueVisitors: 8234,
      averageSessionDuration: '3m 42s',
      bounceRate: '42.3%',
      topPages: [
        { page: '/bcba-exam-prep', views: 3421, uniqueViews: 2876 },
        { page: '/behavior-study-tools', views: 2987, uniqueViews: 2543 },
        { page: '/transformation-program', views: 2156, uniqueViews: 1897 },
        { page: '/iep-goals', views: 1876, uniqueViews: 1654 },
        { page: '/behavior-plans', views: 1543, uniqueViews: 1321 }
      ],
      trafficSources: [
        { source: 'Organic Search', visitors: 4521, percentage: 54.9 },
        { source: 'Direct', visitors: 1876, percentage: 22.8 },
        { source: 'Social Media', visitors: 987, percentage: 12.0 },
        { source: 'Email', visitors: 543, percentage: 6.6 },
        { source: 'Referral', visitors: 307, percentage: 3.7 }
      ],
      recentActivity: [
        { timestamp: '2 minutes ago', event: 'Page View', page: '/bcba-exam-prep', user: 'Anonymous' },
        { timestamp: '5 minutes ago', event: 'Signup', page: '/transformation-program', user: 'john@example.com' },
        { timestamp: '8 minutes ago', event: 'Download', page: '/iep-goals', user: 'sarah@school.edu' },
        { timestamp: '12 minutes ago', event: 'Page View', page: '/behavior-study-tools', user: 'Anonymous' },
        { timestamp: '15 minutes ago', event: 'Contact Form', page: '/contact', user: 'mike@district.org' }
      ]
    };

    setTimeout(() => {
      setAnalytics(mockAnalytics);
      setLoading(false);
    }, 1000);
  }, [timeRange]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics Dashboard</h1>
          <p className="text-slate-600">Track your website performance and user engagement</p>
        </div>
        
        <div className="flex items-center gap-4">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="1d">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {analytics && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Page Views</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.pageViews.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+12.3%</span> from last period
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.uniqueVisitors.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+8.7%</span> from last period
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Session Duration</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.averageSessionDuration}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+5.2%</span> from last period
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
                <MousePointer className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.bounceRate}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-red-600">+2.1%</span> from last period
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts and Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Top Pages */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Top Pages
                </CardTitle>
                <CardDescription>Most visited pages on your site</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.topPages.map((page, index) => (
                    <div key={page.page} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-slate-500">#{index + 1}</span>
                        <div>
                          <p className="text-sm font-medium">{page.page}</p>
                          <p className="text-xs text-slate-500">{page.uniqueViews} unique views</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">{page.views.toLocaleString()}</p>
                        <p className="text-xs text-slate-500">views</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Traffic Sources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Traffic Sources
                </CardTitle>
                <CardDescription>Where your visitors are coming from</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.trafficSources.map((source) => (
                    <div key={source.source} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                        <p className="text-sm font-medium">{source.source}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">{source.visitors.toLocaleString()}</p>
                        <p className="text-xs text-slate-500">{source.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest user interactions on your site</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-b-0">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">{activity.event}</p>
                        <p className="text-xs text-slate-500">{activity.page}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{activity.user}</p>
                      <p className="text-xs text-slate-500">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
