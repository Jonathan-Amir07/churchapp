'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, Button, PageTransition, StaggerContainer, StaggerItem, Input } from '@/components/ui';
import { useNotificationStore } from '@/stores/notifications.store';

export default function InstructorAttendancePage() {
  const [qrToken, setQrToken] = useState<string | null>(null);
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const addToast = useNotificationStore(state => state.addToast);
  const [scanId, setScanId] = useState('');
  const [scanning, setScanning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadClasses() {
      try {
        const res = await fetch('/api/classes');
        if (res.ok) {
          const data = await res.json();
          const arr = Array.isArray(data) ? data : data.data || [];
          setClasses(arr);
          if (arr.length > 0) setSelectedClassId(arr[0].id);
        }
      } catch (err) {
        console.error('Failed to load classes:', err);
      } finally {
        setLoading(false);
      }
    }
    loadClasses();
  }, []);

  useEffect(() => {
    if (!selectedClassId) return;
    async function loadStudents() {
      setLoading(true);
      try {
        // Fetch students for the class
        const res = await fetch(`/api/students?classId=${selectedClassId}`);
        if (res.ok) {
          const data = await res.json();
          const arr = Array.isArray(data) ? data : data.data || [];
          setStudents(arr.map((s: any) => ({ ...s, status: null })));
        }
      } catch (err) {
        console.error('Failed to load students:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStudents();
  }, [selectedClassId]);

  const generateQr = async () => {
    if (!selectedClassId) {
      addToast('Please select a class first', 'error');
      return;
    }
    try {
      const res = await fetch('/api/attendance/qr/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classId: selectedClassId })
      });
      if (res.ok) {
        const data = await res.json();
        setQrToken(data.token);
      } else {
        addToast('Failed to generate QR code', 'error');
      }
    } catch (err) {
      addToast('Failed to generate QR code', 'error');
    }
  };

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanId || !qrToken) {
      addToast('Generate a QR code first and enter a valid ID', 'error');
      return;
    }
    setScanning(true);
    try {
      // In a real app, the scanner scans the QR token. Here we simulate scanning the token for a specific student.
      // Wait, the API expects { token } and uses req.user.userId (since the STUDENT is supposed to scan it on their mobile app).
      // If the INSTRUCTOR is scanning the student's ID, that's not what /qr/scan is built for.
      // Let's just simulate manual attendance for that student.
      const res = await fetch('/api/attendance/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classId: selectedClassId,
          records: [{ studentId: scanId, status: 'present' }]
        })
      });
      const data = await res.json();
      if (res.ok) {
        addToast('Check-in successful!', 'success');
        setScanId('');
        setStudents(prev => prev?.map(s => s.id === scanId || s.username === scanId ? { ...s, status: 'present' } : s));
      } else {
        addToast(data.message || 'Failed to check in', 'error');
      }
    } catch (err) {
      addToast('An error occurred during check-in', 'error');
    } finally {
      setScanning(false);
    }
  };

  const markStudent = (id: string, status: string) => {
    setStudents(prev => prev?.map(s => s.id === id ? { ...s, status } : s));
  };

  const saveAttendance = async () => {
    if (!selectedClassId) return;
    setIsSaving(true);
    try {
      const records = students.filter(s => s.status).map(s => ({
        studentId: s.id,
        status: s.status
      }));
      if (records.length === 0) {
        addToast('No attendance marked', 'error');
        return;
      }
      const res = await fetch('/api/attendance/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classId: selectedClassId,
          records
        })
      });
      const data = await res.json();
      if (res.ok) {
        addToast('Attendance saved successfully', 'success');
      } else {
        addToast(data.message || 'Failed to save attendance', 'error');
      }
    } catch (err) {
      addToast('An error occurred', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PageTransition className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-2xl font-extrabold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>fact_check</span>
          Attendance Management
        </h1>
        <div className="flex items-center gap-4">
          <select 
            value={selectedClassId} 
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="rounded-lg border border-outline-variant bg-surface px-4 py-2 text-on-surface outline-none"
          >
            <option value="">Select a class...</option>
            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <Button variant="primary" onClick={generateQr} icon="qr_code_2" disabled={!selectedClassId}>Generate QR Code</Button>
        </div>
      </div>

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StaggerItem className="md:col-span-2">
          <Card className="border border-outline-variant bg-surface-container-lowest">
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-outline-variant pb-3">
                <h3 className="font-bold text-on-surface">Manual Roster — Today</h3>
                <Button variant="success" size="sm" icon="save" onClick={saveAttendance} loading={isSaving}>Save Attendance</Button>
              </div>

              {loading ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-12 bg-surface-container rounded-lg" />
                  <div className="h-12 bg-surface-container rounded-lg" />
                  <div className="h-12 bg-surface-container rounded-lg" />
                </div>
              ) : students.length === 0 ? (
                <div className="text-center py-8 text-on-surface-variant font-medium">
                  {selectedClassId ? 'No students found in this class.' : 'Select a class to view students.'}
                </div>
              ) : (
                <div className="divide-y divide-outline-variant">
                  {students?.map(student => (
                    <div key={student.id} className="flex justify-between items-center py-3">
                      <span className="font-medium text-on-surface">{student.displayName || student.firstName + ' ' + student.lastName}</span>
                      <div className="flex gap-2">
                        <Button onClick={() => markStudent(student.id, 'present')} variant={student.status === 'present' ? 'success' : 'ghost'} size="sm">Present</Button>
                        <Button onClick={() => markStudent(student.id, 'absent')} variant={student.status === 'absent' ? 'danger' : 'ghost'} size="sm">Absent</Button>
                        <Button onClick={() => markStudent(student.id, 'late')} variant={student.status === 'late' ? 'secondary' : 'ghost'} size="sm">Late</Button>
                      </div>
                    </div>
                  ))}
                </div>
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
                  disabled={scanning || !selectedClassId}
                />
                <Button type="submit" variant="secondary" fullWidth loading={scanning} icon="qr_code_scanner" disabled={!selectedClassId}>
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
