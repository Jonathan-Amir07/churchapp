'use client';

import { Card, CardContent, Button } from '@/components/ui';
import { useRouter } from 'next/navigation';

export default function NewTaskPage() {
  const router = useRouter();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Task created successfully! Notifications sent to students.');
    router.back();
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-[slide-up_0.4s_ease-out]">
      <h1 className="text-2xl font-extrabold flex items-center gap-2">
        <span className="material-symbols-outlined text-orange-500">task</span>
        Create New Task
      </h1>

      <Card className="border border-outline-variant bg-surface-container-lowest">
        <CardContent className="p-6">
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-1">Title</label>
              <input type="text" required className="w-full p-2 border border-outline-variant rounded-md bg-surface" placeholder="e.g. Memorize Psalm 50" />
            </div>
            
            <div>
              <label className="block text-sm font-bold mb-1">Task Type</label>
              <select className="w-full p-2 border border-outline-variant rounded-md bg-surface">
                <option>Memorization</option>
                <option>Reading Summary</option>
                <option>Homework Upload</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold mb-1">Description / Instructions</label>
              <textarea required rows={4} className="w-full p-2 border border-outline-variant rounded-md bg-surface" placeholder="Write what the student needs to do..." />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-1">XP Reward</label>
                <input type="number" defaultValue={50} className="w-full p-2 border border-outline-variant rounded-md bg-surface" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Due Date</label>
                <input type="date" required className="w-full p-2 border border-outline-variant rounded-md bg-surface" />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
              <Button type="submit" variant="primary" className="bg-orange-500 hover:bg-orange-600 text-white border-0">Assign Task</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
