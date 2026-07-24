'use client';

import { useState, useCallback, useEffect, useRef, memo } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

export interface SearchBarProps {
  /** Callback fired with the debounced search query */
  onSearch: (query: string) => void;
  /** Placeholder text override */
  placeholder?: string;
  /** Debounce delay in ms (default: 200) */
  debounceMs?: number;
  /** Additional CSS classes */
  className?: string;
  /** Result count to display (optional) */
  resultCount?: number;
  /** Total count before filtering */
  totalCount?: number;
}

/**
 * High-performance, debounced search bar component.
 * Uses an uncontrolled internal state to avoid parent re-renders on each keystroke,
 * only notifying the parent after the debounce settles.
 */
export const SearchBar = memo(function SearchBar({
  onSearch,
  placeholder,
  debounceMs = 200,
  className,
  resultCount,
  totalCount,
}: SearchBarProps) {
  const t = useTranslations('common');
  const [localValue, setLocalValue] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setLocalValue(value);

      // Clear any pending debounce
      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        onSearch(value);
      }, debounceMs);
    },
    [onSearch, debounceMs]
  );

  const handleClear = useCallback(() => {
    setLocalValue('');
    onSearch('');
    if (timerRef.current) clearTimeout(timerRef.current);
  }, [onSearch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const showCount = resultCount !== undefined && totalCount !== undefined;

  return (
    <div className={cn('relative flex items-center gap-3', className)}>
      <div className="relative flex-1 group">
        <span className="material-symbols-outlined absolute start-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors text-[20px]">
          search
        </span>
        <input
          type="text"
          value={localValue}
          onChange={handleChange}
          placeholder={placeholder || t('search')}
          className={cn(
            'w-full h-11 ps-12 pe-10 bg-surface-container rounded-xl border-2 border-transparent',
            'focus:border-primary focus:ring-0 transition-colors duration-150',
            'text-on-surface placeholder:text-outline-variant outline-none',
            'font-medium text-sm'
          )}
        />
        {localValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute end-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-outline hover:text-on-surface hover:bg-surface-container-high transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        )}
      </div>
      {showCount && (
        <span className="text-xs font-bold text-on-surface-variant whitespace-nowrap shrink-0">
          {resultCount} / {totalCount}
        </span>
      )}
    </div>
  );
});
