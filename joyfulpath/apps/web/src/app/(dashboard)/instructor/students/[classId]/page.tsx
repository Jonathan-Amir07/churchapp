'use client';

import { useState, useCallback, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button, Modal, Input } from '@/components/ui';
import { useNotificationStore } from '@/stores/notifications.store';
import { DataTable } from '@/components/ui/DataTable';
import Link from 'next/link';

interface Student {
  id: string;
  name: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  username: string;
  phone?: string;
  school?: string;
  totalXp: number;
  totalPoints: number;
  level: number;
  levelTitle: string;
  badgesCount: number;
  lastActive: string;
}

export default function InstructorClassStudents() {
  const params = useParams();
  const classId = params.classId as string;
  
  const addToast = useNotificationStore(s => s.addToast);

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState({
    search: '',
  });

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({ 
        ...filters, 
        classId,
        skip: ((page - 1) * limit).toString(), 
        take: limit.toString() 
      }).toString();
      
      const res = await fetch(`/api/students?${queryParams}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      
      const items = Array.isArray(json) ? json : json.data;
      const totalCount = json.total || items.length;
      setTotalPages(Math.ceil(totalCount / limit) || 1);

      const mapped = items?.map((u: any) => ({
        id: u.id,
        name: u.displayName || `${u.firstName} ${u.lastName}`,
        username: u.username,
        phone: u.phone,
        school: u.school,
        totalXp: u.totalXp,
        totalPoints: u.totalPoints,
        level: u.currentLevel?.levelNumber || 1,
        levelTitle: u.currentLevel?.title || 'مبتدئ',
        badgesCount: 0,
        lastActive: u.lastActiveAt ? new Date(u.lastActiveAt).toLocaleDateString('ar-EG') : 'غير متوفر'
      }));
      setStudents(mapped);
    } catch (error) {
      addToast('فشل في تحميل الطلاب', 'error');
    } finally {
      setLoading(false);
    }
  }, [filters, page, classId, addToast]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const columns = [
    {
      key: 'name',
      header: 'الاسم',
      cell: (item: Student) => (
        <div className="flex flex-col">
          <Link href={`/instructor/students/${classId}/${item.id}`} className="font-bold text-primary hover:underline">
            {item.name}
          </Link>
          <span className="text-xs text-on-surface-variant">@{item.username}</span>
        </div>
      )
    },
    { key: 'phone', header: 'رقم الهاتف' },
    { key: 'school', header: 'المدرسة' },
    { key: 'totalXp', header: 'نقاط الخبرة' },
    { key: 'lastActive', header: 'آخر نشاط' }
  ];

  return (
    <div className="space-y-6 animate-[slide-up_0.4s_ease-out]">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">إدارة الطلاب</h1>
          <p className="text-on-surface-variant text-sm max-w-2xl">بحث وإدارة جميع الطلاب في هذا الفصل.</p>
        </div>
        <div className="flex gap-3">
          <Link href={`/instructor/students/${classId}/import`}>
            <Button variant="outline" className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">upload_file</span>
              استيراد من إكسل
            </Button>
          </Link>
          <Button variant="primary" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            إضافة طالب يدوياً
          </Button>
        </div>
      </div>

      <div className="bg-surface p-4 rounded-xl shadow-sm border border-outline-variant grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <label className="text-xs font-bold text-on-surface-variant mb-1 block">البحث الذكي</label>
          <Input name="search" value={filters.search} onChange={handleFilterChange} placeholder="ابحث بالاسم، اسم المستخدم..." />
        </div>
      </div>

      <DataTable 
        data={students} 
        columns={columns} 
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
