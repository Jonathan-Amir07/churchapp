'use client';

import { useEffect, useRef, useState } from 'react';

// ── Type-only import from html5-qrcode ─────────────────────────────────────
type Html5QrcodeScanner = import('html5-qrcode').Html5QrcodeScanner;

export type ScanResult =
  | { success: true; studentName: string; xpAwarded: number; newStreak: number; checkInTime: string }
  | { success: false; alreadyCheckedIn?: boolean; error: string };

interface QRScannerProps {
  /** Called with the result every time a code is successfully decoded */
  onResult?: (result: ScanResult, rawCode: string) => void;
}

/**
 * Renders an html5-qrcode camera scanner and calls POST /api/attendance/scan
 * with the decoded student ID.
 */
export function QRScanner({ onResult }: QRScannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'error' | 'duplicate'>('idle');
  const [lastResult, setLastResult] = useState<ScanResult | null>(null);
  const [lastRaw, setLastRaw] = useState('');
  const cooldownRef = useRef(false); // prevent duplicate rapid fires

  useEffect(() => {
    let scanner: Html5QrcodeScanner;

    const initScanner = async () => {
      const { Html5QrcodeScanner } = await import('html5-qrcode');

      if (!containerRef.current) return;

      scanner = new Html5QrcodeScanner(
        'qr-reader',
        {
          fps: 10,
          qrbox: { width: 220, height: 220 },
          rememberLastUsedCamera: true,
          showTorchButtonIfSupported: true,
        },
        /* verbose= */ false
      );
      scannerRef.current = scanner;

      scanner.render(
        async (decodedText: string) => {
          // Throttle repeated scans of the same code
          if (cooldownRef.current) return;
          cooldownRef.current = true;
          setStatus('scanning');
          setLastRaw(decodedText);

          try {
            const res = await fetch('/api/attendance/scan', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ studentId: decodedText, scannedBy: 'admin' }),
            });
            const data: ScanResult = await res.json();
            setLastResult(data);
            setStatus(
              data.success ? 'success' : data.alreadyCheckedIn ? 'duplicate' : 'error'
            );
            onResult?.(data, decodedText);
          } catch {
            const err: ScanResult = { success: false, error: 'Network error — could not reach server.' };
            setLastResult(err);
            setStatus('error');
            onResult?.(err, decodedText);
          }

          // Allow next scan after 3 seconds
          setTimeout(() => {
            cooldownRef.current = false;
            setStatus('idle');
          }, 3000);
        },
        (errorMessage: string) => {
          // Ignore per-frame decode errors (very frequent)
          void errorMessage;
        }
      );
    };

    initScanner();

    return () => {
      scanner?.clear().catch(() => {});
    };
  }, [onResult]);

  const statusColors: Record<typeof status, string> = {
    idle:      'border-outline-variant',
    scanning:  'border-primary animate-pulse',
    success:   'border-success',
    error:     'border-error',
    duplicate: 'border-secondary',
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Camera viewfinder */}
      <div
        className={`w-full max-w-sm rounded-2xl overflow-hidden border-2 transition-all duration-300 ${statusColors[status]} shadow-sm bg-surface-container-lowest`}
      >
        <div id="qr-reader" ref={containerRef} className="w-full" />
      </div>

      {/* Feedback banner */}
      {status !== 'idle' && lastResult && (
        <div
          className={`w-full max-w-sm rounded-2xl p-4 border text-sm font-bold transition-all duration-300 ${
            status === 'success'
              ? 'bg-success/10 border-success text-success'
              : status === 'duplicate'
              ? 'bg-secondary/10 border-secondary text-secondary'
              : status === 'scanning'
              ? 'bg-primary/10 border-primary text-primary'
              : 'bg-error/10 border-error text-error'
          }`}
        >
          {status === 'scanning' && (
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
              Processing check-in…
            </span>
          )}
          {status === 'success' && lastResult.success && (
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              {lastResult.studentName} checked in! +{lastResult.xpAwarded} XP · 🔥 {lastResult.newStreak}-day streak
            </span>
          )}
          {status === 'duplicate' && !lastResult.success && (
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">info</span>
              {lastResult.error}
            </span>
          )}
          {status === 'error' && !lastResult.success && (
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">error</span>
              {lastResult.error}
            </span>
          )}
        </div>
      )}

      {/* Scanned ID preview */}
      {lastRaw && (
        <p className="text-[10px] font-mono text-on-surface-variant/60">
          Last scanned: <span className="font-bold">{lastRaw}</span>
        </p>
      )}
    </div>
  );
}
