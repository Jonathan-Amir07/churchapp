'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, Button, BadgeTag, QRScanner, SearchBar, type ScanResult } from '@/components/ui';
import { useNotificationStore } from '@/stores/notifications.store';

type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

type Tab = 'roster' | 'scanner';

interface CheckInRecord {
  studentName: string;
  studentId: string;
  time: string;
  xp: number;
  streak: number;
}

export default function AdminAttendancePage() {
  const tNav        = useTranslations('nav');
  const tAttendance = useTranslations('attendance');
  const tCommon     = useTranslations('common');
  const addToast    = useNotificationStore(s => s.addToast);

  const [activeTab, setActiveTab] = useState<Tab>('roster');
  const [date, setDate] = useState('');
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [students, setStudents] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setDate(new Date().toISOString().split('T')[0]);
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
        console.error(err);
      }
    }
    loadClasses();
  }, []);

  useEffect(() => {
    if (!selectedClassId) return;
    async function loadData() {
      setLoading(true);
      try {
        // Load students
        const res = await fetch(`/api/students?classId=${selectedClassId}`);
        if (res.ok) {
          const data = await res.json();
          const arr = Array.isArray(data) ? data : data.data || [];
          setStudents(arr);
          
          // Pre-populate attendance state with 'present' for easy marking
          const initialAtt: Record<string, AttendanceStatus> = {};
          arr.forEach((s: any) => initialAtt[s.id] = 'present');
          setAttendance(initialAtt);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [selectedClassId]);

  // QR scanner state
  const [checkIns, setCheckIns] = useState<CheckInRecord[]>([]);
  const [lastScanError, setLastScanError] = useState<string | null>(null);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const filteredStudents = useMemo(() => {
    if (!searchQuery) return students;
    const q = searchQuery.toLowerCase();
    return students?.filter((s) => (s.displayName || s.firstName + ' ' + s.lastName).toLowerCase().includes(q));
  }, [searchQuery, students]);

  const handleStatusChange = useCallback((studentId: string, status: AttendanceStatus) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  }, []);

  const handleSave = async () => {
    if (!selectedClassId) return;
    setIsSaving(true);
    try {
      const records = Object.entries(attendance).map(([studentId, status]) => ({ studentId, status }));
      const res = await fetch('/api/attendance/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classId: selectedClassId, records })
      });
      const data = await res.json();
      if (res.ok) {
        addToast(tAttendance('saveSuccess'), 'success');
      } else {
        addToast(data.message || 'Failed to save attendance', 'error');
      }
    } catch (err) {
      addToast('An error occurred', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Called by QRScanner on each decoded result
  const handleScanResult = useCallback(async (result: ScanResult, rawCode: string) => {
    if (result.success) {
      // In Admin view we might also just submit it manually here if we want real-time server check-in
      // For now we just log it and mark present
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

      setAttendance((prev) => ({ ...prev, [rawCode]: 'present' }));
    } else {
      setLastScanError(result.error);
    }
  }, []);

  const tabs: { id: Tab; label: string; icon: string }[] = useMemo(() => [
    { id: 'roster',  label: 'قائمة الحضور',  icon: 'list_alt' },
    { id: 'scanner', label: 'ماسح الرمز السريع (QR)', icon: 'qr_code_scanner' },
  ], []);

  return (
    <div className="space-y-6 animate-[slide-up_0.4s_ease-out] pb-12">
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
        {tabs?.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-primary text-on-primary shadow-card'
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
          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/60 shadow-card">
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto flex-1">
              <div className="flex flex-col gap-1 w-full sm:w-48">
                <label className="text-xs font-bold text-on-surface-variant">
                  {tAttendance('selectClass')}
                </label>
                <select
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="h-10 px-3 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary text-sm font-medium"
                >
                  <option value="">-- اختر الفصل --</option>
                  {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
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

              <div className="flex flex-col gap-1 flex-1">
                <label className="text-xs font-bold text-on-surface-variant">
                  {tCommon('search')}
                </label>
                <SearchBar
                  onSearch={handleSearch}
                  placeholder={tCommon('search')}
                  resultCount={filteredStudents.length}
                  totalCount={students.length}
                />
              </div>
            </div>

            <Button variant="primary" size="sm" onClick={handleSave} loading={isSaving} disabled={!selectedClassId || loading} className="w-full sm:w-auto mt-4 sm:mt-0 self-end">
              {tCommon('save')}
            </Button>
          </div>

          {/* Roster Table */}
          <Card className="border border-outline-variant bg-surface-container-lowest shadow-card">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-start border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-outline-variant/60 text-outline text-xs uppercase font-black">
                      <th className="px-6 py-4 text-start">المخدوم</th>
                      <th className="px-6 py-4 text-start">المواظبة</th>
                      <th className="px-6 py-4 text-end">الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/40">
                    {loading ? (
                      <tr>
                         <td colSpan={3} className="px-6 py-8 text-center text-on-surface-variant">
                            جاري تحميل المخدومين...
                         </td>
                      </tr>
                    ) : filteredStudents.length === 0 ? (
                      <tr>
                         <td colSpan={3} className="px-6 py-8 text-center text-on-surface-variant">
                            لا يوجد مخدومين.
                         </td>
                      </tr>
                    ) : (
                      filteredStudents?.map((student) => (
                        <tr key={student.id} className="hover:bg-surface-container-low/40 transition duration-150">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                                {(student.displayName || student.firstName)?.[0]}
                              </div>
                              <span className="font-extrabold text-on-surface">{student.displayName || student.firstName + ' ' + student.lastName}</span>
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
                              <span>{tAttendance('streakInfo', { streak: student.currentStreak || 0 })}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-end">
                            <div className="inline-flex gap-1.5 p-1 bg-surface-container-low rounded-xl border border-outline-variant/40 flex-wrap justify-end">
                              {(['present', 'absent', 'late', 'excused'] as const)?.map((status) => {
                                const isActive = attendance[student.id] === status;
                                return (
                                  <button
                                    key={status}
                                    type="button"
                                    onClick={() => handleStatusChange(student.id, status)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all duration-150 ${
                                      isActive
                                        ? status === 'present'
                                          ? 'bg-tertiary text-on-tertiary shadow-card'
                                          : status === 'absent'
                                          ? 'bg-error text-on-error shadow-card'
                                          : status === 'late'
                                          ? 'bg-secondary text-on-secondary shadow-card'
                                          : 'bg-outline text-white shadow-card'
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
                      ))
                    )}
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
            <Card className="border border-outline-variant bg-surface-container-lowest shadow-card">
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
                    <h2 className="font-extrabold text-on-surface text-base">مسح رمز المخدوم</h2>
                    <p className="text-xs text-on-surface-variant">
                      وجه الكاميرا نحو رمز المخدوم لتسجيل حضوره.
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
                تسجيلات اليوم
              </h2>
              <BadgeTag variant="success">{checkIns.length} حضروا</BadgeTag>
            </div>

            <Card className="border border-outline-variant bg-surface-container-lowest shadow-card">
              <CardContent className="p-0">
                {checkIns.length === 0 ? (
                  <div className="p-10 text-center space-y-2">
                    <span className="material-symbols-outlined text-[40px] text-outline">
                      qr_code
                    </span>
                    <p className="text-sm font-bold text-on-surface-variant">لا توجد تسجيلات بعد</p>
                    <p className="text-xs text-on-surface-variant/70">
                      قم بمسح رمز المخدوم لتسجيل حضوره.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-outline-variant/40">
                    {checkIns?.map((c, idx) => (
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
                              <span>🔥 {c.streak} أيام مواظبة</span>
                              <span>·</span>
                              <span className="text-primary font-bold">+{c.xp} نقطة</span>
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
                <Card className="border border-outline-variant bg-surface-container-lowest shadow-card">
                  <CardContent className="p-4 text-center space-y-1">
                    <p className="text-2xl font-extrabold text-success">{checkIns.length}</p>
                    <p className="text-[10px] uppercase font-black text-on-surface-variant/70 tracking-wider">تم تسجيلهم</p>
                  </CardContent>
                </Card>
                <Card className="border border-outline-variant bg-surface-container-lowest shadow-card">
                  <CardContent className="p-4 text-center space-y-1">
                    <p className="text-2xl font-extrabold text-primary">
                      +{checkIns.reduce((sum, c) => sum + c.xp, 0)}
                    </p>
                    <p className="text-[10px] uppercase font-black text-on-surface-variant/70 tracking-wider">النقاط الممنوحة</p>
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
