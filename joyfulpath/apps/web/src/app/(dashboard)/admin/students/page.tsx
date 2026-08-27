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

export default function InstructorStudents() {
  const tNav = useTranslations('nav');
  const tStudents = useTranslations('students');
  const tCommon = useTranslations('common');
  const addToast = useNotificationStore(s => s.addToast);

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Advanced Search Filters
  const [filters, setFilters] = useState({
    name: '',
    phone: '',
    school: '',
    address: ''
  });

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams(filters).toString();
      // Using the NestJS endpoint. In a real app we'd proxy this or hit it directly.
      const res = await fetch(`/api/users?${queryParams}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      
      // Map API data to component data
      const mapped = data.map((u: any) => ({
        id: u.id,
        name: u.displayName || `${u.firstName} ${u.lastName}`,
        username: u.username,
        phone: u.phone,
        school: u.school,
        totalXp: u.totalXp,
        totalPoints: u.totalPoints,
        level: u.currentLevel?.levelNumber || 1,
        levelTitle: u.currentLevel?.title || 'Beginner',
        badgesCount: 0,
        lastActive: u.lastActiveAt ? new Date(u.lastActiveAt).toLocaleDateString() : 'N/A'
      }));
      setStudents(mapped);
    } catch (error) {
      addToast('Failed to load students', 'error');
    } finally {
      setLoading(false);
    }
  }, [filters, addToast]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

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
  }, [selectedStudent, xpToAdd, pointsToAdd, addToast, tStudents]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const columns = [
    {
      key: 'name',
      header: 'Name',
      cell: (item: Student) => (
        <div className="flex flex-col">
          <Link href={`/students/${item.id}`} className="font-bold text-primary hover:underline">
            {item.name}
          </Link>
          <span className="text-xs text-on-surface-variant">@{item.username}</span>
        </div>
      )
    },
    { key: 'phone', header: 'Phone' },
    { key: 'school', header: 'School' },
    { key: 'totalXp', header: 'XP' },
    {
      key: 'actions',
      header: 'Actions',
      cell: (item: Student) => (
        <Button variant="outline" size="sm" onClick={() => setSelectedStudent(item)}>
          Award
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-[slide-up_0.4s_ease-out]">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">Member Directory</h1>
          <p className="text-on-surface-variant text-sm max-w-2xl">Search and manage all members in the system.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/students/import">
            <Button variant="outline" className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">upload_file</span>
              Import Excel
            </Button>
          </Link>
        </div>
      </div>

      {/* Advanced Search Bar */}
      <div className="bg-surface p-4 rounded-xl shadow-sm border border-outline-variant grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="text-xs font-bold text-on-surface-variant mb-1 block">Name</label>
          <Input name="name" value={filters.name} onChange={handleFilterChange} placeholder="Search name..." />
        </div>
        <div>
          <label className="text-xs font-bold text-on-surface-variant mb-1 block">Phone</label>
          <Input name="phone" value={filters.phone} onChange={handleFilterChange} placeholder="Search phone..." />
        </div>
        <div>
          <label className="text-xs font-bold text-on-surface-variant mb-1 block">School</label>
          <Input name="school" value={filters.school} onChange={handleFilterChange} placeholder="Search school..." />
        </div>
        <div>
          <label className="text-xs font-bold text-on-surface-variant mb-1 block">Address</label>
          <Input name="address" value={filters.address} onChange={handleFilterChange} placeholder="Search address..." />
        </div>
      </div>

      <DataTable 
        data={students} 
        columns={columns} 
      />

      {selectedStudent && (
        <Modal isOpen={true} onClose={() => setSelectedStudent(null)} title={`Award ${selectedStudent.name}`}>
          <form onSubmit={handleAward} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant">XP</label>
                <Input type="number" min={5} max={1000} required value={xpToAdd} onChange={(e) => setXpToAdd(Number(e.target.value))} />
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-4 border-t border-outline-variant">
              <Button variant="outline" size="sm" type="button" onClick={() => setSelectedStudent(null)}>Cancel</Button>
              <Button variant="primary" size="sm" type="submit">Award Now</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
