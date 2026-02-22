'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  Calendar,
  Award,
  User,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  BookOpen,
  Monitor,
  MapPin,
  Headphones,
} from 'lucide-react';

interface EventApprovalCardProps {
  event: {
    _id: string;
    title: string;
    description?: string;
    startDate: number;
    endDate?: number;
    totalCeus: number;
    ceCategory: string;
    modality: string;
    eventType?: string;
    learningObjectives?: string[];
    instructorQualificationsSummary?: string;
    instructorAffiliations?: string;
    conflictsOfInterest?: string;
    maxParticipants?: number;
    fee?: number;
    location?: string;
  };
  instructorName?: string;
  onApprove: (eventId: string) => void;
  onReject: (eventId: string) => void;
  isLoading?: boolean;
  className?: string;
}

const categoryConfig: Record<string, { label: string; className: string }> = {
  learning: {
    label: 'Learning',
    className: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  ethics: {
    label: 'Ethics',
    className: 'bg-purple-100 text-purple-800 border-purple-200',
  },
  supervision: {
    label: 'Supervision',
    className: 'bg-teal-100 text-teal-800 border-teal-200',
  },
  teaching: {
    label: 'Teaching',
    className: 'bg-amber-100 text-amber-800 border-amber-200',
  },
};

const modalityConfig: Record<
  string,
  { label: string; icon: React.ComponentType<{ className?: string }> }
> = {
  in_person: { label: 'In Person', icon: MapPin },
  synchronous: { label: 'Live Online', icon: Monitor },
  asynchronous: { label: 'Self-Paced', icon: Headphones },
};

export function EventApprovalCard({
  event,
  instructorName,
  onApprove,
  onReject,
  isLoading = false,
  className,
}: EventApprovalCardProps) {
  const [expanded, setExpanded] = useState(false);

  const category = categoryConfig[event.ceCategory] || {
    label: event.ceCategory,
    className: 'bg-gray-100 text-gray-700 border-gray-200',
  };

  const modality = modalityConfig[event.modality] || {
    label: event.modality,
    icon: BookOpen,
  };
  const ModalityIcon = modality.icon;

  const formattedDate = new Date(event.startDate).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const formattedTime = new Date(event.startDate).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-foreground leading-tight truncate">
              {event.title}
            </h4>
            {instructorName && (
              <div className="flex items-center gap-1.5 mt-1">
                <User className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                <span className="text-xs text-muted-foreground truncate">
                  {instructorName}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <Badge
              variant="outline"
              className={cn('text-xs', category.className)}
            >
              {category.label}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="grid grid-cols-3 gap-3 text-xs">
          {/* Date */}
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
            <div>
              <p className="font-medium text-foreground">{formattedDate}</p>
              <p className="text-muted-foreground">{formattedTime}</p>
            </div>
          </div>

          {/* CEU Count */}
          <div className="flex items-center gap-1.5">
            <Award className="h-3.5 w-3.5 text-[#D4AF37] flex-shrink-0" />
            <div>
              <p className="font-medium text-foreground">
                {event.totalCeus} CEU{event.totalCeus !== 1 ? 's' : ''}
              </p>
              <p className="text-muted-foreground">
                {event.eventType === 'pd' ? 'Prof. Dev.' : 'Cont. Ed.'}
              </p>
            </div>
          </div>

          {/* Modality */}
          <div className="flex items-center gap-1.5">
            <ModalityIcon className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
            <div>
              <p className="font-medium text-foreground">{modality.label}</p>
              {event.location && (
                <p className="text-muted-foreground truncate max-w-[80px]">
                  {event.location}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Expandable details */}
        {(event.learningObjectives?.length ||
          event.description ||
          event.instructorQualificationsSummary) && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 mt-3 text-xs text-[#1F4D3F] hover:text-[#1F4D3F]/80 font-medium transition-colors"
          >
            {expanded ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
            {expanded ? 'Hide Details' : 'View Details'}
          </button>
        )}

        {expanded && (
          <div className="mt-3 space-y-3 border-t pt-3">
            {event.description && (
              <div>
                <p className="text-xs font-medium text-foreground mb-1">
                  Description
                </p>
                <p className="text-xs text-muted-foreground">
                  {event.description}
                </p>
              </div>
            )}

            {event.learningObjectives &&
              event.learningObjectives.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-foreground mb-1">
                    Learning Objectives
                  </p>
                  <ul className="space-y-1">
                    {event.learningObjectives.map((objective, i) => (
                      <li
                        key={i}
                        className="text-xs text-muted-foreground flex items-start gap-1.5"
                      >
                        <span className="text-[#1F4D3F] font-medium mt-0.5 flex-shrink-0">
                          {i + 1}.
                        </span>
                        {objective}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            {event.instructorQualificationsSummary && (
              <div>
                <p className="text-xs font-medium text-foreground mb-1">
                  Instructor Qualifications
                </p>
                <p className="text-xs text-muted-foreground">
                  {event.instructorQualificationsSummary}
                </p>
              </div>
            )}

            {event.conflictsOfInterest && (
              <div>
                <p className="text-xs font-medium text-foreground mb-1">
                  Conflicts of Interest
                </p>
                <p className="text-xs text-muted-foreground">
                  {event.conflictsOfInterest}
                </p>
              </div>
            )}

            <div className="flex gap-4 text-xs text-muted-foreground">
              {event.maxParticipants && (
                <span>Max Participants: {event.maxParticipants}</span>
              )}
              {event.fee !== undefined && event.fee > 0 && (
                <span>Fee: ${event.fee.toFixed(2)}</span>
              )}
              {event.fee === 0 && <span>Free Event</span>}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="border-t bg-muted/30 px-4 py-2.5">
        <div className="flex w-full gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onReject(event._id)}
            disabled={isLoading}
            className="flex-1 text-xs h-8 border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
          >
            <XCircle className="h-3.5 w-3.5 mr-1" />
            Reject
          </Button>
          <Button
            size="sm"
            onClick={() => onApprove(event._id)}
            disabled={isLoading}
            className="flex-1 text-xs h-8 bg-[#1F4D3F] hover:bg-[#1F4D3F]/90 text-white"
          >
            <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
            Approve
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
