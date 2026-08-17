'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Button, Card, CardContent } from '@/components/ui';
import { useNotificationStore } from '@/stores/notifications.store';
import { createClient } from '@/lib/supabase/client';

export function QRScanner({ onScanSuccess }: { onScanSuccess?: () => void }) {
  const [scannedId, setScannedId] = useState<string | null>(null);
  const [successAnim, setSuccessAnim] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const addToast = useNotificationStore((state) => state.addToast);
  const supabase = createClient();

  useEffect(() => {
    scannerRef.current = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: {width: 250, height: 250}, aspectRatio: 1.0 },
      false
    );

    const onScan = async (decodedText: string) => {
      if (scannedId === decodedText) return; // Prevent double scan
      setScannedId(decodedText);
      scannerRef.current?.pause(true);

      // Record attendance and award points
      try {
        const { error } = await supabase.from('attendance').insert({
          student_id: decodedText,
          status: 'present',
          date: new Date().toISOString().split('T')[0]
        });
        
        if (error && error.code !== '23505') throw error; // Ignore unique constraint if already scanned

        setSuccessAnim(true);
        addToast('Attendance recorded! +10 Blessings', 'success');
        
        if (onScanSuccess) onScanSuccess();

        setTimeout(() => {
          setSuccessAnim(false);
          setScannedId(null);
          scannerRef.current?.resume();
        }, 3000);
      } catch (err: any) {
        addToast('Failed to record attendance', 'error');
        setScannedId(null);
        scannerRef.current?.resume();
      }
    };

    scannerRef.current.render(onScan, () => {});

    return () => {
      scannerRef.current?.clear().catch(console.error);
    };
  }, [scannedId, addToast, supabase, onScanSuccess]);

  return (
    <Card className="border border-outline-variant bg-surface-container-lowest shadow-elevated w-full max-w-sm mx-auto overflow-hidden relative">
      <div className="h-2 bg-gradient-to-r from-tertiary to-tertiary-container" />
      <CardContent className="p-0">
        <div id="reader" className="w-full border-none [&_video]:object-cover" />
        
        {successAnim && (
          <div className="absolute inset-0 bg-tertiary/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center animate-[fade-in_0.3s_ease-out]">
            <span className="material-symbols-outlined text-[80px] text-white animate-[bounce-in_0.5s_cubic-bezier(0.68,-0.55,0.265,1.55)]" style={{ fontVariationSettings: "'FILL' 1" }}>
              check_circle
            </span>
            <h3 className="text-2xl font-black text-white mt-4">Success!</h3>
            <p className="text-tertiary-fixed text-sm font-bold">+10 Blessings</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
