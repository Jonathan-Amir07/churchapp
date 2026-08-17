'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Card, Button, Skeleton, EmptyState, SearchBar } from '@/components/ui';
import { LessonForm } from '@/components/features/lessons/LessonForm';
import { LessonCard } from '@/components/features/lessons/LessonCard';
import { DataTable } from '@/components/ui/DataTable';

interface Lesson {
  id: string;
  title: string;
  description?: string;
  content: string;
  status: 'draft' | 'published' | 'archived';
  xpReward: number;
  pointsReward: number;
  createdAt: string;
  attachments?: Array<{
    id: string;
    fileName: string;
    fileUrl: string;
    fileSize: number;
  }>;
  _count?: {
    progress: number;
  };
}

export default function InstructorLessons() {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const classId = searchParams.get('classId');

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [classes, setClasses] = useState<{id: string, nameEn: string, nameAr: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'published'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleClassSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    if (selected) {
      router.push(`/admin/lessons?classId=${selected}`);
    } else {
      router.push(`/admin/lessons`);
    }
  };

  useEffect(() => {
    async function loadClasses() {
      try {
        const res = await fetch('/api/classes');
        if (res.ok) {
          const data = await res.json();
          setClasses(data);
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadClasses();
  }, []);

  const fetchLessons = useCallback(async () => {
    if (!classId) return;
    try {
      setLoading(true);
      const params = new URLSearchParams({ classId });
      if (filterStatus !== 'all') {
        params.append('status', filterStatus);
      }
      const res = await fetch(`/api/lessons?${params}`);
      if (res.ok) {
        const data = await res.json();
        setLessons(data.lessons || []);
      } else {
        setLessons([]);
      }
    } catch (error) {
      console.error('Failed to fetch lessons:', error);
      setLessons([]);
    } finally {
      setLoading(false);
    }
  }, [classId, filterStatus]);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  const handleLessonCreated = useCallback(() => {
    setShowForm(false);
    fetchLessons();
  }, [fetchLessons]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const filteredLessons = useMemo(() => {
    if (!searchQuery) return lessons;
    const q = searchQuery.toLowerCase();
    return lessons.filter(lesson =>
      lesson.title.toLowerCase().includes(q) ||
      (lesson.description && lesson.description.toLowerCase().includes(q))
    );
  }, [lessons, searchQuery]);

  // Remove early return for !classId so we can show the header and selector
  const renderContent = () => {
    if (!classId) {
      return (
        <EmptyState
          icon="school"
          title="Select a Class"
          description="Please select a class from the dropdown above to view lessons."
        />
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-on-surface dark:text-dark-on-surface">
            {t('nav.lessons')}
          </h1>
          <p className="text-on-surface-variant dark:text-dark-on-surface-variant mt-1">
            {t('lessons.manage')}
          </p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary dark:bg-dark-primary text-on-primary dark:text-dark-on-primary px-6"
        >
          <span className="material-symbols-outlined mr-2">add</span>
          {t('common.create')}
        </Button>
        <div className="flex gap-4 items-center flex-wrap">
          <select 
            className="p-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm font-medium focus:outline-none focus:border-primary min-w-[200px]"
            value={classId || ''}
            onChange={handleClassSelect}
          >
            <option value="">-- Select Class --</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.nameEn}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Filters & Search */}
      <Card className="p-4 bg-surface-container-low dark:bg-dark-surface-container-low">
        <div className="flex gap-4 items-center flex-wrap">
          <div className="flex-1 min-w-60">
            <SearchBar
              onSearch={handleSearch}
              placeholder={t('common.search')}
              resultCount={filteredLessons.length}
              totalCount={lessons.length}
            />
          </div>
          <div className="flex gap-2">
            {['all', 'draft', 'published'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status as any)}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  filterStatus === status
                    ? 'bg-primary dark:bg-dark-primary text-on-primary dark:text-dark-on-primary'
                    : 'bg-surface-container dark:bg-dark-surface-container text-on-surface-variant dark:text-dark-on-surface-variant hover:bg-surface-container-high dark:hover:bg-dark-surface-container-high'
                }`}
              >
                {t(`lessons.status.${status}`)}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Form Modal */}
      {showForm && (
        <LessonForm
          classId={classId || ''}
          onSuccess={handleLessonCreated}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Lessons List */}
      {renderContent()}
      
      {classId && (
        loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-2xl" />
            ))}
          </div>
        ) : filteredLessons.length === 0 ? (
          <EmptyState
            icon="article"
            title={t('lessons.empty')}
            description={t('lessons.emptyDesc')}
            action={{
              label: t('lessons.createFirst'),
              onClick: () => setShowForm(true),
            }}
          />
        ) : (
          <DataTable 
            data={filteredLessons as any[]}
            columns={[
              { key: 'title', header: 'العنوان', cell: (l: any) => <div className="font-bold">{l.title}</div> },
              { key: 'status', header: 'الحالة', cell: (l: any) => (
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${l.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                  {t(`lessons.status.${l.status}`)}
                </span>
              )},
              { key: 'xpReward', header: 'مكافأة XP' },
              { key: 'createdAt', header: 'تاريخ الإنشاء', cell: (l: any) => new Date(l.createdAt).toLocaleDateString('ar-EG') },
              { key: 'actions', header: 'إجراءات', cell: (l: any) => (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">تعديل</Button>
                  <Button variant="outline" size="sm" className="text-red-500 hover:bg-red-50 hover:border-red-200">حذف</Button>
                </div>
              )}
            ]}
            onExportPdf={() => {}}
            onExportExcel={() => {}}
          />
        )
      )}
    </div>
  );
}
