'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, Button, Input, Modal } from '@/components/ui';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface LessonFormProps {
  classId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function LessonForm({ classId, onSuccess, onCancel }: LessonFormProps) {
  const t = useTranslations();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    xpReward: 50,
    pointsReward: 10,
  });
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      setError('Title and content are required');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Create lesson
      const res = await fetch('/api/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classId,
          ...formData,
        }),
      });

      if (!res.ok) throw new Error('Failed to create lesson');
      const lesson = await res.json();

      // Upload attachment if provided
      if (file) {
        const formDataFile = new FormData();
        formDataFile.append('file', file);
        const uploadRes = await fetch(`/api/lessons/${lesson.id}/upload`, {
          method: 'POST',
          body: formDataFile,
        });
        if (!uploadRes.ok) {
          console.warn('Failed to upload file');
        }
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to create lesson');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-primary/5 dark:bg-dark-primary/5 border-2 border-primary/20 dark:border-dark-primary/20">
      <h2 className="text-xl font-bold text-on-surface dark:text-dark-on-surface mb-4">
        {t('lessons.create')}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label={t('common.title')}
          value={formData.title}
          onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Enter lesson title"
          required
        />

        <Input
          label={t('common.description')}
          value={formData.description}
          onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Brief description (optional)"
          type="textarea"
        />

        <div>
          <label className="block text-sm font-semibold text-on-surface dark:text-dark-on-surface mb-2">
            {t('lessons.content')}
          </label>
          <textarea
            value={formData.content}
            onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
            placeholder="Lesson content/story"
            className="w-full px-4 py-3 border border-outline dark:border-dark-outline rounded-xl bg-surface dark:bg-dark-surface text-on-surface dark:text-dark-on-surface focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary outline-none min-h-32"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="XP Reward"
            type="number"
            value={formData.xpReward}
            onChange={e => setFormData(prev => ({ ...prev, xpReward: parseInt(e.target.value) }))}
            min="0"
          />
          <Input
            label="Points Reward"
            type="number"
            value={formData.pointsReward}
            onChange={e => setFormData(prev => ({ ...prev, pointsReward: parseInt(e.target.value) }))}
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-on-surface dark:text-dark-on-surface mb-2">
            {t('common.attachment')} (Optional)
          </label>
          <div className="border-2 border-dashed border-outline dark:border-dark-outline rounded-xl p-6 text-center cursor-pointer hover:bg-surface-container-low dark:hover:bg-dark-surface-container-low transition-colors">
            <input
              type="file"
              onChange={e => setFile(e.target.files?.[0] || null)}
              accept=".pdf,.mp4,.webm,.png,.jpg"
              className="hidden"
              id="file-input"
            />
            <label htmlFor="file-input" className="cursor-pointer block">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant dark:text-dark-on-surface-variant mb-2 block">
                upload_file
              </span>
              <p className="text-sm font-medium text-on-surface dark:text-dark-on-surface">
                {file ? file.name : 'Click to upload or drag and drop'}
              </p>
              <p className="text-xs text-on-surface-variant dark:text-dark-on-surface-variant mt-1">
                PDF, MP4, WebM, PNG or JPG (max 100MB)
              </p>
            </label>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-error/10 dark:bg-dark-error/10 border border-error dark:border-dark-error rounded-lg text-error dark:text-dark-error text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            disabled={loading}
          >
            {t('common.cancel')}
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-primary dark:bg-dark-primary text-on-primary dark:text-dark-on-primary"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                {t('common.creating')}
              </>
            ) : (
              <>
                <span className="material-symbols-outlined mr-2">add</span>
                {t('lessons.create')}
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
