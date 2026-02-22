'use client';

import { type LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
    label?: string;
  };
  className?: string;
}

export function StatCard({ label, value, icon: Icon, trend, className }: StatCardProps) {
  return (
    <Card className={cn('hover:shadow-md transition-shadow', className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {trend && (
              <div className="flex items-center gap-1.5">
                {trend.direction === 'up' && (
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                )}
                {trend.direction === 'down' && (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                {trend.direction === 'neutral' && (
                  <Minus className="h-4 w-4 text-gray-400" />
                )}
                <span
                  className={cn(
                    'text-sm font-medium',
                    trend.direction === 'up' && 'text-emerald-600',
                    trend.direction === 'down' && 'text-red-600',
                    trend.direction === 'neutral' && 'text-gray-500'
                  )}
                >
                  {trend.direction === 'up' ? '+' : ''}
                  {trend.value}%
                </span>
                {trend.label && (
                  <span className="text-xs text-gray-400">{trend.label}</span>
                )}
              </div>
            )}
          </div>
          <div
            className="flex h-12 w-12 items-center justify-center rounded-lg"
            style={{ backgroundColor: 'rgba(31, 77, 63, 0.1)' }}
          >
            <Icon className="h-6 w-6" style={{ color: '#1F4D3F' }} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
