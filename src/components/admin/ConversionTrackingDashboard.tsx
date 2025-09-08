"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Users, 
  Download, 
  Mail, 
  Target, 
  DollarSign,
  RefreshCw
} from 'lucide-react';

interface ConversionData {
  totalConversions: number;
  emailSignups: number;
  downloads: number;
  courseInquiries: number;
  studyAppSignups: number;
  toolUsage: number;
  conversionRate: number;
  totalValue: number;
  period: string;
  trends: {
    emailSignups: number;
    downloads: number;
    courseInquiries: number;
    studyAppSignups: number;
  };
}

interface ConversionEvent {
  id: string;
  event_type: string;
  event_name: string;
  source_page: string;
  user_email?: string;
  resource_name?: string;
  value: number;
  timestamp: string;
  additional_data?: Record<string, unknown>;
}

export default function ConversionTrackingDashboard() {
  const [conversionData, setConversionData] = useState<ConversionData | null>(null);
  const [recentEvents, setRecentEvents] = useState<ConversionEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConversionData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch conversion data from your analytics API
      const response = await fetch('/api/admin/analytics/conversions');
      
      if (!response.ok) {
        throw new Error('Failed to fetch conversion data');
      }

      const data: { conversionData: ConversionData; recentEvents: ConversionEvent[] } = await response.json();
      setConversionData(data.conversionData);
      setRecentEvents(data.recentEvents || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching conversion data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversionData();
  }, []);

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'email_signup':
        return <Mail className="w-4 h-4" />;
      case 'download':
        return <Download className="w-4 h-4" />;
      case 'course_inquiry':
        return <Target className="w-4 h-4" />;
      case 'study_app_signup':
        return <Users className="w-4 h-4" />;
      case 'tool_usage':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case 'email_signup':
        return 'bg-blue-100 text-blue-800';
      case 'download':
        return 'bg-green-100 text-green-800';
      case 'course_inquiry':
        return 'bg-purple-100 text-purple-800';
      case 'study_app_signup':
        return 'bg-orange-100 text-orange-800';
      case 'tool_usage':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Conversion Tracking</h2>
          <Button disabled>
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            Loading...
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-slate-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Conversion Tracking</h2>
          <Button onClick={fetchConversionData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <p className="text-lg font-medium">Error loading conversion data</p>
              <p className="text-sm mt-2">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Conversion Tracking</h2>
          <p className="text-slate-600 mt-1">
            Monitor your lead generation and conversion performance
          </p>
        </div>
        <Button onClick={fetchConversionData}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Conversion Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conversions</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {conversionData?.totalConversions || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {conversionData?.period || 'Last 30 days'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Email Signups</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {conversionData?.emailSignups || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {(conversionData?.trends?.emailSignups ?? 0) > 0 ? '+' : ''}
              {conversionData?.trends?.emailSignups || 0}% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Downloads</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {conversionData?.downloads || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {(conversionData?.trends?.downloads ?? 0) > 0 ? '+' : ''}
              {conversionData?.trends?.downloads || 0}% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${conversionData?.totalValue || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Lead value generated
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Conversion Breakdown</CardTitle>
            <CardDescription>
              Distribution of conversion types
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">Email Signups</span>
              </div>
              <Badge variant="secondary">
                {conversionData?.emailSignups || 0}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Download className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium">Downloads</span>
              </div>
              <Badge variant="secondary">
                {conversionData?.downloads || 0}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium">Course Inquiries</span>
              </div>
              <Badge variant="secondary">
                {conversionData?.courseInquiries || 0}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium">Study App Signups</span>
              </div>
              <Badge variant="secondary">
                {conversionData?.studyAppSignups || 0}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium">Tool Usage</span>
              </div>
              <Badge variant="secondary">
                {conversionData?.toolUsage || 0}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Conversions</CardTitle>
            <CardDescription>
              Latest conversion events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentEvents.length > 0 ? (
                recentEvents.slice(0, 5).map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${getEventColor(event.event_type)}`}>
                        {getEventIcon(event.event_type)}
                      </div>
                      <div>
                        <p className="text-sm font-medium capitalize">
                          {event.event_name.replace('_', ' ')}
                        </p>
                        <p className="text-xs text-slate-600">
                          {event.source_page} • {new Date(event.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">${event.value}</p>
                      {event.user_email && (
                        <p className="text-xs text-slate-600 truncate max-w-32">
                          {event.user_email}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No recent conversions</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Setup Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Setup Instructions</CardTitle>
          <CardDescription>
            How to configure conversion tracking in Google Analytics 4
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Google Analytics 4 Setup</h4>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Go to Google Analytics 4 → Admin → Events</li>
              <li>Mark these events as conversions: email_signup, file_download, course_inquiry, study_app_signup</li>
              <li>Set up custom dimensions for: user_type, signup_source, lead_type, resource_name</li>
              <li>Configure conversion values: Email Signup ($5), Download ($10), Course Inquiry ($25), Study App ($15)</li>
            </ol>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-900 mb-2">Current Status</h4>
            <div className="text-sm text-green-800 space-y-1">
              <p>✅ Analytics tracking implemented</p>
              <p>✅ Conversion events configured</p>
              <p>✅ Custom dimensions set up</p>
              <p>⏳ GA4 conversion goals need to be marked in Google Analytics</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
