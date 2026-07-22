'use client';

import { cn } from '@/lib/utils';

export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className,
  variant = 'text',
  width,
  height,
}: SkeletonProps) {
  const variantStyles = {
    text: 'h-4 rounded-md',
    circular: 'rounded-full aspect-square',
    rectangular: 'rounded-xl',
    card: 'rounded-xl h-48',
  };

  return (
    <div
      className={cn(
        'bg-surface-container-high animate-pulse',
        variantStyles[variant],
        className
      )}
      style={{ width, height }}
    />
  );
}

/**
 * Skeleton for a lesson card.
 */
export function LessonCardSkeleton() {
  return (
    <div className="card p-0 overflow-hidden">
      <Skeleton variant="rectangular" className="h-40 rounded-none" />
      <div className="p-5 space-y-3">
        <Skeleton className="w-3/4 h-5" />
        <Skeleton className="w-full" />
        <Skeleton className="w-2/3" />
        <Skeleton className="h-12 rounded-xl mt-4" />
      </div>
    </div>
  );
}

/**
 * Skeleton for a leaderboard row.
 */
export function LeaderboardRowSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4">
      <Skeleton className="w-8 h-6" />
      <Skeleton variant="circular" className="w-10 h-10" />
      <div className="flex-1 space-y-2">
        <Skeleton className="w-32 h-4" />
        <Skeleton className="w-20 h-3" />
      </div>
      <Skeleton className="w-16 h-5" />
    </div>
  );
}
