'use client';

import { Card, CardContent, Button } from '@/components/ui';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useNotificationStore } from '@/stores/notifications.store';

export default function NewLessonPage() {
  const router = useRouter();
  const addToast = useNotificationStore((s: any) => s.addToast);
  const [classes, setClasses] = useState<any[]>([]);
  const [form, setForm] = useState({
    title: '',
    category: 'Old Testament',
    content: '',
    bibleReferences: '',
    classId: '',
    xpReward: 50,
    pointsReward: 10,
  });
  const [files, setFiles] = useState<FileList | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchClasses() {
      try {
        const res = await fetch('/api/classes');
        if (res.ok) {
          const data = await res.json();
          setClasses(data);
          if (data.length > 0) {
            setForm((prev) => ({ ...prev, classId: data[0].id }));
          }
        }
      } catch (e) {
        console.error('Failed to fetch classes', e);
      }
    }
    fetchClasses();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.classId) {
      addToast('Please select a class first.', 'error');
      return;
    }
    setIsSubmitting(true);

    try {
      // 1. Create Lesson
      const lessonRes = await fetch('/api/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          category: form.category,
          content: form.content,
          bibleReferences: form.bibleReferences,
          classId: form.classId,
          xpReward: form.xpReward,
          pointsReward: form.pointsReward,
          status: 'published',
        })
      });

      if (!lessonRes.ok) {
        throw new Error('Failed to create lesson');
      }

      const lesson = await lessonRes.json();

      // 2. Upload Files if any
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          const formData = new FormData();
          formData.append('file', files[i]);
          
          await fetch(`/api/lessons/${lesson.id}/upload`, {
            method: 'POST',
            body: formData,
          });
        }
      }

      addToast('Lesson created successfully!', 'success');
      router.back();
    } catch (e: any) {
      addToast(e.message || 'An error occurred', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-[slide-up_0.4s_ease-out]">
      <h1 className="text-2xl font-extrabold flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">menu_book</span>
        Create New Lesson
      </h1>

      <Card className="border border-outline-variant bg-surface-container-lowest">
        <CardContent className="p-6">
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-1">Class *</label>
              <select
                required
                value={form.classId}
                onChange={(e) => setForm({ ...form, classId: e.target.value })}
                className="w-full p-2 border border-outline-variant rounded-md bg-surface"
              >
                {classes.length === 0 && <option value="">No classes available</option>}
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.nameEn} ({c.gradeLevel})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold mb-1">Title *</label>
              <input 
                type="text" 
                required 
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full p-2 border border-outline-variant rounded-md bg-surface" 
                placeholder="e.g. The Exodus" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold mb-1">Category</label>
              <select 
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full p-2 border border-outline-variant rounded-md bg-surface"
              >
                <option>Old Testament</option>
                <option>New Testament</option>
                <option>Church History</option>
                <option>Dogma</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold mb-1">Content *</label>
              <textarea 
                required 
                rows={6} 
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="w-full p-2 border border-outline-variant rounded-md bg-surface" 
                placeholder="Write the lesson content here..." 
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-1">Bible References</label>
              <input 
                type="text" 
                value={form.bibleReferences}
                onChange={(e) => setForm({ ...form, bibleReferences: e.target.value })}
                className="w-full p-2 border border-outline-variant rounded-md bg-surface" 
                placeholder="e.g. Exodus 14:1-31" 
              />
            </div>

            <div className="pt-4 border-t border-outline-variant">
              <h3 className="text-sm font-bold mb-2">Attachments (Audio, Video, PDF)</h3>
              <input 
                type="file" 
                multiple 
                onChange={(e) => setFiles(e.target.files)}
                className="text-sm" 
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>Cancel</Button>
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? 'Publishing...' : 'Publish Lesson'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
