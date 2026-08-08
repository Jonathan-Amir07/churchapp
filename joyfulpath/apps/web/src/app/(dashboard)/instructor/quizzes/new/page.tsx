'use client';

import { Card, CardContent, Button } from '@/components/ui';
import { useRouter } from 'next/navigation';

export default function NewQuizPage() {
  const router = useRouter();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/instructor/quizzes/123/builder'); // Mock redirect to builder
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-[slide-up_0.4s_ease-out]">
      <h1 className="text-2xl font-extrabold flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">quiz</span>
        Create New Quiz
      </h1>

      <Card className="border border-outline-variant bg-surface-container-lowest">
        <CardContent className="p-6">
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-1">Title</label>
              <input type="text" required className="w-full p-2 border border-outline-variant rounded-md bg-surface" placeholder="e.g. Genesis Chapter 1 Quiz" />
            </div>
            
            <div>
              <label className="block text-sm font-bold mb-1">Description</label>
              <textarea rows={3} className="w-full p-2 border border-outline-variant rounded-md bg-surface" placeholder="Brief description of the quiz..." />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-1">Time Limit (minutes)</label>
                <input type="number" defaultValue={15} className="w-full p-2 border border-outline-variant rounded-md bg-surface" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Max Attempts</label>
                <input type="number" defaultValue={1} className="w-full p-2 border border-outline-variant rounded-md bg-surface" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Passing Score (%)</label>
                <input type="number" defaultValue={70} className="w-full p-2 border border-outline-variant rounded-md bg-surface" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">XP Reward</label>
                <input type="number" defaultValue={100} className="w-full p-2 border border-outline-variant rounded-md bg-surface" />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant">
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
              <Button type="submit" variant="primary">Create & Add Questions</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
