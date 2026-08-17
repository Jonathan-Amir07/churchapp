'use client';

import { cn } from '@/lib/utils';

export interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'success';
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  size = 'md',
  variant = 'primary',
  showLabel = false,
  label,
  animated = true,
  className,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const sizeStyles = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  const gradients = {
    primary: 'from-primary to-primary-container',
    secondary: 'from-secondary to-secondary-container',
    success: 'from-tertiary to-tertiary-container',
  };

  return (
    <div className={cn('w-full', className)}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && (
            <span className="text-sm font-semibold text-on-surface">{label}</span>
          )}
          {showLabel && (
            <span className="text-sm font-bold text-primary">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      <div
        className={cn(
          'w-full rounded-full overflow-hidden bg-surface-container-high progress-bar-track',
          sizeStyles[size]
        )}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className={cn(
            'h-full rounded-full bg-gradient-to-r relative',
            gradients[variant],
            animated && 'transition-all duration-700 ease-out'
          )}
          style={{ width: `${percentage}%` }}
        >
          {/* Shine overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/25 to-transparent rounded-full" />
        </div>
      </div>
    </div>
  );
}
