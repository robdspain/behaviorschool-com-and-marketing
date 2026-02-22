'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type StatusType =
  | 'active'
  | 'pending'
  | 'approved'
  | 'draft'
  | 'completed'
  | 'archived'
  | 'lapsed'
  | 'expired'
  | 'submitted'
  | 'under_review'
  | 'resolved'
  | 'escalated'
  | 'issued'
  | 'revoked'
  | 'pending_approval'
  | 'in_progress'
  | 'confirmed'
  | 'cancelled';

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  active: {
    label: 'Active',
    className: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  pending: {
    label: 'Pending',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  },
  approved: {
    label: 'Approved',
    className: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  draft: {
    label: 'Draft',
    className: 'bg-gray-100 text-gray-600 border-gray-200',
  },
  completed: {
    label: 'Completed',
    className: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  archived: {
    label: 'Archived',
    className: 'bg-gray-100 text-gray-500 border-gray-200',
  },
  lapsed: {
    label: 'Lapsed',
    className: 'bg-red-100 text-red-800 border-red-200',
  },
  expired: {
    label: 'Expired',
    className: 'bg-red-100 text-red-700 border-red-200',
  },
  submitted: {
    label: 'Submitted',
    className: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  under_review: {
    label: 'Under Review',
    className: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  resolved: {
    label: 'Resolved',
    className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  },
  escalated: {
    label: 'Escalated',
    className: 'bg-orange-100 text-orange-800 border-orange-200',
  },
  issued: {
    label: 'Issued',
    className: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  revoked: {
    label: 'Revoked',
    className: 'bg-red-100 text-red-800 border-red-200',
  },
  pending_approval: {
    label: 'Pending Approval',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  },
  in_progress: {
    label: 'In Progress',
    className: 'bg-sky-100 text-sky-800 border-sky-200',
  },
  confirmed: {
    label: 'Confirmed',
    className: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-gray-100 text-gray-500 border-gray-300',
  },
};

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  if (!config) {
    return (
      <Badge variant="outline" className={className}>
        {status}
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className={cn(config.className, 'font-medium', className)}
    >
      {config.label}
    </Badge>
  );
}
