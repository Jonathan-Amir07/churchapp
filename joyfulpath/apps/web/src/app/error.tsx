'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
      <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mb-6">
        <span
          className="material-symbols-outlined text-error text-[48px]"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          error
        </span>
      </div>

      <h2 className="text-2xl font-extrabold text-on-surface mb-2">
        Something went wrong
      </h2>
      <p className="text-on-surface-variant mb-8 max-w-md">
        An unexpected error occurred. Please try again, or contact support if the problem persists.
      </p>

      <button
        onClick={reset}
        className="px-6 py-3 bg-primary text-on-primary rounded-xl font-bold hover:opacity-90 transition-opacity"
      >
        Try Again
      </button>
    </div>
  );
}
