'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Shield,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Download,
  FileText,
  Clock,
  Calendar,
  Building2,
  Users,
  Award,
  MessageSquare,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import type { AceComplianceDashboard } from '@/lib/ace/types';

interface ComplianceMetrics {
  overdueCertificates: number;
  overdueFeedbackReviews: number;
  overdueComplaints: number;
  coordinatorCertExpiringSoon: number;
  providersLapsed: number;
  missingLegalVerification: number;
  complianceScore: number;
}

interface AuditItem {
  type: 'certificate' | 'feedback' | 'complaint' | 'coordinator' | 'provider';
  id: string;
  title: string;
  severity: 'critical' | 'warning' | 'info';
  daysOverdue?: number;
  action: string;
}

export default function ComplianceDashboardPage() {
  const [metrics, setMetrics] = useState<ComplianceMetrics | null>(null);
  const [auditItems, setAuditItems] = useState<AuditItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchComplianceData();
  }, []);

  const fetchComplianceData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/ace/compliance');
      const data = await response.json();
      if (data.success) {
        setMetrics(data.metrics);
        setAuditItems(data.auditItems || []);
      }
    } catch (error) {
      console.error('Error fetching compliance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAuditReport = async () => {
    setGenerating(true);
    try {
      const response = await fetch('/api/admin/ace/compliance/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          report_type: 'full_audit',
          date_range_start: new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().split('T')[0],
          date_range_end: new Date().toISOString().split('T')[0],
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ace-audit-report-${new Date().toISOString().split('T')[0]}.pdf`;
        a.click();
      } else {
        alert('Failed to generate report');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report');
    } finally {
      setGenerating(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 95) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 85) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (score >= 70) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 95) return 'Excellent';
    if (score >= 85) return 'Good';
    if (score >= 70) return 'Needs Attention';
    return 'Critical';
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 95) return '🟢';
    if (score >= 85) return '🟡';
    if (score >= 70) return '🟠';
    return '🔴';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  const score = metrics?.complianceScore ?? 0;

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <Shield className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Compliance Dashboard</h1>
              <p className="text-slate-600">BACB 2026 Requirements Monitoring & Audit Readiness</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={fetchComplianceData}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              onClick={handleGenerateAuditReport}
              disabled={generating}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {generating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Generate Audit Report
            </Button>
          </div>
        </div>

        {/* Compliance Score */}
        <Card className={`p-8 mb-8 ${getScoreColor(score)} border-2`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium mb-2">Overall Compliance Score</h2>
              <div className="flex items-center gap-4">
                <span className="text-6xl font-bold">{score}%</span>
                <div>
                  <Badge className={getScoreColor(score)}>
                    {getScoreEmoji(score)} {getScoreLabel(score)}
                  </Badge>
                  <p className="text-sm mt-2 opacity-80">
                    {score >= 95 
                      ? 'All requirements met. Audit-ready.'
                      : score >= 85
                      ? 'Minor issues detected. Review action items.'
                      : score >= 70
                      ? 'Several compliance gaps. Immediate attention needed.'
                      : 'Critical compliance failures. Take action immediately.'}
                  </p>
                </div>
              </div>
            </div>
            <TrendingUp className="w-20 h-20 opacity-20" />
          </div>
        </Card>

        {/* Metrics Grid */}
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card className={`p-4 ${metrics?.overdueCertificates ? 'bg-red-50 border-red-200' : ''}`}>
            <div className="flex items-center justify-between mb-2">
              <Award className={`w-5 h-5 ${metrics?.overdueCertificates ? 'text-red-600' : 'text-slate-400'}`} />
              {metrics?.overdueCertificates ? (
                <Badge className="bg-red-600 text-xs">Action</Badge>
              ) : (
                <CheckCircle className="w-4 h-4 text-green-600" />
              )}
            </div>
            <p className="text-2xl font-bold text-slate-900">{metrics?.overdueCertificates ?? 0}</p>
            <p className="text-xs text-slate-500">Overdue Certificates</p>
            <p className="text-xs text-slate-400">45-day rule</p>
          </Card>

          <Card className={`p-4 ${metrics?.overdueFeedbackReviews ? 'bg-amber-50 border-amber-200' : ''}`}>
            <div className="flex items-center justify-between mb-2">
              <FileText className={`w-5 h-5 ${metrics?.overdueFeedbackReviews ? 'text-amber-600' : 'text-slate-400'}`} />
              {metrics?.overdueFeedbackReviews ? (
                <Badge className="bg-amber-600 text-xs">Review</Badge>
              ) : (
                <CheckCircle className="w-4 h-4 text-green-600" />
              )}
            </div>
            <p className="text-2xl font-bold text-slate-900">{metrics?.overdueFeedbackReviews ?? 0}</p>
            <p className="text-xs text-slate-500">Feedback Unreviewed</p>
            <p className="text-xs text-slate-400">45-day rule</p>
          </Card>

          <Card className={`p-4 ${metrics?.overdueComplaints ? 'bg-red-50 border-red-200' : ''}`}>
            <div className="flex items-center justify-between mb-2">
              <MessageSquare className={`w-5 h-5 ${metrics?.overdueComplaints ? 'text-red-600' : 'text-slate-400'}`} />
              {metrics?.overdueComplaints ? (
                <Badge className="bg-red-600 text-xs">Urgent</Badge>
              ) : (
                <CheckCircle className="w-4 h-4 text-green-600" />
              )}
            </div>
            <p className="text-2xl font-bold text-slate-900">{metrics?.overdueComplaints ?? 0}</p>
            <p className="text-xs text-slate-500">Overdue Complaints</p>
            <p className="text-xs text-slate-400">45-day response</p>
          </Card>

          <Card className={`p-4 ${metrics?.coordinatorCertExpiringSoon ? 'bg-amber-50 border-amber-200' : ''}`}>
            <div className="flex items-center justify-between mb-2">
              <Users className={`w-5 h-5 ${metrics?.coordinatorCertExpiringSoon ? 'text-amber-600' : 'text-slate-400'}`} />
              {metrics?.coordinatorCertExpiringSoon ? (
                <Badge className="bg-amber-600 text-xs">Soon</Badge>
              ) : (
                <CheckCircle className="w-4 h-4 text-green-600" />
              )}
            </div>
            <p className="text-2xl font-bold text-slate-900">{metrics?.coordinatorCertExpiringSoon ?? 0}</p>
            <p className="text-xs text-slate-500">Coord. Cert Expiring</p>
            <p className="text-xs text-slate-400">Within 90 days</p>
          </Card>

          <Card className={`p-4 ${metrics?.providersLapsed ? 'bg-red-50 border-red-200' : ''}`}>
            <div className="flex items-center justify-between mb-2">
              <Building2 className={`w-5 h-5 ${metrics?.providersLapsed ? 'text-red-600' : 'text-slate-400'}`} />
              {metrics?.providersLapsed ? (
                <Badge className="bg-red-600 text-xs">Lapsed</Badge>
              ) : (
                <CheckCircle className="w-4 h-4 text-green-600" />
              )}
            </div>
            <p className="text-2xl font-bold text-slate-900">{metrics?.providersLapsed ?? 0}</p>
            <p className="text-xs text-slate-500">Providers Lapsed</p>
            <p className="text-xs text-slate-400">Grace period ended</p>
          </Card>

          <Card className={`p-4 ${metrics?.missingLegalVerification ? 'bg-orange-50 border-orange-200' : ''}`}>
            <div className="flex items-center justify-between mb-2">
              <FileText className={`w-5 h-5 ${metrics?.missingLegalVerification ? 'text-orange-600' : 'text-slate-400'}`} />
              {metrics?.missingLegalVerification ? (
                <Badge className="bg-orange-600 text-xs">Missing</Badge>
              ) : (
                <CheckCircle className="w-4 h-4 text-green-600" />
              )}
            </div>
            <p className="text-2xl font-bold text-slate-900">{metrics?.missingLegalVerification ?? 0}</p>
            <p className="text-xs text-slate-500">Legal Verification</p>
            <p className="text-xs text-slate-400">Organizations</p>
          </Card>
        </div>

        {/* Action Items */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              Compliance Action Items
            </h2>
            <Badge variant="outline">{auditItems.length} items</Badge>
          </div>

          {auditItems.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">All Clear!</h3>
              <p className="text-slate-600">No compliance issues detected. Keep up the great work!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {auditItems.map((item, index) => (
                <div
                  key={`${item.type}-${item.id}-${index}`}
                  className={`flex items-start justify-between p-4 rounded-lg border-l-4 ${
                    item.severity === 'critical'
                      ? 'bg-red-50 border-red-500'
                      : item.severity === 'warning'
                      ? 'bg-amber-50 border-amber-500'
                      : 'bg-blue-50 border-blue-500'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      item.severity === 'critical'
                        ? 'bg-red-100'
                        : item.severity === 'warning'
                        ? 'bg-amber-100'
                        : 'bg-blue-100'
                    }`}>
                      {item.type === 'certificate' && <Award className="w-4 h-4" />}
                      {item.type === 'feedback' && <FileText className="w-4 h-4" />}
                      {item.type === 'complaint' && <MessageSquare className="w-4 h-4" />}
                      {item.type === 'coordinator' && <Users className="w-4 h-4" />}
                      {item.type === 'provider' && <Building2 className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={
                          item.severity === 'critical'
                            ? 'bg-red-600'
                            : item.severity === 'warning'
                            ? 'bg-amber-600'
                            : 'bg-blue-600'
                        }>
                          {item.severity}
                        </Badge>
                        <span className="text-sm text-slate-500 capitalize">{item.type}</span>
                        {item.daysOverdue && (
                          <span className="text-xs text-red-600 font-medium">
                            {item.daysOverdue} days overdue
                          </span>
                        )}
                      </div>
                      <p className="font-medium text-slate-900">{item.title}</p>
                      <p className="text-sm text-slate-600">{item.action}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Take Action
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Quick Export Actions */}
        <div className="grid md:grid-cols-4 gap-4 mt-8">
          <Card className="p-4 hover:shadow-lg transition cursor-pointer" onClick={() => {}}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Download className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Attendance Logs</p>
                <p className="text-xs text-slate-500">Export all attendance records</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 hover:shadow-lg transition cursor-pointer" onClick={() => {}}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Download className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Instructor Quals</p>
                <p className="text-xs text-slate-500">Export qualifications</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 hover:shadow-lg transition cursor-pointer" onClick={() => {}}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Download className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Certificates</p>
                <p className="text-xs text-slate-500">Export certificates issued</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 hover:shadow-lg transition cursor-pointer" onClick={() => {}}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Download className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Feedback</p>
                <p className="text-xs text-slate-500">Export feedback records</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
