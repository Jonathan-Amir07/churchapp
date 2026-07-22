'use client';

import { forwardRef, type InputHTMLAttributes, useState } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: string;
  error?: string;
  hint?: string;
  showPasswordToggle?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, icon, error, hint, showPasswordToggle, type, id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-semibold tracking-wide text-on-surface uppercase"
          >
            {label}
          </label>
        )}
        <div className="relative group">
          {icon && (
            <span className="material-symbols-outlined absolute start-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors text-[20px]">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            className={cn(
              'w-full h-14 bg-surface-container rounded-lg border-2 border-transparent',
              'focus:border-primary focus:ring-0 transition-colors duration-200',
              'text-on-surface placeholder:text-outline-variant outline-none',
              'font-medium text-base',
              icon && 'ps-12',
              isPassword && showPasswordToggle && 'pe-12',
              !icon && 'ps-4',
              error && 'border-error focus:border-error',
              className
            )}
            {...props}
          />
          {isPassword && showPasswordToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute end-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
              tabIndex={-1}
            >
              <span className="material-symbols-outlined text-[20px]">
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          )}
        </div>
        {error && (
          <p className="text-sm text-error flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">error</span>
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="text-sm text-on-surface-variant">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
