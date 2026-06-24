'use client';

import { type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'interactive' | 'gradient';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  gradient?: 'primary' | 'secondary' | 'success';
}

export function Card({
  className,
  variant = 'default',
  padding = 'md',
  gradient,
  children,
  ...props
}: CardProps) {
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const gradientStyles = {
    primary: 'bg-gradient-to-br from-primary to-primary-container text-on-primary',
    secondary: 'bg-gradient-to-br from-secondary to-secondary-container text-on-secondary',
    success: 'bg-gradient-to-br from-tertiary to-tertiary-container text-on-tertiary',
  };

  if (gradient) {
    return (
      <div
        className={cn(
          'rounded-2xl',
          paddingStyles[padding],
          gradientStyles[gradient],
          'shadow-card',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'card',
        paddingStyles[padding],
        variant === 'interactive' && 'card-interactive cursor-pointer',
        variant === 'elevated' && 'card-elevated',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mb-4', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-xl font-bold text-on-surface', className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-sm text-on-surface-variant mt-1', className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mt-4 flex items-center', className)} {...props}>
      {children}
    </div>
  );
}
