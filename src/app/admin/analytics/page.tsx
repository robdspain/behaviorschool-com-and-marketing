'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Users, TrendingUp, Globe, Eye, MousePointer } from 'lucide-react';
import ConversionTrackingDashboard from '@/components/admin/ConversionTrackingDashboard';
import SiteMapViewer from '@/components/admin/SiteMapViewer';

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
  // Real conversion data
  totalSignups?: number;
  totalDownloads?: number;
  totalConversions?: number;
  trends?: {
    signups: number;
    downloads: number;
    conversions: number;
  };
}

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [activeTab, setActiveTab] = useState<'overview' | 'conversions' | 'sitemap'>('overview');

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/admin/analytics/overview?timeRange=${timeRange}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch analytics data');
        }

        const result = await response.json();
        
        if (result.success) {
          setAnalytics(result.data);
        } else {
          throw new Error(result.error || 'Failed to fetch analytics data');
        }
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        // Set empty data on error
        setAnalytics({
          pageViews: 0,
          uniqueVisitors: 0,
          averageSessionDuration: '0m 0s',
          bounceRate: '0%',
          topPages: [],
          trafficSources: [],
          recentActivity: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
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

      {/* Tab Navigation */}
      <div className="border-b border-slate-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('conversions')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'conversions'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <TrendingUp className="w-4 h-4 inline mr-2" />
            Conversions
          </button>
          <button
            onClick={() => setActiveTab('sitemap')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'sitemap'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <Globe className="w-4 h-4 inline mr-2" />
            Site Map
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && analytics && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Conversions</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalConversions?.toLocaleString() || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {analytics.trends?.conversions && analytics.trends.conversions > 0 ? (
                    <span className="text-green-600">+{analytics.trends.conversions}%</span>
                  ) : (
                    <span className="text-slate-500">No change</span>
                  )} from last period
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Email Signups</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalSignups?.toLocaleString() || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {analytics.trends?.signups && analytics.trends.signups > 0 ? (
                    <span className="text-green-600">+{analytics.trends.signups}%</span>
                  ) : (
                    <span className="text-slate-500">No change</span>
                  )} from last period
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Downloads</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalDownloads?.toLocaleString() || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {analytics.trends?.downloads && analytics.trends.downloads > 0 ? (
                    <span className="text-green-600">+{analytics.trends.downloads}%</span>
                  ) : (
                    <span className="text-slate-500">No change</span>
                  )} from last period
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Page Views</CardTitle>
                <MousePointer className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.pageViews.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Estimated from conversions
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
                  Top Conversion Sources
                </CardTitle>
                <CardDescription>Pages generating the most conversions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.topPages.length > 0 ? (
                    analytics.topPages.map((page, index) => (
                      <div key={page.page} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-slate-500">#{index + 1}</span>
                          <div>
                            <p className="text-sm font-medium">{page.page}</p>
                            <p className="text-xs text-slate-500">{page.uniqueViews} conversions</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold">{page.views.toLocaleString()}</p>
                          <p className="text-xs text-slate-500">total actions</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No conversion data yet</p>
                      <p className="text-xs mt-1">Start getting signups and downloads to see data here</p>
                    </div>
                  )}
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
                {analytics.recentActivity.length > 0 ? (
                  analytics.recentActivity.map((activity, index) => (
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
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No recent activity</p>
                    <p className="text-xs mt-1">Activity will appear here as users interact with your site</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Conversion Tracking Tab */}
      {activeTab === 'conversions' && (
        <ConversionTrackingDashboard />
      )}

      {/* Site Map Tab */}
      {activeTab === 'sitemap' && (
        <SiteMapViewer />
      )}
    </div>
  );
}
