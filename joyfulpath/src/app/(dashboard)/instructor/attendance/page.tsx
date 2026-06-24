'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, Button, BadgeTag } from '@/components/ui';

interface Student {
  id: string;
  name: string;
  avatarUrl?: string;
  streak: number;
}

const MOCK_STUDENTS: Student[] = [
  { id: '1', name: 'Jonathan Amir', streak: 12 },
  { id: '2', name: 'Mary Faith', streak: 5 },
  { id: '3', name: 'David Shepherd', streak: 8 },
  { id: '4', name: 'Noah Ark', streak: 4 },
  { id: '5', name: 'Sarah Joy', streak: 0 },
];

export default function InstructorAttendance() {
  const tNav = useTranslations('nav');
  const tAttendance = useTranslations('attendance');
  const tCommon = useTranslations('common');

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('c1');
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent' | 'late' | 'excused'>>(
    MOCK_STUDENTS.reduce((acc, student) => ({ ...acc, [student.id]: 'present' }), {})
  );

  const handleStatusChange = (studentId: string, status: 'present' | 'absent' | 'late' | 'excused') => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleSave = () => {
    alert(tAttendance('saveSuccess'));
  };

  return (
    <div className="space-y-6 animate-[slide-up_0.4s_ease-out]">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">
          {tNav('attendance')}
        </h1>
        <p className="text-on-surface-variant text-sm max-w-2xl">
          {tAttendance('description')}
        </p>
      </div>

      {/* Date & Class Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/60 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="flex flex-col gap-1 w-full sm:w-48">
            <label className="text-xs font-bold text-on-surface-variant">{tAttendance('selectClass')}</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="h-10 px-3 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary text-sm font-medium"
            >
              <option value="c1">Class A (Level 1-3)</option>
              <option value="c2">Class B (Level 4-7)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1 w-full sm:w-48">
            <label className="text-xs font-bold text-on-surface-variant">{tAttendance('selectDate')}</label>
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

      {/* Attendance Roster Table */}
      <Card className="border border-outline-variant bg-surface-container-lowest shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-start border-collapse text-sm">
              <thead>
                <tr className="border-b border-outline-variant/60 text-outline text-xs uppercase font-black">
                  <th className="px-6 py-4 text-start">{tCommon('appName') === 'JoyfulPath' ? 'Student' : 'الطالب'}</th>
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
                        <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
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
    </div>
  );
}
