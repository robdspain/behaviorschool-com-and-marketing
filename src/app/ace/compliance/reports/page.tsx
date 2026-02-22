'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BarChart,
  FileCheck,
  Download,
  ClipboardCheck,
  Users,
  MessageSquare,
  Award,
  AlertTriangle,
  Shield,
  ChevronLeft,
  Loader2,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

// Hardcoded provider ID for demo
const DEMO_PROVIDER_ID = 'demo_provider';

type ReportType =
  | 'attendance'
  | 'qualifications'
  | 'feedback'
  | 'certificates'
  | 'complaints'
  | 'full_audit';

interface ReportTypeOption {
  value: ReportType;
  label: string;
  description: string;
  icon: typeof BarChart;
  color: string;
  bgColor: string;
}

const REPORT_TYPES: ReportTypeOption[] = [
  {
    value: 'attendance',
    label: 'Attendance',
    description: 'Attendance records, sign-in/out data, verification status',
    icon: ClipboardCheck,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    value: 'qualifications',
    label: 'Instructor Qualifications',
    description: 'Instructor credentials, certifications, and approval status',
    icon: Users,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    value: 'feedback',
    label: 'Feedback',
    description: 'Participant feedback responses, ratings, and review status',
    icon: MessageSquare,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
  },
  {
    value: 'certificates',
    label: 'Certificates',
    description: 'Certificate issuance, pending, and revocation records',
    icon: Award,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
  },
  {
    value: 'complaints',
    label: 'Complaints',
    description: 'Complaint records, response times, and resolution status',
    icon: AlertTriangle,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
  {
    value: 'full_audit',
    label: 'Full Audit',
    description: 'Comprehensive audit covering all compliance areas',
    icon: Shield,
    color: 'text-[#1F4D3F]',
    bgColor: 'bg-[#1F4D3F]/10',
  },
];

interface ReportHistoryEntry {
  type: ReportType;
  generatedAt: number;
  dateRange: { start: string | null; end: string | null };
  score?: number;
  level?: string;
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatDateTime(timestamp: number): string {
  return new Date(timestamp).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AuditReportsPage() {
  const [selectedType, setSelectedType] = useState<ReportType>('full_audit');
  const [dateRangeStart, setDateRangeStart] = useState('');
  const [dateRangeEnd, setDateRangeEnd] = useState('');
  const [generating, setGenerating] = useState(false);
  const [reportData, setReportData] = useState<Record<string, any> | null>(
    null
  );
  const [reportHistory, setReportHistory] = useState<ReportHistoryEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  const generateReport = useCallback(async () => {
    try {
      setGenerating(true);
      setError(null);
      setReportData(null);

      const body: Record<string, any> = {
        provider_id: DEMO_PROVIDER_ID,
        report_type: selectedType,
      };

      if (dateRangeStart) {
        body.date_range_start = new Date(dateRangeStart).getTime();
      }
      if (dateRangeEnd) {
        body.date_range_end = new Date(dateRangeEnd).getTime();
      }

      const res = await fetch('/api/ace/compliance/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate report');
      }

      setReportData(data.data);

      // Add to history
      setReportHistory((prev) => [
        {
          type: selectedType,
          generatedAt: Date.now(),
          dateRange: {
            start: dateRangeStart || null,
            end: dateRangeEnd || null,
          },
          score: data.data.complianceScore?.score,
          level: data.data.complianceScore?.level,
        },
        ...prev.slice(0, 9), // Keep last 10
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate report');
    } finally {
      setGenerating(false);
    }
  }, [selectedType, dateRangeStart, dateRangeEnd]);

  const downloadJSON = () => {
    if (!reportData) return;
    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedType}-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadCSV = () => {
    if (!reportData) return;

    // Convert the main data section to CSV
    let csvContent = '';
    let dataArrayKey: string | null = null;

    // Find the main data array in the report
    const dataKeys = [
      'attendanceData',
      'qualificationsData',
      'feedbackData',
      'certificateData',
      'complaintData',
    ];
    for (const key of dataKeys) {
      if (reportData[key] && Array.isArray(reportData[key])) {
        dataArrayKey = key;
        break;
      }
    }

    if (dataArrayKey && reportData[dataArrayKey].length > 0) {
      const items = reportData[dataArrayKey];
      const headers = Object.keys(items[0]);
      csvContent = headers.join(',') + '\n';
      for (const item of items) {
        csvContent +=
          headers
            .map((h) => {
              const val = item[h];
              if (typeof val === 'string' && val.includes(',')) {
                return `"${val}"`;
              }
              return val ?? '';
            })
            .join(',') + '\n';
      }
    } else {
      // Flatten summary data
      const summary = reportData.summary || {};
      csvContent = 'Metric,Value\n';
      for (const [key, value] of Object.entries(summary)) {
        csvContent += `${key},${value}\n`;
      }
    }

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedType}-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const selectedTypeConfig = REPORT_TYPES.find(
    (t) => t.value === selectedType
  )!;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.back()}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Audit Reports
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Generate and export compliance audit reports
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Report Configuration */}
        <div className="lg:col-span-1 space-y-6">
          {/* Report Type Selection */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Report Type</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {REPORT_TYPES.map((type) => {
                const Icon = type.icon;
                const isSelected = selectedType === type.value;
                return (
                  <button
                    key={type.value}
                    onClick={() => setSelectedType(type.value)}
                    className={`w-full flex items-start gap-3 rounded-lg border p-3 text-left transition-all ${
                      isSelected
                        ? 'border-[#1F4D3F] bg-[#1F4D3F]/5 ring-1 ring-[#1F4D3F]'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div
                      className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${type.bgColor}`}
                    >
                      <Icon className={`h-4 w-4 ${type.color}`} />
                    </div>
                    <div className="min-w-0">
                      <p
                        className={`text-sm font-medium ${isSelected ? 'text-[#1F4D3F]' : 'text-gray-900'}`}
                      >
                        {type.label}
                      </p>
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {type.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </CardContent>
          </Card>

          {/* Date Range */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                Date Range (Optional)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Start Date
                </label>
                <Input
                  type="date"
                  value={dateRangeStart}
                  onChange={(e) => setDateRangeStart(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  End Date
                </label>
                <Input
                  type="date"
                  value={dateRangeEnd}
                  onChange={(e) => setDateRangeEnd(e.target.value)}
                />
              </div>
              {(dateRangeStart || dateRangeEnd) && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    setDateRangeStart('');
                    setDateRangeEnd('');
                  }}
                >
                  Clear dates
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Generate Button */}
          <Button
            className="w-full gap-2 bg-[#1F4D3F] hover:bg-[#1F4D3F]/90 h-12 text-base"
            onClick={generateReport}
            disabled={generating}
          >
            {generating ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <BarChart className="h-5 w-5" />
                Generate Report
              </>
            )}
          </Button>
        </div>

        {/* Right Column: Report Preview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Error */}
          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertTriangle className="h-5 w-5" />
                  <p className="text-sm">{error}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Report Preview */}
          {generating ? (
            <Card>
              <CardContent className="p-8">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="h-10 w-10 animate-spin text-[#1F4D3F]" />
                  <p className="text-sm text-gray-500">
                    Generating {selectedTypeConfig.label} report...
                  </p>
                  <div className="w-64 space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : reportData ? (
            <>
              {/* Report Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${selectedTypeConfig.bgColor}`}
                      >
                        <selectedTypeConfig.icon
                          className={`h-5 w-5 ${selectedTypeConfig.color}`}
                        />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {selectedTypeConfig.label} Report
                        </CardTitle>
                        <p className="text-xs text-gray-500">
                          Provider: {reportData.provider?.name || 'Unknown'} |
                          Generated:{' '}
                          {reportData.generatedAt
                            ? formatDateTime(reportData.generatedAt)
                            : 'Now'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5"
                        onClick={downloadJSON}
                      >
                        <Download className="h-4 w-4" />
                        JSON
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5"
                        onClick={downloadCSV}
                      >
                        <Download className="h-4 w-4" />
                        CSV
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Compliance Score */}
                  {reportData.complianceScore && (
                    <div className="flex items-center gap-4 rounded-lg bg-gray-50 p-4 mb-4">
                      <div
                        className="flex h-14 w-14 items-center justify-center rounded-full text-white text-lg font-bold"
                        style={{
                          backgroundColor:
                            reportData.complianceScore.score >= 95
                              ? '#10b981'
                              : reportData.complianceScore.score >= 85
                                ? '#eab308'
                                : reportData.complianceScore.score >= 70
                                  ? '#f97316'
                                  : '#ef4444',
                        }}
                      >
                        {reportData.complianceScore.score}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Compliance Score:{' '}
                          {reportData.complianceScore.level}
                        </p>
                        {reportData.complianceScore.deductions?.length >
                          0 && (
                          <p className="text-xs text-gray-500">
                            {reportData.complianceScore.deductions.length}{' '}
                            deduction(s) found
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Summary Statistics */}
                  {reportData.summary && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                      {Object.entries(reportData.summary).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="rounded-lg border p-3"
                          >
                            <p className="text-xs text-gray-500 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </p>
                            <p className="text-lg font-bold text-gray-900">
                              {typeof value === 'number'
                                ? value.toLocaleString()
                                : String(value)}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Data Tables */}
              {(() => {
                const dataKeys = [
                  'attendanceData',
                  'qualificationsData',
                  'feedbackData',
                  'certificateData',
                  'complaintData',
                ];
                return dataKeys.map((key) => {
                  if (
                    !reportData[key] ||
                    !Array.isArray(reportData[key]) ||
                    reportData[key].length === 0
                  )
                    return null;

                  const items = reportData[key];
                  const headers = Object.keys(items[0]).filter(
                    (h) =>
                      typeof items[0][h] !== 'object' ||
                      items[0][h] === null
                  );

                  return (
                    <Card key={key}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base capitalize">
                          {key
                            .replace('Data', '')
                            .replace(/([A-Z])/g, ' $1')
                            .trim()}{' '}
                          Data
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b">
                                {headers.slice(0, 6).map((h) => (
                                  <th
                                    key={h}
                                    className="pb-2 pr-4 text-left text-xs font-medium text-gray-500 capitalize"
                                  >
                                    {h
                                      .replace(/([A-Z])/g, ' $1')
                                      .trim()}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {items
                                .slice(0, 10)
                                .map((item: any, idx: number) => (
                                  <tr
                                    key={idx}
                                    className="border-b last:border-0"
                                  >
                                    {headers.slice(0, 6).map((h) => (
                                      <td
                                        key={h}
                                        className="py-2 pr-4 text-gray-700"
                                      >
                                        {typeof item[h] === 'number' &&
                                        h.toLowerCase().includes('date')
                                          ? formatDate(item[h])
                                          : typeof item[h] === 'number' &&
                                              h.toLowerCase().includes('at')
                                            ? formatDate(item[h])
                                            : typeof item[h] === 'boolean'
                                              ? item[h]
                                                ? 'Yes'
                                                : 'No'
                                              : item[h] ?? '--'}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                          {items.length > 10 && (
                            <p className="text-xs text-gray-400 mt-2 text-center">
                              Showing 10 of {items.length} records. Download
                              the full report for all data.
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                });
              })()}

              {/* Findings & Recommendations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reportData.findings &&
                  reportData.findings.length > 0 && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                          <FileCheck className="h-4 w-4 text-amber-500" />
                          Compliance Findings
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {reportData.findings.map(
                            (finding: string, i: number) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-sm"
                              >
                                <ArrowRight className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-700">
                                  {finding}
                                </span>
                              </li>
                            )
                          )}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                {reportData.recommendations &&
                  reportData.recommendations.length > 0 && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-[#1F4D3F]" />
                          Recommendations
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {reportData.recommendations.map(
                            (rec: string, i: number) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-sm"
                              >
                                <ArrowRight className="h-4 w-4 text-[#1F4D3F] flex-shrink-0 mt-0.5" />
                                <span className="text-gray-700">{rec}</span>
                              </li>
                            )
                          )}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center py-16">
                <BarChart className="h-16 w-16 text-gray-200 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">
                  Generate an Audit Report
                </h3>
                <p className="text-sm text-gray-500 mt-1 text-center max-w-md">
                  Select a report type and optionally set a date range, then
                  click Generate Report to view compliance data.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Report History */}
          {reportHistory.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">
                  Report History (This Session)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {reportHistory.map((entry, i) => {
                    const typeConfig = REPORT_TYPES.find(
                      (t) => t.value === entry.type
                    )!;
                    const Icon = typeConfig.icon;
                    return (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-lg ${typeConfig.bgColor}`}
                          >
                            <Icon
                              className={`h-4 w-4 ${typeConfig.color}`}
                            />
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {typeConfig.label}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDateTime(entry.generatedAt)}
                            </p>
                          </div>
                        </div>
                        {entry.score !== undefined && (
                          <Badge
                            className={
                              entry.score >= 95
                                ? 'bg-emerald-100 text-emerald-800'
                                : entry.score >= 85
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : entry.score >= 70
                                    ? 'bg-orange-100 text-orange-800'
                                    : 'bg-red-100 text-red-800'
                            }
                          >
                            Score: {entry.score}
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
