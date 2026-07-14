'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Card, Button, Input, Skeleton, EmptyState, LoadingSpinner } from '@/components/ui';
import { LessonForm } from '@/components/features/lessons/LessonForm';
import { LessonCard } from '@/components/features/lessons/LessonCard';

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
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'published'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchLessons();
  }, [classId, filterStatus]);

  const fetchLessons = async () => {
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
        setLessons(data.lessons);
      }
    } catch (error) {
      console.error('Failed to fetch lessons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLessonCreated = () => {
    setShowForm(false);
    fetchLessons();
  };

  const filteredLessons = lessons.filter(lesson =>
    lesson.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!classId) {
    return (
      <EmptyState
        icon="school"
        title="Select a Class"
        description="Please select a class to view lessons"
      />
    );
  }

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
      </div>

      {/* Filters & Search */}
      <Card className="p-4 bg-surface-container-low dark:bg-dark-surface-container-low">
        <div className="flex gap-4 items-center flex-wrap">
          <Input
            placeholder={t('common.search')}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="flex-1 min-w-60"
            icon="search"
          />
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
          classId={classId}
          onSuccess={handleLessonCreated}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Lessons List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-80 rounded-2xl" />
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLessons.map(lesson => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              onUpdate={fetchLessons}
            />
          ))}
        </div>
      )}
    </div>
  );
}
