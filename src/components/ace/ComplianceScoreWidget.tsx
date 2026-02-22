'use client';

import { cn } from '@/lib/utils';

interface ComplianceScoreWidgetProps {
  score: number;
  label?: string;
  className?: string;
}

function getScoreColor(score: number): {
  stroke: string;
  text: string;
  bg: string;
  label: string;
} {
  if (score >= 95) {
    return {
      stroke: '#10b981',
      text: 'text-emerald-600',
      bg: 'bg-emerald-50',
      label: 'Excellent',
    };
  }
  if (score >= 85) {
    return {
      stroke: '#eab308',
      text: 'text-yellow-600',
      bg: 'bg-yellow-50',
      label: 'Good',
    };
  }
  if (score >= 70) {
    return {
      stroke: '#f97316',
      text: 'text-orange-600',
      bg: 'bg-orange-50',
      label: 'Fair',
    };
  }
  return {
    stroke: '#ef4444',
    text: 'text-red-600',
    bg: 'bg-red-50',
    label: 'Critical',
  };
}

export function ComplianceScoreWidget({
  score,
  label = 'Compliance Score',
  className,
}: ComplianceScoreWidgetProps) {
  const clampedScore = Math.max(0, Math.min(100, score));
  const colorConfig = getScoreColor(clampedScore);

  // SVG circle parameters
  const size = 160;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampedScore / 100) * circumference;

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <div className="relative">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-gray-200"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={colorConfig.stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        {/* Score in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn('text-3xl font-bold', colorConfig.text)}>
            {clampedScore}
          </span>
          <span className="text-xs text-muted-foreground font-medium">
            / 100
          </span>
        </div>
      </div>
      <div className="mt-3 text-center">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className={cn('text-xs font-semibold mt-0.5', colorConfig.text)}>
          {colorConfig.label}
        </p>
      </div>
    </div>
  );
}
