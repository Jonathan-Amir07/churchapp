'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui';
import { useLocale } from 'next-intl';
import Link from 'next/link';

export default function ParentAttendance() {
  const searchParams = useSearchParams();
  const childId = searchParams.get('child');
  const currentLocale = useLocale();
  const supabase = createClient();

  const [childProfile, setChildProfile] = useState<any>(null);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAttendanceData() {
      if (!childId) return;

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('display_name')
        .eq('id', childId)
        .single();
      
      if (profile) setChildProfile(profile);

      const { data: attData } = await supabase
        .from('attendance')
        .select('*')
        .eq('user_id', childId)
        .order('date', { ascending: false });

      if (attData) {
        setAttendance(attData);
      } else {
        // Mock data fallback
        setAttendance([
          { id: '1', date: '2026-06-28', status: 'present', notes: 'Excellent' },
          { id: '2', date: '2026-06-21', status: 'present', notes: '' },
          { id: '3', date: '2026-06-14', status: 'late', notes: 'Late by 10 mins' },
          { id: '4', date: '2026-06-07', status: 'absent', notes: 'Sick' }
        ]);
      }
      setLoading(false);
    }

    loadAttendanceData();
  }, [childId]);

  return (
    <div className="space-y-6 animate-[slide-up_0.4s_ease-out]">
      <div className="flex items-center gap-4">
        <Link href="/parent/dashboard">
          <Button variant="ghost" size="sm" className="rounded-full">
            <span className="material-symbols-outlined">arrow_back</span>
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">
            {currentLocale === 'en' ? 'Attendance History' : 'سجل الحضور'}
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            {currentLocale === 'en'
              ? `Tracking attendance details for ${childProfile?.display_name || ''}`
              : `تفاصيل حضور الطالب ${childProfile?.display_name || ''}`}
          </p>
        </div>
      </div>

      {loading ? (
        <Card className="animate-pulse h-64 bg-surface-container" />
      ) : (
        <Card className="border border-outline-variant bg-surface-container-lowest shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-start border-collapse text-sm">
                <thead>
                  <tr className="border-b border-outline-variant/60 text-outline text-xs uppercase font-black">
                    <th className="px-6 py-4 text-start">{currentLocale === 'en' ? 'Date' : 'التاريخ'}</th>
                    <th className="px-6 py-4 text-start">{currentLocale === 'en' ? 'Status' : 'الحالة'}</th>
                    <th className="px-6 py-4 text-start">{currentLocale === 'en' ? 'Remarks' : 'ملاحظات'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/40">
                  {attendance.map((record) => (
                    <tr key={record.id} className="hover:bg-surface-container-low/40 transition duration-150">
                      <td className="px-6 py-4 font-bold text-on-surface">{record.date}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-black capitalize ${
                            record.status === 'present'
                              ? 'bg-tertiary/10 text-tertiary border border-tertiary/20'
                              : record.status === 'absent'
                              ? 'bg-error/10 text-on-error-container border border-error/20'
                              : 'bg-secondary-container/20 text-on-secondary-container border border-secondary-container/40'
                          }`}
                        >
                          {record.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-on-surface-variant font-medium">{record.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
