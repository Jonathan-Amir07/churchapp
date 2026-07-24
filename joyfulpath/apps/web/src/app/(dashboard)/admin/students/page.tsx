'use client';

import { useState, useMemo, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardTitle, CardDescription, Button, Modal, Input, SearchBar } from '@/components/ui';
import { useNotificationStore } from '@/stores/notifications.store';

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

const INITIAL_STUDENTS: Student[] = [
  {
    id: '1',
    name: 'Jonathan Amir',
    username: 'jonathan_amir',
    totalXp: 450,
    totalPoints: 90,
    level: 3,
    levelTitle: 'Sapling',
    badgesCount: 4,
    lastActive: '10 min ago',
  },
  {
    id: '2',
    name: 'Mary Faith',
    username: 'mary_faith',
    totalXp: 380,
    totalPoints: 75,
    level: 2,
    levelTitle: 'Seedling',
    badgesCount: 3,
    lastActive: '1 hour ago',
  },
  {
    id: '3',
    name: 'David Shepherd',
    username: 'david_shepherd',
    totalXp: 350,
    totalPoints: 70,
    level: 2,
    levelTitle: 'Seedling',
    badgesCount: 2,
    lastActive: '2 days ago',
  },
];

export default function InstructorStudents() {
  const tNav = useTranslations('nav');
  const tStudents = useTranslations('students');
  const tCommon = useTranslations('common');
  const tGamification = useTranslations('gamification');
  const addToast = useNotificationStore(s => s.addToast);

  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Award XP form states
  const [xpToAdd, setXpToAdd] = useState(50);
  const [pointsToAdd, setPointsToAdd] = useState(10);
  const [reason, setReason] = useState('');

  // Memoized filtered students – only recalculates when students or searchQuery change
  const filteredStudents = useMemo(() => {
    if (!searchQuery) return students;
    const q = searchQuery.toLowerCase();
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.username.toLowerCase().includes(q) ||
        s.levelTitle.toLowerCase().includes(q)
    );
  }, [students, searchQuery]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleAward = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    setStudents((prev) =>
      prev.map((s) =>
        s.id === selectedStudent.id
          ? {
              ...s,
              totalXp: s.totalXp + xpToAdd,
              totalPoints: s.totalPoints + pointsToAdd,
            }
          : s
      )
    );
    setSelectedStudent(null);
    addToast(tStudents('awardSuccess', { xp: xpToAdd, points: pointsToAdd, name: selectedStudent.name }), 'success');
    setReason('');
    setXpToAdd(50);
    setPointsToAdd(10);
  }, [selectedStudent, xpToAdd, pointsToAdd, addToast, tStudents]);

  const handleSelectStudent = useCallback((student: Student) => {
    setSelectedStudent(student);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedStudent(null);
  }, []);

  return (
    <div className="space-y-6 animate-[slide-up_0.4s_ease-out]">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">
          {tNav('students')}
        </h1>
        <p className="text-on-surface-variant text-sm max-w-2xl">
          {tStudents('description')}
        </p>
      </div>

      {/* Search Bar */}
      <SearchBar
        onSearch={handleSearch}
        placeholder={tStudents('searchStudent')}
        resultCount={filteredStudents.length}
        totalCount={students.length}
      />

      {/* Grid listing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <Card key={student.id} className="border border-outline-variant bg-surface-container-lowest shadow-sm flex flex-col justify-between">
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-start gap-4">
                <span className="text-xs font-black bg-primary/10 text-primary px-2.5 py-1 rounded-full border border-primary/20">
                  {tStudents('levelName', { level: student.level })}
                </span>
                <span className="text-xs text-outline">{student.lastActive}</span>
              </div>

              <div className="space-y-0.5">
                <CardTitle className="text-base font-black text-on-surface truncate">
                  {student.name}
                </CardTitle>
                <CardDescription className="text-xs">@{student.username}</CardDescription>
              </div>

              <div className="grid grid-cols-3 gap-2 border-t border-b border-outline-variant/60 py-3 text-center text-xs font-black">
                <div className="space-y-0.5">
                  <p className="text-on-surface-variant/80 text-[10px] uppercase">{tGamification('xp')}</p>
                  <p className="text-primary">{student.totalXp}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-on-surface-variant/80 text-[10px] uppercase">{tGamification('points')}</p>
                  <p className="text-secondary">{student.totalPoints}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-on-surface-variant/80 text-[10px] uppercase">{tNav('badges')}</p>
                  <p className="text-tertiary">{student.badgesCount}</p>
                </div>
              </div>
            </CardContent>

            <div className="p-6 pt-0">
              <Button variant="outline" fullWidth size="sm" onClick={() => handleSelectStudent(student)}>
                {tStudents('awardRewardsBtn')}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty state */}
      {filteredStudents.length === 0 && (
        <div className="text-center py-16 bg-surface-container-lowest border border-outline-variant/60 rounded-2xl">
          <span className="material-symbols-outlined text-[48px] text-outline">person_search</span>
          <p className="text-on-surface-variant text-sm font-bold mt-2">{tCommon('noResults')}</p>
        </div>
      )}

      {/* Award XP Modal */}
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
