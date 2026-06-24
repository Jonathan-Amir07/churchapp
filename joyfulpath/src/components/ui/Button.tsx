'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  tactile?: boolean;
  loading?: boolean;
  icon?: string;
  iconPosition?: 'start' | 'end';
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      tactile = true,
      loading = false,
      icon,
      iconPosition = 'end',
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center gap-2 font-bold transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed select-none';

    const variantStyles = {
      primary: cn(
        'bg-primary text-on-primary hover:bg-primary-container',
        tactile && 'btn-tactile'
      ),
      secondary: cn(
        'bg-secondary-container text-on-secondary-container hover:brightness-105',
        tactile && 'btn-tactile-secondary'
      ),
      success: cn(
        'bg-tertiary text-on-tertiary hover:bg-tertiary-container',
        tactile && 'btn-tactile-success'
      ),
      outline:
        'border-2 border-primary text-primary hover:bg-primary hover:text-on-primary bg-transparent',
      ghost:
        'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface bg-transparent',
      danger: cn(
        'bg-error text-on-error hover:brightness-110',
        tactile && 'shadow-[0_4px_0_0_#93000a] active:shadow-[0_2px_0_0_#93000a] active:translate-y-[2px]'
      ),
    };

    const sizeStyles = {
      sm: 'h-9 px-4 text-sm rounded-lg',
      md: 'h-12 px-6 text-base rounded-xl',
      lg: 'h-14 px-8 text-lg rounded-xl',
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          loading && 'cursor-wait',
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <span className="material-symbols-outlined animate-spin text-[18px]">
            progress_activity
          </span>
        )}
        {!loading && icon && iconPosition === 'start' && (
          <span className="material-symbols-outlined text-[20px]">{icon}</span>
        )}
        {children}
        {!loading && icon && iconPosition === 'end' && (
          <span className="material-symbols-outlined text-[20px]">{icon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
