'use client';

import { QRCodeSVG } from 'qrcode.react';
import { useUser } from '@/hooks/useUser';
import { Card, CardContent } from '@/components/ui';

export function QRDisplay() {
  const { profile } = useUser();

  if (!profile) return null;

  return (
    <Card className="border border-outline-variant bg-surface-container-lowest shadow-elevated w-full max-w-sm mx-auto text-center">
      <div className="h-2 bg-gradient-to-r from-primary to-primary-container" />
      <CardContent className="p-8 flex flex-col items-center justify-center space-y-6">
        <div>
          <h3 className="text-xl font-black text-on-surface">Your Attendance QR</h3>
          <p className="text-sm text-on-surface-variant font-medium mt-1">Show this to your Servant</p>
        </div>
        
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-outline-variant/30">
          <QRCodeSVG 
            value={profile.id} 
            size={200}
            level="H"
            includeMargin={false}
            fgColor="#001a42"
          />
        </div>

        <div className="text-xs text-on-surface-variant font-bold uppercase tracking-widest bg-surface-container-low px-4 py-2 rounded-full">
          ID: {profile.id.substring(0, 8)}
        </div>
      </CardContent>
    </Card>
  );
}
