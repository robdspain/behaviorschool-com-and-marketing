'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { AlertTriangle, ShieldCheck, ShieldAlert, Clock } from 'lucide-react';

interface CertificationCountdownProps {
  expirationDate: string | number;
  label?: string;
  className?: string;
}

function getDaysUntil(expirationDate: string | number): number {
  const expDate =
    typeof expirationDate === 'number'
      ? new Date(expirationDate)
      : new Date(expirationDate);
  const now = new Date();
  const diffMs = expDate.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

function getSeverity(daysRemaining: number): {
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  badgeClass: string;
  severity: 'critical' | 'warning' | 'info' | 'safe';
  label: string;
} {
  if (daysRemaining <= 0) {
    return {
      color: 'text-red-700',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-600',
      badgeClass: 'bg-red-100 text-red-800 border-red-300',
      severity: 'critical',
      label: 'EXPIRED',
    };
  }
  if (daysRemaining < 30) {
    return {
      color: 'text-red-700',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-600',
      badgeClass: 'bg-red-100 text-red-800 border-red-300',
      severity: 'critical',
      label: 'Critical',
    };
  }
  if (daysRemaining <= 90) {
    return {
      color: 'text-yellow-700',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-600',
      badgeClass: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      severity: 'warning',
      label: 'Expiring Soon',
    };
  }
  return {
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-600',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    severity: 'safe',
    label: 'Active',
  };
}

export function CertificationCountdown({
  expirationDate,
  label = 'BCBA Certification',
  className,
}: CertificationCountdownProps) {
  const daysRemaining = getDaysUntil(expirationDate);
  const config = getSeverity(daysRemaining);

  const IconComponent =
    config.severity === 'critical'
      ? ShieldAlert
      : config.severity === 'warning'
        ? AlertTriangle
        : ShieldCheck;

  const formattedDate =
    typeof expirationDate === 'number'
      ? new Date(expirationDate).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : new Date(expirationDate).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });

  return (
    <div
      className={cn(
        'rounded-lg border p-4',
        config.bgColor,
        config.borderColor,
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <IconComponent className={cn('h-5 w-5', config.textColor)} />
          <span className="text-sm font-medium text-foreground">{label}</span>
        </div>
        <Badge variant="outline" className={cn('text-xs', config.badgeClass)}>
          {config.label}
        </Badge>
      </div>

      <div className="mt-3">
        <div className="flex items-baseline gap-1">
          {daysRemaining <= 0 ? (
            <span className={cn('text-2xl font-bold', config.color)}>
              Expired
            </span>
          ) : (
            <>
              <span className={cn('text-2xl font-bold', config.color)}>
                {daysRemaining}
              </span>
              <span className={cn('text-sm', config.color)}>
                {daysRemaining === 1 ? 'day' : 'days'} remaining
              </span>
            </>
          )}
        </div>
        <div className="flex items-center gap-1 mt-1">
          <Clock className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            Expires {formattedDate}
          </span>
        </div>
      </div>

      {config.severity === 'critical' && daysRemaining > 0 && (
        <p className="mt-2 text-xs text-red-600 font-medium">
          Renewal required immediately. Provider status at risk.
        </p>
      )}
      {config.severity === 'critical' && daysRemaining <= 0 && (
        <p className="mt-2 text-xs text-red-600 font-medium">
          Certification has expired. Provider cannot issue certificates or publish events.
        </p>
      )}
      {config.severity === 'warning' && (
        <p className="mt-2 text-xs text-yellow-700 font-medium">
          Begin renewal process soon to avoid service interruption.
        </p>
      )}
    </div>
  );
}
