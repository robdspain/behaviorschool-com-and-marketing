'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Calendar,
  Lock,
  Unlock
} from 'lucide-react';

interface CoordinatorCertification {
  id: string;
  provider_id: string;
  provider_name: string;
  coordinator_name: string;
  coordinator_email: string;
  certification_number: string;
  certification_date: string;
  certification_expires: string;
  certification_verified: boolean;
  years_certified: number;
  is_active: boolean;
  can_publish_events: boolean;
  can_issue_certificates: boolean;
}

export default function CoordinatorCertificationPage() {
  const [coordinators, setCoordinators] = useState<CoordinatorCertification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCoordinators();
  }, []);

  const fetchCoordinators = async () => {
    try {
      const response = await fetch('/api/admin/ace/coordinators');
      const data = await response.json();
      if (data.data) {
        setCoordinators(data.data);
      }
    } catch (error) {
      console.error('Error fetching coordinators:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCertificationStatus = (expiresDate: string) => {
    const today = new Date();
    const expires = new Date(expiresDate);
    const daysUntilExpiry = Math.ceil((expires.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) {
      return { status: 'expired', days: Math.abs(daysUntilExpiry), color: 'red' };
    } else if (daysUntilExpiry <= 30) {
      return { status: 'critical', days: daysUntilExpiry, color: 'red' };
    } else if (daysUntilExpiry <= 90) {
      return { status: 'warning', days: daysUntilExpiry, color: 'amber' };
    } else {
      return { status: 'valid', days: daysUntilExpiry, color: 'green' };
    }
  };

  const handleVerifyCertification = async (coordinatorId: string) => {
    if (!confirm('Have you verified this coordinator\'s BCBA certification with the BACB registry?')) {
      return;
    }

    try {
      const response = await fetch('/api/admin/ace/coordinators', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coordinator_id: coordinatorId,
          certification_verified: true,
          verified_at: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        await fetchCoordinators();
        alert('Certification verified successfully!');
      } else {
        alert('Failed to verify certification');
      }
    } catch (error) {
      console.error('Error verifying certification:', error);
      alert('Failed to verify certification');
    }
  };

  const handleToggleOperations = async (coordinatorId: string, canOperate: boolean) => {
    const action = canOperate ? 'enable' : 'disable';
    if (!confirm(`Are you sure you want to ${action} operations for this coordinator?`)) {
      return;
    }

    try {
      const response = await fetch('/api/admin/ace/coordinators', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coordinator_id: coordinatorId,
          can_publish_events: canOperate,
          can_issue_certificates: canOperate,
        }),
      });

      if (response.ok) {
        await fetchCoordinators();
        alert(`Operations ${canOperate ? 'enabled' : 'disabled'} successfully!`);
      } else {
        alert(`Failed to ${action} operations`);
      }
    } catch (error) {
      console.error(`Error toggling operations:`, error);
      alert(`Failed to ${action} operations`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-64 mb-8"></div>
            <div className="h-96 bg-slate-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  const expiredCount = coordinators.filter(c => getCertificationStatus(c.certification_expires).status === 'expired').length;
  const criticalCount = coordinators.filter(c => getCertificationStatus(c.certification_expires).status === 'critical').length;
  const warningCount = coordinators.filter(c => getCertificationStatus(c.certification_expires).status === 'warning').length;
  const validCount = coordinators.filter(c => getCertificationStatus(c.certification_expires).status === 'valid').length;

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Coordinator Certification Tracking</h1>
              <p className="text-slate-600">Monitor ACE coordinator BCBA certifications and manage operations</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Valid</p>
                <p className="text-3xl font-bold text-green-600">{validCount}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </Card>

          <Card className="p-6 bg-amber-50 border-amber-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-800">Warning (≤90 days)</p>
                <p className="text-3xl font-bold text-amber-600">{warningCount}</p>
              </div>
              <AlertTriangle className="w-10 h-10 text-amber-600" />
            </div>
          </Card>

          <Card className="p-6 bg-red-50 border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-800">Critical (≤30 days)</p>
                <p className="text-3xl font-bold text-red-600">{criticalCount}</p>
              </div>
              <AlertTriangle className="w-10 h-10 text-red-600" />
            </div>
          </Card>

          <Card className="p-6 bg-red-50 border-red-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-900 font-semibold">Expired</p>
                <p className="text-3xl font-bold text-red-700">{expiredCount}</p>
              </div>
              <XCircle className="w-10 h-10 text-red-700" />
            </div>
          </Card>
        </div>

        {/* Critical Alerts */}
        {(expiredCount > 0 || criticalCount > 0) && (
          <Card className="p-6 mb-8 bg-red-50 border-red-200">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-red-600 mt-1" />
              <div>
                <h3 className="font-semibold text-red-900 text-lg mb-2">
                  ⚠️ Action Required: Certification Issues Detected
                </h3>
                <p className="text-red-800 mb-3">
                  {expiredCount > 0 && (
                    <span className="block mb-1">
                      <strong>{expiredCount} coordinator(s)</strong> have expired certifications. Their operations have been automatically blocked.
                    </span>
                  )}
                  {criticalCount > 0 && (
                    <span className="block">
                      <strong>{criticalCount} coordinator(s)</strong> have certifications expiring within 30 days.
                    </span>
                  )}
                </p>
                <p className="text-sm text-red-700">
                  2026 BACB Requirement: ACE coordinators must maintain valid BCBA certification at all times.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Coordinators List */}
        <div className="space-y-4">
          {coordinators.map(coordinator => {
            const certStatus = getCertificationStatus(coordinator.certification_expires);
            const isExpired = certStatus.status === 'expired';
            const isCritical = certStatus.status === 'critical';
            const isWarning = certStatus.status === 'warning';

            return (
              <Card 
                key={coordinator.id} 
                className={`p-6 ${isExpired ? 'bg-red-50 border-red-300' : isCritical ? 'bg-red-50 border-red-200' : isWarning ? 'bg-amber-50 border-amber-200' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-slate-900">
                        {coordinator.coordinator_name}
                      </h3>
                      {coordinator.certification_verified ? (
                        <Badge className="bg-green-500">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          Unverified
                        </Badge>
                      )}
                      {isExpired && (
                        <Badge className="bg-red-600">
                          <XCircle className="w-3 h-3 mr-1" />
                          EXPIRED
                        </Badge>
                      )}
                      {isCritical && (
                        <Badge className="bg-red-500">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Critical
                        </Badge>
                      )}
                      {isWarning && (
                        <Badge className="bg-amber-500">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Warning
                        </Badge>
                      )}
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-slate-500">Provider</p>
                        <p className="font-medium text-slate-900">{coordinator.provider_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Email</p>
                        <p className="font-medium text-slate-900">{coordinator.coordinator_email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">BCBA Certification #</p>
                        <p className="font-medium text-slate-900">{coordinator.certification_number}</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-slate-500">Certification Date</p>
                        <p className="font-medium text-slate-900">
                          {new Date(coordinator.certification_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Expires</p>
                        <p className={`font-medium ${isExpired ? 'text-red-700' : isCritical ? 'text-red-600' : isWarning ? 'text-amber-600' : 'text-green-600'}`}>
                          {new Date(coordinator.certification_expires).toLocaleDateString()}
                          <span className="text-sm ml-2">
                            ({isExpired ? `${certStatus.days} days ago` : `${certStatus.days} days`})
                          </span>
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Years Certified</p>
                        <p className="font-medium text-slate-900">{coordinator.years_certified} years</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        {coordinator.can_publish_events ? (
                          <Unlock className="w-4 h-4 text-green-600" />
                        ) : (
                          <Lock className="w-4 h-4 text-red-600" />
                        )}
                        <span className={coordinator.can_publish_events ? 'text-green-700' : 'text-red-700'}>
                          Event Publishing: {coordinator.can_publish_events ? 'Enabled' : 'Blocked'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {coordinator.can_issue_certificates ? (
                          <Unlock className="w-4 h-4 text-green-600" />
                        ) : (
                          <Lock className="w-4 h-4 text-red-600" />
                        )}
                        <span className={coordinator.can_issue_certificates ? 'text-green-700' : 'text-red-700'}>
                          Certificate Issuance: {coordinator.can_issue_certificates ? 'Enabled' : 'Blocked'}
                        </span>
                      </div>
                    </div>

                    {isExpired && (
                      <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg">
                        <p className="text-sm text-red-900 font-medium">
                          ⚠️ This coordinator&apos;s certification has expired. All operations are automatically blocked until certification is renewed.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    {!coordinator.certification_verified && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVerifyCertification(coordinator.id)}
                        className="bg-green-50 hover:bg-green-100 border-green-300 text-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Verify
                      </Button>
                    )}
                    {!isExpired && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleOperations(
                          coordinator.id, 
                          !coordinator.can_publish_events
                        )}
                        className={
                          coordinator.can_publish_events 
                            ? 'bg-red-50 hover:bg-red-100 border-red-300 text-red-700'
                            : 'bg-green-50 hover:bg-green-100 border-green-300 text-green-700'
                        }
                      >
                        {coordinator.can_publish_events ? (
                          <>
                            <Lock className="w-4 h-4 mr-2" />
                            Block
                          </>
                        ) : (
                          <>
                            <Unlock className="w-4 h-4 mr-2" />
                            Enable
                          </>
                        )}
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedCoordinator(coordinator);
                        setShowUpdateModal(true);
                      }}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Update
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {coordinators.length === 0 && (
          <Card className="p-12 text-center">
            <Shield className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600">No coordinator certifications found</p>
          </Card>
        )}
      </div>
    </div>
  );
}

