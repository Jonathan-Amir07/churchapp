'use client';

import { Card, CardContent, Button } from '@/components/ui';
import { useRouter } from 'next/navigation';

export default function NewLessonPage() {
  const router = useRouter();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Lesson created successfully!');
    router.back();
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
              <label className="block text-sm font-bold mb-1">Title</label>
              <input type="text" required className="w-full p-2 border border-outline-variant rounded-md bg-surface" placeholder="e.g. The Exodus" />
            </div>
            
            <div>
              <label className="block text-sm font-bold mb-1">Category</label>
              <select className="w-full p-2 border border-outline-variant rounded-md bg-surface">
                <option>Old Testament</option>
                <option>New Testament</option>
                <option>Church History</option>
                <option>Dogma</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold mb-1">Content</label>
              <textarea required rows={6} className="w-full p-2 border border-outline-variant rounded-md bg-surface" placeholder="Write the lesson content here..." />
            </div>

            <div>
              <label className="block text-sm font-bold mb-1">Bible References</label>
              <input type="text" className="w-full p-2 border border-outline-variant rounded-md bg-surface" placeholder="e.g. Exodus 14:1-31" />
            </div>

            <div className="pt-4 border-t border-outline-variant">
              <h3 className="text-sm font-bold mb-2">Attachments (Audio, Video, PDF)</h3>
              <input type="file" multiple className="text-sm" />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
              <Button type="submit" variant="primary">Publish Lesson</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
