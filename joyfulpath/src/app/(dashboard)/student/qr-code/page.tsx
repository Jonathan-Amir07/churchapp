'use client';

import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Card, CardContent } from '@/components/ui';
import { useUser } from '@/hooks/useUser';

// ── MOCK: student ID comes from the mock profile ───────────────────────────
// REAL DB: profile.id is the real Supabase UUID — no change needed here.

export default function StudentQRCodePage() {
  const { profile, loading } = useUser();
  const [copied, setCopied] = useState(false);
  const [pulse, setPulse] = useState(false);

  // Trigger a small entrance animation after mount
  useEffect(() => {
    const t = setTimeout(() => setPulse(true), 400);
    return () => clearTimeout(t);
  }, []);

  const studentId = profile?.id ?? 'mock-student-id';
  const displayName = profile?.display_name ?? 'Student';

  const handleCopy = () => {
    navigator.clipboard?.writeText(studentId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-8 animate-[slide-up_0.4s_ease-out]">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <span
            className="material-symbols-outlined text-[32px] text-primary"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            qr_code_2
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-on-surface">
          My Check-in QR Code
        </h1>
        <p className="text-sm text-on-surface-variant max-w-sm mx-auto leading-relaxed">
          Show this QR code to your instructor at the start of class to mark your attendance.
        </p>
      </div>

      {/* QR Card */}
      <Card className="border-2 border-secondary/20 bg-surface-container-lowest shadow-2xl w-full max-w-sm rounded-3xl overflow-hidden">
        <CardContent className="p-8 flex flex-col items-center gap-6">
          {/* Avatar + Name */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-tertiary flex items-center justify-center text-white text-2xl font-extrabold shadow-md">
              {displayName[0]?.toUpperCase()}
            </div>
            <div className="text-center">
              <p className="font-extrabold text-on-surface text-base">{displayName}</p>
              <p className="text-xs text-on-surface-variant font-medium">Sunday School Student</p>
            </div>
          </div>

          {/* QR Code */}
          {loading ? (
            <div className="w-48 h-48 rounded-2xl bg-surface-container-high animate-pulse" />
          ) : (
            <div
              className={`p-4 bg-white rounded-2xl shadow-sm border border-outline-variant/40 transition-all duration-500 ${
                pulse ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
              }`}
            >
              <QRCodeSVG
                value={studentId}
                size={192}
                bgColor="#ffffff"
                fgColor="#1a1a2e"
                level="H"
                marginSize={1}
              />
            </div>
          )}

          {/* Student ID display */}
          <div className="w-full">
            <p className="text-[10px] uppercase font-black text-on-surface-variant/70 text-center tracking-widest mb-1">
              Student ID
            </p>
            <button
              onClick={handleCopy}
              className="w-full text-center font-mono text-xs font-bold text-on-surface-variant bg-surface-container-high hover:bg-surface-container px-4 py-2.5 rounded-xl border border-outline-variant/50 transition-all duration-150 flex items-center justify-center gap-2 group"
            >
              <span className="truncate">{studentId}</span>
              <span className="material-symbols-outlined text-[14px] shrink-0 group-hover:text-primary transition-colors">
                {copied ? 'check' : 'content_copy'}
              </span>
            </button>
            {copied && (
              <p className="text-center text-[10px] font-bold text-success mt-1">Copied to clipboard!</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <div className="flex flex-col gap-3 w-full max-w-sm">
        {[
          { icon: 'brightness_high', text: 'Increase your screen brightness for easier scanning.' },
          { icon: 'lock', text: 'Your QR code is unique to you — do not share it.' },
          { icon: 'star', text: 'Each check-in earns you +50 XP and continues your streak!' },
        ].map(({ icon, text }) => (
          <div key={icon} className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs text-on-surface-variant font-medium">
            <span className="material-symbols-outlined text-[18px] text-primary mt-0.5 shrink-0">{icon}</span>
            {text}
          </div>
        ))}
      </div>
    </div>
  );
}
