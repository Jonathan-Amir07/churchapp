import { QRScanner } from '@/components/attendance/QRScanner';
import { useTranslations } from 'next-intl';

export default function InstructorQRPage() {
  const tQr = useTranslations('qr');
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-black text-on-surface">{tQr('scanAttendance')}</h2>
        <p className="text-on-surface-variant font-medium mt-1">{tQr('scanDescription')}</p>
      </div>
      <QRScanner />
    </div>
  );
}
