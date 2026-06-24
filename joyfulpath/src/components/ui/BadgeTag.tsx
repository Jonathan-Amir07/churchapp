'use client';

import { cn } from '@/lib/utils';

export interface BadgeTagProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline';
  size?: 'sm' | 'md';
  icon?: string;
  className?: string;
}

export function BadgeTag({
  children,
  variant = 'primary',
  size = 'sm',
  icon,
  className,
}: BadgeTagProps) {
  const variantStyles = {
    primary: 'bg-primary-fixed text-on-primary-fixed',
    secondary: 'bg-secondary-fixed text-on-secondary-fixed',
    success: 'bg-tertiary-fixed text-on-tertiary-fixed',
    warning: 'bg-secondary-container text-on-secondary-container',
    error: 'bg-error-container text-on-error-container',
    outline: 'bg-transparent border border-outline text-on-surface-variant',
  };

  const sizeStyles = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-semibold tracking-wide uppercase',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {icon && (
        <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
          {icon}
        </span>
      )}
      {children}
    </span>
  );
}
