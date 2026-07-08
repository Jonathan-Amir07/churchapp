'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Card, Button } from '@/components/ui';

interface LessonCardProps {
  lesson: {
    id: string;
    title: string;
    description?: string;
    status: 'draft' | 'published' | 'archived';
    xpReward: number;
    pointsReward: number;
    createdAt: string;
    attachments?: Array<{
      id: string;
      fileName: string;
      fileType: string;
    }>;
    _count?: {
      progress: number;
    };
  };
  onUpdate: () => void;
}

export function LessonCard({ lesson, onUpdate }: LessonCardProps) {
  const t = useTranslations();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handlePublish = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/lessons/${lesson.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: lesson.status === 'published' ? 'draft' : 'published',
        }),
      });
      if (res.ok) {
        onUpdate();
      }
    } catch (error) {
      console.error('Failed to update lesson:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this lesson?')) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/lessons/${lesson.id}`, { method: 'DELETE' });
      if (res.ok) {
        onUpdate();
      }
    } catch (error) {
      console.error('Failed to delete lesson:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusColor = {
    draft: 'bg-warning/10 dark:bg-dark-warning/10 text-warning dark:text-dark-warning border-warning',
    published: 'bg-success/10 dark:bg-dark-success/10 text-success dark:text-dark-success border-success',
    archived: 'bg-error/10 dark:bg-dark-error/10 text-error dark:text-dark-error border-error',
  };

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow duration-200 bg-surface-container-lowest dark:bg-dark-surface-container-lowest h-full flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-bold text-on-surface dark:text-dark-on-surface line-clamp-2 flex-1">
          {lesson.title}
        </h3>
        <span
          className={`text-xs font-bold px-3 py-1 rounded-full border ${
            statusColor[lesson.status]
          }`}
        >
          {t(`lessons.status.${lesson.status}`)}
        </span>
      </div>

      {lesson.description && (
        <p className="text-sm text-on-surface-variant dark:text-dark-on-surface-variant line-clamp-2 mb-3">
          {lesson.description}
        </p>
      )}

      <div className="flex gap-2 mb-4 flex-wrap">
        <span className="text-xs bg-primary/10 dark:bg-dark-primary/10 text-primary dark:text-dark-primary px-2 py-1 rounded-full font-medium">
          {lesson.xpReward} XP
        </span>
        <span className="text-xs bg-secondary/10 dark:bg-dark-secondary/10 text-secondary dark:text-dark-secondary px-2 py-1 rounded-full font-medium">
          {lesson.pointsReward} pts
        </span>
        {lesson.attachments && lesson.attachments.length > 0 && (
          <span className="text-xs bg-tertiary/10 dark:bg-dark-tertiary/10 text-tertiary dark:text-dark-tertiary px-2 py-1 rounded-full font-medium">
            {lesson.attachments.length} files
          </span>
        )}
      </div>

      {lesson._count?.progress && (
        <p className="text-xs text-on-surface-variant dark:text-dark-on-surface-variant mb-4">
          {lesson._count.progress} students tracking
        </p>
      )}

      <div className="flex gap-2 mt-auto pt-4 border-t border-outline-variant dark:border-dark-outline-variant">
        <Button
          onClick={() => router.push(`/instructor/lessons/${lesson.id}`)}
          variant="outline"
          size="sm"
          className="flex-1"
        >
          {t('common.edit')}
        </Button>
        <Button
          onClick={handlePublish}
          disabled={loading}
          size="sm"
          className={`flex-1 ${
            lesson.status === 'published'
              ? 'bg-warning dark:bg-dark-warning text-on-warning'
              : 'bg-primary dark:bg-dark-primary text-on-primary'
          }`}
        >
          {lesson.status === 'published' ? 'Unpublish' : 'Publish'}
        </Button>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="p-2 hover:bg-error/10 dark:hover:bg-dark-error/10 text-error dark:text-dark-error rounded-lg transition-colors"
          title="Delete lesson"
        >
          <span className="material-symbols-outlined text-[20px]">delete</span>
        </button>
      </div>
    </Card>
  );
}
