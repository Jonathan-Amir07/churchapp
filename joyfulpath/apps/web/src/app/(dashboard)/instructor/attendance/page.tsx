'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, Button, PageTransition, StaggerContainer, StaggerItem, Input } from '@/components/ui';
import { useNotificationStore } from '@/stores/notifications.store';

export default function InstructorAttendancePage() {
  const [qrToken, setQrToken] = useState<string | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const addToast = useNotificationStore(state => state.addToast);
  const [scanId, setScanId] = useState('');
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    async function loadStudents() {
      try {
        const res = await fetch('/api/students');
        if (res.ok) {
          const data = await res.json();
          // Initialize status as null
          setStudents(data.map((s: any) => ({ ...s, status: null })));
        }
      } catch (err) {
        console.error('Failed to load students:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStudents();
  }, []);

  const generateQr = () => {
    const token = Math.random().toString(36).substring(2, 10).toUpperCase();
    setQrToken(token);
  };

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanId) return;
    setScanning(true);
    try {
      const res = await fetch('/api/attendance/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: scanId })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        addToast(data.message || 'Check-in successful!', 'success');
        setScanId('');
        // Update local roster state
        setStudents(prev => prev.map(s => s.id === scanId ? { ...s, status: 'present' } : s));
      } else {
        addToast(data.error || 'Failed to check in', 'error');
      }
    } catch (err) {
      addToast('An error occurred during check-in', 'error');
    } finally {
      setScanning(false);
    }
  };

  const markStudent = async (id: string, status: string) => {
    // This would ideally hit an endpoint to save individual attendance
    // For now we'll update local state and let the 'scan' endpoint handle 'present'
    if (status === 'present') {
      try {
        const res = await fetch('/api/attendance/scan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ studentId: id })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          addToast(data.message || 'Marked present', 'success');
          setStudents(prev => prev.map(s => s.id === id ? { ...s, status } : s));
        } else if (res.status === 409) {
           addToast('Student already checked in today.', 'success');
           setStudents(prev => prev.map(s => s.id === id ? { ...s, status } : s));
        } else {
          addToast(data.error || 'Failed to mark attendance', 'error');
        }
      } catch (err) {}
    } else {
      setStudents(prev => prev.map(s => s.id === id ? { ...s, status } : s));
      addToast(`Marked as ${status}`, 'success');
    }
  };

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

              {loading ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-12 bg-surface-container rounded-lg" />
                  <div className="h-12 bg-surface-container rounded-lg" />
                  <div className="h-12 bg-surface-container rounded-lg" />
                </div>
              ) : students.length === 0 ? (
                <div className="text-center py-8 text-on-surface-variant font-medium">
                  No students found in your classes.
                </div>
              ) : (
                students.map(student => (
                  <div key={student.id} className="flex justify-between items-center p-3 bg-surface-container rounded-lg">
                    <span className="font-medium text-on-surface">{student.name}</span>
                    <div className="flex gap-2">
                      <Button onClick={() => markStudent(student.id, 'present')} variant={student.status === 'present' ? 'success' : 'ghost'} size="sm">Present</Button>
                      <Button onClick={() => markStudent(student.id, 'absent')} variant={student.status === 'absent' ? 'danger' : 'ghost'} size="sm">Absent</Button>
                      <Button onClick={() => markStudent(student.id, 'late')} variant={student.status === 'late' ? 'secondary' : 'ghost'} size="sm">Late</Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </StaggerItem>

        <StaggerItem>
          <Card className="border border-outline-variant bg-surface-container-lowest text-center h-full">
            <CardContent className="p-8">
              <h3 className="font-bold text-on-surface mb-4">Quick Check-in</h3>
              
              <form onSubmit={handleScan} className="mb-6 space-y-3">
                <Input
                  placeholder="Enter Student ID"
                  value={scanId}
                  onChange={(e) => setScanId(e.target.value)}
                  disabled={scanning}
                />
                <Button type="submit" variant="secondary" fullWidth loading={scanning} icon="qr_code_scanner">
                  Scan ID
                </Button>
              </form>

              <div className="border-t border-outline-variant pt-6">
                {qrToken ? (
                  <div className="space-y-4 animate-[scale-in_0.3s_ease-out]">
                    <div className="w-32 h-32 bg-surface mx-auto flex items-center justify-center border-4 border-primary rounded-xl shadow-inner">
                      <span className="material-symbols-outlined text-[48px] text-primary">qr_code_2</span>
                    </div>
                    <p className="text-xl font-black tracking-widest text-on-surface">{qrToken}</p>
                    <p className="text-xs text-on-surface-variant">Students can scan this code or enter the PIN to mark themselves present.</p>
                    <Button variant="outline" size="sm" onClick={() => setQrToken(null)}>Close</Button>
                  </div>
                ) : (
                  <div className="py-4 text-on-surface-variant">
                    <span className="material-symbols-outlined text-[48px] mb-2 opacity-50">qr_code_scanner</span>
                    <p className="text-sm">Generate a code to project on the screen.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </StaggerItem>
      </StaggerContainer>
    </PageTransition>
  );
}
