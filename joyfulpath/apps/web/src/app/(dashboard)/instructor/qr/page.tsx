import { QRScanner } from '@/components/attendance/QRScanner';

export default function InstructorQRPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-black text-on-surface">Scan Attendance</h2>
        <p className="text-on-surface-variant font-medium mt-1">Scan a child&apos;s QR code to mark them present.</p>
      </div>
      <QRScanner />
    </div>
  );
}
