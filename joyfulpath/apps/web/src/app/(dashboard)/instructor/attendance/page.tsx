'use client';

import { useState } from 'react';
import { Card, CardContent, Button, PageTransition, StaggerContainer, StaggerItem } from '@/components/ui';

export default function InstructorAttendancePage() {
  const [qrToken, setQrToken] = useState<string | null>(null);

  const generateQr = () => {
    const token = Math.random().toString(36).substring(2, 10).toUpperCase();
    setQrToken(token);
  };

  const students = [
    { id: '1', name: 'John Doe', status: 'present' },
    { id: '2', name: 'Jane Smith', status: 'absent' },
    { id: '3', name: 'Michael Johnson', status: 'present' }
  ];

  return (
    <PageTransition className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-extrabold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>fact_check</span>
          Attendance Management
        </h1>
        <Button variant="primary" onClick={generateQr} icon="qr_code_2">Generate QR Code</Button>
      </div>

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StaggerItem className="md:col-span-2">
          <Card className="border border-outline-variant bg-surface-container-lowest">
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-outline-variant pb-3">
                <h3 className="font-bold text-on-surface">Manual Roster — Today</h3>
                <Button variant="success" size="sm" icon="save">Save Attendance</Button>
              </div>

              {students.map(student => (
                <div key={student.id} className="flex justify-between items-center p-3 bg-surface-container rounded-lg">
                  <span className="font-medium text-on-surface">{student.name}</span>
                  <div className="flex gap-2">
                    <Button variant={student.status === 'present' ? 'success' : 'ghost'} size="sm">Present</Button>
                    <Button variant={student.status === 'absent' ? 'danger' : 'ghost'} size="sm">Absent</Button>
                    <Button variant="ghost" size="sm">Late</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </StaggerItem>

        <StaggerItem>
          <Card className="border border-outline-variant bg-surface-container-lowest text-center h-full">
            <CardContent className="p-8">
              <h3 className="font-bold text-on-surface mb-4">Quick Check-in</h3>
              {qrToken ? (
                <div className="space-y-4 animate-[scale-in_0.3s_ease-out]">
                  <div className="w-48 h-48 bg-surface mx-auto flex items-center justify-center border-4 border-primary rounded-xl shadow-inner">
                    <span className="material-symbols-outlined text-[64px] text-primary">qr_code_2</span>
                  </div>
                  <p className="text-2xl font-black tracking-widest text-on-surface">{qrToken}</p>
                  <p className="text-xs text-on-surface-variant">Students can scan this code or enter the PIN to mark themselves present.</p>
                  <Button variant="outline" onClick={() => setQrToken(null)}>Close</Button>
                </div>
              ) : (
                <div className="py-8 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[48px] mb-2 opacity-50">qr_code_scanner</span>
                  <p className="text-sm">Generate a code to project on the screen.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </StaggerItem>
      </StaggerContainer>
    </PageTransition>
  );
}
