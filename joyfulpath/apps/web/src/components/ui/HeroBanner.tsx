'use client';

import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';

export interface HeroBannerProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  variant?: 'primary' | 'admin' | 'instructor' | 'parent';
  children?: ReactNode;
  className?: string;
}

/**
 * HeroBanner — a consistent welcome/hero section for all dashboards.
 * Uses the design system gradient palette.
 */
export function HeroBanner({ title, subtitle, icon, variant = 'primary', children, className }: HeroBannerProps) {
  const gradients = {
    primary: 'bg-gradient-to-br from-primary via-primary-container to-secondary',
    admin: 'bg-gradient-to-br from-[#1e293b] to-[#334155]',
    instructor: 'bg-gradient-to-br from-primary to-primary-container',
    parent: 'bg-gradient-to-br from-primary via-primary-container to-tertiary-container',
  };

  return (
    <div className={cn(
      'relative rounded-3xl overflow-hidden p-8 md:p-10 text-on-primary shadow-2xl select-none border border-secondary/30',
      gradients[variant],
      className
    )}>
      <div className="absolute inset-0 bg-coptic-pattern opacity-10 mix-blend-overlay pointer-events-none" />
      <div className="relative z-10 space-y-4">
        <div className="flex items-center gap-4">
          {icon && (
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center animate-[bounce-in_0.5s_cubic-bezier(0.68,-0.55,0.265,1.55)]">
              {icon}
            </div>
          )}
          <h1 className="text-2xl md:text-3xl font-extrabold">{title}</h1>
        </div>
        {subtitle && (
          <p className="text-sm md:text-base font-medium opacity-90 max-w-xl">
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}
