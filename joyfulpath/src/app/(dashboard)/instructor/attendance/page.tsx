'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, Button, BadgeTag, QRScanner, type ScanResult } from '@/components/ui';

interface Student {
  id: string;
  name: string;
  streak: number;
}

const MOCK_STUDENTS: Student[] = [
  { id: 'mock-student-id',  name: 'Jonathan Junior', streak: 5 },
  { id: 'mock-student2-id', name: 'Mary Grace',      streak: 2 },
  { id: '3',                name: 'David Shepherd',  streak: 8 },
  { id: '4',                name: 'Noah Ark',         streak: 4 },
  { id: '5',                name: 'Sarah Joy',        streak: 0 },
];

type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

type Tab = 'roster' | 'scanner';

interface CheckInRecord {
  studentName: string;
  studentId: string;
  time: string;
  xp: number;
  streak: number;
}

export default function InstructorAttendance() {
  const tNav        = useTranslations('nav');
  const tAttendance = useTranslations('attendance');
  const tCommon     = useTranslations('common');

  const [activeTab, setActiveTab] = useState<Tab>('roster');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('c1');
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>(
    MOCK_STUDENTS.reduce((acc, s) => ({ ...acc, [s.id]: 'present' }), {})
  );

  // QR scanner state
  const [checkIns, setCheckIns] = useState<CheckInRecord[]>([]);
  const [lastScanError, setLastScanError] = useState<string | null>(null);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSave = () => {
    alert(tAttendance('saveSuccess'));
  };

  // Called by QRScanner on each decoded result
  const handleScanResult = useCallback((result: ScanResult, rawCode: string) => {
    if (result.success) {
      setCheckIns((prev) => [
        {
          studentName: result.studentName,
          studentId: rawCode,
          time: new Date(result.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          xp: result.xpAwarded,
          streak: result.newStreak,
        },
        ...prev,
      ]);
      setLastScanError(null);

      // Also mark as present in the roster
      setAttendance((prev) => ({ ...prev, [rawCode]: 'present' }));
    } else {
      setLastScanError(result.error);
    }
  }, []);

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'roster',  label: 'Attendance Roster',  icon: 'list_alt' },
    { id: 'scanner', label: 'QR Check-in Scanner', icon: 'qr_code_scanner' },
  ];

  return (
    <div className="space-y-6 animate-[slide-up_0.4s_ease-out]">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">
          {tNav('attendance')}
        </h1>
        <p className="text-on-surface-variant text-sm max-w-2xl">
          {tAttendance('description')}
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2 p-1 bg-surface-container-low rounded-2xl border border-outline-variant/50 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── TAB: ROSTER ─────────────────────────────────────────────────────── */}
      {activeTab === 'roster' && (
        <>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/60 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <div className="flex flex-col gap-1 w-full sm:w-48">
                <label className="text-xs font-bold text-on-surface-variant">
                  {tAttendance('selectClass')}
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="h-10 px-3 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary text-sm font-medium"
                >
                  <option value="c1">Class A (Level 1–3)</option>
                  <option value="c2">Class B (Level 4–7)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1 w-full sm:w-48">
                <label className="text-xs font-bold text-on-surface-variant">
                  {tAttendance('selectDate')}
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="h-10 px-3 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary text-sm font-medium"
                />
              </div>
            </div>

            <Button variant="primary" size="sm" onClick={handleSave} className="w-full sm:w-auto mt-4 sm:mt-0">
              {tCommon('save')}
            </Button>
          </div>

          {/* Roster Table */}
          <Card className="border border-outline-variant bg-surface-container-lowest shadow-sm">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-start border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-outline-variant/60 text-outline text-xs uppercase font-black">
                      <th className="px-6 py-4 text-start">Student</th>
                      <th className="px-6 py-4 text-start">Streak</th>
                      <th className="px-6 py-4 text-end">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/40">
                    {MOCK_STUDENTS.map((student) => (
                      <tr key={student.id} className="hover:bg-surface-container-low/40 transition duration-150">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                              {student.name[0]}
                            </div>
                            <span className="font-extrabold text-on-surface">{student.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-xs font-black text-orange-600">
                            <span
                              className="material-symbols-outlined text-[16px]"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              local_fire_department
                            </span>
                            <span>{tAttendance('streakInfo', { streak: student.streak })}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-end">
                          <div className="inline-flex gap-1.5 p-1 bg-surface-container-low rounded-xl border border-outline-variant/40 flex-wrap justify-end">
                            {(['present', 'absent', 'late', 'excused'] as const).map((status) => {
                              const isActive = attendance[student.id] === status;
                              return (
                                <button
                                  key={status}
                                  type="button"
                                  onClick={() => handleStatusChange(student.id, status)}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all duration-150 ${
                                    isActive
                                      ? status === 'present'
                                        ? 'bg-tertiary text-on-tertiary shadow-sm'
                                        : status === 'absent'
                                        ? 'bg-error text-on-error shadow-sm'
                                        : status === 'late'
                                        ? 'bg-secondary text-on-secondary shadow-sm'
                                        : 'bg-outline text-white shadow-sm'
                                      : 'text-on-surface-variant hover:text-on-surface'
                                  }`}
                                >
                                  {tAttendance(status)}
                                </button>
                              );
                            })}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* ── TAB: QR SCANNER ─────────────────────────────────────────────────── */}
      {activeTab === 'scanner' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Scanner left col */}
          <div className="space-y-4">
            <Card className="border border-outline-variant bg-surface-container-lowest shadow-sm">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span
                      className="material-symbols-outlined text-[22px] text-primary"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      qr_code_scanner
                    </span>
                  </div>
                  <div>
                    <h2 className="font-extrabold text-on-surface text-base">Scan Student QR Code</h2>
                    <p className="text-xs text-on-surface-variant">
                      Point the camera at the student&apos;s QR code to check them in.
                    </p>
                  </div>
                </div>

                <QRScanner onResult={handleScanResult} />

                {lastScanError && (
                  <div className="text-xs font-bold text-error flex items-center gap-1 mt-1">
                    <span className="material-symbols-outlined text-[14px]">error</span>
                    {lastScanError}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Check-in log right col */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-success" style={{ fontVariationSettings: "'FILL' 1" }}>
                  fact_check
                </span>
                Today&apos;s Check-ins
              </h2>
              <BadgeTag variant="success">{checkIns.length} checked in</BadgeTag>
            </div>

            <Card className="border border-outline-variant bg-surface-container-lowest shadow-sm">
              <CardContent className="p-0">
                {checkIns.length === 0 ? (
                  <div className="p-10 text-center space-y-2">
                    <span className="material-symbols-outlined text-[40px] text-outline">
                      qr_code
                    </span>
                    <p className="text-sm font-bold text-on-surface-variant">No check-ins yet</p>
                    <p className="text-xs text-on-surface-variant/70">
                      Scan a student&apos;s QR code to record their attendance.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-outline-variant/40">
                    {checkIns.map((c, idx) => (
                      <div key={idx} className="px-5 py-3.5 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-success/10 flex items-center justify-center">
                            <span
                              className="material-symbols-outlined text-[18px] text-success"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              check_circle
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-extrabold text-on-surface">{c.studentName}</p>
                            <div className="flex items-center gap-2 text-[10px] text-on-surface-variant font-medium">
                              <span>🔥 {c.streak}-day streak</span>
                              <span>·</span>
                              <span className="text-primary font-bold">+{c.xp} XP</span>
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-outline">{c.time}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stats summary */}
            {checkIns.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                <Card className="border border-outline-variant bg-surface-container-lowest shadow-sm">
                  <CardContent className="p-4 text-center space-y-1">
                    <p className="text-2xl font-extrabold text-success">{checkIns.length}</p>
                    <p className="text-[10px] uppercase font-black text-on-surface-variant/70 tracking-wider">Checked In</p>
                  </CardContent>
                </Card>
                <Card className="border border-outline-variant bg-surface-container-lowest shadow-sm">
                  <CardContent className="p-4 text-center space-y-1">
                    <p className="text-2xl font-extrabold text-primary">
                      +{checkIns.reduce((sum, c) => sum + c.xp, 0)}
                    </p>
                    <p className="text-[10px] uppercase font-black text-on-surface-variant/70 tracking-wider">XP Awarded</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
