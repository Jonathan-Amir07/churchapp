'use client';

import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';

export interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  iconColor?: string;
  trend?: { value: string; positive: boolean };
  className?: string;
}

/**
 * StatCard — a consistent statistics display card.
 * Uses the design system tokens for all colors.
 */
export function StatCard({ icon, label, value, iconColor = 'text-primary bg-primary/10', trend, className }: StatCardProps) {
  return (
    <div className={cn(
      'card p-6 flex items-center justify-between stagger-item',
      'border-2 border-secondary/20 hover:border-secondary/50 hover:shadow-md transition-all bg-surface-container-lowest',
      className
    )}>
      <div className="space-y-1 min-w-0">
        <p className="text-xs uppercase font-black text-on-surface-variant/80 tracking-wider truncate">
          {label}
        </p>
        <h3 className="text-3xl font-extrabold text-on-surface truncate">
          {value}
        </h3>
        {trend && (
          <p className={cn(
            'text-[10px] font-bold',
            trend.positive ? 'text-success' : 'text-error'
          )}>
            {trend.positive ? '↑' : '↓'} {trend.value}
          </p>
        )}
      </div>
      <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center shrink-0', iconColor)}>
        <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
          {icon}
        </span>
      </div>
    </div>
  );
}
