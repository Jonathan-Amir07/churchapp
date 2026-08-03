'use client';

import { useState, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button, Modal, Input } from '@/components/ui';
import { useNotificationStore } from '@/stores/notifications.store';
import { DataTable } from '@/components/ui/DataTable';
import Link from 'next/link';

interface Student {
  id: string;
  name: string;
  username: string;
  totalXp: number;
  totalPoints: number;
  level: number;
  levelTitle: string;
  badgesCount: number;
  lastActive: string;
}



export default function InstructorStudents() {
  const tNav = useTranslations('nav');
  const tStudents = useTranslations('students');
  const tCommon = useTranslations('common');
  const addToast = useNotificationStore(s => s.addToast);

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchStudents() {
      try {
        const res = await fetch('/api/students');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setStudents(data);
      } catch (error) {
        addToast('Failed to load students', 'error');
      } finally {
        setLoading(false);
      }
    }
    fetchStudents();
  }, [addToast]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  
  const [xpToAdd, setXpToAdd] = useState(50);
  const [pointsToAdd, setPointsToAdd] = useState(10);
  const [reason, setReason] = useState('');

  const handleAward = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    setStudents((prev) =>
      prev.map((s) =>
        s.id === selectedStudent.id
          ? { ...s, totalXp: s.totalXp + xpToAdd, totalPoints: s.totalPoints + pointsToAdd }
          : s
      )
    );
    setSelectedStudent(null);
    addToast(tStudents('awardSuccess', { xp: xpToAdd, points: pointsToAdd, name: selectedStudent.name }), 'success');
    setReason('');
    setXpToAdd(50);
    setPointsToAdd(10);
  }, [selectedStudent, xpToAdd, pointsToAdd, addToast, tStudents]);

  const handleCloseModal = useCallback(() => {
    setSelectedStudent(null);
  }, []);

  const handleBulkAction = (ids: string[]) => {
    addToast(`تم اختيار ${ids.length} طالب للإجراء الجماعي`, 'success');
  };

  const columns = [
    {
      key: 'name',
      header: 'الاسم',
      cell: (item: Student) => (
        <div className="flex flex-col">
          <Link href={`/admin/students/${item.id}`} className="font-bold text-primary hover:underline">
            {item.name}
          </Link>
          <span className="text-xs text-on-surface-variant">@{item.username}</span>
        </div>
      )
    },
    {
      key: 'levelTitle',
      header: 'المستوى',
      cell: (item: Student) => (
        <span className="text-xs font-black bg-primary/10 text-primary px-2.5 py-1 rounded-full border border-primary/20">
          {item.levelTitle} ({item.level})
        </span>
      )
    },
    { key: 'totalXp', header: 'XP' },
    { key: 'totalPoints', header: 'النقاط' },
    { key: 'lastActive', header: 'آخر نشاط' },
    {
      key: 'actions',
      header: 'إجراءات',
      cell: (item: Student) => (
        <Button variant="outline" size="sm" onClick={() => setSelectedStudent(item)}>
          مكافأة
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-[slide-up_0.4s_ease-out]">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">
            {tNav('students')}
          </h1>
          <p className="text-on-surface-variant text-sm max-w-2xl">
            {tStudents('description')}
          </p>
        </div>
        <Button variant="primary" className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">person_add</span>
          طالب جديد
        </Button>
      </div>

      <DataTable 
        data={students} 
        columns={columns} 
        onBulkAction={handleBulkAction} 
        onExportPdf={() => addToast('تم تصدير ملف PDF بنجاح', 'success')}
        onExportExcel={() => addToast('تم تصدير ملف Excel بنجاح', 'success')}
      />

      {selectedStudent && (
        <Modal isOpen={true} onClose={handleCloseModal} title={tStudents('awardTitle', { name: selectedStudent.name })}>
          <form onSubmit={handleAward} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant">{tStudents('xpToAward')}</label>
                <Input type="number" min={5} max={1000} required value={xpToAdd} onChange={(e) => setXpToAdd(Number(e.target.value))} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant">{tStudents('pointsToAward')}</label>
                <Input type="number" min={1} max={500} required value={pointsToAdd} onChange={(e) => setPointsToAdd(Number(e.target.value))} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface-variant">{tStudents('reason')}</label>
              <Input required value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Excellent behavior or helper" />
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-outline-variant">
              <Button variant="outline" size="sm" type="button" onClick={handleCloseModal}>
                {tCommon('cancel')}
              </Button>
              <Button variant="primary" size="sm" type="submit">
                {tStudents('awardNow')}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
